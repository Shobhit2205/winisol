'use client';

import Image from "next/image";
import LotteryTable from "./LotteryTable";
import { Button } from "@/components/ui/button";
import { useWinisolProgramAccount } from "@/components/winisol/winisol-data-access";
import { LimitedLottery, Lottery } from "@/types";
import { setLimitedLoteryCompleted } from "@/services/limitedLotteryService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { setLoteryCompleted } from "@/services/lotteryService";

type lotteryType = "regular" | "limited";

interface AuthorityLotteryDetailsProps {
  lottery: Lottery | LimitedLottery | undefined;
  isLotteryLoading: boolean;
  lotteryType: lotteryType;
}

export default function AuthorityLotteryDetails({lottery, isLotteryLoading, lotteryType}: AuthorityLotteryDetailsProps) {

  const { initializeLottery, initializeLimitedLottery, createLimitedLotteryRandomness, createRandomness, commitLimitedLotteryRandmoness, commitRandmoness, revealLimitedLotteryWinner, revealWinner, authorityTransfer, authorityLimitedLotteryTransfer } = useWinisolProgramAccount();
  const { token } = useAuth();
  const { toast } = useToast();


  const handleInitializeLottery = async () => {
    try {
      if(!lottery?.id) return;
      if(lotteryType === "limited") {
        await initializeLimitedLottery.mutateAsync({ lottery_id: lottery?.id });
      }
      else {
        await initializeLottery.mutateAsync({lottery_id : lottery?.id});
      }
      
    } catch (error) {
      console.error("Error initializing lottery:", error);
    }
  };

  const handleCompleteLottery = async () => {
    try {
      if(!lottery?.id) return;
      if(!token) {
        toast({
          title: "Error",
          description: "Please login to your account",
          variant: "destructive",
        })
        return;
      };
      if(lotteryType === "limited") {
        await setLimitedLoteryCompleted(lottery?.id, token );
      }
      else {
        await setLoteryCompleted(lottery?.id, token);
      }

      toast({
        title: "Success",
        description: "Lottery completed successfully",
        variant: "default",
      })
      
    } catch (error) {
      console.error("Error initializing lottery:", error);
    }
  };

  if(isLotteryLoading) {
    return (
      <div className="text-center my-32">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-16 px-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto">
      <div className="rounded-md bg-gradient-to-r from-primary to-secondary p-[1px] w-48 h-48">
        <div className="rounded-md flex h-full w-full items-center justify-center bg-black">
          <Image
            width={100}
            height={100}
            src={lottery?.image ||"https://res.cloudinary.com/shobhit2205/image/upload/v1742150434/Group_n9sfdb.png"}
            alt="Solana lottery image"
            className="object-fit w-20"
          />
        </div>
      </div>

      <LotteryTable lottery={lottery}  lotteryType={lotteryType} />

      {lottery?.winnerChosen ?
       <Button
       className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black w-full"
       disabled={lottery?.authorityPriceClaimed}
       onClick={async () => {
         if(!lottery?.id) return;
         lotteryType === "limited" ? await authorityLimitedLotteryTransfer.mutateAsync({ lottery_id: lottery?.id }) : await authorityTransfer.mutateAsync({lottery_id: lottery?.id})
       }}
     >
       Claim Authority Share
     </Button> : 
       <div className="w-full flex flex-col gap-4">
          <Button
            className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black w-full"
            disabled={lottery?.initializeLotterySignature !== null}
            onClick={handleInitializeLottery}
          >
            Initialize Lottery
          </Button>
          <div className="flex gap-4">
            <Button
              className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black w-full"
              disabled={lottery?.createRandomnessSignature !== null}
              onClick={async () => {
                if(!lottery?.id) return;
                lotteryType === "limited" ? await createLimitedLotteryRandomness.mutateAsync({ lottery_id: lottery?.id }) : await createRandomness.mutateAsync({lottery_id : lottery?.id});
              }}
            >
              Create Randomness
            </Button>
            <Button
              className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black w-full"
              disabled={lottery?.commitRandomnessSignature !== null}
              onClick={async () => {
                if(!lottery?.id) return;
                lotteryType === "limited" ? await commitLimitedLotteryRandmoness.mutateAsync({ lottery_id: lottery?.id }) : await commitRandmoness.mutateAsync({lottery_id : lottery?.id});
              }}
            >
              Commit Randomness
            </Button>
            <Button
              className="border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black w-full"
              disabled={lottery?.revealWinnerSignature !== null}
              onClick={async () => {
                if(!lottery?.id) return;
                lotteryType === "limited" ? await revealLimitedLotteryWinner.mutateAsync({ lottery_id: lottery?.id }) : await revealWinner.mutateAsync({lottery_id : lottery?.id});
              }}
            >
              Reveal Winner
            </Button>
          </div>
      </div>}

      {lottery?.priceClaimed && lottery?.authorityPriceClaimed && (
        <Button  className="border-2 border-red-500 bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-red-500 hover:bg-red-500 hover:text-white w-full"
        onClick={handleCompleteLottery}
        disabled={lottery.status === "completed"}
        >
          Set Lottery Completed
        </Button>
      )}
    </div>
  );
}
