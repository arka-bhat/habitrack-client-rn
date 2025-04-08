import { z } from "zod";
import { ImagePickerAssetSchema } from "./imageMetadata";
import { LangCode } from "@/i18n"; // Your language enum

/**
 * Constants for user field names
 * @readonly
 */
export const USER_FIELDS = {
    id: "id",
    name: "name",
    phoneNumber: "phoneNumber",
    image: "image",
    language: "language",
    verified: "verified",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
} as const;

/**
 * Type representing the keys of the USER_FIELDS object
 * @typedef {keyof typeof USER_FIELDS} UserFieldKey
 */
export type UserFieldKey = keyof typeof USER_FIELDS;

/**
 * Base validation schema for user data
 * @const {z.ZodObject}
 */
export const BaseUserSchema = z.object({
    /** Required field with validation */
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email").optional(),
    /** Required field with validation */
    phoneNumber: z.string().min(10, "Phone number must be 10 digits"),
    /** Optional profile image */
    image: ImagePickerAssetSchema.optional(),
    /** Language preference */
    language: z.nativeEnum(LangCode).default(LangCode.en),
    /** Verification status */
    verified: z.boolean().default(false),
    plan: z.enum(["free", "premium"]).default("free"),
});

/**
 * Extended schema for database records
 * @const {z.ZodObject}
 */
export const UserDBSchema = BaseUserSchema.extend({
    id: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

/**
 * Type representing the input data for creating/updating a user
 * @typedef {z.infer<typeof BaseUserSchema>} UserInput
 */
export type UserInput = z.infer<typeof BaseUserSchema>;

/**
 * Type representing a user as stored in the database
 * @typedef {z.infer<typeof UserDBSchema>} UserDB
 */
export type UserDB = z.infer<typeof UserDBSchema>;

/**
 * Combined user type for client-side usage
 * @typedef {UserInput & Partial<Pick<UserDB, "createdAt" | "updatedAt">>} UserProfile
 */
export type UserProfile = UserInput & Partial<Pick<UserDB, "createdAt" | "updatedAt">>;

/**
 * Type to control which user fields are optional
 * @typedef {Partial<Record<keyof UserProfile, boolean>>} UserOptionalFields
 */
export type UserOptionalFields = Partial<Record<keyof UserProfile, boolean>>;

/**
 * Validates partial user data against the schema
 * @param {Partial<UserProfile>} data - Partial user data to validate
 * @returns {z.SafeParseReturnType<any, any>} - Zod validation result
 */
export const validateUser = (data: Partial<UserProfile>) => {
    return BaseUserSchema.safeParse(data);
};

/**
 * Creates a custom validation schema with specified optional fields
 * @param {UserOptionalFields} [optionalFields={}] - Dictionary specifying which fields should be optional
 * @returns {z.ZodObject<any, any>} - Customized Zod validation schema
 */
export const createUserValidationSchema = (optionalFields: UserOptionalFields = {}) => {
    return z.object(
        Object.fromEntries(
            Object.entries(BaseUserSchema.shape).map(([key, validator]) => {
                const isOptional = optionalFields[key as keyof UserProfile] ?? false;
                return isOptional ? [key, validator.optional()] : [key, validator];
            })
        )
    );
};

/**
 * Type guard to check if a string is a valid user field key
 * @param {string} key - String to check
 * @returns {boolean} - True if key is a valid user field
 */
export const isUserFieldKey = (key: string): key is UserFieldKey => {
    return key in BaseUserSchema.shape;
};

// Schema for API responses
export const UserResponseSchema = UserDBSchema.omit({
    verified: true,
}).extend({
    properties: z.array(z.string()).optional(), // Array of property IDs
});

/**
 * Type representing API response with nested properties
 * @typedef {z.infer<typeof UserResponseSchema>} UserResponse
 */
export type UserResponse = z.infer<typeof UserResponseSchema>;
