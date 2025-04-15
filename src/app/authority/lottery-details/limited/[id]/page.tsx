'use client';

import AuthorityLotteryDetails from "@/components/authority/lottery-details/AuthorityLotteryDetails";
import { useAuth } from "@/contexts/AuthContext";
import { AUTHORITY_PUBLIC_KEY } from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Page() {
    const { token } = useAuth();
    const { publicKey, connected } = useWallet();
    const [checkingAuth, setCheckingAuth] = useState(true);
    const { limitedLotteries, isLimitedLotteriesLoading } = useSelector((state: RootState) => state.limitedLotteries);
    const params = useParams();

    const lotteryId = params?.id.toLocaleString();

    const limitedLottery = limitedLotteries.find((lottery: any) => lottery.id === parseInt(lotteryId));

    useEffect(() => {
    
        if (!connected || publicKey === undefined) {
            return;
        }
        if (publicKey?.toString() !== AUTHORITY_PUBLIC_KEY) {
            notFound();
        } else if(!token) {
            return;
        }
        else {
            setCheckingAuth(false);
        }
    }, [connected, publicKey, token]);


    if (checkingAuth) {
        return (
            <div className="text-center my-32 min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    return (
        <AuthorityLotteryDetails lottery={limitedLottery} isLotteryLoading
        ={isLimitedLotteriesLoading} lotteryType="limited" />
    );
}