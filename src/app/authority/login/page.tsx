'use client';

import { useAuthority } from "@/components/authority/authority-login-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { AUTHORITY_PUBLIC_KEY } from "@/lib/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const [nonce, setNonce] = useState<string | null>(null);
    const { getNonce, verifyNonce } = useAuthority();
    const { token } = useAuth();
    const router = useRouter();
    const { publicKey, connected } = useWallet();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (token) {
            router.replace("/authority/dashboard");
        }
    }, [token, router]);

    const handleGetNonce = () => {
        getNonce.mutate(undefined, {
            onSuccess: (generatedNonce: any) => setNonce(generatedNonce),
        });
    };
    const handleVerifyNonce = () => {
        verifyNonce.mutate(nonce);
    };
    
    useEffect(() => {
        if (!connected || publicKey === undefined) {
            return;
        }
        if (publicKey?.toString() !== AUTHORITY_PUBLIC_KEY) {
            notFound();
        } else {
            setCheckingAuth(false); 
        }
    }, [connected, publicKey]);


    if (checkingAuth) {
        return (
            <div className="text-center my-32 min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    
    return (
        <div className="min-h-[90vh] flex items-center justify-center">
            <div className="border border-white p-4 flex flex-col gap-4 rounded-lg shadow-md w-1/2">
                <Input disabled type="text" placeholder="Click on get Nonce" value={nonce || ""} className="bg-[#1A1A1A] py-5 border-white" />
                <div className="flex gap-2">
                    <Button className="w-full border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black" onClick={handleGetNonce} disabled={getNonce.isPending}>
                        {getNonce.isPending ? "Fetching..." : "Get Nonce"}
                    </Button>
                    <Button className="w-full border-2 border-primary bg-custom_black rounded-xl py-6 px-10 text-xl font-medium text-primary hover:bg-primary hover:text-black" onClick={handleVerifyNonce}>
                        {verifyNonce.isPending ? "Verifying..." : "Verify Nonce"}
                    </Button>
                </div>
            </div>
        </div>
    )
}