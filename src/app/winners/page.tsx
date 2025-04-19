"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";
import solanaLogo from "@/assets/solana-logo.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { formatDistanceToNowStrict } from "date-fns";
import { SOLANA_ENVIRONMENT } from "@/lib/constants";
import { RootState } from "@/redux/store";
import { Winner } from "@/types";

export default function Page() {
  const { winners, isWinnersLoading } = useSelector((state: RootState) => state.recentWinners);

  return (
    <div className="my-8 xl:my-16 flex flex-col items-center  gap-16 max-w-screen-2xl mx-4 xl:mx-auto min-h-screen">
      <div className="flex flex-col items-center gap-4 mx-8">
        <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary leading-normal">
          Recent Winners
        </h1>
        <p className="text-center max-w-5xl">
          Transparency is at the heart of our lottery system. Here’s a look at
          the latest winners who secured their Solana payouts instantly! Every
          draw is provably fair, and every transaction is publicly verifiable on
          the blockchain.
        </p>
      </div>
      <div className="border border-white w-full max-w-screen-xl rounded-box relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-primary to-transparent blur-3xl"></div>
        <div className="flex gap-2 p-4 items-center">
          <h3 className="gradient-text bg-gradient-to-r from-primary to-secondary text-2xl">
            Recent Winners
          </h3>
          <Badge
            dot
            className="text-primary bg-[#1A1A1A] ring-[#484848] py-1 px-4"
          >
            Live
          </Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Lottery Id</TableHead>
              <TableHead>Lottery Name</TableHead>
              <TableHead>Winning Amount</TableHead>
              <TableHead>Winner Ticket</TableHead>
              <TableHead className="text-right">Time Won</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isWinnersLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </TableCell>
              </TableRow>
            ) : (
              winners.map((winner: Winner) => (
                <TableRow key={winner.id}>
                  <TableCell>
                    <Badge className="border-black ring-primary">
                      <a
                        href={`https://explorer.solana.com/address/${winner.winnerPublicKey}?cluster=${SOLANA_ENVIRONMENT}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View wallet ${winner.winnerPublicKey} on Solana Explorer`}
                        className="flex items-center gap-1"
                      >
                        {winner.winnerPublicKey.slice(0, 6)}...
                        {winner.winnerPublicKey.slice(-4)}
                        <ArrowUpRight size={20} color="#0AEFB2" />
                      </a>
                    </Badge>
                  </TableCell>
                  <TableCell>#{winner.id}</TableCell>
                  <TableCell>{winner.lotteryName}</TableCell>
                  <TableCell className="flex gap-1 items-center">
                    <Image
                      width={12}
                      height={12}
                      src={solanaLogo.src}
                      alt="solana logo"
                    />
                    {Number(winner.winningAmount) / LAMPORTS_PER_SOL} SOL
                  </TableCell>
                  <TableCell>{winner.winnerTicketId}</TableCell>
                  <TableCell className="text-end">
                    {formatDistanceToNowStrict(
                      winner.winnerDeclaredTime ?? new Date(),
                    )}{" "}
                    ago
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
