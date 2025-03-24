import { create } from "zustand";
import { ASSET_FIELDS, AssetFieldKey } from "@/types/asset";

type AssetFormData = Record<AssetFieldKey, string | string[]>;

type AssetStore = {
    formData: AssetFormData;
    updateField: (key: AssetFieldKey, value: string | string[]) => void;
    resetForm: () => void;
};

export const useAssetStore = create<AssetStore>((set) => ({
    // Initialize form data dynamically
    formData: Object.keys(ASSET_FIELDS).reduce((acc, key) => {
        acc[key as AssetFieldKey] = "";
        return acc;
    }, {} as AssetFormData),

    // Update field dynamically
    updateField: (key, value) =>
        set((state) => ({
            formData: { ...state.formData, [key]: value },
        })),

    // Reset form
    resetForm: () =>
        set({
            formData: Object.keys(ASSET_FIELDS).reduce((acc, key) => {
                acc[key as AssetFieldKey] = "";
                return acc;
            }, {} as AssetFormData),
        }),
}));
