import { create } from "zustand";
import { PROPERTY_FIELDS, PropertyFieldKey } from "@/types/property";

type PropertyFormData = Record<PropertyFieldKey, string | string[]>;

type PropertyStore = {
    formData: PropertyFormData;
    updateField: (key: PropertyFieldKey, value: string | string[]) => void;
    resetForm: () => void;
};

export const usePropertyStore = create<PropertyStore>((set) => ({
    // Initialize form data dynamically
    formData: Object.keys(PROPERTY_FIELDS).reduce((acc, key) => {
        acc[key as PropertyFieldKey] = key === "images" ? [] : "";
        return acc;
    }, {} as PropertyFormData),

    // Update field dynamically
    updateField: (key, value) =>
        set((state) => ({
            formData: { ...state.formData, [key]: value },
        })),

    // Reset form
    resetForm: () =>
        set({
            formData: Object.keys(PROPERTY_FIELDS).reduce((acc, key) => {
                acc[key as PropertyFieldKey] = key === "images" ? [] : "";
                return acc;
            }, {} as PropertyFormData),
        }),
}));
