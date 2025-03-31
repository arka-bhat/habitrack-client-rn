import { ImageMetadata } from "./imageMetadata";

export interface Property {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    coordinates?: string;
    images: ImageMetadata[];
}

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
} as const;

export type PropertyFieldKey = keyof typeof PROPERTY_FIELDS;

export type PropertyFormAction =
    | { type: "UPDATE_FIELD"; field: keyof Property; value: string }
    | { type: "ADD_IMAGE"; image: string }
    | { type: "REMOVE_IMAGE"; index: number };
