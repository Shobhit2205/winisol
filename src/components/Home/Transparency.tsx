'use client';
import Image from "next/image";
import blockchain from "@/assets/blockchain.svg";
import draws from "@/assets/transparency-draws-1.png";
import payout from "@/assets/transparency-cash-2.png";
import eye from "@/assets/transparency-eye-3.png";

export default function Transparency() {
    return (
        <div className="mx-8 lg:mx-16 flex flex-col gap-8 max-w-screen-2xl w-auto xl:mx-auto">
            <div className="flex flex-col gap-3 items-center justify-center">
                <h4 className="text-3xl md:text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-white to-primary text-center">Security & Transparency</h4>
                <p className="font-light">Why You Can Trust Us?</p>
            </div>
            <div className="flex items-center justify-center lg:justify-between gap-16 w-full">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image width={30} height={30} src={draws.src} alt="fairs lottery draws" />
                            <h2 className="text-lg">Provably Fair Draws</h2>
                        </div>
                        <p className="font-light">Results are generated using secure <span className="text-primary">blockchain algorithms</span> with no human interference.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image width={30} height={30} src={payout.src} alt="fairs lottery draws" />
                            <h2 className="text-lg">Instant Payouts</h2>
                        </div>
                        <p className="font-light">You can claim the prize just after completion of lottery - <span className="text-primary">no waiting</span>, no delays.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Image width={30} height={30} src={eye.src} alt="fairs lottery draws" />
                            <span className="text-lg">Publicly Verifiable Transactions</span>
                        </div>
                        <p className="font-light">Every lottery entry and payout is visible on the <span className="text-primary">Solana Explorer</span> for full transparency.</p>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <Image width={100} height={100} src={blockchain.src} alt="solana lottery image" className="w-[400px] h-[400px]" />
                </div>
            </div>
        </div>
    );
}