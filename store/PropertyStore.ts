import _ from "lodash";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

import { mockCreatePropertyAPI, mockUpdatePropertyAPI } from "@/services/property";
import { Property, CategorizedProperties } from "@/types/property";

/**
 * Storage instance for property data
 * @const {MMKV}
 */
const propertyStorage = new MMKV({ id: "property-storage" });

/**
 * Custom storage implementation for Zustand persist middleware
 * @const {Object}
 */
const zustandStorage = {
    /**
     * Gets an item from storage by name
     * @param {string} name - Storage key
     * @returns {string|null} - The stored value or null if not found
     */
    getItem: (name: string): string | null => {
        const value = propertyStorage.getString(name);
        return value !== undefined ? value : null;
    },

    /**
     * Sets an item in storage
     * @param {string} name - Storage key
     * @param {string} value - Value to store
     */
    setItem: (name: string, value: string): void => {
        propertyStorage.set(name, value);
    },

    /**
     * Removes an item from storage
     * @param {string} name - Storage key to remove
     */
    removeItem: (name: string): void => {
        propertyStorage.delete(name);
    },
};

/**
 * Options for getPropertiesByCountry function
 * @interface PropertiesByCountryOptions
 */
interface PropertiesByCountryOptions {
    /** If true, only returns countries with at least one property */
    onlyNonEmpty?: boolean;
}

/**
 * Property store state and actions
 * @interface PropertyStore
 */
type PropertyStore = {
    /** Indicates if the store has been hydrated from persistent storage */
    isHydrated: boolean;

    /** List of all properties */
    properties: Property[];

    /** Map of properties by ID for O(1) lookups */
    propertiesMap: Record<string, Property>;

    /** Currently selected property */
    currentProperty: Property | null;

    /**
     * Creates a new property
     * @param {Property} data - Property data to save
     * @returns {Promise<boolean>} - Success indicator
     */
    saveProperty: (data: Property) => Promise<boolean>;

    /**
     * Updates an existing property
     * @param {string} id - Property ID
     * @param {Property} data - Updated property data
     * @returns {Promise<boolean>} - Success indicator
     */
    updateProperty: (id: string, data: Property) => Promise<boolean>;

    /**
     * Deletes a property
     * @param {string} id - Property ID to delete
     * @returns {Promise<boolean>} - Success indicator
     */
    deleteProperty: (id: string) => Promise<boolean>;

    /**
     * Loads properties from storage
     * @returns {Promise<void>}
     */
    loadProperties: () => Promise<void>;

    /**
     * Gets a property by ID with O(1) lookup
     * @param {string|null|undefined} id - Property ID
     * @returns {Property|undefined} - The property or undefined if not found
     */
    getPropertyById: (id: string | null | undefined) => Property | undefined;

    /**
     * Gets all properties as a flat list
     * @returns {Property[]} - List of all properties
     */
    getAllProperties: () => Property[];

    /**
     * Gets all rooms for a specific property in a format suitable for dropdown selection
     * @param {string|null|undefined} id - Property ID
     * @returns {Array<{label: string, value: string}>} - List of rooms with label/value format
     */
    getAllRooms: (id: string | null | undefined) => Array<{ label: string; value: string }>;

    /**
     * Sets the current active property for the session
     * @function
     * @param {Property} property - The property to set as current
     * @example
     * setCurrentProperty(selectedProperty);
     */
    setCurrentProperty: (property: Property) => void;

    /**
     * Clears the current active property
     * @function
     * @example
     * clearCurrentProperty();
     */
    clearCurrentProperty: () => void;
};

/**
 * Create and export the property store with persistence
 * @const {Object}
 */
