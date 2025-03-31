import _ from "lodash";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

import { mockCreateAssetAPI, mockUpdateAssetAPI } from "@/services/asset";
import { Asset, CategorizedAssets } from "@/types/asset";

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
    // Business Data
    assets: Asset[];
    currentAsset: Asset | null;

    // API Operations
    saveAsset: (data: Asset) => Promise<boolean>;
    updateAsset: (id: string, data: Asset) => Promise<boolean>;
    deleteAsset: (id: string) => Promise<boolean>;
    loadAssets: () => Promise<void>;

    // Utilities
    getAssetById: (id: string) => Asset | undefined;
    getAssetsByLocation: (options?: AssetsByLocationOptions) => CategorizedAssets;
};

export const useAssetStore = create<AssetStore>()(
    persist(
        (set, get) => ({
            isHydrated: false,

            // Business Data
            assets: [],
            currentAsset: null,

            // API Operations
            saveAsset: async (data) => {
                try {
                    const newAsset = await mockCreateAssetAPI(data);
                    set((state) => ({ assets: [...state.assets, newAsset] }));
                    return true;
                } catch (error) {
                    console.error("Save failed:", error);
                    return false;
                }
            },

            updateAsset: async (id, data) => {
                try {
                    const updatedAsset = await mockUpdateAssetAPI(id, data);
                    set((state) => ({
                        assets: state.assets.map((a) => (a.id === id ? updatedAsset : a)),
                    }));
                    return true;
                } catch (error) {
                    console.error("Update failed:", error);
                    return false;
                }
            },

            deleteAsset: async (id) => {
                set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }));
                return true;
            },

            loadAssets: async () => {
                const stored = zustandStorage.getItem("assets");
                console.log("Loading assets from storage:", stored);
                if (stored) set({ assets: JSON.parse(stored) });
            },

            // Utilities
            getAssetById: (id) => get().assets.find((a) => a.id === id),

            getAssetsByLocation: (options?: AssetsByLocationOptions): CategorizedAssets => {
                const assets = get().assets;
                const grouped = _.groupBy(
                    assets,
                    (asset) => asset.location || "Unspecified Location"
                );

                return Object.entries(grouped).reduce((acc, [location, locationAssets]) => {
                    if (options?.onlyNonEmpty && locationAssets.length === 0) return acc;

                    acc[location] = {
                        assets: locationAssets,
                        count: locationAssets.length,
                        label: location, // Raw location as label
                    };
                    return acc;
                }, {} as CategorizedAssets);
            },
        }),
        {
            name: "asset-storage",
            storage: createJSONStorage(() => zustandStorage),
            onRehydrateStorage: () => (state) => {
                state!.isHydrated = true;
            },
        }
    )
);
