import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import * as sb from '@switchboard-xyz/on-demand'
import { Winisol } from '../target/types/winisol'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import SwitchboardIDL from '../switchboard.json'

describe('winisol', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const wallet = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Winisol as Program<Winisol>

  
  let switchboardProgram : anchor.Program<anchor.Idl>;
  const rngKp = Keypair.generate();

  beforeAll(async () => {
    const swithcboardIDL = await anchor.Program.fetchIdl(
      sb.ON_DEMAND_MAINNET_PID,
      {connection: new anchor.web3.Connection('https://polished-side-star.solana-mainnet.quiknode.pro/4279d32be8387502db78a48e0b0aeb18202330e6')}
    ) as anchor.Idl;

    // var fs = require('fs');
    // fs.writeFile("switchboard.json", JSON.stringify(swithcboardIDL), function(err: Error){
    //   if(err){
    //     console.log(err);
    //   }
    // })
    switchboardProgram = new anchor.Program(swithcboardIDL, provider);
    
    // console.log("Switch Board Program : ", switchboardProgram);
  }, 30000);

  async function buy_ticket() {
    const buyTicketIx = await program.methods.buyTickets(new anchor.BN(1).toNumber()).accounts({
      tokenProgram: TOKEN_PROGRAM_ID
    }).instruction();

    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({units: 300000});

    const prioriityIx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: 1});

    const blockhash = await provider.connection.getLatestBlockhash();

    const tx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(buyTicketIx)
    .add(computeIx)
    .add(prioriityIx);

    const signature = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [wallet.payer], {skipPreflight: true});
    console.log(`Buy ticket signature ${signature}`);
  }

  it('Initialize WiniSol', async () => {
    const slot = await provider.connection.getSlot();
    const endSlot = slot + 20;

    const InitConfigIx = await program.methods.initializeConfig(
      new anchor.BN(1).toNumber(),
      "TOKEN LOTTERY",
      "TLT",
      "https://media.istockphoto.com/id/1500283713/vector/cinema-ticket-on-white-background-movie-ticket-on-white-background.jpg?s=612x612&w=0&k=20&c=4J15lHFXyjEs6xBoagcZqq5GYHKk5sMwCJRP8pNM3Zg=",
      new anchor.BN(Math.floor(Date.now() / 1000)).toNumber(),
      new anchor.BN(Math.floor(Date.now() / 1000 + 100)).toNumber(),
      new anchor.BN(10000).toNumber(),
    ).instruction();

    const blockhash = await provider.connection.getLatestBlockhash();

    const tx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(InitConfigIx);

    const signature = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [wallet.payer], {skipPreflight: true});

    console.log(`Transaction Signature is ${signature}`);

    const initLotteryIx = await program.methods.initializeLottery(new anchor.BN(1).toNumber()).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();

    const initLotteryTx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(initLotteryIx);

    const initLotterySignature = await anchor.web3.sendAndConfirmTransaction(provider.connection, initLotteryTx, [wallet.payer], {skipPreflight: true});

    console.log("Initialize lottery signature", initLotterySignature);

    await buy_ticket();
    await buy_ticket();
    await buy_ticket();
    await buy_ticket();
    await buy_ticket();
    await buy_ticket();
    await buy_ticket();


    // let sbProgramId = sb.ON_DEMAND_MAINNET_PID;
    // let switchboardProgram = await anchor.Program.at(sbProgramId, provider);
    // const { keypair, connection, program: sbProgram } = await sb.AnchorUtils.loadEnv();
    // console.log("sb program: ", sbProgram);
    // console.log("Program", program!.programId.toString());

    const queue = new anchor.web3.PublicKey(sb.ON_DEMAND_MAINNET_QUEUE);
    console.log('Queue: ', queue.toString());
    const queueAccount = new sb.Queue(switchboardProgram, queue);

    try {
      await queueAccount.loadData();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    if (!switchboardProgram) {
      throw new Error("Switchboard program is not initialized.");
    }
    // console.log("Switchboard Program ID:", switchboardProgram.programId.toBase58());

    
    const [randomness, createRandomnessIx] = await sb.Randomness.create(switchboardProgram, rngKp, queue);
    // console.log("Randomness account", randomness.pubkey.toBase58());
    // console.log("rkp account", rngKp.publicKey.toBase58());

    const createRandomnessTx = await sb.asV0Tx({
      connection: provider.connection,
      ixs: [createRandomnessIx],
      payer: wallet.publicKey,
      signers: [wallet.payer, rngKp],
      computeUnitPrice: 75_000,
      computeUnitLimitMultiple: 1.3,
    });

    // const createRandomnessSignature = await provider.connection.sendTransaction(createRandomnessTx);
    const blockhashContext = await provider.connection.getLatestBlockhash();

    const createRandomnessSignature = await provider.connection.sendTransaction(createRandomnessTx, {skipPreflight: true});
    await provider.connection.confirmTransaction({
      signature: createRandomnessSignature,
      blockhash: blockhashContext.blockhash,
      lastValidBlockHeight: blockhashContext.lastValidBlockHeight
    });
    console.log(
      "Transaction Signature for randomness account creation: ",
      createRandomnessSignature
    );

    // console.log('Create Randomness Signature: ', createRandomnessSignature);

    let confirmed = false;
    while(!confirmed){
      try {
        const confirmRandomness = await provider.connection.getSignatureStatuses([createRandomnessSignature]);
        const randomnessStatus = confirmRandomness?.value[0];
        if(randomnessStatus?.confirmations != null && randomnessStatus.confirmationStatus === 'confirmed'){
          confirmed = true;
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!queue) {
      throw new Error("Queue is not initialized.");
    }
    if(!randomness.pubkey){
      throw new Error("Randomness not found...");
    }
    
    // const balanceBefore = await provider.connection.getBalance(randomness.pubkey);
    // console.log('Randomness Key:', randomness.pubkey.toString());
    // console.log("Randomness account balance before airdrop:", balanceBefore);

    // if (balanceBefore < 0.01 * anchor.web3.LAMPORTS_PER_SOL) {
    //   console.log('Insufficient SOL! Requesting Airdrop...');

    //   const airdropSignature = await provider.connection.requestAirdrop(
    //     randomness.pubkey, // Public key of the randomness account
    //     2 * anchor.web3.LAMPORTS_PER_SOL
    //   );

    //   console.log("Airdrop Transaction Signature:", airdropSignature);

    //   // Wait for confirmation before checking the new balance
    //   await provider.connection.confirmTransaction(airdropSignature, "confirmed");

    //   // Re-check the balance AFTER the airdrop is confirmed
    //   let balanceAfter = await provider.connection.getBalance(randomness.pubkey);

    //   // Ensure the new balance is actually updated
    //   while (balanceAfter === balanceBefore) {
    //     console.log("Waiting for SOL to be available...");
    //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
    //     balanceAfter = await provider.connection.getBalance(randomness.pubkey);
    //   }

    //   console.log("Randomness account balance after airdrop:", balanceAfter);
    // }

 
    const sbCommitIx = await randomness.commitIx(queue);
    
    

    const commitIx = await program.methods.commitRandomness(new anchor.BN(1).toNumber()).accounts({
      randomnessAccount: randomness.pubkey
    }).instruction();


    const commitComputeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 100000
    });

    const commitPriorityIx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1,
    });

    const commitBlockhashWithContext = await provider.connection.getLatestBlockhash();
    
    const commitTx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: commitBlockhashWithContext.blockhash,
      lastValidBlockHeight: commitBlockhashWithContext.lastValidBlockHeight
    }).add(commitComputeIx)
    .add(commitPriorityIx)
    .add(sbCommitIx)
    .add(commitIx);


    const commitSignature = await anchor.web3.sendAndConfirmTransaction(provider.connection, commitTx, [wallet.payer], {skipPreflight: true});

    console.log('commitSignature: ', commitSignature);

    const sbRevealIx = await randomness.revealIx();

    const revealWinnerIx = await program.methods.revealWinner(new anchor.BN(1).toNumber()).accounts({
      randomnessAccount: randomness.pubkey
    }).instruction();

    const revealBlockHashWithContext = await provider.connection.getLatestBlockhash();

    const revealTx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: revealBlockHashWithContext.blockhash,
      lastValidBlockHeight: revealBlockHashWithContext.lastValidBlockHeight,
    }).add(sbRevealIx).add(revealWinnerIx);

    let currentSlot = 0;
    while(currentSlot < endSlot){
      let slot = await provider.connection.getSlot();
      if(slot > currentSlot){
        currentSlot = slot;
        console.log(currentSlot);
      }
    }

    const revealSignature = await anchor.web3.sendAndConfirmTransaction(provider.connection, revealTx, [wallet.payer], {skipPreflight: true});

    console.log('Reveal Signature: ', revealSignature);

    const calimIx = await program.methods.claimWinnings(new anchor.BN(1).toNumber()).accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();

    const claimBlockhashWithContext = await provider.connection.getLatestBlockhash();
    const claimTx = new anchor.web3.Transaction({
      feePayer: provider.wallet.publicKey,
      blockhash: claimBlockhashWithContext.blockhash,
      lastValidBlockHeight: claimBlockhashWithContext.lastValidBlockHeight
    }).add(calimIx);

    const claimSignature = await anchor.web3.sendAndConfirmTransaction(provider.connection, claimTx, [wallet.payer], {skipPreflight: true});

    console.log("claim signature: ", claimSignature);

  }, 300000)

})
