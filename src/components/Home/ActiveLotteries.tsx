/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import LotteryCard, { ShimmerCard } from "../ui/common/Card/LotteryCard";
import lotterySide1 from "@/assets/lottery-side-1.png";
import lotterySide2 from "@/assets/lottery-side-2.png";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { PublicKey } from "@solana/web3.js";
import { useWinisolProgramAccount } from "../winisol/winisol-data-access";
import LimitedLotteryCard from "../ui/common/Card/LimitedLotteryCard";
import tag from "@/assets/tag.png";
import { RootState } from "@/redux/store";

export default function ActiveLotteries() {
  const { lotteries, isLotteriesLoading } = useSelector(
    (state: RootState) => state.lotteries
  );
  const { limitedLotteries, isLimitedLotteriesLoading } = useSelector(
    (state: RootState) => state.limitedLotteries
  );
  const { initializeLimitedLottery, buyLimitedLotteryTicket } =
    useWinisolProgramAccount({
      account: new PublicKey("FKKVUnKqXHtHZEivpK4saiDF8pwV9Q67RiFGwBLxNvEY"),
    });
  const currentTime = new Date().getTime() / 1000;

  const filteredLotteries = lotteries.filter((lottery: any) => {
    return lottery.endTime > currentTime && lottery.initializeLotterySignature;
  });

  return (
    <div
      id="active-lotteries"
      className="relative max-w-screen-2xl w-full mx-auto"
    >
      <Image
        width={64}
        height={100}
        src={lotterySide1.src}
        alt="solana lottery"
        className="absolute -top-20 left-0 "
      />
      <div
        className="border border-white mx-8 lg:mx-16 px-4 lg:px-8 rounded-box"
        style={{
          backgroundImage:
            "radial-gradient(circle, #00ffbb50 0%, rgba(10, 239, 178, 0) 70%)",
          backgroundSize: "cover",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="py-6 flex justify-between items-center"
          style={{
            borderBottom: "0.5px solid",
            borderImageSource:
              "radial-gradient(circle, #ffffff 0%, rgba(153, 153, 153, 0) 80%)",
            borderImageSlice: 1,
          }}
        >
          <h2 className="text-3xl text-primary font-medium">
            // Active Lotteries
          </h2>
          <Badge
            dot
            className="text-primary bg-[#1A1A1A] ring-[#484848] py-1 px-4"
          >
            Live
          </Badge>
        </div>

        {isLimitedLotteriesLoading && isLotteriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 my-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center w-full">
                <ShimmerCard />
              </div>
            ))}
          </div>
        ) : filteredLotteries.length === 0 && limitedLotteries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 w-full h-40 lg:m-8">
            <h3 className="text-2xl font-semibold">No Active Lotteries</h3>
            <p className="text-center max-w-5xl">
              There are no active lotteries at the moment. Please create and
              check later.
            </p>
          </div>
        ) : (
          <>
            {filteredLotteries.length > 0 && (
              <div className="mx-2 my-8 lg:m-8 flex flex-col gap-8">
                <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
                  <Image
                    src={tag.src}
                    alt="solana lottery"
                    width={100}
                    height={100}
                    className="w-8 h-8"
                  />
                  <h3 className="text-lg font-semibold">Timely Lotteries</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16  ">
                  {filteredLotteries?.map((data: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-center w-full"
                    >
                      <LotteryCard data={data} pageType="user_lottery" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {limitedLotteries.length > 0 && (
              <div className="mx-2 my-8 lg:m-8 flex flex-col gap-8">
                <div className="flex gap-2 items-center justify-start bg-gradient-to-r from-[#00815E] to-[#0E0E0E00] w-fit p-2 rounded-md">
                  <Image
                    src={tag.src}
                    alt="solana lottery"
                    width={100}
                    height={100}
                    className="w-8 h-8"
                  />
                  <h3 className="text-lg font-semibold">Limited Lotteries</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16  ">
                  {limitedLotteries?.map((data: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-center w-full"
                    >
                      <LimitedLotteryCard data={data} pageType="user_lottery" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Image
        width={64}
        height={100}
        src={lotterySide2.src}
        alt="solana lottery"
        className="absolute bottom-10 right-0"
      />
    </div>
  );
}
