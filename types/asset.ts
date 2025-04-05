import { z } from "zod";
import { ImagePickerAssetSchema } from "./imageMetadata";
import { assetCategoryValues } from "@/utils/ZodSchemaUtils";

/**
 * Constants for asset field names
 * @readonly
 */
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

/**
 * Type definition for categorized assets
 * @typedef {Object} CategorizedAssets
 * @property {Asset[]} assets - List of assets in this category
 * @property {number} count - Number of assets in this category
 * @property {string} [label] - Optional display label for the category
 */
export type CategorizedAssets = {
    [key: string]: {
        assets: Asset[];
        count: number;
        label?: string;
    };
};

/**
 * Type representing the keys of the ASSET_FIELDS object
 * @typedef {keyof typeof ASSET_FIELDS} AssetFieldKey
 */
export type AssetFieldKey = keyof typeof ASSET_FIELDS;

/**
 * Base validation schema for asset data
 * @const {z.ZodObject}
 */
export const BaseAssetSchema = z.object({
    /** Required field with validation */
    name: z.string().min(1, "Name is required"),
    /** Required field with validation */
    brand: z.string().min(1, "Brand is required"),
    /** Required field with validation */
    model: z.string().min(1, "Model is required"),
    /** Required field with validation */
    serialNumber: z.string().min(1, "Serial Number is required"),

    /** Optional display name */
    displayName: z.string().optional(),
    /** Optional category */
    category: z.enum([...assetCategoryValues] as [string, ...string[]]),
    /** Optional location */
    location: z.string().min(1, "Location is required"),
    /** Optional size */
    size: z.string().optional(),
    /** Optional manufacture date */
    manufactureDate: z.coerce.date().optional(),
    /** Optional installation date */
    installDate: z.coerce.date().optional(),
    /** Optional warranties information */
    warranties: z.string().optional(),
    /** Optional notes */
    notes: z.string().optional(),
    /** Optional array of image URLs */
    images: z.array(ImagePickerAssetSchema).optional(),
});

export const AssetCreateSchema = BaseAssetSchema.extend({
    propertyId: z.string().min(1, "Property ID is required"),
});

/**
 * Type representing the input data for creating an asset
 * @typedef {z.infer<typeof BaseAssetSchema>} AssetInput
 */
export type AssetInput = z.infer<typeof BaseAssetSchema>;

/**
 * Extended schema for database records with metadata
 * @const {z.ZodObject}
 */
export const AssetDBSchema = BaseAssetSchema.extend({
    id: z.string(),
    propertyId: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
});

/**
 * Type representing an asset as stored in the database
 * @typedef {z.infer<typeof AssetDBSchema>} AssetDB
 */
export type AssetDB = z.infer<typeof AssetDBSchema>;

/**
 * Combined asset type for client-side usage
 * @typedef {AssetInput & Partial<Pick<AssetDB, "id" | "createdAt" | "updatedAt">> & {propertyId: string}} Asset
 */
export type Asset = AssetInput &
    Partial<Pick<AssetDB, "id" | "createdAt" | "updatedAt">> & {
        propertyId: string; // Required link to property
    };

/**
 * Type to control which asset fields are optional
 * @typedef {Partial<Record<keyof Asset, boolean>>} AssetOptionalFields
 */
export type AssetOptionalFields = Partial<Record<keyof Asset, boolean>>;

/**
 * Validates partial asset data against the schema
 * @param {Partial<Asset>} data - Partial asset data to validate
 * @returns {z.SafeParseReturnType<any, any>} - Zod validation result
 */
export const validateAsset = (data: Partial<Asset>) => {
    // Convert Date objects to ISO strings for validation
    const submissionData = {
        ...data,
        manufactureDate: data.manufactureDate?.toISOString(),
        installDate: data.installDate?.toISOString(),
    };

    return BaseAssetSchema.safeParse(submissionData);
};

/**
 * Creates a custom validation schema with specified optional fields
 * @param {AssetOptionalFields} [optionalFields={}] - Dictionary specifying which fields should be optional
 * @returns {z.ZodObject<any, any>} - Customized Zod validation schema
 */
export const createAssetValidationSchema = (optionalFields: AssetOptionalFields = {}) => {
    // Create a new schema by modifying field requirements
    const schema = z.object(
        Object.fromEntries(
            Object.entries(BaseAssetSchema.shape).map(([key, validator]) => {
                // Check if field should be optional based on input parameter
                const isExplicitlyOptional =
                    key in optionalFields ? optionalFields[key as keyof Asset] : false;

                // If already optional or explicitly marked optional, keep as is
                if (isExplicitlyOptional || validator instanceof z.ZodOptional) {
                    return [key, validator];
                }

                // Otherwise ensure it's required with appropriate error message
                return [key, (validator as z.ZodString).min(1, `${key} is required`)];
            })
        )
    );

    return schema;
};

/**
 * Type guard to check if a string is a valid asset field key
 * @param {string} key - String to check
 * @returns {boolean} - True if key is a valid asset field
 */
export const isAssetFieldKey = (key: string): key is keyof Asset => {
    return key in BaseAssetSchema.shape;
};

/**
 * TypeScript Utility Types Explanation:
 *
 * @typedef {T} Partial
 * Makes all properties of T optional
 * Example: Partial<{name: string}> becomes {name?: string}
 * Used when you need to represent incomplete objects or updates
 *
 * @typedef {T} Pick
 * Creates a type with only the properties K from type T
 * Example: Pick<{id: string, name: string}, 'id'> becomes {id: string}
 * Used to extract specific fields from a larger type
 *
 * @typedef {T} Record
 * Creates a type with keys of type K and values of type T
 * Example: Record<'id' | 'name', string> becomes {id: string, name: string}
 * Used to create dictionaries or maps with known key types
 *
 * @typedef {T} keyof
 * Returns a union type of all property names of T
 * Example: keyof {id: string, name: string} becomes 'id' | 'name'
 * Used to reference property names in a type-safe way
 */
