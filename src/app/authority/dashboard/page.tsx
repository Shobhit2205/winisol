'use client';

import ClosedLotteries from "@/components/authority/dashboard/ClosedLotteries";
import CreateLimitedLottery from "@/components/authority/dashboard/CreateLimitedLottery";
import CreateLottery from "@/components/authority/dashboard/CreateLottery";
import OpenLotteries from "@/components/authority/dashboard/OpenLotteries";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { useAuth } from "@/contexts/AuthContext";
import { AUTHORITY_PUBLIC_KEY } from "@/lib/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

const Tabs: Tab[] = [
  {
    id: "tab1",
    label: "Open lotteries",
    content: (
      <OpenLotteries/>
    ),
  },
  {
    id: "tab2",
    label: "Closed Lotteries",
    content: (
      <ClosedLotteries/>
    ),
  },
  {
    id: "tab3",
    label: "Create Lottery",
    content: (
      <CreateLottery/>
    ),
  },
  {
    id: "tab4",
    label: "Create Limited Lottery",
    content: (
      <CreateLimitedLottery/>
    ),
  },
];

export default function Dashboard () {
  const { token } = useAuth();
  // const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    <div className="mx-16 my-8">
        <AnimatedTabs tabs={Tabs} className="max-w-full"/>
    </div>
  )
}