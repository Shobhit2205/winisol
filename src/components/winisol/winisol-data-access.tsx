'use client';

import { getWinisolProgram, getWinisolProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, ComputeBudgetProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useAuth } from '@/contexts/AuthContext'
import { CreateLotteryInputArgs } from '../authority/dashboard/CreateLottery'
import { authorityTransferSign, buyTicketSign, claimWinningsSign, commitRandomnessSign, createLottery, createRandomnessSign, deleteLottery, getRandomnessKeys, initializeConfig, initializeLotterySign, revealWinnerSign } from '@/services/lotteryService'
import { BN, Idl, Program, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as sb from '@switchboard-xyz/on-demand'
import { useWiniSolTransactionToast } from '../ui/layouts/Layout';
import { useToast } from '@/hooks/use-toast';
import { CreateLimitedLotteryInputArgs } from '../authority/dashboard/CreateLimitedLottery';
import { buyLimitedLotteryTicketSign, claimLimitedLotteryWinningsSign, commitLimitedLotteryRandomnessSign, createLimitedLottery, createLimitedLotteryRandomnessSign, deleteLimitedLottery, getLimitedLotteryRandomnessKeys, initializeLimitedLotteryConfigSign, initializeLimitedLotterySign, limitedLotteryAuthorityTransferSign, revealLimitedLotteryWinnerSign } from '@/services/limitedLotteryService';
import { CONNECTION_ENDPOINT } from '@/lib/constants';

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

  const initialize = useMutation<string, Error, CreateLotteryInputArgs>({
    mutationKey: ['tokenlottery', 'initialize-config', { cluster }],
    mutationFn: async (data) =>{
      let lottery_id = null;
      try {
        if(!publicKey) {
          throw new Error("Provider or public key is missing");
        }
          
        if(!token) {
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
  
        lottery_id = res.data.lottery.id;
  
        const InitConfigIx = await program.methods.initializeConfig(
          lottery_id,
          data.lotteryName, 
          data.lotterySymbol,
          data.lotteryURI,
          new Date(data.startTime).getTime() / 1000, // Convert to UNIX timestamp
          new Date(data.endTime).getTime() / 1000,
          new BN(data.price * LAMPORTS_PER_SOL),
        ).instruction();
    
        const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
          units: 40000,  
        });
        
        const recentPriorityFees = await connection.getRecentPrioritizationFees();
        const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
    
        const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: minFee + 1, 
        });
  
        const blockhashContext = await connection.getLatestBlockhashAndContext();
    
        const tx = new Transaction({
          feePayer: publicKey,
          blockhash: blockhashContext.value.blockhash,
          lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight
        }).add(computeUnitLimitIx).add(computeUnitPriceIx).add(InitConfigIx);
    
        const signature = await sendTransaction(tx, connection);
  
        await initializeConfig(lottery_id, signature, token);
  
        return signature;
      } catch (error) {
        if (lottery_id) {
          try {
            if(!token) {
              throw new Error("Token not found");
            }
            await deleteLottery(lottery_id, token);
            console.log(`Lottery ${lottery_id} was deleted due to initialization failure`);
          } catch (deleteError) {
            console.error(`Failed to delete lottery ${lottery_id}:`, deleteError);
          }
        }
        throw error;
      }
      
    },
    onSuccess: (signature) => {
      transactionToast("Initialized config", signature)
      // return accounts.refetch()
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
      let lottery_id = null;
      try {
        if(!publicKey) {
          throw new Error("Connect your wallet");
        }
          
        if(!token) {
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
  
        lottery_id = res.data.limitedLottery.id;
  
        const InitConfigIx = await program.methods.initializeLimitedLotteryConfig(
          lottery_id,
          data.lotteryName, 
          data.lotterySymbol,
          data.lotteryURI,
          new BN(data.price * LAMPORTS_PER_SOL),
          data.totalTickets,
        ).instruction();
    
        const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
          units: 40000,  
        });
        const recentPriorityFees = await connection.getRecentPrioritizationFees();
        const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
    
        const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: minFee + 1, 
        });
  
        const blockhashContext = await connection.getLatestBlockhashAndContext();
    
        const tx = new Transaction({
          feePayer: publicKey,
          blockhash: blockhashContext.value.blockhash,
          lastValidBlockHeight: blockhashContext.value.lastValidBlockHeight
        }).add(computeUnitLimitIx).add(computeUnitPriceIx).add(InitConfigIx);
    
        const signature = await sendTransaction(tx, connection);
        console.log(signature);
        await initializeLimitedLotteryConfigSign(lottery_id, signature, token);
  
        return signature;
      } catch (error) {
        if (lottery_id) {
          try {
            if(!token) {
              throw new Error("Token not found");
            }
            await deleteLimitedLottery(lottery_id, token);
            console.log(`Lottery ${lottery_id} was deleted due to initialization failure`);
          } catch (deleteError) {
            console.error(`Failed to delete lottery ${lottery_id}:`, deleteError);
          }  
        }
        throw error;
      }
      
    },
    onSuccess: (signature) => {
      transactionToast("Initialized config", signature)
      // return accounts.refetch()
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
    initialize,
    initializeLimitedLotteryConfig
  }
}

