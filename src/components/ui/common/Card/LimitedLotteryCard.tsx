'use client';

import { ArrowRight, TicketCheck } from 'lucide-react';
import Image from 'next/image';
import solanaLogo from '@/assets/solana-logo.png';
import { Button } from '../../animated-button';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { ChooseTicketDialog } from './ChooseTicketDialog';

type pageType = "authority_open_lottery" | "authority_closed_lottery" | "user_lottery" | "user_claim_winnings"
interface LimitedLotteryCardProps {
    data: {
        id: number;
        lotteryName: string,
        lotterySymbol: string,
        image: string,
        totalPotAmount: number,
        totalTickets: number,
        ticketBought: string[],
        numberOfTicketSold: number
        price: number,
        winnerTicketId: string,
    },
    pageType: pageType,
}

export default function LimitedLotteryCard({data, pageType}: LimitedLotteryCardProps) {

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
                        <Image width={100} height={100} src={data.image || "https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png"} alt='solana lottery image' className='object-cover w-10' />
                    </div>
                </div>
                <div className='rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] w-full h-[105px] self-end'>
                    <div className='border bg-black w-full h-[103px] relative rounded-md flex flex-col items-center justify-center'>
                        <div className='rounded-badge py-1 px-2 xl:px-4 bg-gradient-to-r from-primary to-secondary w-fit absolute -top-[20px] xl:-top-[18px]'>
                            <h3 className='text-center text-black font-medium'>Prize Amount</h3>
                        </div>
                        <div className='mt-2'>
                            <h3 className='text-4xl text-primary'>{data.totalPotAmount / LAMPORTS_PER_SOL}</h3>
                            <div className='flex gap-2 items-center'>
                                <Image width={12} height={12} src={solanaLogo.src} alt='solana logo' />
                                <h4 className='text-base'>sol</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='flex items-center justify-between gap-2'>
                <div className='flex gap-2 items-center'>
                    <h4 className='text-lg gradient-text bg-gradient-to-r from-primary to-secondary'>Tickets Sold</h4>
                </div>
                <div className='flex gap-2 items-center'>
                    <span className='text-lg gradient-text bg-gradient-to-r from-primary to-secondary'>{data.numberOfTicketSold} / {data.totalTickets}</span>
                    <span className='text-sm text-[#C8C8C8]'>Tickets</span>
                </div>
            </div>

            {(pageType === "user_claim_winnings" || pageType === "authority_closed_lottery") && 
            <div>
                <h3 className='gradient-text text-lg text-center bg-gradient-to-r from-[#FBFBFB] to-[#696969]'>Winner Ticket</h3>
                <h4 className='gradient-text text-2xl text-center bg-gradient-to-r from-primary to-secondary'>{data.winnerTicketId}</h4>
            </div>}

            <div className='w-full flex items-end justify-between gap-2'>
                <div className='flex flex-col items-center gap-1 min-w-24'>
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
                </div>
                {pageType === "user_lottery" && <ChooseTicketDialog lotteryName={data.lotteryName} lotteryId={data.id} price={data.price} totalTickets={data.totalTickets} ticketBought={data.ticketBought} />}

                {
                (pageType === "authority_open_lottery" || pageType === "authority_closed_lottery") && 
                (<Link href={`/authority/lottery-details/limited/${data?.id}`} className='w-full'>
                <Button 
                    variant="expandIcon" 
                    Icon={() => <ArrowRight className="h-4 w-4" />} 
                    iconPlacement="right"
                    className='hover:bg-tertiary w-full font-bold'
                >
                    View
                </Button>
            </Link>)}
            </div>
        </div>
    )
}
