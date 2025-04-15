'use client';

import { getWinisolProgram, getWinisolProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useAuth } from '@/contexts/AuthContext'
import { CreateLotteryInputArgs } from '../authority/dashboard/CreateLottery'
import { authorityTransferSign, buyTicketSign, claimWinningsSign, commitRandomnessSign, createLottery, createRandomnessSign, getRandomnessKeys, initializeConfig, initializeLotterySign, revealWinnerSign } from '@/services/lotteryService'
import { BN, Idl, Program, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as sb from '@switchboard-xyz/on-demand'
import { useWiniSolTransactionToast } from '../ui/layouts/Layout';
import { useToast } from '@/hooks/use-toast';
import { CreateLimitedLotteryInputArgs } from '../authority/dashboard/CreateLimitedLottery';
import { buyLimitedLotteryTicketSign, claimLimitedLotteryWinningsSign, commitLimitedLotteryRandomnessSign, createLimitedLottery, createLimitedLotteryRandomnessSign, getLimitedLotteryRandomnessKeys, initializeLimitedLotteryConfigSign, initializeLimitedLotterySign, limitedLotteryAuthorityTransferSign, revealLimitedLotteryWinnerSign } from '@/services/limitedLotteryService';

interface LotteryArgs {
  lottery_id: number,
}
interface LimitedLotteryArgs {
  lottery_id: number,
  ticket_number: number,
}

export function useWinisolProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getWinisolProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getWinisolProgram(provider, programId), [provider, programId])
  const { publicKey, sendTransaction } = useWallet();
  const {token} = useAuth();
  const { toast } = useToast();
  const transactionToast = useWiniSolTransactionToast()


  const accounts = useQuery({
    queryKey: ['winisol', 'all', { cluster }],
    queryFn: () => program.account.tokenLottery.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation<string, Error, CreateLotteryInputArgs>({
    mutationKey: ['tokenlottery', 'initialize-config', { cluster }],
    mutationFn: async (data) =>{
      if(!provider || !publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Provider or public key is missing");
      }
        
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found");
      }
      
      const res = await createLottery(data, token);

      if (!res?.data?.success || !res?.data?.lottery?.id) {
        toast({
          title: 'Error',
          description: 'Failed to create lottery',
          variant: 'destructive',
        })
        throw new Error("API call failed");
      }

      const lottery_id = res.data.lottery.id;

    const InitConfigIx = await program.methods.initializeConfig(
      lottery_id,
      data.lotteryName, 
      data.lotterySymbol,
      data.lotteryURI,
      new Date(data.startTime).getTime() / 1000, // Convert to UNIX timestamp
      new Date(data.endTime).getTime() / 1000,
      new BN(data.price * LAMPORTS_PER_SOL),
    ).instruction();
  
      // const computeUnitLimitIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      //   units: 5000,  // Adjust based on the program's complexity
      // });
  
      // const computeUnitPriceIx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
      //   microLamports: 1,  // Lower fees for simulation
      // });

      const blockhashContext = await connection.getLatestBlockhashAndContext();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhashContext.value.blockhash,
        lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight
      }).add(InitConfigIx);
  
      const signature = await sendTransaction(tx, connection, {skipPreflight: true});

      await initializeConfig(lottery_id, signature, token);

      return signature;
    },
    onSuccess: (signature) => {
      transactionToast("Initialized config", signature)
      return accounts.refetch()
    },
    onError: (error) =>{
      toast({
        title: 'Error',
        description: 'Failed to initialize account',
        variant: 'destructive',
      });
      console.log("Error: ", error);
    },
  })

  const initializeLimitedLotteryConfig = useMutation<string, Error, CreateLimitedLotteryInputArgs>({
    mutationKey: ['winisol', 'initialize-limited-lottery-config', { cluster }],
    mutationFn: async (data) =>{
      if(!provider || !publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Provider or public key is missing");
      }
        
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found");
      }
      
      const res = await createLimitedLottery(data, token);

      if (!res?.data?.success || !res?.data?.limitedLottery?.id) {
        toast({
          title: 'Error',
          description: 'Failed to create lottery',
          variant: 'destructive',
        })
        throw new Error("API call failed");
      }

      const lottery_id = res.data.limitedLottery.id;

    const InitConfigIx = await program.methods.initializeLimitedLotteryConfig(
      lottery_id,
      data.lotteryName, 
      data.lotterySymbol,
      data.lotteryURI,
      new BN(data.price * LAMPORTS_PER_SOL),
      data.totalTickets,
    ).instruction();
  
      // const computeUnitLimitIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      //   units: 5000,  // Adjust based on the program's complexity
      // });
  
      // const computeUnitPriceIx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
      //   microLamports: 1,  // Lower fees for simulation
      // });

      const blockhashContext = await connection.getLatestBlockhashAndContext();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhashContext.value.blockhash,
        lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight
      }).add(InitConfigIx);
  
      const signature = await sendTransaction(tx, connection);
      console.log(signature);
      await initializeLimitedLotteryConfigSign(lottery_id, signature, token);

      return signature;
    },
    onSuccess: (signature) => {
      transactionToast("Initialized config", signature)
      return accounts.refetch()
    },
    onError: (error) =>{
      toast({
        title: 'Error',
        description: 'Failed to initialize account',
        variant: 'destructive',
      });
      console.log("Error: ", error);
    },
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
    initializeLimitedLotteryConfig
  }
}

