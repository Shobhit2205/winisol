'use client';

import { Button } from "../ui/button";
import HeroSlideLeft from "@/assets/hero-button-slide-left.png"
import HeroSlideRight from "@/assets/hero-button-slide-right.png"
import HeroAir from "@/assets/hero-air.png";
import Image from "next/image";
import Link from "next/link";
import { IconBrandDiscord, IconBrandInstagram, IconBrandLinkedin, IconBrandTelegram, IconBrandX } from "@tabler/icons-react";


export default function HeroSection() {

    return (
        <div className="mt-16 h-fit w-full flex justify-center relative">
            <Image width={100} height={100} src={HeroAir.src} alt="Hero image" className="w-12 h-12" />
            <div className="max-w-4xl h-fit flex flex-col gap-16 items-center">
            
                <div className="flex flex-col gap-4">

                    <h1 className="text-center text-white text-4xl lg:text-6xl leading-[100%] font-bold">The Future of 
                        <span className="gradient-text bg-gradient-to-r from-primary to-secondary"> Fair</span> & <br/><span className="gradient-text bg-gradient-to-r from-primary to-secondary">Transparent</span> Crypto Lotteries.
                    </h1>
                    <p className="text-center text-lg mx-4">Play with confidence! A blockchain-powered lottery with provably fair draws and instant payouts. Win big, withdraw fast—100% transparency, guaranteed!</p>
                </div>
                <div className="flex gap-4 md:gap-8 items-center hover:gap-2 transition-all transition-500">
                    <Image width={100} height={100} src={HeroAir.src} alt="solana" className="w-12 h-12 hidden lg:block" />

                    <Image width={100} height={100} src={HeroSlideLeft.src} alt="solana-arrows" className="w-52 hidden lg:block" />
                    <Link href="#active-lotteries" className="scroll-smooth">
                        <Button className="border-2 border-primary bg-custom_black rounded-full py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black" >Get Started</Button>
                    </Link>
                    <Image width={100} height={100} src={HeroSlideRight.src} alt="solana-arrows" className="w-52 hidden lg:block" />
                    <Image width={100} height={100} src={HeroAir.src} alt="solana" className="w-12 h-12 hidden lg:block" />
                </div>
                
            </div>
            <Image width={100} height={100} src={HeroAir.src} alt="solana" className="w-12 h-12 " />
            
           <div className="flex flex-col gap-4 bg-[#63636333] items-center justify-center py-6 px-2 rounded-badge h-fit absolute right-4 top-1/4 z-10">
           <a href="https://www.instagram.com/winisol_/" target="_blank" className="cursor-pointer transition-all hover:scale-125 hover:text-primary" >
            <IconBrandInstagram size={32}/>
           </a>
           <a href="https://discord.gg/FdvDbf8MPp" target="_blank" className="cursor-pointer transition-all hover:scale-125 hover:text-primary" >
            <IconBrandDiscord size={32}/>
           </a>
           <a href="https://x.com/winisol_" target="_blank" className="cursor-pointer transition-all hover:scale-125 hover:text-primary" >
            <IconBrandX  size={32} />
           </a>
           <a href="https://www.linkedin.com/company/winisol-org/" target="_blank" className="cursor-pointer transition-all hover:scale-125 hover:text-primary" >
            <IconBrandLinkedin  size={32} />
           </a>
           {/* <a href="https://t.me/+mymR169Bmc8xZGFl" target="_blank" className="cursor-pointer transition-all hover:scale-125 hover:text-primary" >
            <IconBrandTelegram  size={32} />
           </a> */}
           
           </div>
        </div>
    )
}

