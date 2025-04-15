"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import WorkingStep1 from "@/assets/working-steps/working-step-1.png";
import WorkingStep2 from "@/assets/working-steps/working-step-2.png";
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
          Understanding how our lottery works is key to making the most of your experience. Our comprehensive guide walks you through every step, from buying a ticket to claiming your prize—all in a simple, transparent, and fair manner. Whether you’re a first-time player or a seasoned participant, this guide ensures you have all the information needed to play with confidence. Explore the steps, learn the rules, and get ready to win! 
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
              Select your preferred lottery pool and purchase a ticket. Upon
              purchase, you’ll receive an NFT ticket in your wallet as proof of
              entry.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-3">
              <Image
                src={WorkingStep2.src}
                alt="Buy a lottery ticket using your Solana wallet"
                width={400}
                height={200}
                className=" border border-white"
              />
              <ul className="px-5 md:px-10 list-disc space-y-3">
                <li>
                  Each pool has a fixed{" "}
                  <span className="text-primary font-semibold">
                    Ticket Price,
                  </span>{" "}
                  which is the cost of the NFT ticket.
                </li>
                <li>
                  When you buy a ticket, the{" "}
                  <span className="text-primary font-semibold">Prize Pool</span>{" "}
                  increases by the ticket price.
                </li>
                <li>
                  Every pool has a{" "}
                  <span className="text-primary font-semibold">Time Limit</span>
                  , after which the pool closes and a winner is selected.
                </li>
                <li>
                  After buying ticket your{" "}
                  <span className="text-primary font-semibold">Wallet</span>,
                  have the respective NFT ticket in it.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              3. Wait for the Draw
            </h2>
            <p>
            Once the lottery timer ends, a random winner is selected using the <span className="text-primary font-semibold">Switchboard Algorithm</span> for on demand randomness, ensuring a fair and transparent draw.
            </p>
            <p>
            Everything is decentralized—no human interference, just pure randomness! Nobody including authority can predict the winner of the lottery.
            </p>
            
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              4. Check If You Won
            </h2>
            <p>
            After the draw, simply connect your wallet. If you&apos;re the lucky winner, a banner will appear on top, notifying you to <span className="text-primary font-semibold">Claim Prize.</span></p>
            <p>
            Everything is decentralized—no human interference, just pure randomness! Nobody including authority can predict the winner of the lottery.
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
            Click the <span className="text-primary font-semibold">Claim Prize</span> button, and your winnings will be instantly sent to your wallet.</p>
            <p>
            No extra steps—just claim and enjoy your rewards!
            </p>
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
            If luck isn&apos;t on your side and you don&apos;t win the lottery, you can still recover your NFT minting fees by <span className="text-primary font-semibold">burning</span> your ticket.</p>
            <p>
            Do not burn your ticket before the draw! If you do, you won’t be able to claim your winnings even if you win.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              7. How Rewards Are Distributed
            </h2>
            <p>
            Winner Gets <span className="text-primary font-semibold">90%</span> of the total prize pool.</p>
            <p>
            <span className="text-primary font-semibold">10%</span> Goes to the Authority to cover handling fees, maintain transparency, and ensure smooth operations.
            </p>
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
