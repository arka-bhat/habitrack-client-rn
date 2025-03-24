export interface Asset {
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    displayName?: string;
    category?: string;
    location?: string;
    images: string[];
    size?: string;
    manufactureDate?: string;
    installDate?: string;
    warranties?: string;
    notes?: string;
}

export const ASSET_FIELDS = {
    name: "name",
    brand: "brand",
    model: "model",
    serialNumber: "serialNumber",
    displayName: "displayName",
    category: "category",
    location: "location",
    images: "images",
    size: "size",
    manufactureDate: "manufactureDate",
    installDate: "installDate",
    warranties: "warranties",
    notes: "notes",
} as const;

export type AssetFieldKey = keyof typeof ASSET_FIELDS;

export type AssetFormAction =
    | { type: "UPDATE_FIELD"; field: keyof Asset; value: string }
    | { type: "ADD_IMAGE"; image: string }
    | { type: "REMOVE_IMAGE"; index: number };
