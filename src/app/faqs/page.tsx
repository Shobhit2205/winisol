"use client";

import { FAQs } from "@/components/data/mock";
import FAQCard from "@/components/ui/common/Card/FAQCard";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function FaqPage() {
    useEffect(() => {
        document.title = "FAQs - WiniSol";  
    }, []); 
  return (
    <>
      <Head>
        <title>Frequently Asked Questions - WiniSol</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about WiniSol's decentralized lottery system. Get insights into how WiniSol works, its features, and its benefits."
        />
        <meta property="og:title" content="Frequently Asked Questions - WiniSol" />
        <meta
          property="og:description"
          content="Find answers to common questions about WiniSol's decentralized lottery system, how it works, its features, and more."
        />
        <meta property="og:image" content="/winisol-thumbnail.jpg" />
        <meta name="robots" content="index, follow" />

        {/* Schema.org FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            }),
          }}
        />
      </Head>
      <div className="my-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto">
        <div className="flex flex-col items-center gap-4 mx-8">
          <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-center max-w-5xl">
            We understand that questions can arise at any time, and our team is
            always ready to assist you. Our FAQ section is designed to provide
            clear and helpful answers, but if you need further assistance, we
            are here to resolve your queries quickly and efficiently. With our
            commitment to fast response times and expert support, you can trust
            us to provide accurate solutions, ensuring a smooth and hassle-free
            experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 mx-8 xl:gap-12 xl:mx-16 items-center justify-center">
          {FAQs.map((faq) => (
            <FAQCard key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
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
