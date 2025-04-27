'use client'

import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'
import { SOLANA_ENVIRONMENT } from '@/lib/constants'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentWinnings, setPreviousWinnings, setIsLoading } from "@/redux/slices/winningsSlice"; 
import { setLotteries, setIsLotteriesLoading } from "@/redux/slices/lotteriesSlice"; 
import { getAllLotteries } from '@/services/lotteryService';
import { useWallet } from '@solana/wallet-adapter-react';
import { Toaster as WiniSolToast } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { ExternalLink } from 'lucide-react'
import { setIsLimitedLotteriesLoading, setLimitedLotteries } from '@/redux/slices/limitedLotterySlice'
import { getAllLimitedLottery } from '@/services/limitedLotteryService'
import { getAllRecentWinners, getWinningsByPublicKey } from '@/services/commonLotteryService'
import { RootState } from '@/redux/store'
import { setIsWinnersLoading, setTotalWinners, setWinners } from '@/redux/slices/recentWinnersSlice'

export function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch(); // Get dispatch from the hook
  const { currentWinnings } = useSelector((state: RootState) => state.winnings);
  const { publicKey } = useWallet();


  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        if(!publicKey) {
          // toast.error("Please connect your wallet.");
          return;
        }
        dispatch(setIsLoading(true)); 
        const winningsData = await getWinningsByPublicKey(publicKey.toString());

        dispatch(setCurrentWinnings(winningsData.data.currentWinnings));
        dispatch(setPreviousWinnings(winningsData.data.previousWinnings));
        dispatch(setIsLoading(false)); 
      } catch (error) {
        console.error("Error fetching winnings:", error);
        dispatch(setIsLoading(false)); 
      }
    };

    fetchWinnings();
  }, [dispatch, publicKey]);


  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        dispatch(setIsLotteriesLoading(true)); 
        const lotteriesData = await getAllLotteries();

        dispatch(setLotteries(lotteriesData.data.lotteries));
        dispatch(setIsLotteriesLoading(false)); 
      } catch (error) {
        console.error("Error fetching winnings:", error);
        dispatch(setIsLotteriesLoading(false)); 
      }
    };

    fetchLotteries();
  }, [dispatch]);

  useEffect(() => {
    const fetchLimitedLotteries = async () => {
      try {
        dispatch(setIsLimitedLotteriesLoading(true)); 
        const lotteriesData = await getAllLimitedLottery();

        dispatch(setLimitedLotteries(lotteriesData.data.lotteries));
        dispatch(setIsLimitedLotteriesLoading(false)); 
      } catch (error) {
        console.error("Error fetching winnings:", error);
        dispatch(setIsLimitedLotteriesLoading(false)); 
      }
    };

    fetchLimitedLotteries();
  }, [dispatch]);

  useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        dispatch(setIsWinnersLoading(true)); 
        const winnersData = await getAllRecentWinners();


        dispatch(setWinners(winnersData.data.winners));
        dispatch(setTotalWinners(winnersData.data.total));
        dispatch(setIsWinnersLoading(false)); 
      } catch (error) {
        console.error("Error fetching winnings:", error);
        dispatch(setIsWinnersLoading(false)); 
      }
    };

    fetchRecentWinners();
  }, [dispatch])
  
  return (
    <div className="flex flex-col" >
      <Navbar/>
      <div className="pt-16">
        {SOLANA_ENVIRONMENT === 'devnet' && (
          <div className="w-full text-center text-black bg-primary font-semibold py-1 px-2">
            🚀 Running on Devnet | Mainnet Solana Launch Incoming! Stay Tuned 🔥  
          </div>
        )}
        {currentWinnings?.length > 0 && <div className='w-full bg-primary text-black flex items-center justify-center py-3 gap-2 px-16'>
          <h2 className='text-lg'>Congratulations 🎉 you have won the lottery</h2> 
          <Link href='/claim-winnings' className='text-lg font-bold'>Claim Winnings</Link>
        </div>}
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <WiniSolToast />
      </div>
      <Footer/>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}


export function useWiniSolTransactionToast() {
  const { toast } = useToast();
  return (description: string, signature: string) => {
    toast({
      className: 'bg-primary text-black outline-none border-none',
      title: "Transaction Successful",
      description: description,
      action: <a href={`https://explorer.solana.com/tx/${signature}?cluster=${SOLANA_ENVIRONMENT}`} target='_blank' rel='noopener noreferrer' className='w-fit px-2 py-1 bg-black text-primary flex gap-1 items-center rounded-md'> 
         <span className=''>View</span>
         <ExternalLink size={20} />
        </a>
    })
  }
}