export function useWinisolProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  // const transactionToast = useTransactionToast()
  const transactionToast = useWiniSolTransactionToast()
  const { program, accounts } = useWinisolProgram()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet();
  const provider = useAnchorProvider();

  const {token} = useAuth();
  const { toast } = useToast();

  const accountQuery = useQuery({
    queryKey: ['winisol', 'fetch', { cluster, account }],
    queryFn: () => program.account.tokenLottery.fetch(account),
  })

  const initializeLottery = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'initialize-lottery', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found");
      }
      const initLotteryIx = await program.methods.initializeLottery(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();

      const blockhashContext = await connection.getLatestBlockhashAndContext();

      const computeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({units: 300000});
  
      const prioriityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: 1});
  
      const initLotteryTx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhashContext.value.blockhash,
        lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight,
      }).add(initLotteryIx).add(computeIx).add(prioriityIx);
  
      const initLotterySignature = await sendTransaction(initLotteryTx, connection, {skipPreflight: true});
      await initializeLotterySign(lottery_id, initLotterySignature, token);
      return initLotterySignature;
    },
    onSuccess: (tx) => {
      transactionToast("Initialized lottery", tx)
      // return accounts.refetch()
    },
  })

  const initializeLimitedLottery = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'initialize-limited-lottery', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found");
      }
      const initLotteryIx = await program.methods.initializeLimitedLottery(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();

      const blockhashContext = await connection.getLatestBlockhashAndContext();

      const computeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({units: 300000});
  
      const prioriityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: 1});
  
      const initLotteryTx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhashContext.value.blockhash,
        lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight,
      }).add(initLotteryIx).add(computeIx).add(prioriityIx);
  
      const initLotterySignature = await sendTransaction(initLotteryTx, connection, {skipPreflight: true});
      console.log(initLotterySignature);
      await initializeLimitedLotterySign(lottery_id, initLotterySignature, token);
      return initLotterySignature;
    },
    onSuccess: (tx) => {
      transactionToast("Initialized lottery", tx)
      // return accounts.refetch()
    },
  })

  const buyTicket = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        })
        throw new Error("Connect your wallet");
      }

      const buyTicketIx = await program.methods.buyTickets(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID
      }).instruction();
  
      const computeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({units: 300000});
  
      const prioriityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: 1});
  
      const blockhash = await connection.getLatestBlockhash();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(buyTicketIx)
      .add(computeIx)
      .add(prioriityIx);
  
      const signature = await sendTransaction(tx, connection);
      try {
        await connection.confirmTransaction(signature, 'processed');
        // console.log("Transaction confirmed:", signature);

        let res = await buyTicketSign(lottery_id, signature, publicKey?.toString());
  
        return signature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Ticket purchased successfully" ,tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })

  const buyLimitedLotteryTicket = useMutation<string, Error, LimitedLotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster, account }],
    mutationFn: async ({lottery_id, ticket_number}) => {
      if(!publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        })
        throw new Error("Connect your wallet");
      }

      const buyTicketIx = await program.methods.buyLimitedLotteryTickets(lottery_id, ticket_number).accounts({
        tokenProgram: TOKEN_PROGRAM_ID
      }).instruction();
  
      const computeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({units: 300000});
  
      const prioriityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: 1});
  
      const blockhash = await connection.getLatestBlockhash();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(buyTicketIx)
      .add(computeIx)
      .add(prioriityIx);
  
      const signature = await sendTransaction(tx, connection, {skipPreflight: true});
      console.log(signature);
      // return signature;
      try {
        await connection.confirmTransaction(signature, 'processed');
        // console.log("Transaction confirmed:", signature);

        let res = await buyLimitedLotteryTicketSign(lottery_id, signature, publicKey?.toString());
  
        return signature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Ticket purchased successfully" ,tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })


  const createRandomness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        })
        throw new Error("Token not found...");
      }
      if(!publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Connect your wallet")
      }
      const rngKp = web3.Keypair.generate();

      const swithcboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_DEVNET_PID,
        {connection: new web3.Connection('https://api.devnet.solana.com')}
      ) as Idl;

      let switchboardProgram = new Program(swithcboardIDL, provider);
      const queue = new web3.PublicKey(sb.ON_DEMAND_DEVNET_QUEUE);
      const queueAccount = new sb.Queue(switchboardProgram, queue);
      // setSbQueue(queue);
      // dispatch(setSbQueue(queue));
      // setSbQueuePubkey(queue.toString());
      const sbQueuePubKey = queue.toString();
  
      try {
        await queueAccount.loadData();
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
  
      const [randomness, createRandomnessIx] = await sb.Randomness.create(switchboardProgram, rngKp, queue);
      // setSbRandmoness(randomness);
      // dispatch(setSbRandomness(randomness));
      // setSbRandomnessPubkey(randomness.pubkey.toString());
      const sbRandomnessPubKey = randomness.pubkey.toString();

  
      const createRandomnessTx = await sb.asV0Tx({
        connection: provider.connection,
        ixs: [createRandomnessIx],
        payer: publicKey || undefined,
        signers: [rngKp],
        computeUnitLimitMultiple: 1.5,
        computeUnitPrice: 1,
      });
  
      const createRandomnessSignature = await sendTransaction(createRandomnessTx, connection);
      await createRandomnessSign(lottery_id, createRandomnessSignature, sbRandomnessPubKey, sbQueuePubKey, token);
      
      return createRandomnessSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Randomness created", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to create randomness',
      variant: 'destructive',
    })
  })

  const createLimitedLotteryRandomness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        })
        throw new Error("Token not found...");
      }
      if(!publicKey) {
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Connect your wallet")
      }
      const rngKp = web3.Keypair.generate();

      const swithcboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_DEVNET_PID,
        {connection: new web3.Connection('https://api.devnet.solana.com')}
      ) as Idl;

      let switchboardProgram = new Program(swithcboardIDL, provider);
      const queue = new web3.PublicKey(sb.ON_DEMAND_DEVNET_QUEUE);
      const queueAccount = new sb.Queue(switchboardProgram, queue);
      // setSbQueue(queue);
      // dispatch(setSbQueue(queue));
      // setSbQueuePubkey(queue.toString());
      const sbQueuePubKey = queue.toString();
  
      try {
        await queueAccount.loadData();
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
  
      const [randomness, createRandomnessIx] = await sb.Randomness.create(switchboardProgram, rngKp, queue);
      // setSbRandmoness(randomness);
      // dispatch(setSbRandomness(randomness));
      // setSbRandomnessPubkey(randomness.pubkey.toString());
      const sbRandomnessPubKey = randomness.pubkey.toString();

  
      const createRandomnessTx = await sb.asV0Tx({
        connection: provider.connection,
        ixs: [createRandomnessIx],
        payer: publicKey || undefined,
        signers: [rngKp],
        computeUnitLimitMultiple: 1.5,
        computeUnitPrice: 1,
      });
  
      const createRandomnessSignature = await sendTransaction(createRandomnessTx, connection);
      await createLimitedLotteryRandomnessSign(lottery_id, createRandomnessSignature, sbRandomnessPubKey, sbQueuePubKey, token);
      
      return createRandomnessSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Randomness created", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to create randomness',
      variant: 'destructive',
    })
  })

  const commitRandmoness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'commit-randomness', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
        if(!token) {
          toast({
            title: 'Error',
            description: 'Token not found',
            variant: 'destructive',
          })
          throw new Error("Token not found...");
        }

        const res = await getRandomnessKeys(lottery_id, token);

        if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
          toast({
            title: 'Error',
            description: 'Failed to get randomness keys',
            variant: 'destructive',
          })
          throw new Error("Failed to get randomness keys");
        }
        const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
        const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

        const switchboardIDL = await Program.fetchIdl(
          sb.ON_DEMAND_DEVNET_PID,
          { connection: new web3.Connection('https://api.devnet.solana.com') }
        ) as Idl;
    
        const switchboardProgram = new Program(switchboardIDL, provider);
        // const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
        const randomnessAccount = new sb.Randomness(switchboardProgram, new web3.PublicKey(sbRandomnessPubkey));
    
        const sbCommitIx = await randomnessAccount.commitIx(new web3.PublicKey(sbQueuePubkey));
    
        const commitIx = await program.methods.commitRandomness(lottery_id).accounts({
          randomnessAccount: randomnessAccount.pubkey
        }).instruction();
    
        const commitComputeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({
          units: 100000
        });
    
        const commitPriorityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1,
        });
    
        const commitBlockhashWithContext = await provider.connection.getLatestBlockhash();
        const commitTx = new Transaction({
          feePayer: provider.wallet.publicKey,
          blockhash: commitBlockhashWithContext.blockhash,
          lastValidBlockHeight: commitBlockhashWithContext.lastValidBlockHeight
        }).add(commitComputeIx)
        .add(commitPriorityIx)
        .add(sbCommitIx)
        .add(commitIx);
    
        const commitSignature = await sendTransaction(commitTx, provider.connection);
        await commitRandomnessSign(lottery_id, commitSignature, token);
        return commitSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Commited randomness", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to commit randomness',
      variant: 'destructive',
    }),
  })


  const commitLimitedLotteryRandmoness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'commit-limited-lottery-randomness', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
        if(!token) {
          toast({
            title: 'Error',
            description: 'Token not found',
            variant: 'destructive',
          })
          throw new Error("Token not found...");
        }

        const res = await getLimitedLotteryRandomnessKeys(lottery_id, token);

        if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
          toast({
            title: 'Error',
            description: 'Failed to get randomness keys',
            variant: 'destructive',
          })
          throw new Error("Failed to get randomness keys");
        }
        const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
        const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

        const switchboardIDL = await Program.fetchIdl(
          sb.ON_DEMAND_DEVNET_PID,
          { connection: new web3.Connection('https://api.devnet.solana.com') }
        ) as Idl;
    
        const switchboardProgram = new Program(switchboardIDL, provider);
        // const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
        const randomnessAccount = new sb.Randomness(switchboardProgram, new web3.PublicKey(sbRandomnessPubkey));
    
        const sbCommitIx = await randomnessAccount.commitIx(new web3.PublicKey(sbQueuePubkey));
    
        const commitIx = await program.methods.commitLimitedLotteryRandomness(lottery_id).accounts({
          randomnessAccount: randomnessAccount.pubkey
        }).instruction();
    
        const commitComputeIx = web3.ComputeBudgetProgram.setComputeUnitLimit({
          units: 100000
        });
    
        const commitPriorityIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1,
        });
    
        const commitBlockhashWithContext = await provider.connection.getLatestBlockhash();
        const commitTx = new Transaction({
          feePayer: provider.wallet.publicKey,
          blockhash: commitBlockhashWithContext.blockhash,
          lastValidBlockHeight: commitBlockhashWithContext.lastValidBlockHeight
        }).add(commitComputeIx)
        .add(commitPriorityIx)
        .add(sbCommitIx)
        .add(commitIx);
    
        const commitSignature = await sendTransaction(commitTx, provider.connection);
        console.log(commitSignature);
        await commitLimitedLotteryRandomnessSign(lottery_id, commitSignature, token);
        return commitSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Commited randomness", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to commit randomness',
      variant: 'destructive',
    }),
  })


  // Reveal winner 
  const revealWinner = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'reveal-winner', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found...");
      }
      const res = await getRandomnessKeys(lottery_id, token);
      if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
        toast({
          title: 'Error',
          description: 'Failed to get randomness keys',
          variant: 'destructive',
        })
        throw new Error("Failed to get randomness keys");
      }
      const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
      const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

      const switchboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_DEVNET_PID,
        { connection: new web3.Connection('https://api.devnet.solana.com') }
      ) as Idl;
  
      const switchboardProgram = new Program(switchboardIDL, provider);

      // const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
      const randomnessAccount = new sb.Randomness(switchboardProgram, new web3.PublicKey(sbRandomnessPubkey));
      const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
      try {
        await queueAccount.loadData();
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
      const sbRevealIx = await randomnessAccount.revealIx();
        
      const revealWinnerIx = await program.methods.revealWinner(lottery_id).accounts({
        randomnessAccount: randomnessAccount.pubkey
      }).instruction();
  
      const revealBlockHashWithContext = await provider.connection.getLatestBlockhash();
  
      const revealTx = new Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: revealBlockHashWithContext.blockhash,
        lastValidBlockHeight: revealBlockHashWithContext.lastValidBlockHeight,
      }).add(sbRevealIx).add(revealWinnerIx);
  
  
      const revealWinnerSignature = await sendTransaction(revealTx, provider.connection);
      console.log(revealWinnerSignature);

      try {
        await connection.confirmTransaction(revealWinnerSignature, 'processed');

        let res = await revealWinnerSign(lottery_id, revealWinnerSignature, token);
        // console.log("Backend response:", res);
  
        return revealWinnerSignature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Winner Revealed", tx)
      // return accountQuery.refetch()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reveal winner',
        variant: 'destructive',
      })
      console.log(error);
    },
  })


  const revealLimitedLotteryWinner = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'reveal-limited-lottery-winner', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        });
        throw new Error("Token not found...");
      }
      const res = await getLimitedLotteryRandomnessKeys(lottery_id, token);
      if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
        toast({
          title: 'Error',
          description: 'Failed to get randomness keys',
          variant: 'destructive',
        })
        throw new Error("Failed to get randomness keys");
      }
      const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
      const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

      const switchboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_DEVNET_PID,
        { connection: new web3.Connection('https://api.devnet.solana.com') }
      ) as Idl;
  
      const switchboardProgram = new Program(switchboardIDL, provider);

      // const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
      const randomnessAccount = new sb.Randomness(switchboardProgram, new web3.PublicKey(sbRandomnessPubkey));
      const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
      try {
        await queueAccount.loadData();
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
      const sbRevealIx = await randomnessAccount.revealIx();
        
      const revealWinnerIx = await program.methods.revealLimitedLotteryWinner(lottery_id).accounts({
        randomnessAccount: randomnessAccount.pubkey
      }).instruction();
  
      const revealBlockHashWithContext = await provider.connection.getLatestBlockhash();
  
      const revealTx = new Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: revealBlockHashWithContext.blockhash,
        lastValidBlockHeight: revealBlockHashWithContext.lastValidBlockHeight,
      }).add(sbRevealIx).add(revealWinnerIx);
  
  
      const revealWinnerSignature = await sendTransaction(revealTx, provider.connection);
      console.log(revealWinnerSignature);

      try {
        await connection.confirmTransaction(revealWinnerSignature, 'processed');

        let res = await revealLimitedLotteryWinnerSign(lottery_id, revealWinnerSignature, token);
        // console.log("Backend response:", res);
  
        return revealWinnerSignature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Winner Revealed", tx)
      // return accountQuery.refetch()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to reveal winner',
        variant: 'destructive',
      })
      console.log(error);
    },
  })
  

  const claimWinnings = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'claim-prize', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey){
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Connect your wallet")
      }
      const calimIx = await program.methods.claimWinnings(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();
  
      const claimBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const claimTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: claimBlockhashWithContext.blockhash,
        lastValidBlockHeight: claimBlockhashWithContext.lastValidBlockHeight
      }).add(calimIx);
  
      const claimSignature = await sendTransaction(claimTx, provider.connection);
  
      console.log("claim signature: ", claimSignature);

      

      try {
        await connection.confirmTransaction(claimSignature, 'processed');

        await claimWinningsSign(lottery_id, publicKey?.toString(), claimSignature);
  
        return claimSignature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Winning claimed", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to claim winnings',
      variant: 'destructive',
    })
  })

  const claimLimitedLotteryWinnings = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'claim-limited-lottery-winnings', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey){
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        });
        throw new Error("Connect your wallet")
      }
      const calimIx = await program.methods.claimLimitedLotteryWinnings(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();
  
      const claimBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const claimTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: claimBlockhashWithContext.blockhash,
        lastValidBlockHeight: claimBlockhashWithContext.lastValidBlockHeight
      }).add(calimIx);
  
      const claimSignature = await sendTransaction(claimTx, provider.connection, {skipPreflight: true});
  
      console.log("claim signature: ", claimSignature);

      try {
        await connection.confirmTransaction(claimSignature, 'processed');

        await claimLimitedLotteryWinningsSign(lottery_id, publicKey?.toString(), claimSignature);
  
        return claimSignature;
      } catch (error) {
        console.error("Transaction failed to confirm:", error);
        toast({
          title: 'Error',
          description: 'Transaction failed to confirm',
          variant: 'destructive',
        })
        throw error; 
      }
    },
    onSuccess: (tx) => {
      transactionToast("Winning claimed", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to claim winnings',
      variant: 'destructive',
    })
  })

  const authorityTransfer = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'authority-transfer', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        })
        throw new Error("Token not found...");
      }
      if(!publicKey){
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        })
        throw new Error("Connect your wallet")
      }
      const authorityTransferIx = await program.methods.transferToAuthority(lottery_id).accounts({
        payer: publicKey
      }).instruction();
  
      const authorityTranferBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const authorityTransferTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: authorityTranferBlockhashWithContext.blockhash,
        lastValidBlockHeight: authorityTranferBlockhashWithContext.lastValidBlockHeight
      }).add(authorityTransferIx);
  
      const authorityTransferSignature = await sendTransaction(authorityTransferTx, provider.connection);
  
      console.log("authority transfer signature: ", authorityTransferSignature);
      await authorityTransferSign(lottery_id, publicKey?.toString(), authorityTransferSignature, token);

      return authorityTransferSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Transfer to authority successfully", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to transfer authority',
      variant: 'destructive',
    })
  })

  const authorityLimitedLotteryTransfer = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'authority-limited-lottery-transfer', { cluster, account }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        toast({
          title: 'Error',
          description: 'Token not found',
          variant: 'destructive',
        })
        throw new Error("Token not found...");
      }
      if(!publicKey){
        toast({
          title: 'Error',
          description: 'Connect your wallet',
          variant: 'destructive',
        })
        throw new Error("Connect your wallet")
      }
      const authorityTransferIx = await program.methods.limitedLotteryTransferToAuthority(lottery_id).accounts({
        payer: publicKey
      }).instruction();
  
      const authorityTranferBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const authorityTransferTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: authorityTranferBlockhashWithContext.blockhash,
        lastValidBlockHeight: authorityTranferBlockhashWithContext.lastValidBlockHeight
      }).add(authorityTransferIx);
  
      const authorityTransferSignature = await sendTransaction(authorityTransferTx, provider.connection, {skipPreflight: true});
  
      console.log("authority transfer signature: ", authorityTransferSignature);
      await limitedLotteryAuthorityTransferSign(lottery_id, publicKey?.toString(), authorityTransferSignature, token);

      return authorityTransferSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Transfer to authority successfully", tx)
      // return accountQuery.refetch()
    },
    onError: () => toast({
      title: 'Error',
      description: 'Failed to transfer authority',
      variant: 'destructive',
    })
  })

  return {
    initializeLottery,
    initializeLimitedLottery,
    buyTicket,
    buyLimitedLotteryTicket,
    createRandomness,
    createLimitedLotteryRandomness,
    commitRandmoness,
    commitLimitedLotteryRandmoness,
    revealWinner,
    revealLimitedLotteryWinner,
    claimWinnings,
    claimLimitedLotteryWinnings,
    authorityTransfer,
    authorityLimitedLotteryTransfer
  }
}