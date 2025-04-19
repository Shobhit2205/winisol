import { BACKEND_API } from "@/lib/constants";
import { RecentWinnersData, WinningData } from "@/types";
import axios from "axios";

export const getWinningsByPublicKey = async (publicKey: string) => {
    try {
        const res = await axios.get<WinningData>(`${BACKEND_API}/api/v1/common/winner-by-public-key/${publicKey}`);
        return res;
    } catch (error) {
        console.error("Error fetching winnings:", error);
        throw error;
    }
}

export const getAllRecentWinners = async () => {
    try {
        const res = await axios.get<RecentWinnersData>(`${BACKEND_API}/api/v1/common/get-all-winners`);
        return res;
    } catch (error) {
        console.error("Error fetching winnings:", error);
        throw error;
    }
}