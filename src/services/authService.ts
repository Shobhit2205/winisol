import axios from "axios";
import { BACKEND_API } from "../lib/constants";

export const fetchNonce = async (publicKey: string) => {
    const res = await axios.post<{ nonce: string }>(`${BACKEND_API}/api/v1/auth/generate-nonce`, { publicKey });
    return res.data.nonce;
};

export const verifySignature = async (signature: string, publicKey: string) => {
    const res = await axios.post<{ success: boolean; token: string; message: string }>(`${BACKEND_API}/api/v1/auth/verify-authority`, {
        signature,
        publicKey,
    });
    return res.data;
};

export const sendMail = async (name: string, email: string, message: string) => {
    const res = await axios.post<{ success: boolean; message: string }>(`${BACKEND_API}/api/v1/auth/send-mail`, {
        name,
        email,
        message,
    });
    return res.data;
}
