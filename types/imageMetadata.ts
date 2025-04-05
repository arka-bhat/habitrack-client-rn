import { z } from "zod";
import { ImagePickerAsset } from "expo-image-picker";

/**
 * Zod schema for ImagePickerAsset validation
 * @const {z.ZodObject}
 */
export const ImagePickerAssetSchema: z.ZodType<ImagePickerAsset> = z.object({
    uri: z.string(),
    assetId: z.string().nullable().optional(),
    width: z.number(),
    height: z.number(),
    type: z.enum(["image", "video", "livePhoto", "pairedVideo"]).optional(),
    fileName: z.string().nullable().optional(),
    fileSize: z.number().optional(),
    exif: z.record(z.any()).nullable().optional(),
    base64: z.string().nullable().optional(),
    duration: z.number().nullable().optional(),
    mimeType: z.string().optional(),
    pairedVideoAsset: z.lazy(() => ImagePickerAssetSchema.nullable().optional()),
    file: z.any().optional(), // Using any for File type since it's a complex browser API type
});
