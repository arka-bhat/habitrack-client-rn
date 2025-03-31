// src/storage/storage.ts
import { MMKV } from "react-native-mmkv";

export const appStorage = new MMKV();

export const encryptedStorage = new MMKV({
    id: "encrypted-storage",
    encryptionKey: "your-256-bit-encryption-key", // Generate properly in production
});
