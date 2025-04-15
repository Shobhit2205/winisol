"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
    {
        id: 1,
        label: 'Guide',
        link: '/lottery-guide',
    },
    {
        id: 2,
        label: 'Winners',
        link: '/winners',
    },
    {
        id: 3,
        label: 'FAQs',
        link: '/faqs',
    },
    {
        id: 4,
        label: 'Privacy Policy',
        link: '/privacy-policy',
    },
    {
        id: 5,
        label: 'Terms & Conditions',
        link: '/terms-and-conditions',
    }, 
]

export default function Footer() {
    return (
        <div className="w-full bg-gradient-to-b from-black via-tertiary to-primary">
        <div className=" max-w-screen-2xl w-full xl:mx-auto">
            <div className="flex items-center justify-between mx-8 lg:mx-24 py-8 flex-col lg:flex-row gap-4">
                <Link href="/" className="flex items-end gap-2 w-fit">
                    <Image src={'/logo.svg'} alt="logo" width={40} height={40} />
                    <span className='text-3xl font-semibold cursor-pointer gradient-text bg-gradient-to-r from-primary to-secondary'>
                        WiniSol
                    </span>
                </Link>
                
                <div className="flex items-center flex-wrap justify-center gap-6">
                    {footerLinks.map((link) => (
                        <Link key={link.id} href={link.link} className="relative text-white text-center after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:absolute after:left-0 after:bottom-[-6px] after:rounded-lg after:transition-all after:duration-500 hover:after:w-full hover:text-primary">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <Link href={'/contact'} className="relative text-white after:content-[''] after:w-0 after:h-[2px] after:bg-primary after:absolute after:left-0 after:bottom-[-6px] after:rounded-lg after:transition-all after:duration-500 hover:after:w-full hover:text-primary">Contact us</Link>
            </div>
            <hr className="text-black"/>
            <div className="flex items-start justify-between mx-8 lg:mx-24 py-8 gap-3">
                <p className="text-black">Copyright © 2025 WiniSol. All right Reserved</p>
                <Link href={"mailto:contact@winisol.com"} className="text-black">contact@winisol.com</Link>
            </div>
        </div>
        </div>
    )
}