import { BACKEND_API } from "@/lib/constants";
import { CreateLimitedLotteryInputArgs, GetAllLimitedLotteriesArgs, LimitedLottery } from "@/types";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";

interface LimitedLotteryResponse {
    success: boolean;
    message: string;
    limitedLottery: LimitedLottery;
}
export const createLimitedLottery = async (data: CreateLimitedLotteryInputArgs, token: string) => {
    try {
        const formattedData = {
            ...data,
            price: Math.floor(Number(data.price) * LAMPORTS_PER_SOL), 
        };
        const res = await axios.post<LimitedLotteryResponse>(
            `${BACKEND_API}/api/v1/limited-lottery/create-limited-lottery`,
            formattedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return res;
    } catch (error) {
        console.error("Error creating lottery:", error);
        throw error;
    }
};

export const getAllLimitedLottery = async () => {
    try {
        const res = await axios.get<GetAllLimitedLotteriesArgs>(`${BACKEND_API}/api/v1/limited-lottery/get-all-limited-lotteries`);
        return res;
    } catch (error) {
        console.error("Error creating lottery:", error);
        throw error;
    }
}

export const initializeLimitedLotteryConfigSign = async (lotteryId: number, initializeConfigSignature: string, token: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/limited-lottery/initialize-limited-lottery-config`, {lotteryId, initializeConfigSignature}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error creating lottery:", error);
        throw error;
    }
}

export const initializeLimitedLotterySign = async (lotteryId: number, initializeLotterySignature: string, token: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/limited-lottery/initialize-limited-lottery`, {lotteryId, initializeLotterySignature}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error initializing lottery:", error);
        throw error;
    }
}


export const buyLimitedLotteryTicketSign = async (lotteryId: number, signature: string, publicKey: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/limited-lottery/buy-limited-lottery-ticket`, {lotteryId, signature, publicKey});
        return res;
    } catch (error) {
        console.error("Error buying ticket:", error);
        throw error;
    }
}

export const createLimitedLotteryRandomnessSign = async (lotteryId: number, createRandomnessSignature: string, sbRandomnessPubKey: string, sbQueuePubKey: string,  token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/create-limited-lottery-randomness`, {lotteryId, createRandomnessSignature, sbRandomnessPubKey, sbQueuePubKey}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error creating randomness:", error);
        throw error;
    }
}

export const getLimitedLotteryRandomnessKeys = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.get(`${BACKEND_API}/api/v1/limited-lottery/get-limited-lottery-randomness-keys/${lotteryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error fetching randomness keys:", error);
        throw error;
    }
}

export const commitLimitedLotteryRandomnessSign = async (lotteryId: number, commitRandomnessSignature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/commit-limited-lottery-randomness`, {lotteryId, commitRandomnessSignature}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error committing randomness:", error);
        throw error;
    }
}

export const revealLimitedLotteryWinnerSign = async (lotteryId: number, revealWinnerSignature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/reveal-limited-lottery-winner`, {lotteryId, revealWinnerSignature}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error revealing randomness:", error);
        throw error;
    }
}

export const claimLimitedLotteryWinningsSign = async (lotteryId: number, publicKey: string, signature: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/claim-limited-lottery-winnings`, {lotteryId, publicKey, signature});
        return res;
    } catch (error) {
        console.error("Error claiming winnings:", error);
        throw error;
    }
}

export const limitedLotteryAuthorityTransferSign = async (lotteryId: number, publicKey: string, signature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/limited-lottery-authority-transfer`, { lotteryId, publicKey, signature}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error transferring authority:", error);
        throw error;
    }
}

export const setLimitedLoteryCompleted = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/limited-lottery/update-lottery-status`, { lotteryId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error setting lottery completed:", error);
        throw error;
        
    }
}