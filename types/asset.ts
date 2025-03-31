import { z } from "zod";

// Preserve your existing constants and field keys
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

export type CategorizedAssets = {
    [key: string]: {
        assets: Asset[];
        count: number;
        label?: string; // Optional: include the display label
    };
};

// Export the type for field keys
export type AssetFieldKey = keyof typeof ASSET_FIELDS;

// Zod validation schema
export const BaseAssetSchema = z.object({
    name: z.string().min(1, "Name is required"),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    serialNumber: z.string().min(1, "Serial Number is required"),
    displayName: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    size: z.string().optional(),
    manufactureDate: z.coerce.date().optional(),
    installDate: z.coerce.date().optional(),
    warranties: z.string().optional(),
    notes: z.string().optional(),
    images: z.array(z.string()).optional(),
});

// Type inference from Zod schema
export type AssetInput = z.infer<typeof BaseAssetSchema>;

// Complete asset type with metadata
export const AssetDBSchema = BaseAssetSchema.extend({
    id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
});

export type AssetDB = z.infer<typeof AssetDBSchema>;

// Combined type for client-side usage
export type Asset = AssetInput & Partial<Pick<AssetDB, "id" | "createdAt" | "updatedAt">>;

// Custom type to control field optionality
export type AssetOptionalFields = Partial<Record<keyof Asset, boolean>>;

// // Validation function

export const validateAsset = (data: Partial<Asset>) => {
    const submissionData = {
        ...data,
        manufactureDate: data.manufactureDate?.toISOString(),
        installDate: data.installDate?.toISOString(),
    };

    console.log("in validate asset", data);
    return BaseAssetSchema.safeParse(submissionData);
};

// Function to create a validation schema with custom optionality
export const createAssetValidationSchema = (optionalFields: AssetOptionalFields = {}) => {
    const schema = z.object(
        Object.fromEntries(
            Object.entries(BaseAssetSchema.shape).map(([key, validator]) => {
                // Type-safe check for optional fields
                const isExplicitlyOptional =
                    key in optionalFields ? optionalFields[key as keyof Asset] : false;

                // If the field is explicitly marked as optional or is already optional
                if (isExplicitlyOptional || validator instanceof z.ZodOptional) {
                    return [key, validator];
                }

                // Otherwise, ensure it's a required field
                return [key, (validator as z.ZodString).min(1, `${key} is required`)];
            })
        )
    );

    return schema;
};

export const isAssetFieldKey = (key: string): key is keyof Asset => {
    return key in BaseAssetSchema.shape;
};

export type AssetFormAction =
    | { type: "UPDATE_FIELD"; field: keyof Asset; value: string }
    | { type: "ADD_IMAGE"; image: string }
    | { type: "REMOVE_IMAGE"; index: number };
