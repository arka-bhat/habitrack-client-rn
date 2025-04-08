import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { useLocales } from "expo-localization";

import { UserDB, UserInput, UserProfile } from "@/types/user";
import { isI18nReady, isValidLang, LangCode, LanguageMetadata } from "@/i18n";
import { mockCreateUserAPI } from "@/services/user";
import { PropertyInput } from "@/types/property";
import i18next from "i18next";

let profileStorage: MMKV | null = null;

try {
    profileStorage = new MMKV({
        id: "user-profile",
    });
} catch (error) {
    console.error("Failed to initialize MMKV profile storage:", error);
}

export const getProfileStorage = () => {
    if (!profileStorage) {
        try {
            profileStorage = new MMKV({
                id: "user-profile",
            });
        } catch (error) {
            console.error("Failed to initialize MMKV profile storage on demand:", error);
            return null;
        }
    }
    return profileStorage;
};

const zustandStorage = {
    getItem: (name: string) => {
        try {
            const storage = getProfileStorage();
            if (!storage) {
                console.warn("MMKV storage not available");
                return null;
            }
            return storage.getString(name) || null;
        } catch (error) {
            console.error("Error getting item from MMKV:", error);
            return null;
        }
    },
    setItem: (name: string, value: string) => {
        try {
            const storage = getProfileStorage();
            if (!storage) {
                console.warn("MMKV storage not available");
                return;
            }
            storage.set(name, value);
        } catch (error) {
            console.error("Error setting item in MMKV:", error);
        }
    },
    removeItem: (name: string) => {
        try {
            const storage = getProfileStorage();
            if (!storage) {
                console.warn("MMKV storage not available");
                return;
            }
            storage.delete(name);
        } catch (error) {
            console.error("Error removing item from MMKV:", error);
        }
    },
};

type UserStore = {
    profile: UserProfile | null;
    userLanguage: LangCode;
    isHydrated: boolean;

    // registration states
    onboarding: {
        stage: "phone_verification" | "user_registration" | "property_registration" | "complete";
        tempData?: {
            user?: Partial<UserInput>;
            property?: Partial<PropertyInput>;
        };
    };

    // Actions
    setOnboardingStage: (stage: UserStore["onboarding"]["stage"]) => void;
    saveTempOnboardingData: (
        data: Partial<{
            user: Partial<UserInput>;
            property: Partial<PropertyInput>;
        }>
    ) => void;
    completeOnboarding: () => void;

    // Actions
    setLanguage: (lang: LangCode) => void;
    getAvailableLanguages: () => Array<{ code: LangCode; name: string }>;

    setProfile: (user: UserDB) => void;
    createProfile: (data: UserInput) => Promise<UserDB>;
    clearProfile: () => void;

    hydrate: () => void;
};

const initialState = {
    profile: null,
    userLanguage: LangCode.en,
    isHydrated: false,
    onboarding: {
        stage: "phone_verification" as const,
        tempData: {},
    },
};

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            setOnboardingStage: (stage) =>
                set((state) => ({
                    onboarding: { ...state.onboarding, stage },
                })),

            saveTempOnboardingData: (data) =>
                set((state) => ({
                    onboarding: {
                        ...state.onboarding,
                        tempData: { ...state.onboarding.tempData, ...data },
                    },
                })),

            completeOnboarding: () =>
                set({
                    onboarding: { stage: "complete", tempData: undefined },
                }),

            setLanguage: (lang) => {
                if (Object.values(LangCode).includes(lang)) {
                    set({ userLanguage: lang });
                    // Update i18n when language changes
                    if (isI18nReady()) {
                        i18next.changeLanguage(lang);
                    }
                }
            },

            getAvailableLanguages: () => {
                return Object.values(LangCode).map((code) => ({
                    code,
                    name: LanguageMetadata[code].name,
                }));
            },

            setProfile: (user) => set({ profile: user }),

            createProfile: async (data) => {
                const newUser = await mockCreateUserAPI(data);
                set({ profile: newUser });
                return newUser;
            },

            clearProfile: () =>
                set({
                    profile: null,
                }),

            hydrate: () => {
                return new Promise<void>((resolve) => {
                    try {
                        const storedValue = zustandStorage.getItem("user-profile");
                        // If we couldn't get any stored data, just mark hydration as complete
                        if (!storedValue) {
                            set({
                                ...initialState,
                                isHydrated: true,
                            });
                            return;
                        }

                        try {
                            const parsedState = JSON.parse(storedValue);
                            const userLang =
                                parsedState?.language && isValidLang(parsedState.language)
                                    ? parsedState.language
                                    : LangCode.en;

                            set({
                                profile: parsedState?.profile || null,
                                userLanguage: userLang,
                                isHydrated: true,
                            });
                        } catch (parseError) {
                            console.error("Error parsing stored data:", parseError);
                            set({
                                ...initialState,
                                isHydrated: true,
                            });
                        }
                    } catch (error) {
                        console.error("Error during hydration:", error);
                        set({
                            // Default state...
                            isHydrated: true,
                        });
                    }
                    resolve();
                });
            },
        }),
        {
            name: "user-profile",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({
                profile: state.profile,
                language: state.userLanguage,
            }),
            onRehydrateStorage: () => (state) => {
                state?.hydrate();
            },
        }
    )
);
