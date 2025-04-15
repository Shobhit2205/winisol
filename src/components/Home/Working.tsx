'use client';

import WorkingCard from "../ui/common/Card/WorkingCard";
import { WorkingData } from "../data/mock";


export default function Working() {
    return (
        <div className="mx-8 lg:mx-16 flex flex-col gap-12">
            <div className="flex flex-col items-center gap-3">
                <h2 className="text-4xl lg:text-5xl gradient-text bg-gradient-to-b from-white to-primary">How it works</h2>
                <p className="font-light">Play & Win in 3 Easy Steps</p>
            </div>

            <div className="flex items-center flex-wrap justify-center gap-8">
                {WorkingData.map((data) => (
                    <WorkingCard key={data.id} data={data}/>
                ))}
            </div>
            
        </div>
    )
}