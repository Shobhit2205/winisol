"use client";

import { Tilt } from "../../tilt";

interface WorkingCardProps {
    data: {
        step: number,
        title: string,
        description: string
    }
}

export default function WorkingCard({data} : WorkingCardProps) {
    return (
        <Tilt rotationFactor={8} isRevese>
            <div className="flex flex-col max-w-xs h-96 border p-8 justify-between rounded-xl" style={{
                backgroundImage: 'radial-gradient(circle, #00ffbb50 0%, rgba(10, 239, 178, 0) 70%)',
                backgroundSize: 'cover',
                position: 'relative',
                zIndex: 1, 
            }}>
                <div className="flex flex-col gap-4">
                    <div className="flex rounded-full w-10 h-10 items-center justify-center bg-gradient-to-br from-[#B5FFEB] via-[#ABFFE9] to-[#000000]">
                        <span className="text-black font-bold text-xl">{data.step}</span>
                    </div>
                    <h3 className="text-3xl w-48">{data.title}</h3>
                </div>
                <p>{data.description}</p>
            </div>
        </Tilt>
    )
}