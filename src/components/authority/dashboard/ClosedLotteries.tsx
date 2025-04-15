'use client';

import LotteryCard from "@/components/ui/common/Card/LotteryCard";
import { useSelector } from "react-redux";

export default function ClosedLotteries() {
    const { lotteries, isLotteriesLoading } = useSelector((state: any) => state.lotteries);

    const currentTime = new Date().getTime();

    const filteredLotteries = lotteries.filter((lottery: any) => {
        return lottery.endTime < currentTime && lottery.winnerChosen;
    });
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 mx-2 my-8 lg:m-8">
            {filteredLotteries.map((data: any, i: number) => (
                data.winnerChosen && <div key={i} className="flex items-center justify-center w-full">
                    <LotteryCard data={data} pageType="authority_closed_lottery" />
                </div>
            ))}
        </div>
    )
}