export const usePropertyStore = create<PropertyStore>()(
    persist(
        (set, get) => ({
            isHydrated: false,

            // Business Data
            properties: [],
            propertiesMap: {},
            currentProperty: null,

            saveProperty: async (data: Property): Promise<boolean> => {
                try {
                    const newProperty = await mockCreatePropertyAPI(data);

                    // Update both array and map atomically for consistency
                    set((state) => {
                        const newMap = { ...state.propertiesMap };
                        // Ensure the id exists and is a valid key
                        if (newProperty && newProperty.id) {
                            newMap[newProperty.id] = newProperty;
                        }

                        return {
                            properties: [...state.properties, newProperty],
                            propertiesMap: newMap,
                        };
                    });
                    return true;
                } catch (error) {
                    console.error("Save failed:", error);
                    return false;
                }
            },

            updateProperty: async (id: string, data: Property): Promise<boolean> => {
                // Early validation prevents unnecessary API calls
                if (!id) return false;

                try {
                    const updatedProperty = await mockUpdatePropertyAPI(id, data);

                    // Updates both array and map in a single state update
                    set((state) => {
                        const newMap = { ...state.propertiesMap };
                        // Using string key to avoid computed property issue
                        newMap[id] = updatedProperty;

                        return {
                            properties: state.properties.map((property) =>
                                property.id === id ? updatedProperty : property
                            ),
                            propertiesMap: newMap,
                        };
                    });
                    return true;
                } catch (error) {
                    console.error("Update failed:", error);
                    return false;
                }
            },

            deleteProperty: async (id: string): Promise<boolean> => {
                // Early validation prevents unnecessary operations
                if (!id) return false;

                // Single atomic update for both data structures
                set((state) => {
                    const newPropertiesMap = { ...state.propertiesMap };
                    // Safe delete operation that works even if the key doesn't exist
                    delete newPropertiesMap[id];

                    return {
                        properties: state.properties.filter((property) => property.id !== id),
                        propertiesMap: newPropertiesMap,
                    };
                });
                return true;
            },

            loadProperties: async (): Promise<void> => {
                const stored = zustandStorage.getItem("properties");
                if (stored) {
                    const parsedProperties = JSON.parse(stored);

                    // Build index map in O(n) time for future O(1) lookups
                    const propertiesMap = parsedProperties.reduce(
                        (map: Record<string, Property>, property: Property) => {
                            // Ensure the id exists
                            if (property && property.id) {
                                map[property.id] = property;
                            }
                            return map;
                        },
                        {} as Record<string, Property>
                    );
                    set({ properties: parsedProperties, propertiesMap });
                }
            },

            getPropertyById: (id: string | null | undefined): Property | undefined => {
                // O(1) lookup instead of O(n) array traversal
                if (!id) return undefined;
                return get().propertiesMap[id];
            },

            getAllProperties: (): Property[] => {
                // Return all properties as a flat list
                return get().properties;
            },

            getAllRooms: (
                id: string | null | undefined
            ): Array<{ label: string; value: string }> => {
                // Early validation prevents unnecessary operations
                if (!id) return [];

                const property = get().propertiesMap[id];

                // If property not found or rooms not defined, return empty array
                if (!property || !property.rooms) return [];

                // Convert string array to label/value format
                return property.rooms.map((room) => ({
                    label: room,
                    value: room,
                }));
            },

            setCurrentProperty: (property) => set({ currentProperty: property }),
            clearCurrentProperty: () => set({ currentProperty: null }),
        }),
        {
            name: "property-storage",
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => _.omit(state, ["currentProperty"]),

            onRehydrateStorage:
                () =>
                (state?: PropertyStore): void => {
                    if (state) {
                        state.isHydrated = true;

                        // Ensures data consistency after rehydration
                        if (
                            state.properties &&
                            (!state.propertiesMap || Object.keys(state.propertiesMap).length === 0)
                        ) {
                            state.propertiesMap = state.properties.reduce((map, property) => {
                                if (property && property.id) {
                                    map[property.id] = property;
                                }
                                return map;
                            }, {} as Record<string, Property>);
                        }
                    }
                },
        }
    )
);
