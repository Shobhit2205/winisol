'use client';

import { ArrowRight, ArrowUpRight, Clock, TicketCheck, UsersRound } from 'lucide-react';
import Image from 'next/image';
import solanaLogo from '@/assets/solana-logo.png';
import { SlidingNumber } from '../../sliding-number';
import { useEffect, useState } from 'react';
import { Button } from '../../animated-button';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { useWinisolProgramAccount } from '@/components/winisol/winisol-data-access';
import { Badge } from '../../badge';
import { useDispatch } from 'react-redux';
import { updateLottery } from '@/redux/slices/lotteriesSlice';

type pageType = "authority_open_lottery" | "authority_closed_lottery" | "user_lottery" | "user_claim_winnings"
interface LotteryCardProps {
    data: {
        id: number;
        lotteryName: string,
        lotterySymbol: string,
        lotteryImage: string,
        startTime: number,
        endTime: number,
        potAmount: number,
        totalTickets: number,
        price: number,
        priceClaimedSignature? : string,
        winnerTicketId?: string
        winnings?: number
        lotteryType?: string
    },
    pageType: pageType,
    isPrevoiusWinnings?: boolean
}

export default function LotteryCard({data, pageType, isPrevoiusWinnings}: LotteryCardProps) {
    const { buyTicket, claimLimitedLotteryWinnings, claimWinnings } = useWinisolProgramAccount({account: new PublicKey("FKKVUnKqXHtHZEivpK4saiDF8pwV9Q67RiFGwBLxNvEY")});
    const [isBuying, setIsBuying] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const dispatch = useDispatch();

    const calculateRemainingTime = (endTime: number) => {
        const now = Math.floor(Date.now() / 1000); // Current time in Unix
        const diff = Math.max(endTime - now, 0); // Ensure non-negative
    
        return {
          days: Math.floor(diff / (60 * 60 * 24)),
          hours: Math.floor((diff % (60 * 60 * 24)) / (60 * 60)),
          minutes: Math.floor((diff % (60 * 60)) / 60),
          seconds: diff % 60,
        };
    };

    const claculateHours = (endTime: number) => {
        const now = Math.floor(Date.now() / 1000); // Current time in Unix
        const diff = Math.max(endTime - now, 0); // Ensure non-negative
        setHoursLeft(Math.floor((diff) / (60 * 60)));
    }

    
    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime(data.endTime));
    const [hoursLeft, setHoursLeft] = useState<number>();

    useEffect(() => {
    const interval = setInterval(() => {
        setTimeLeft(calculateRemainingTime(data.endTime));
        claculateHours(data.endTime);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleBuyTicket = async () => {
        try {
            setIsBuying(true);
            await buyTicket.mutateAsync({lottery_id: data.id})
            dispatch(updateLottery({
                lotteryId: data.id,
            }))
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsBuying(false);
        }
    }

    const handleClaimWinnings = async () => {
        try {
            setIsClaiming(true);
            if(data.lotteryType === "limited") {
                await claimLimitedLotteryWinnings.mutateAsync({lottery_id: data.id})
            } else {
                await claimWinnings.mutateAsync({lottery_id: data.id})
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsClaiming(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full border border-[#BFBFBF] rounded-2xl px-3 py-4 bg-gradient-to-t from-[rgba(9,9,9,0)] via-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.12)]">
            <div className='flex justify-between items-center gap-6'>
                <div className='flex gap-2 items-center'>
                    <TicketCheck  color="#0AEFB2" />
                    <span className='text-[#F6F6F6] text-md'>#{data.id}</span>
                    <span className='text-sm text-[#C8C8C8]'>Ticket Code</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <h3 className='text-[#F6F6F6] text-md'>{data.lotteryName}</h3>
                </div>
                
            </div>
            <div className='w-full flex gap-2 h-[120px]'>
                <div className='rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] w-full'>
                    <div className='rounded-md flex h-full w-full items-center justify-center  bg-black' >
                        <Image width={100} height={100} src={data.lotteryImage || "https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png"} alt='solana lottery image' className='object-cover w-10' />
                    </div>
                </div>
                <div className='rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] w-full h-[105px] self-end'>
                    <div className='border bg-black w-full h-[103px] relative rounded-md flex flex-col items-center justify-center'>
                        <div className='rounded-badge py-1 px-2 xl:px-4 bg-gradient-to-r from-primary to-secondary w-fit absolute -top-[20px] xl:-top-[18px]'>
                            <h3 className='text-center text-black font-medium'>{pageType === "user_claim_winnings" ? "Winning amount" : "Current Pool"}</h3>
                        </div>
                        <div className='mt-2'>
                            
                            <h3 className='text-4xl text-primary'>{((pageType === "user_claim_winnings" ? data.winnings : data.potAmount) || 0 )/ LAMPORTS_PER_SOL}</h3>
                            <div className='flex gap-2 items-center'>
                                <Image width={12} height={12} src={solanaLogo.src} alt='solana logo' />
                                <h4 className='text-base'>sol</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {(pageType === "user_claim_winnings" || pageType === "authority_closed_lottery") ? 
            <div>
                <h3 className='gradient-text text-lg text-center bg-gradient-to-r from-[#FBFBFB] to-[#696969]'>Winner Ticket</h3>
                <h4 className='gradient-text text-2xl text-center bg-gradient-to-r from-primary to-secondary'>{data.winnerTicketId}</h4>
            </div> 
            : <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <h3 className='gradient-text bg-gradient-to-r from-[#FBFBFB] to-[#696969]'>Ticket Expires in</h3>
                    <div className='flex gap-1 items-center'>
                        <Clock size={15}/>
                        <h3 className='gradient-text bg-gradient-to-r from-[#FBFBFB] to-[#696969]'>{hoursLeft}h left</h3>
                    </div>
                </div>

                <div className='flex justify-center items-center w-full gap-2'>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <div className='h-12 w-full m-auto rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] flex items-center justify-center'>
                            <div className='rounded-md bg-black h-11 w-full flex items-center justify-center'>
                                <div className='text-3xl font-medium'>
                                <SlidingNumber value={timeLeft.days} padStart={true} />
                                </div>
                                
                            </div>
                        </div>
                        <h4>Days</h4>
                    </div>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <div className='h-12 w-full m-auto rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] flex items-center justify-center'>
                            <div className='rounded-md bg-black h-11 w-full flex items-center justify-center'>
                                <div className='text-3xl font-medium'>
                                    <SlidingNumber value={timeLeft.hours} padStart={true} />
                                </div>
                            </div>
                        </div>
                        <h4>Hours</h4>
                    </div>
                    <div className='flex flex-col items-center justify-between w-full'>
                        <div className='h-12 w-full m-auto rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] flex items-center justify-center'>
                            <div className='rounded-md bg-black h-11 w-full flex items-center justify-center'>
                                <div className='text-3xl font-medium'>
                                    <SlidingNumber value={timeLeft.minutes} padStart={true} />
                                </div>
                            </div>
                        </div>
                        <h4>Minutes</h4>
                    </div>
                    <div className='flex flex-col items-center justify-between w-full gap-1'>
                        <div className='h-12 w-full m-auto rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] flex items-center justify-center'>
                            <div className='rounded-md bg-black h-11 w-full flex items-center justify-center'>
                                <div className='text-3xl font-medium'>
                                    <SlidingNumber value={timeLeft.seconds} padStart={true} />
                                </div>
                            </div>
                        </div>
                        <h4 className='text-sm'>Seconds</h4>
                    </div>
                </div>

            </div>}

            <div className='w-full flex items-end justify-between gap-2'>
                {pageType !== 'user_claim_winnings' && <div className='flex flex-col items-center gap-1 min-w-24'>
                    <div className='flex gap-2 items-center justify-center rounded-badge bg-black w-fit py-1 px-3'>
                        <Image width={15} height={15} src={solanaLogo.src} alt='solana logo' />
                        <h4>Price</h4>
                    </div>
                    <div className='bg-gradient-to-r from-primary to-secondary p-[1px] rounded-md w-full'>
                        <div className='rounded-md flex flex-col h-full w-full items-center justify-center bg-black'>
                            <h4 className='text-2xl font-bold gradient-text bg-gradient-to-r from-primary to-secondary'>{data.price / LAMPORTS_PER_SOL}</h4>
                            <span className='gradient-text bg-gradient-to-r from-primary to-secondary'>sol</span>
                        </div>
                    </div>
                </div>}
                {pageType === "user_lottery" ? 
                <Button 
                    variant="expandIcon" 
                    Icon={() => <ArrowRight className="h-4 w-4" />} 
                    iconPlacement="right"
                    className='hover:bg-tertiary w-full font-bold'
                    onClick={handleBuyTicket}
                    disabled={isBuying}
                >
                    {isBuying ?  <span className="loading loading-spinner loading-sm"></span> : "Buy"}
                </Button> : 
                (pageType === "user_claim_winnings" && !isPrevoiusWinnings )?
                <Button 
                    variant="expandIcon" 
                    Icon={() => <ArrowRight className="h-4 w-4" />} 
                    iconPlacement="right"
                    className='hover:bg-tertiary w-full font-bold'
                    onClick={handleClaimWinnings}
                    disabled={isClaiming}
                >
                    {isClaiming ?  <span className="loading loading-spinner loading-sm"></span>  : "Claim Winnings"}
                </Button> :
                isPrevoiusWinnings ?
                <div className='flex gap-2 items-center justify-between w-full'>
                    <h3 className='gradient-text text-lg text-center bg-gradient-to-r from-[#FBFBFB] to-[#696969]'>Signature</h3>
                    <Badge className="border-black ring-primary py-1 px-4">
                        <a 
                            href={`https://explorer.solana.com/tx/${data.priceClaimedSignature}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`View wallet ${data.priceClaimedSignature} on Solana Explorer`}
                            className="flex items-center gap-1"
                        >
                            {data.priceClaimedSignature?.slice(0, 6)}...{data.priceClaimedSignature?.slice(-4)}
                            <ArrowUpRight size={20} color="#0AEFB2" />
                        </a>
                    </Badge>
                </div> :
                <Link href={`/authority/lottery-details/regular/${data?.id}`} className='w-full'>
                    <Button 
                        variant="expandIcon" 
                        Icon={() => <ArrowRight className="h-4 w-4" />} 
                        iconPlacement="right"
                        className='hover:bg-tertiary w-full font-bold'
                    >
                        View
                    </Button>
                </Link>}
            </div>
        </div>
    )
}


export const ShimmerCard = () => {
    return (
      <div className="relative w-full h-[450px] rounded-lg bg-transparent overflow-hidden animate-pulse">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-primary via-secondary to-teriary-200">
          <div className="h-full w-full bg-[#0aefb242]"></div>
        </div>
      </div>
    );
};