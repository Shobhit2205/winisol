'use client';

import LotteryCard, { ShimmerCard } from "@/components/ui/common/Card/LotteryCard";
import Image from "next/image";
import tag from "@/assets/tag.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Page() {
  const { currentWinnings, previousWinnings, isLoading } = useSelector((state: RootState) => state.winnings);
  return (
    <div className="my-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto min-h-[80vh]">
      <div className="flex flex-col items-center gap-4 mx-8">
        <h1 className="text-4xl lg:text-5xl text-center gradient-text bg-gradient-to-b from-primary to-secondary">
          Claim Your Winnings
        </h1>
        <p className="text-center max-w-5xl">
          We believe in fairness, transparency, and ensuring that every winner gets 
          what they deserve—quickly and securely. Our streamlined process guarantees 
          a hassle-free claim experience, so you can enjoy your winnings with 
          confidence. Whether big or small, every prize is handled with the utmost 
          care and integrity. Your trust is our commitment, and we are here to ensure 
          you receive your rewards smoothly, with no delays or complications.
        </p>
      </div>
      <div className="mx-8 lg:mx-24 lg:my-8 flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
            <Image src={tag.src} alt="solana lottery" width={100} height={100} className="w-8 h-8"/>
            <h3 className="text-lg font-semibold">Current winnings</h3>
          </div>
         
            {/* Show shimmer effect if loading */}
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </div>
            ) : (
              currentWinnings.length === 0 ? 
              <div className="flex flex-col items-center justify-center gap-4 w-full h-40 lg:m-8">
                <h3 className="text-2xl font-semibold">No Current Winnings</h3>
                <p className="text-center max-w-5xl text-sm text-gray-500">
                    Luck doesn’t always shine, but every try is a step closer. Keep going!
                </p>
              </div>
              : 
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16">
              {currentWinnings.map((data: any, i: number) => (
                <div key={i} className="flex items-center justify-center w-full">
                  <LotteryCard data={data} pageType="user_claim_winnings" />
                </div>
              ))}
              </div>
            )}
        </div>

        {previousWinnings.length > 0 && <hr/>}

        {previousWinnings.length > 0 && <div className="flex flex-col gap-8">
          <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
            <Image src={tag.src} alt="solana lottery" width={100} height={100} className="w-8 h-8"/>
            <h3 className="text-lg font-semibold">Previous winnings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16">
            {/* Show shimmer effect if loading */}
            {isLoading ? (
              <>
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
              </>
            ) : (
              previousWinnings.map((data: any, i: number) => (
                <div key={i} className="flex items-center justify-center w-full">
                  <LotteryCard data={data} pageType="user_claim_winnings" isPrevoiusWinnings={true} />
                </div>
              ))
            )}
          </div>
        </div>}
      </div>
    </div>
  );
}