"use client";

import Image from "next/image";
import { GlowEffect } from "../../glow-effect";
import questionMark from '@/assets/question-mark.png';

interface FAQCardProps {
    question: string;
    answer: string;
}

export default function FAQCard({ question, answer }: FAQCardProps) {
    return (
        <div className="relative w-full max-w-sm cursor-pointer group">
            <GlowEffect
                colors={['#0AEFB2', '#3C929A', '#FFFFFF']}
                mode='static'
                blur='soft'
            />
            
            <div className="relative w-full rounded-lg bg-gradient-to-br from-primary to-black">
                <div className="h-32  rounded-t-lg p-6">
                    <h3 className="text-2xl">{question}</h3>
                    <Image width={40} height={40} src={questionMark.src} alt="Question mark" className="absolute right-20 opacity-40 top-16" />
                </div>
                <div className="p-3 md:p-6 h-44 rounded-lg bg-black">
                    <p className="text-[#777777] group-hover:text-white">{answer}</p>
                </div>
            </div>
      </div>
    )
}