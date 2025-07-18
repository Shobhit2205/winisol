'use client';

import LotteryCard from "@/components/ui/common/Card/LotteryCard";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";
import tag from "@/assets/tag.png";
import LimitedLotteryCard from "@/components/ui/common/Card/LimitedLotteryCard";
import { LimitedLottery } from "@/types";

export default function ClosedLotteries() {
    const { lotteries, isLotteriesLoading } = useSelector((state: RootState) => state.lotteries);
    const { limitedLotteries } = useSelector((state: RootState) => state.limitedLotteries);

    const currentTime = new Date().getTime();

    const filteredLotteries = lotteries.filter((lottery: any) => {
        return lottery.endTime < currentTime && lottery.winnerChosen;
    });

    const filterLimitedLotteries = limitedLotteries.filter((lottery: LimitedLottery) => {
        return lottery.winnerChosen;
    });
    return (
       <div className="flex flex-col w-full">
             <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
               <Image src={tag.src} alt="solana lottery" width={100} height={100} className="w-8 h-8" />
               <h3 className="text-lg font-semibold">Timely Lotteries</h3>
             </div>
       
             {filteredLotteries.length === 0 ? (
               <div className="flex flex-col items-center justify-center gap-4 w-full h-40 lg:m-8">
                 <h3 className="text-2xl font-semibold">No Active Timely Lotteries</h3>
                 <p className="text-center max-w-5xl">There are no active Timely lotteries at the moment. Please create and check later.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 my-8 ">
                 {filteredLotteries.map((data: any, i: number) => (
                     <div key={i} className="flex items-center justify-center w-full">
                       <LotteryCard data={data} pageType="authority_closed_lottery" />
                     </div>
                 ))}
               </div>
             )}
       
       <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
               <Image src={tag.src} alt="solana lottery" width={100} height={100} className="w-8 h-8" />
               <h3 className="text-lg font-semibold">Limited Lotteries</h3>
             </div>
       
             {filterLimitedLotteries.length === 0 ? (
               <div className="flex flex-col items-center justify-center gap-4 w-full h-40 lg:m-8">
                 <h3 className="text-2xl font-semibold">No Active Limited Lotteries</h3>
                 <p className="text-center max-w-5xl">There are no active limited lotteries at the moment. Please create and check later.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 my-8">
                 {filterLimitedLotteries.map((data: any, i: number) => (
                     <div key={i} className="flex items-center justify-center w-full">
                       <LimitedLotteryCard data={data} pageType="authority_closed_lottery"  />
                     </div>
                 ))}
               </div>
             )}
           </div>
    )
}