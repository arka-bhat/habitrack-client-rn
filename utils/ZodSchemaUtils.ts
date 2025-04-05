import assetCategories from "@/constants/AssetCategories";
import { usePropertyStore } from "@/store/PropertyStore";

export type AssetCategory = (typeof assetCategories)[number]["value"];

// Create zod enum (better approach)
export const assetCategoryValues = assetCategories.map((c) => c.value);

/**
 * Gets available room values from a property
 * @param {string|null|undefined} propertyId - Property ID to get rooms from
 * @returns {string[]} - Array of room values
 */
export const getAvailableRoomValues = (propertyId: string | null | undefined): string[] => {
    if (!propertyId) return [];

    const roomOptions = usePropertyStore.getState().getAllRooms(propertyId);
    return roomOptions.map((room) => room.value);
};
