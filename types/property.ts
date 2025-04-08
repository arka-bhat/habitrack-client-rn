import { z } from "zod";
import { ImagePickerAssetSchema } from "./imageMetadata";

/**
 * Constants for property field names
 * @readonly
 */
export const PROPERTY_FIELDS = {
    name: "name",
    addressLine1: "addressLine1",
    addressLine2: "addressLine2",
    city: "city",
    state: "state",
    zip: "zip",
    country: "country",
    coordinates: "coordinates",
    images: "images",
    rooms: "rooms", // Added new field
} as const;

/**
 * Type definition for categorized properties
 * @typedef {Object} CategorizedProperties
 * @property {Property[]} properties - List of properties in this category
 * @property {number} count - Number of properties in this category
 * @property {string} [label] - Optional display label for the category
 */
export type CategorizedProperties = {
    [key: string]: {
        properties: Property[];
        count: number;
        label?: string;
    };
};

/**
 * Type representing the keys of the PROPERTY_FIELDS object
 * @typedef {keyof typeof PROPERTY_FIELDS} PropertyFieldKey
 */
export type PropertyFieldKey = keyof typeof PROPERTY_FIELDS;

/**
 * Base validation schema for property data
 * @const {z.ZodObject}
 */
export const BasePropertySchema = z.object({
    /** Required field with validation */
    name: z.string().min(1, "Name is required"),
    /** Required field with validation */
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    /** Optional address line 2 */
    addressLine2: z.string().optional(),
    /** Required field with validation */
    city: z.string().min(1, "City is required"),
    /** Required field with validation */
    state: z.string().min(1, "State is required"),
    /** Required field with validation */
    postalCode: z.string().min(1, "Postal code is required"),
    /** Required field with validation */
    country: z.string().min(1, "Country is required"),
    /** Optional GPS coordinates */
    coordinates: z.string().optional(),
    /** Array of image metadata */
    images: z.array(ImagePickerAssetSchema).optional(),
    /** Array of room names */
    rooms: z.array(z.string()).optional(),
});

/**
 * Type representing the input data for creating a property
 * @typedef {z.infer<typeof BasePropertySchema>} PropertyInput
 */
export type PropertyInput = z.infer<typeof BasePropertySchema>;

/**
 * Extended schema for database records with metadata
 * @const {z.ZodObject}
 */
export const PropertyDBSchema = BasePropertySchema.extend({
    /** Unique identifier */
    id: z.string(),
    /** Creation timestamp */
    createdAt: z.string().datetime(),
    /** Optional update timestamp */
    updatedAt: z.string().datetime().optional(),
});

/**
 * Type representing a property as stored in the database
 * @typedef {z.infer<typeof PropertyDBSchema>} PropertyDB
 */
export type PropertyDB = z.infer<typeof PropertyDBSchema>;

/**
 * Combined property type for client-side usage
 * @typedef {PropertyInput & Partial<Pick<PropertyDB, "id" | "createdAt" | "updatedAt">>} Property
 */
export type Property = PropertyInput & Partial<Pick<PropertyDB, "id" | "createdAt" | "updatedAt">>;

/**
 * Type to control which property fields are optional
 * @typedef {Partial<Record<keyof Property, boolean>>} PropertyOptionalFields
 */
export type PropertyOptionalFields = Partial<Record<keyof Property, boolean>>;

/**
 * Validates partial property data against the schema
 * @param {Partial<Property>} data - Partial property data to validate
 * @returns {z.SafeParseReturnType<any, any>} - Zod validation result
 */
export const validateProperty = (data: Partial<Property>) => {
    // Handle any necessary data transformations before validation
    const submissionData = { ...data };

    return BasePropertySchema.safeParse(submissionData);
};

/**
 * Creates a custom validation schema with specified optional fields
 * @param {PropertyOptionalFields} [optionalFields={}] - Dictionary specifying which fields should be optional
 * @returns {z.ZodObject<any, any>} - Customized Zod validation schema
 */
export const createPropertyValidationSchema = (optionalFields: PropertyOptionalFields = {}) => {
    // Create a new schema by modifying field requirements
    const schema = z.object(
        Object.fromEntries(
            Object.entries(BasePropertySchema.shape).map(([key, validator]) => {
                // Check if field should be optional based on input parameter
                const isExplicitlyOptional =
                    key in optionalFields ? optionalFields[key as keyof Property] : false;

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
 * Type guard to check if a string is a valid property field key
 * @param {string} key - String to check
 * @returns {boolean} - True if key is a valid property field
 */
export const isPropertyFieldKey = (key: string): key is keyof Property => {
    return key in BasePropertySchema.shape;
};
