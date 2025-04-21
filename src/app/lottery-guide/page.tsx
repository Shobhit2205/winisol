"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import WorkingStep1 from "@/assets/working-steps/working-step-1.png";
import WorkingStep4 from "@/assets/working-steps/working-step-4.png";
import WorkingStep5 from "@/assets/working-steps/working-step-5.png";

export default function FaqPage() {
  useEffect(() => {
    document.title = "Lottery Guide - WiniSol";
  }, []);
  return (
    <>
      <div className="my-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto">
        <div className="flex flex-col items-center gap-4 mx-8">
          <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary text-center">
            Lottery Guide
          </h1>
          <p className="text-center max-w-5xl">
            Understanding how our lottery works is key to making the most of
            your experience. Our comprehensive guide walks you through every
            step, from buying a ticket to claiming your prize—all in a simple,
            transparent, and fair manner. Whether you’re a first-time player or
            a seasoned participant, this guide ensures you have all the
            information needed to play with confidence. Explore the steps, learn
            the rules, and get ready to win!
          </p>
        </div>

        <div className="mx-8 xl:mx-16 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              1. Connect Your Wallet
            </h2>
            <p>
              To get started, connect your Solana wallet to the platform. This
              ensures you can securely participate in the lottery and claim your
              winnings.
            </p>
            <p>
              We support all major Solana wallets like Phantom, Solflare, and
              Backpack. After connecting the wallet you can see your connected
              publick key like this below
            </p>
            <Image
              src={WorkingStep1.src}
              alt="Connect your phantom wallet"
              width={1000}
              height={400}
              className="p-1 border border-white m-auto"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              2. Buy a Ticket
            </h2>
            <p>
              We offer two types of lottery pools:{" "}
              <span className="text-primary font-semibold">
                Timely Lotteries
              </span>{" "}
              and{" "}
              <span className="text-primary font-semibold">
                Limited Ticket Lotteries
              </span>
              .
            </p>
            <p>
              In a{" "}
              <span className="text-primary font-semibold">Timely Lottery</span>
              , the pool runs for a fixed duration. Once the timer ends, a
              winner is selected randomly. The winner receives{" "}
              <span className="text-primary font-semibold">
                90% of the prize pool
              </span>
              , while the remaining 10% goes to the platform to maintain
              operations and ensure fairness.
            </p>
            <p>
              In a{" "}
              <span className="text-primary font-semibold">
                Limited Ticket Lottery
              </span>
              , the pool closes once a set number of tickets are sold. In this
              case, the winner receives{" "}
              <span className="text-primary font-semibold">
                100% of the prize pool
              </span>
              , making it a high-reward option for quick entries.
            </p>
            <p>
              Both types of lotteries are designed to be completely transparent,
              with random winner selection and secure ticket handling via NFTs
              on the Solana blockchain.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              3. Wait for the Draw
            </h2>
            <p>
              Once the lottery timer ends, a random winner is selected using the{" "}
              <span className="text-primary font-semibold">
                Switchboard Algorithm
              </span>{" "}
              for on demand randomness, ensuring a fair and transparent draw.
            </p>
            <p>
              Everything is decentralized—no human interference, just pure
              randomness! Nobody including authority can predict the winner of
              the lottery.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              4. Check If You Won
            </h2>
            <p>
              After the draw, simply connect your wallet. If you&apos;re the
              lucky winner, a banner will appear on top, notifying you to{" "}
              <span className="text-primary font-semibold">Claim Prize.</span>
            </p>
            <p>
              Everything is decentralized—no human interference, just pure
              randomness! Nobody including authority can predict the winner of
              the lottery.
            </p>
            <Image
              src={WorkingStep4.src}
              alt="claim your prize"
              width={1000}
              height={400}
              className="p-1 border border-white m-auto"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              5. Claim Your Prize
            </h2>
            <p>
              Click the{" "}
              <span className="text-primary font-semibold">Claim Prize</span>{" "}
              button, and your winnings will be instantly sent to your wallet.
            </p>
            <p>No extra steps—just claim and enjoy your rewards!</p>
            <Image
              src={WorkingStep5.src}
              alt="claim your prize"
              width={1000}
              height={400}
              className="p-1 border border-white m-auto"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              6. Get Your NFT Fees Back
            </h2>
            <p>
              If luck isn&apos;t on your side and you don&apos;t win the
              lottery, you can still recover your NFT minting fees by{" "}
              <span className="text-primary font-semibold">burning</span> your
              ticket.
            </p>
            <p>
              Do not burn your ticket before the draw! If you do, you won’t be
              able to claim your winnings even if you win.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              7. How Rewards Are Distributed
            </h2>
            <p>The reward distribution depends on the type of lottery pool:</p>
            <ul className="list-disc px-6 space-y-2">
              <li>
                In a{" "}
                <span className="text-primary font-semibold">
                  Timely Lottery
                </span>
                , the winner receives
                <span className="text-primary font-semibold">
                  {" "}
                  90% of the total prize pool
                </span>
                . The remaining{" "}
                <span className="text-primary font-semibold">10%</span> goes to
                the platform to cover operational costs and maintain a fair,
                secure system.
              </li>
              <li>
                In a{" "}
                <span className="text-primary font-semibold">
                  Limited Ticket Lottery
                </span>
                , the winner receives
                <span className="text-primary font-semibold">
                  {" "}
                  100% of the prize pool
                </span>
                , making it a high-stakes, winner-takes-all lottery.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span>Have any questions?</span>
          <Link
            href="/contact"
            className="relative text-primary after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:absolute after:left-0 after:bottom-[-4px] after:rounded-lg after:transition-all after:duration-500 hover:after:w-full hover:text-primary"
          >
            Contact us
          </Link>
        </div>
      </div>
    </>
  );
}
