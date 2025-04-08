import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { getEncryptionKey } from "./security";
import { mockVerifyOtp } from "@/services/auth";
import { createJSONStorage, persist } from "zustand/middleware";

// Use a promise to track initialization
let authStorageReady: boolean = false;
let authStoragePromise: Promise<unknown> | null = null;
let authStorage: MMKV;

const initializeAuthStorage = async () => {
    if (authStoragePromise) return authStoragePromise;

    authStoragePromise = new Promise(async (resolve) => {
        try {
            const encryptionKey = await getEncryptionKey();
            authStorage = new MMKV({
                id: "auth-storage",
                encryptionKey,
            });
            authStorageReady = true;
            console.log("Auth storage initialized successfully");
            resolve(true);
        } catch (error) {
            console.error("Failed to initialize auth storage:", error);
            resolve(false);
        }
    });

    return authStoragePromise;
};

// Create a storage object that implements PersistStorage
const zustandStorage = {
    getItem: (name: string) => {
        return authStorage?.getString(name) ?? null;
    },
    setItem: (name: string, value: string) => {
        authStorage?.set(name, value);
    },
    removeItem: (name: string) => {
        authStorage?.delete(name);
    },
};

// Start initialization right away
initializeAuthStorage();

type AuthStore = {
    // Actions
    setOtpPhoneNumber: (countryCode: string, phoneNumber: string) => void;
    startOTPCountdown: (phoneNumber: string) => void;
    verifyOTP: (code: string) => Promise<boolean>;
    resetOTPState: () => void;
    recordOTPAttempt: () => void;
    setToken: (token: string) => void;
    clearToken: () => void;
    otpPhoneNumber: string | null;
    otpCooldownExpires: number | null;
    otpAttempts: number;

    // Persisted state
    token: string | null;
    isHydrated: boolean;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Initial state
            otpPhoneNumber: null,
            otpCooldownExpires: null,
            otpAttempts: 0,
            token: null,
            isHydrated: false,

            // Actions
            setOtpPhoneNumber: (countryCode: string, phoneNumber: string) => {
                set({ otpPhoneNumber: `${countryCode}${phoneNumber.replace(/\s*/g, "")}` });
            },

            startOTPCountdown: (phoneNumber: string) => {
                const COOLDOWN_DURATION = 60 * 1000; // 1 minute
                set({
                    otpPhoneNumber: phoneNumber,
                    otpCooldownExpires: Date.now() + COOLDOWN_DURATION,
                    otpAttempts: 0,
                });
            },

            verifyOTP: async (code: string) => {
                const { otpPhoneNumber } = get();
                if (!otpPhoneNumber) {
                    throw new Error("No phone number set for OTP verification.");
                }
                try {
                    // Simulate OTP verification API call
                    console.log("Verifying OTP for phone number:", otpPhoneNumber, code);
                    const response = await mockVerifyOtp(otpPhoneNumber, code);
                    if (!response) {
                        throw new Error("OTP verification failed");
                    }
                    // Handle successful verification
                    return true;
                } catch (error) {
                    console.error("OTP verification error:", error);
                    throw new Error("OTP verification failed. Please try again.");
                }
            },

            resetOTPState: () =>
                set({
                    otpPhoneNumber: null,
                    otpCooldownExpires: null,
                    otpAttempts: 0,
                }),

            recordOTPAttempt: () =>
                set((state: { otpAttempts: number }) => ({
                    otpAttempts: state.otpAttempts + 1,
                })),

            setToken: (token: any) => set({ token }),

            clearToken: () => {
                set({
                    token: null,
                    otpPhoneNumber: null,
                    otpCooldownExpires: null,
                });
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({
                token: state.token, // Only persist the token
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    useAuthStore.setState({ isHydrated: true });
                }
            },
        }
    )
);

// Initialize hydration on app start
