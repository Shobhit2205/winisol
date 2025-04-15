'use client';

import ActiveLotteries from '@/components/Home/ActiveLotteries'
import Contact from '@/components/Home/Contact';
import FrequestlyAskedQuestions from '@/components/Home/FrequentlyAskedQuestions';
import HeroSection from '@/components/Home/HeroSection'
import RecentWinners from '@/components/Home/RecentWinners';
import Transparency from '@/components/Home/Transparency';
import Working from '@/components/Home/Working';
import Head from 'next/head';

export default function Page() {
  
  return (
    <>
      <Head>
        <meta name="keywords" content="Solana Lottery, Crypto Lottery, Decentralized Lottery, Blockchain Lottery, WiniSol, Play and Win, Web3 Lottery, NFT Lottery, Smart Contract Lottery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WiniSol",
              "url": "https://winisol.com",
              "logo": "https://winisol.com/logo.png",
              "description": "WiniSol is a decentralized lottery platform built on Solana. Play, win, and experience true decentralization.",
              "sameAs": [
                "https://twitter.com/winisol_",
                "https://t.me/winisol"
              ]
            }),
          }}
        />
      </Head>
      <div className='flex flex-col gap-24 mb-16'>
        <HeroSection/>
        <RecentWinners/>
        <ActiveLotteries/>
        <Working/>
        <Transparency/>
        <FrequestlyAskedQuestions/>
        <Contact/>
      </div>
    </>
  )
}
