'use client';

import React, { useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { SOLANA_ENVIRONMENT } from "@/lib/constants";

interface SolanaExplorerLinkProps {
  signature?: string;
  label: string;
  type: "transaction" | "address";
}

const SolanaExplorerLink: React.FC<SolanaExplorerLinkProps> = ({
  signature,
  label,
  type = "transaction",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (signature) {
      try {
        await navigator.clipboard.writeText(signature);
        setCopied(true);

        // Hide "Copied" text after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return signature ? (
    <div className="flex gap-4 items-center">
      <a
        href={`https://explorer.solana.com/${type === 'transaction' ? 'tx' : 'address'}/${signature}?cluster=${SOLANA_ENVIRONMENT}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline flex gap-2"
      >
        {signature}
        <ExternalLink size={20} />
      </a>
      <Copy
        size={20}
        color="#0AEFB2"
        className="cursor-pointer"
        onClick={handleCopy}
      />
      {copied && (
        <span className="text-primary ml-2">Copied</span>
      )}
    </div>
  ) : (
    <>N/A</>
  );
};

export default SolanaExplorerLink;
