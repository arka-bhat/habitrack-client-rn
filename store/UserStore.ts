import { create } from "zustand";
import { USER_FIELDS, UserFieldKey } from "@/types/user";
import { Property } from "@/types/property";
import { Asset } from "@/types/asset";

type UserFormData = Record<Exclude<UserFieldKey, "properties" | "assets">, string> & {
    properties: Property[];
    assets: Asset[];
};

type UserStore = {
    formData: UserFormData;
    updateField: (key: Exclude<UserFieldKey, "properties" | "assets">, value: string) => void;
    setProperties: (properties: Property[]) => void;
    setAssets: (assets: Asset[]) => void;
    resetUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    // Initialize user data
    formData: {
        id: "",
        name: "",
        phoneNumber: "",
        authToken: "",
        properties: [],
        assets: [],
    },

    // Update user fields dynamically
    updateField: (key, value) =>
        set((state) => ({
            formData: { ...state.formData, [key]: value },
        })),

    // Set properties
    setProperties: (properties) =>
        set((state) => ({
            formData: { ...state.formData, properties },
        })),

    // Set assets
    setAssets: (assets) =>
        set((state) => ({
            formData: { ...state.formData, assets },
        })),

    // Reset user data
    resetUser: () =>
        set({
            formData: {
                id: "",
                name: "",
                phoneNumber: "",
                authToken: "",
                properties: [],
                assets: [],
            },
        }),
}));
