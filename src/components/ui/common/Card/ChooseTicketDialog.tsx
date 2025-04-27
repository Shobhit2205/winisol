import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../../animated-button";
import { ArrowRight, Ban } from "lucide-react";
import Image from "next/image";
import solanaLogo from "@/assets/solana-logo.png";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWinisolProgramAccount } from "@/components/winisol/winisol-data-access";
import { useDispatch } from "react-redux";
import { updateLimitedLottery } from '@/redux/slices/limitedLotterySlice'

interface ChooseTicketDialogProps {
    lotteryName: string,
    lotteryId: number,
    price: number,
    totalTickets: number,
    ticketBought: string[],
}

export function ChooseTicketDialog({lotteryName, lotteryId, price, totalTickets, ticketBought}: ChooseTicketDialogProps) {
  const { buyLimitedLotteryTicket } = useWinisolProgramAccount()
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const isTicketBought = (ticket: number) => {
    const ticketIdentifier = `${lotteryName} #${lotteryId}-${ticket}`;
    return ticketBought.includes(ticketIdentifier);
  };
  const [isBuying, setIsBuying] = useState(false);
  const dispatch = useDispatch();

    const handleBuyTicket = async () => {
        try {
            if(selectedTicket === null) return;
            setIsBuying(true);
            await buyLimitedLotteryTicket.mutateAsync({lottery_id: lotteryId, ticket_number: selectedTicket})

            const ticketIdentifier = `${lotteryName} #${lotteryId}-${selectedTicket}`;

            dispatch(updateLimitedLottery({
                lotteryId,
                ticketIdentifier,
            }));
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsBuying(false);
        }
    }

  return (
    <Dialog onOpenChange={() => setSelectedTicket(null)}>
      <DialogTrigger asChild>
        <Button
          variant="expandIcon"
          Icon={() => <ArrowRight className="h-4 w-4" />}
          iconPlacement="right"
          className="hover:bg-tertiary w-full font-bold"
        >
          Choose Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lotteryName} #{lotteryId}</DialogTitle>
          <DialogDescription>
            Choose the ticket you want to buy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
          {Array.from({ length: totalTickets }, (_, i) => i + 1).map((ticket) => {
            const isBought = isTicketBought(ticket);
            const isSelected = selectedTicket === ticket;

            return (
              <button
                key={ticket}
                type="button"
                disabled={isBought}
                className={`relative border rounded p-2 text-sm font-medium transition-colors
                  ${isBought
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-tertiary text-white"
                    : "bg-white text-black hover:bg-tertiary hover:text-white"
                  }
                `}
                onClick={() => !isBought && setSelectedTicket(ticket)}
              >
                {ticket}
                {isBought && (
                  <Ban className="absolute top-1 right-1 h-3 w-3 text-red-500" />
                )}
              </button>
            );
          })}
        </div>
        <DialogFooter className="flex sm:justify-between gap-2 items-center mt-4 w-full">
          <div className="flex items-center gap-2 border border-primary px-4 rounded-badge">
            <Image
              width={12}
              height={12}
              src={solanaLogo.src}
              alt="solana logo"
            />
            <span>{price / LAMPORTS_PER_SOL} sol</span>
          </div>
          <Button
            type="submit"
            disabled={selectedTicket === null || isBuying}
            className="border-2 w-fit border-primary bg-custom_black rounded-xl py-4 px-6 font-medium text-primary hover:bg-primary hover:text-black"
            onClick={handleBuyTicket}
          >
             {isBuying ?  <span className="loading loading-spinner loading-sm"></span> : 
             `Buy Ticket ${selectedTicket !== null ? `#${selectedTicket}` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
