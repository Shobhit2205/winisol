import { CreateLotteryInputArgs } from "@/components/authority/dashboard/CreateLottery";
import axios from "axios";
import { BACKEND_API } from "../lib/constants";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CreateLotteryArgs, GetAllLotteriesArgs, LotteryDetailsResponse } from "@/types";


export const createLottery = async (data: CreateLotteryInputArgs, token: string) => {
    try {
        const formattedData = {
            ...data,
            price: Math.floor(Number(data.price) * LAMPORTS_PER_SOL), 
            startTime: (new Date(data.startTime).getTime()) / 1000,
            endTime: (new Date(data.endTime).getTime()) / 1000,
        };
        const res = await axios.post<CreateLotteryArgs>(
            `${BACKEND_API}/api/v1/lottery/create-lottery`,
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

export const getAllLotteries = async() => {
    try {
        const res = await axios.get<GetAllLotteriesArgs>(`${BACKEND_API}/api/v1/lottery/get-all-lotteries`);
        return res;
    } catch (error) {
        console.error("Error creating lottery:", error);
        throw error;
    }
}

export const getSingleLottery = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.get<LotteryDetailsResponse>(`${BACKEND_API}/api/v1/lottery/get-single-lottery/${lotteryId}`, {
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

export const initializeConfig = async (lotteryId: number, initializeConfigSignature: string, token: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/lottery/initialize-config`, {lotteryId, initializeConfigSignature}, {
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

export const initializeLotterySign = async (lotteryId: number, initializeLotterySignature: string, token: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/lottery/initialize-lottery`, {lotteryId, initializeLotterySignature}, {
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

export const buyTicketSign = async (lotteryId: number, signature: string, publicKey: string) => {
    try {
        const res = await axios.post(`${BACKEND_API}/api/v1/lottery/buy-ticket`, {lotteryId, signature, publicKey});
        return res;
    } catch (error) {
        console.error("Error buying ticket:", error);
        throw error;
    }
}

export const createRandomnessSign = async (lotteryId: number, createRandomnessSignature: string, sbRandomnessPubKey: string, sbQueuePubKey: string,  token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/create-randomness`, {lotteryId, createRandomnessSignature, sbRandomnessPubKey, sbQueuePubKey}, {
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

export const getRandomnessKeys = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.get(`${BACKEND_API}/api/v1/lottery/get-randomness-keys/${lotteryId}`, {
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

export const commitRandomnessSign = async (lotteryId: number, commitRandomnessSignature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/commit-randomness`, {lotteryId, commitRandomnessSignature}, {
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

export const revealWinnerSign = async (lotteryId: number, revealWinnerSignature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/reveal-winner`, {lotteryId, revealWinnerSignature}, {
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


export const claimWinningsSign = async (lotteryId: number, publicKey: string, signature: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/claim-winnings`, {lotteryId, publicKey, signature});
        return res;
    } catch (error) {
        console.error("Error claiming winnings:", error);
        throw error;
    }
}

export const authorityTransferSign = async (lotteryId: number, publicKey: string, signature: string, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/authority-transfer`, { lotteryId, publicKey, signature}, {
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

export const setLoteryCompleted = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.put(`${BACKEND_API}/api/v1/lottery/update-lottery-status`, { lotteryId }, {
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

export const deleteLottery = async (lotteryId: number, token: string) => {
    try {
        const res = await axios.delete(`${BACKEND_API}/api/v1/lottery/delete-lottery/${lotteryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.error("Error deleting lottery:", error);
        throw error;
    }
}
