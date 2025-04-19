"use client";

import { ArrowUpRight, EyeClosed } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import solanaLogo from "@/assets/solana-logo.png";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { formatDistanceToNowStrict } from "date-fns";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SOLANA_ENVIRONMENT } from "@/lib/constants";
import { RootState } from "@/redux/store";
import { Winner } from "@/types";

export default function RecentWinners() {
  const { winners, isWinnersLoading } = useSelector((state: RootState) => state.recentWinners);

  return (
    <div className="flex flex-col gap-8 items-center justify-center mx-8 lg:mx-16">
      <div className="max-w-screen-lg flex flex-col gap-2">
        <h2 className="gradient-text bg-gradient-to-b from-[#F8F8F8] to-primary text-3xl text-center">
          Recent Winners – Proof of Fair Play
        </h2>
        <p className="font-light text-center">
          Transparency is at the heart of our lottery system. Here’s a look at
          the latest winners who secured their Solana payouts instantly! Every
          draw is provably fair, and every transaction is publicly verifiable on
          the blockchain.
        </p>
      </div>
      <div className="border border-white w-full max-w-screen-lg rounded-box relative overflow-hidden">
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
          <TableCaption>
            <Link
              href="/winners"
              className="text-primary flex items-center justify-center gap-2 mb-2"
            >
              <EyeClosed />
              View All Winners
            </Link>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Lottery Id</TableHead>
              <TableHead>Lottery Name</TableHead>
              <TableHead>Winning Amount</TableHead>
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
              winners.slice(0, 5).map((winner: Winner) => (
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
                    {(Number(winner?.winningAmount) / LAMPORTS_PER_SOL)} SOL
                  </TableCell>
                  <TableCell className="text-end">
                    {formatDistanceToNowStrict(
                      winner?.winnerDeclaredTime ?? new Date(),
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
