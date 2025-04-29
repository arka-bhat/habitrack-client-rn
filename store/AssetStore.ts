import _ from "lodash";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

import { mockCreateAssetAPI, mockUpdateAssetAPI } from "@/services/asset";
import { Asset, AssetInput, CategorizedAssets } from "@/types/asset";
import { usePropertyStore } from "./PropertyStore";

const assetStorage = new MMKV({ id: "asset-storage" });

const zustandStorage = {
    getItem: (name: string): string | null => {
        const value = assetStorage.getString(name);
        return value !== undefined ? value : null;
    },

    setItem: (name: string, value: string): void => {
        assetStorage.set(name, value);
    },

    removeItem: (name: string): void => {
        assetStorage.delete(name);
    },
};

interface AssetsByLocationOptions {
    onlyNonEmpty?: boolean;
}

type AssetStore = {
    isHydrated: boolean;
    assets: Asset[];
    assetsMap: Record<string, Asset>;
    currentAsset: Asset | null;

    /**
     * Creates a new asset linked to the current property
     * @param {Omit<AssetInput, 'propertyId'>} data - Asset data without propertyId
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} When no current property is set
     */
    saveAsset: (data: Omit<AssetInput, "propertyId">) => Promise<boolean>;

    /**
     * Updates an existing asset while maintaining its property association
     * @param {string} id - ID of the asset to update
     * @param {Omit<AssetInput, 'propertyId'>} data - New asset data
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} When no current property is set
     */
    updateAsset: (id: string, data: Omit<AssetInput, "propertyId">) => Promise<boolean>;

    /**
     * Deletes an asset
     * @param {string} id - Asset ID to delete
     * @returns {Promise<boolean>} True if successful
     */
    deleteAsset: (id: string) => Promise<boolean>;

    /**
     * Loads assets from storage
     * @returns {Promise<void>}
     */
    loadAssets: () => Promise<void>;

    /**
     * Gets an asset by ID with O(1) lookup
     * @param {string|null|undefined} id - Asset ID
     * @returns {Asset|undefined} The asset or undefined if not found
     */
    getAssetById: (id: string | null | undefined) => Asset | undefined;

    /**
     * Gets assets grouped by rooms for the current property
     * @returns {CategorizedAssets} Assets grouped by rooms
     * @throws {Error} When no current property is set
     */
    getAssetsByRooms: () => CategorizedAssets;

    /**
     * Gets all assets belonging to the current property
     * @returns {Asset[]} Array of assets
     * @throws {Error} When no current property is set
     */
    getAssetsForCurrentProperty: () => Asset[];
};

export const useAssetStore = create<AssetStore>()(
    persist(
        (set, get) => {
            const getCurrentPropertyId = () => {
                const property = usePropertyStore.getState().currentProperty;
                if (!property) return "1";
                return property.id;
            };

            return {
                isHydrated: false,
                assets: [],
                assetsMap: {},
                currentAsset: null,

                saveAsset: async (data) => {
                    try {
                        const propertyId = getCurrentPropertyId();
                        const newAsset = await mockCreateAssetAPI(propertyId!, data);

                        set((state) => ({
                            assets: [...state.assets, newAsset],
                            assetsMap: { ...state.assetsMap, [newAsset.id]: newAsset },
                        }));
                        return true;
                    } catch (error) {
                        console.error("Save failed:", error);
                        return false;
                    }
                },

                updateAsset: async (id, data) => {
                    if (!id) return false;

                    try {
                        const propertyId = getCurrentPropertyId();
                        const updatedAsset = await mockUpdateAssetAPI(id, propertyId!, data);

                        set((state) => ({
                            assets: state.assets.map((asset) =>
                                asset.id === id ? updatedAsset : asset
                            ),
                            assetsMap: { ...state.assetsMap, [id]: updatedAsset },
                        }));
                        return true;
                    } catch (error) {
                        console.error("Update failed:", error);
                        return false;
                    }
                },

                deleteAsset: async (id) => {
                    if (!id) return false;

                    set((state) => {
                        const newAssetsMap = { ...state.assetsMap };
                        delete newAssetsMap[id];

                        return {
                            assets: state.assets.filter((asset) => asset.id !== id),
                            assetsMap: newAssetsMap,
                        };
                    });
                    return true;
                },

                loadAssets: async () => {
                    const stored = zustandStorage.getItem("assets");
                    if (stored) {
                        const parsedAssets = JSON.parse(stored);
                        const assetsMap = parsedAssets.reduce(
                            (map: Record<string, Asset>, asset: Asset) => {
                                if (asset?.id) map[asset.id] = asset;
                                return map;
                            },
                            {}
                        );
                        set({ assets: parsedAssets, assetsMap });
                    }
                },

                getAssetById: (id) => {
                    if (!id) return undefined;
                    return get().assetsMap[id];
                },

                getAssetsByRooms: () => {
                    const propertyId = getCurrentPropertyId();
                    const propertyAssets = get().assets.filter((a) => a.propertyId === propertyId);
                    const grouped = _.groupBy(
                        propertyAssets,
                        (asset) => asset.room || "Unspecified Room"
                    );

                    return Object.entries(grouped).reduce((acc, [room, assets]) => {
                        acc[room] = {
                            assets,
                            count: assets.length,
                            label: room,
                        };
                        return acc;
                    }, {} as CategorizedAssets);
                },

                getAssetsForCurrentProperty: () => {
                    const propertyId = getCurrentPropertyId();
                    return get().assets.filter((a) => a.propertyId === propertyId);
                },
            };
        },
        {
            name: "asset-storage",
            storage: createJSONStorage(() => zustandStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;
                    if (state.assets && _.isEmpty(state.assetsMap)) {
                        state.assetsMap = _.keyBy(state.assets, "id");
                    }
                }
            },
        }
    )
);
