"use client";

import Head from "next/head";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    document.title = "Terms & Conditions - WiniSol";
  }, []);
  return (
    <>
      <Head>
        <title>
          WiniSol Terms & Conditions | Decentralized Lottery on Solana
        </title>
        <meta
          name="description"
          content="Review WiniSol's Terms & Conditions to understand the decentralized lottery rules, blockchain transactions, and user responsibilities on the Solana network."
        />
        <meta
          name="keywords"
          content="Winisol terms, decentralized lottery rules, Solana blockchain, crypto gambling, Web3 gaming"
        />
        <meta property="og:title" content="WiniSol Terms & Conditions" />
        <meta
          property="og:description"
          content="Learn about WiniSol's rules, eligibility, blockchain transactions, and security measures."
        />
        <meta
          property="og:url"
          content="https://winisol.com/terms-and-conditions"
        />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="WiniSol Terms & Conditions" />
        <meta
          property="twitter:description"
          content="Explore WiniSol's Terms & Conditions for using our decentralized lottery platform on Solana."
        />
      </Head>

      <div className="my-8 xl:my-16 flex flex-col gap-16 max-w-screen-2xl w-full xl:mx-auto">
        <div className="flex flex-col items-center gap-4 mx-8">
          <h1 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-primary to-secondary leading-normal">
            Terms & Conditions
          </h1>
          <p className="text-center max-w-5xl">
            Welcome to{" "}
            <span className="text-primary font-semibold">Winisol!</span> By
            accessing or using our platform, you agree to abide by these Terms
            and Conditions. Please read them carefully before using our
            services. If you do not agree with any part of these terms, kindly
            refrain from using our platform.
          </p>
        </div>
        <div className="mx-8 xl:mx-16 flex flex-col gap-8">
          <h2 className="text-lg">Effective Date: 22 March 2025</h2>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              1. Eligibility
            </h2>
            <ul className="px-8 list-disc">
              <li>
                You must be at least{" "}
                <span className="text-primary font-semibold">18 years</span> old
                to use{" "}
                <span className="text-primary font-semibold">Winisol</span>. By
                using our platform, you confirm that you meet this age
                requirement.
              </li>
              <li>
                It is your responsibility to ensure that using our services
                complies with the laws of your jurisdiction.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              2. Blockchain Transactions & Wallet Usage
            </h2>
            <ul className="px-8 list-disc">
              <li>
                <span className="text-primary font-semibold">Winisol</span>{" "}
                operates on the{" "}
                <span className="text-primary font-semibold">
                  Solana blockchain
                </span>{" "}
                and does not have control over blockchain transactions. Once a
                transaction is confirmed, it cannot be reversed.
              </li>
              <li>
                You are solely responsible for securing your wallet credentials,
                including private keys and seed phrases.{" "}
                <span className="text-primary font-semibold">Winisol</span> will
                never ask for this information and cannot recover lost wallets.
              </li>
              <li>
                By connecting your wallet, you acknowledge that transactions are
                public and recorded on the blockchain.{" "}
                <span className="text-primary font-semibold">Winisol</span> does
                not store or track your transaction history beyond what is
                publicly available.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              3. No Financial Advice or Guarantees
            </h2>
            <ul className="px-8 list-disc">
              <li>
                <span className="text-primary font-semibold">Winisol</span> does
                not provide financial, investment, or legal advice. Any
                interactions with our platform are at your own risk.
              </li>
              <li>
                We do not guarantee any winnings, profits, or financial returns
                from using our platform. You acknowledge that all transactions
                are final and that cryptocurrency values can be volatile.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              4. User Conduct
            </h2>
            <p className="px-8">
              By using{" "}
              <span className="text-primary font-semibold">Winisol</span>, you
              agree to:
            </p>
            <ul className="px-16 list-disc">
              <li>Use our platform only for lawful purposes.</li>
              <li>
                Not engage in fraudulent, illegal, or abusive activities,
                including hacking, money laundering, or exploiting
                vulnerabilities.
              </li>
              <li>
                Respect the decentralized nature of blockchain and the fair use
                of our platform.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              5. No Liability
            </h2>
            <ul className="px-8 list-disc">
              <li>
                <span className="text-primary font-semibold">Winisol</span> is
                provided on an &quot;as-is&quot; and &quot;as-available&quot;
                basis. We make no warranties regarding uninterrupted access,
                security, or error-free functionality.
              </li>
              <li>
                We are not responsible for any losses, damages, or liabilities
                arising from the use of our platform, including but not limited
                to:
                <ul className="list-disc px-8">
                  <li>Fluctuations in cryptocurrency value</li>
                  <li>Failed or delayed blockchain transactions</li>
                  <li>
                    Unauthorized access to your wallet due to negligence or
                    third-party interference
                  </li>
                </ul>
              </li>
              <li>
                You acknowledge that using blockchain-based platforms involves
                inherent risks, and you assume full responsibility for any
                consequences.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              6. Third-Party Services
            </h2>
            <ul className="list-disc px-8">
              <li>
                <span className="text-primary font-semibold">Winisol</span> may
                integrate with third-party wallet providers (e.g., Phantom,
                Solflare) or blockchain explorers. We do not control these
                services and are not responsible for their policies or actions.
              </li>
              <li>
                You should review their terms and conditions separately before
                using their services.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              7. Changes to These Terms
            </h2>
            <ul className="list-disc px-8">
              <li>
                We reserve the right to update or modify these Terms and
                Conditions at any time. Continued use of{" "}
                <span className="text-primary font-semibold">Winisol</span>{" "}
                after changes are posted constitutes acceptance of the revised
                terms.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              8. Termination
            </h2>
            <ul className="list-disc px-8">
              <li>
                We may suspend or terminate your access to{" "}
                <span className="text-primary font-semibold">Winisol</span> if
                you violate these terms or engage in any prohibited activities.
              </li>
              <li>
                We are not responsible for any loss resulting from account
                suspension or restriction due to non-compliance with these
                terms.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl gradient-text bg-gradient-to-b from-primary to-secondary">
              9. Contact Us
            </h2>
            <p className="px-8">
              If you have any questions regarding these Terms and Conditions,
              feel free to reach out to us through our official communication
              channels..
            </p>
            <p className="px-8">
              By using{" "}
              <span className="text-primary font-semibold">Winisol</span>, you
              acknowledge that you have read, understood, and agree to these
              Terms and Conditions. Use our platform responsibly and at your own
              risk.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
