"use client";

import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        document.title = "Privacy Policy - WiniSol";  
    }, []); 
  return (
    <>
      <Head>
        <title>Privacy Policy | WiniSol - Decentralized Solana Lottery</title>
        <meta
          name="description"
          content="Read WiniSol's Privacy Policy to learn how we protect your data while providing a decentralized, transparent lottery experience on the Solana blockchain."
        />
        <meta name="keywords" content="Solana lottery, decentralized privacy, crypto gaming security, blockchain privacy policy" />
        <meta property="og:title" content="Privacy Policy | WiniSol - Solana Lottery" />
        <meta property="og:description" content="Understand how WiniSol ensures privacy and security while providing a transparent decentralized lottery on Solana." />
        <meta property="og:image" content="https://winisol.com/logo.png" />
        <meta property="og:url" content="https://winisol.com/privacy-policy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | WiniSol" />
        <meta name="twitter:description" content="WiniSol prioritizes user privacy by not collecting personal data. Read our Privacy Policy to learn more." />
        <meta name="twitter:image" content="https://winisol.com/logo.png" />
        <link rel="canonical" href="https://winisol.com/privacy-policy" />
      </Head>

      {/* JSON-LD Schema Markup for SEO */}
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - WiniSol",
            "url": "https://winisol.com/privacy-policy",
            "description": "WiniSol ensures privacy and security by not collecting personal data. Learn more about our decentralized Solana lottery platform.",
            "publisher": {
              "@type": "Organization",
              "name": "WiniSol",
              "url": "https://winisol.com",
              "logo": "https://winisol.com/logo.png"
            },
          }),
        }}
      />
      <div className="my-8 xl:my-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto">
        <div className="flex flex-col items-center gap-4 mx-8">
          <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary">
            Privacy Policy
          </h1>
          <p className="text-center max-w-5xl">
            Welcome to Winisol! Your privacy is important to us, and we are
            committed to maintaining transparency about how we handle your data.
            This Privacy Policy explains what information we do and do not
            collect, how we ensure your privacy, and our approach to security
            when you use our services.
          </p>
        </div>
        <div className="mx-8 xl:mx-16 flex flex-col gap-8">
          <h2 className="text-lg">Effective Date: 22 March 2025</h2>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              1. Information We Do Not Collect
            </h2>
            <p className="px-8">
              At <span className="text-primary font-semibold">Winisol</span>, we
              respect your privacy and do not collect any personally
              identifiable information (PII) such as:
            </p>
            <ul className="px-16 list-disc">
              <li>Email addresses</li>
              <li>Names or usernames</li>
              <li>Phone numbers</li>
              <li>Home addresses</li>
              <li>
                Your financial information like Payment details, including
                credit or debit card information
              </li>
            </ul>
            <p className="px-8">
              We believe in complete user anonymity, and our platform does not
              require any form of registration or login. You can use our
              services without providing any personal information.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              2. Wallet & Transaction Information
            </h2>
            <p className="px-8">
              Since <span className="text-primary font-semibold">Winisol</span>{" "}
              is a Solana-based platform, interactions on the blockchain are
              inherently public. When you connect your Solana wallet to use our
              services, we do not have access to or store your private keys,
              seed phrases, or any sensitive wallet data. However, your
              transactions on the Solana blockchain are publicly visible, as
              they are recorded on a decentralized ledger.{" "}
              <span className="text-primary font-semibold">Winisol</span> does
              not track, analyze, or store your transaction history beyond what
              is publicly available on the blockchain.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              3. Cookies & Tracking Technologies
            </h2>
            <p className="px-8">
              We do not use cookies, tracking pixels, or any third-party
              analytics tools to monitor your activity. Our goal is to provide a
              privacy-first experience, ensuring that you can use our platform
              without concern for data tracking or surveillance.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              4. Third-Party Services
            </h2>
            <p className="px-8">
              While using{" "}
              <span className="text-primary font-semibold">Winisol</span>, you
              may interact with third-party services such as wallet providers
              (e.g., Phantom, Solflare) or blockchain explorers. These services
              have their own privacy policies, and we encourage you to review
              them separately, as we do not control how they handle your data.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              5. Security & Data Protection
            </h2>
            <p className="px-8">
              Our platform is designed with security in mind. Since we do not
              collect or store any personal data, there is no risk of your
              sensitive information being compromised. However, we advise users
              to follow best security practices when interacting with the Solana
              blockchain, such as:
            </p>
            <ul className="px-16 list-disc">
              <li>
                Never sharing your private keys or seed phrases with anyone
              </li>
              <li>Using trusted and secure wallet providers</li>
              <li>
                Double-checking transaction details before approving any
                interaction
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              6. Policy Updates
            </h2>
            <p className="px-8">
              We may update this Privacy Policy from time to time to reflect
              changes in our platform or to comply with legal requirements. Any
              updates will be reflected on this page, and we encourage users to
              review this policy periodically.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              7. Contact Us
            </h2>
            <p className="px-8">
              If you have any questions about our Privacy Policy or need further
              clarification, feel free to reach out to us through our official
              communication channels.
            </p>
          </div>
          <p className="text-primary text-center">
            Your privacy is our priority, and we are committed to keeping
            Winisol a secure and transparent platform for all users.
          </p>
        </div>
      </div>
    </>
  );
}
