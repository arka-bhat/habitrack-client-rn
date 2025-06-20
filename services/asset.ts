import type { AssetDB, AssetInput } from "@/types/asset";

export const mockCreateAssetAPI = async (
    propertyId: string,
    data: AssetInput
): Promise<AssetDB> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...data,
                id: `mock-${Date.now()}`, // Simulated server-generated ID
                propertyId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }, 800); // 800ms delay to simulate network latency
    });
};

export const mockUpdateAssetAPI = async (
    assetId: string,
    propertyId: string,
    data: AssetInput
): Promise<AssetDB> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...data,
                id: assetId,
                propertyId,
                createdAt: "2023-01-01T00:00:00Z", // Mock existing created date
                updatedAt: new Date().toISOString(),
            });
        }, 800); // Consistent 800ms delay
    });
};