export function useWinisolProgramAccount() {
  const { cluster } = useCluster()
  // const transactionToast = useTransactionToast()
  const transactionToast = useWiniSolTransactionToast()
  const { program } = useWinisolProgram()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet();
  const provider = useAnchorProvider();

  const {token} = useAuth();
  const { toast } = useToast();


  const initializeLottery = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'initialize-lottery', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found");
      }
      if(!publicKey) {
        throw new Error("Connect your wallet");
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
  
      const initLotterySignature = await sendTransaction(initLotteryTx, connection);
      await initializeLotterySign(lottery_id, initLotterySignature, token);
      return initLotterySignature;
    },
    onSuccess: (tx) => {
      transactionToast("Initialized lottery", tx)
      // return accounts.refetch()
    },
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })

  const initializeLimitedLottery = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'initialize-limited-lottery', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found");
      }
      if(!publicKey) {
        throw new Error("Connect your wallet");
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
  
      const initLotterySignature = await sendTransaction(initLotteryTx, connection);
      console.log(initLotterySignature);
      await initializeLimitedLotterySign(lottery_id, initLotterySignature, token);
      return initLotterySignature;
    },
    onSuccess: (tx) => {
      transactionToast("Initialized lottery", tx)
      // return accounts.refetch()
    },
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })

  const buyTicket = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey) {
        throw new Error("Connect your wallet");
      }

      const buyTicketIx = await program.methods.buyTickets(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID
      }).instruction();
  
      const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 300000,  
      });
      
      const recentPriorityFees = await connection.getRecentPrioritizationFees();
      const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
  
      const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: minFee + 1, 
      });
  
      const blockhash = await connection.getLatestBlockhash();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(computeUnitLimitIx)
      .add(computeUnitPriceIx).add(buyTicketIx);
  
      const signature = await sendTransaction(tx, connection);
      try {
        await connection.confirmTransaction(signature, 'processed');
        // console.log("Transaction confirmed:", signature);

        await buyTicketSign(lottery_id, signature, publicKey?.toString());
  
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })

  const buyLimitedLotteryTicket = useMutation<string, Error, LimitedLotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster }],
    mutationFn: async ({lottery_id, ticket_number}) => {
      if(!publicKey) {
        throw new Error("Connect your wallet");
      }

      const buyTicketIx = await program.methods.buyLimitedLotteryTickets(lottery_id, ticket_number).accounts({
        tokenProgram: TOKEN_PROGRAM_ID
      }).instruction();
  
      const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 300000,  
      });
      
      const recentPriorityFees = await connection.getRecentPrioritizationFees();
      const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
  
      const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: minFee + 1, 
      });
  
      const blockhash = await connection.getLatestBlockhash();
  
      const tx = new Transaction({
        feePayer: publicKey,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }).add(computeUnitLimitIx)
      .add(computeUnitPriceIx).add(buyTicketIx);
  
      const signature = await sendTransaction(tx, connection);
      console.log(signature);
      // return signature;
      try {
        await connection.confirmTransaction(signature, 'processed');
        // console.log("Transaction confirmed:", signature);

        await buyLimitedLotteryTicketSign(lottery_id, signature, publicKey?.toString());
  
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to purchase ticket',
      variant: 'destructive',
    })
  })


  const createRandomness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found...");
      }
      if(!publicKey) {
        throw new Error("Connect your wallet")
      }
      const rngKp = web3.Keypair.generate();

      const swithcboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_MAINNET_PID,
        {connection: new web3.Connection(CONNECTION_ENDPOINT)}
      ) as Idl;

      let switchboardProgram = new Program(swithcboardIDL, provider);
      const queue = new web3.PublicKey(sb.ON_DEMAND_MAINNET_QUEUE);
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to create randomness',
      variant: 'destructive',
    })
  })

  const createLimitedLotteryRandomness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'buy-ticket', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found...");
      }
      if(!publicKey) {
        throw new Error("Connect your wallet")
      }
      const rngKp = web3.Keypair.generate();

      const swithcboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_MAINNET_PID,
        {connection: new web3.Connection(CONNECTION_ENDPOINT)}
      ) as Idl;

      let switchboardProgram = new Program(swithcboardIDL, provider);
      const queue = new web3.PublicKey(sb.ON_DEMAND_MAINNET_QUEUE);
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to create randomness',
      variant: 'destructive',
    })
  })

  const commitRandmoness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'commit-randomness', { cluster }],
    mutationFn: async ({lottery_id}) => {
        if(!token) {
          throw new Error("Token not found...");
        }

        const res = await getRandomnessKeys(lottery_id, token);

        if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
          throw new Error("Failed to get randomness keys");
        }
        const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
        const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

        const switchboardIDL = await Program.fetchIdl(
          sb.ON_DEMAND_MAINNET_QUEUE,
          { connection: new web3.Connection(CONNECTION_ENDPOINT) }
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to commit randomness',
      variant: 'destructive',
    }),
  })


  const commitLimitedLotteryRandmoness = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'commit-limited-lottery-randomness', { cluster }],
    mutationFn: async ({lottery_id}) => {
        if(!token) {
          throw new Error("Token not found...");
        }

        const res = await getLimitedLotteryRandomnessKeys(lottery_id, token);

        if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
          throw new Error("Failed to get randomness keys");
        }
        const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
        const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

        const switchboardIDL = await Program.fetchIdl(
          sb.ON_DEMAND_MAINNET_PID,
          { connection: new web3.Connection(CONNECTION_ENDPOINT) }
        ) as Idl;
    
        const switchboardProgram = new Program(switchboardIDL, provider);
        // const queueAccount = new sb.Queue(switchboardProgram, new web3.PublicKey(sbQueuePubkey));
        const randomnessAccount = new sb.Randomness(switchboardProgram, new web3.PublicKey(sbRandomnessPubkey));
    
        const sbCommitIx = await randomnessAccount.commitIx(new web3.PublicKey(sbQueuePubkey));
    
        const commitIx = await program.methods.commitLimitedLotteryRandomness(lottery_id).accounts({
          randomnessAccount: randomnessAccount.pubkey
        }).instruction();
    
        const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
          units: 50000,  
        });
        
        const recentPriorityFees = await connection.getRecentPrioritizationFees();
        const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
    
        const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: minFee + 1, 
        });
    
        const commitBlockhashWithContext = await provider.connection.getLatestBlockhash();
        const commitTx = new Transaction({
          feePayer: provider.wallet.publicKey,
          blockhash: commitBlockhashWithContext.blockhash,
          lastValidBlockHeight: commitBlockhashWithContext.lastValidBlockHeight
        }).add(computeUnitLimitIx)
        .add(computeUnitPriceIx)
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to commit randomness',
      variant: 'destructive',
    }),
  })


  // Reveal winner 
  const revealWinner = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'reveal-winner', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found...");
      }
      const res = await getRandomnessKeys(lottery_id, token);
      if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
        throw new Error("Failed to get randomness keys");
      }
      const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
      const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

      const switchboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_MAINNET_PID,
        { connection: new web3.Connection(CONNECTION_ENDPOINT) }
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
        description: error.message || 'Failed to reveal winner',
        variant: 'destructive',
      })
      console.log(error);
    },
  })


  const revealLimitedLotteryWinner = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'reveal-limited-lottery-winner', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found...");
      }
      const res = await getLimitedLotteryRandomnessKeys(lottery_id, token);
      if(!res?.data?.success || !res?.data?.randomnessKeys?.sbRandomnessPubKey || !res?.data?.randomnessKeys?.sbQueuePubKey) {
        throw new Error("Failed to get randomness keys");
      }
      const sbRandomnessPubkey = res.data.randomnessKeys.sbRandomnessPubKey;
      const sbQueuePubkey = res.data.randomnessKeys.sbQueuePubKey;

      const switchboardIDL = await Program.fetchIdl(
        sb.ON_DEMAND_MAINNET_PID,
        { connection: new web3.Connection(CONNECTION_ENDPOINT) }
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
        description: error.message || 'Failed to reveal winner',
        variant: 'destructive',
      })
      console.log(error);
    },
  })
  

  const claimWinnings = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'claim-prize', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey){
        throw new Error("Connect your wallet")
      }
      const calimIx = await program.methods.claimWinnings(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();

      const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 60000,  
      });
      
      const recentPriorityFees = await connection.getRecentPrioritizationFees();
      const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
  
      const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: minFee + 1, 
      });
  
      const claimBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const claimTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: claimBlockhashWithContext.blockhash,
        lastValidBlockHeight: claimBlockhashWithContext.lastValidBlockHeight
      }).add(computeUnitLimitIx).add(computeUnitPriceIx).add(calimIx);
  
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to claim winnings',
      variant: 'destructive',
    })
  })

  const claimLimitedLotteryWinnings = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'claim-limited-lottery-winnings', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!publicKey){
        throw new Error("Connect your wallet")
      }
      const calimIx = await program.methods.claimLimitedLotteryWinnings(lottery_id).accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      }).instruction();

      const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 60000,  
      });
      
      const recentPriorityFees = await connection.getRecentPrioritizationFees();
      const minFee = Math.min(...recentPriorityFees.map(fee => fee.prioritizationFee));
  
      const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: minFee + 1, 
      });
  
      const claimBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const claimTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: claimBlockhashWithContext.blockhash,
        lastValidBlockHeight: claimBlockhashWithContext.lastValidBlockHeight
      }).add(computeUnitLimitIx).add(computeUnitPriceIx).add(calimIx);
  
      const claimSignature = await sendTransaction(claimTx, provider.connection);
  
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to claim winnings',
      variant: 'destructive',
    })
  })

  const authorityTransfer = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'authority-transfer', { cluster }],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found...");
      }
      if(!publicKey){
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
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to transfer authority',
      variant: 'destructive',
    })
  })

  const authorityLimitedLotteryTransfer = useMutation<string, Error, LotteryArgs>({
    mutationKey: ['winisol', 'authority-limited-lottery-transfer'],
    mutationFn: async ({lottery_id}) => {
      if(!token) {
        throw new Error("Token not found");
      }
      if(!publicKey){
        throw new Error("Connect your wallet")
      }
      const authorityTransferIx = await program.methods.limitedLotteryTransferToAuthority(lottery_id).instruction();
  
      const authorityTranferBlockhashWithContext = await provider.connection.getLatestBlockhash();
      const authorityTransferTx = new web3.Transaction({
        feePayer: provider.wallet.publicKey,
        blockhash: authorityTranferBlockhashWithContext.blockhash,
        lastValidBlockHeight: authorityTranferBlockhashWithContext.lastValidBlockHeight
      }).add(authorityTransferIx);
  
      const authorityTransferSignature = await sendTransaction(authorityTransferTx, provider.connection);
      console.log("authority transfer signature: ", authorityTransferSignature);

      await limitedLotteryAuthorityTransferSign(lottery_id, publicKey?.toString(), authorityTransferSignature, token);

      return authorityTransferSignature;
    },
    onSuccess: (tx) => {
      transactionToast("Transfer to authority successfully", tx)
      // return accountQuery.refetch()
    },
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'Failed to transfer authority',
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