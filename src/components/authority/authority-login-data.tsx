'use client';

import { useWallet } from "@solana/wallet-adapter-react";
import { useCluster } from "../cluster/cluster-data-access";
import { useMutation } from "@tanstack/react-query";
import bs58 from "bs58";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNonce, verifySignature } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export function useAuthority() {
    const { publicKey, signMessage } = useWallet();
    const { cluster } = useCluster();
    const { setToken } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    // Get Nonce Mutation
    const getNonce = useMutation({
        mutationKey: ["tokenlottery", "generate-nonce", cluster],
        mutationFn: async () => {
            if (!publicKey) {
                toast({
                    title: "wallet not connected.",
                    description: "Please connect your wallet to generate a nonce.",
                    variant: "destructive",
                })
                throw new Error("Public key is missing.");
            }
            return fetchNonce(publicKey?.toBase58());
        },
        onSuccess: (nonce) => {
            toast({
                title: "Nonce generated successfully.",
                description: "Please sign the nonce to verify your identity.",
                variant: "default",
            })
        },
        onError: (error) => {
            console.error("Failed to generate nonce:", error);
            toast({
                title: "Failed to generate nonce.",
                description: "Please try again later.",
                variant: "destructive",
            });
        },
    });

    // Verify Nonce Mutation
    const verifyNonce = useMutation({
        mutationKey: ["tokenlottery", "verify-nonce", cluster],
        mutationFn: async (nonce: string | null) => {
            if (!nonce) throw new Error("Nonce is required.");
            if (!signMessage) throw new Error("Wallet signature function is unavailable.");
            if (!publicKey) throw new Error("Public key is missing.");

            const signatureUint8Array = await signMessage(Buffer.from(nonce));
            const signature = bs58.encode(signatureUint8Array);

            return verifySignature(signature, publicKey.toBase58());
        },
        onSuccess: (data) => {
            setToken(data.token);
            toast({
                title: "Nonce verified successfully.",
                description: "You are now logged in.",
                variant: "default",
            })
            router.push("/authority/dashboard");
        },
        onError: (error) => {
            console.error("Failed to verify nonce:", error);
            toast({
                title: "Failed to verify nonce.",
                description: "Please try again later.",
                variant: "destructive",
            })
        },
    });

    return { getNonce, verifyNonce };
}
