'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import FAQCard from "../ui/common/Card/FAQCard";
import { FAQs } from "../data/mock";

export default function FrequestlyAskedQuestions() {
    return (
        <div className="mx-8 lg:mx-16 flex flex-col gap-12 max-w-screen-2xl w-auto xl:mx-auto">
            <div className="flex items-center justify-center flex-col gap-2">
                <h2 className="text-3xl md:text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-white to-primary text-center">Frequently Asked Questions</h2>
                <p className="text-lg text-center font-light">Got questions? We’ve got answers! Here’s everything you need to know before you play.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FAQs.slice(0, 6).map((faq) => (
                <div key={faq.id} className="flex items-center justify-center w-full">
                    <FAQCard question={faq.question} answer={faq.answer} />
                </div>
            ))}
            </div>
            <Link href="/faqs" className="mx-auto">
            <Button className="border-2 w-fit  border-primary bg-custom_black rounded-full py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black">
                View All
            </Button>
            </Link>
        </div>
    );
}