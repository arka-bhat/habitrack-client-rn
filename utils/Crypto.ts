import * as Crypto from "expo-crypto";
import { encode as btoa } from "base-64";

export const generateSecureKey = async (): Promise<string> => {
    const bytes = await Crypto.getRandomBytesAsync(32);

    // Convert Uint8Array to base64 without Buffer
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
};
