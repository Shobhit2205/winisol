"use client";

import Link from "next/link";
// import { WalletButton } from "@/components/solana/solana-provider";
import { ClusterUiSelect } from "@/components/cluster/cluster-ui";
import logo from "@/assets/logo.png"
import walletIcon from '@/assets/wallet.png'
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { ENVIRONMENT } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { WalletButton } from "@/components/solana/solana-provider";

const navbarLinks = [
  {
      id: 1,
      label: 'Home',
      link: '/',
  },
  {
      id: 2,
      label: 'Guide',
      link: '/lottery-guide',
  },
  {
      id: 3,
      label: 'FAQs',
      link: '/faqs',
  },
  {
      id: 4,
      label: 'Contact us',
      link: '/contact',
  }, 
]

const Navbar: React.FC = () => {
    const {publicKey, connected} = useWallet();
    
    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className='fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black'
      style={{
        borderBottom: '0.5px solid',
        borderImageSource: 'radial-gradient(circle, #ffffff 0%, rgba(153, 153, 153, 0) 80%)',
        borderImageSlice: 1, 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo / Name */}
        <Link href="/" className="flex items-end gap-2 w-1/2 md:w-1/3">
          <Image src={'/logo.svg'} alt="logo" width={40} height={40} />
          <span className='text-3xl font-semibold cursor-pointer gradient-text bg-gradient-to-r from-primary to-secondary'>
            WiniSol
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex gap-8 w-1/3 justify-center items-center">
            {navbarLinks.map((link) => (
                <Link key={link.id} href={link.link} className="relative text-white after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:absolute after:left-0 after:bottom-[-6px] after:rounded-lg after:transition-all after:duration-500 hover:after:w-full hover:text-primary">
                    {link.label}
                </Link>
            ))}
        </div>

        {/* Sidebar */}
        <div className=""></div>

        <div className="hidden md:flex space-x-6 w-1/2 md:w-1/3 md:justify-end md:items-center">
          <WalletButton>
              {!connected ? "Connect Wallet" : publicKey?.toString().slice(0, 5) + "..." + publicKey?.toString().slice(-5)}
              <div className="border border-white rounded-full p-2 ml-2">
                  <Image width={100} height={100} src={walletIcon.src} alt="crypto wallet" className="w-[15px]"/>
              </div>
          </WalletButton>
          
          {ENVIRONMENT === "development" && <ClusterUiSelect />}
        </div>
        <button
          className="lg:hidden block text-white"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={32} color="#0AEFB2" />
        </button>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white"
            onClick={() => setMenuOpen(false)}
          >
            <X size={32}  color="#0AEFB2" />
          </button>

          <div className="flex flex-col items-center gap-6">
            {navbarLinks.map((link) => (
              <Link
                key={link.id}
                href={link.link}
                className="text-2xl text-white hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
