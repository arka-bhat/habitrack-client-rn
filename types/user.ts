import { Asset } from "./asset";
import { ImageMetadata } from "./imageMetadata";
import { Property } from "./property";

export interface UserAccount {
    id: string;
    name: string;
    image: ImageMetadata;
    phoneNumber: string;
    authToken: string;
    properties: Property[]; // List of properties
    assets: Asset[]; // List of assets for one property
}

export const USER_FIELDS = {
    id: "id",
    name: "name",
    image: "image",
    phoneNumber: "phoneNumber",
    authToken: "authToken",
    properties: "properties",
    assets: "assets",
} as const;

export type UserFieldKey = keyof typeof USER_FIELDS;

export type UserFormAction =
    | {
          type: "UPDATE_FIELD";
          field: Exclude<keyof UserAccount, "properties" | "assets">;
          value: string;
      }
    | { type: "SET_PROPERTIES"; properties: Property[] }
    | { type: "SET_ASSETS"; assets: Asset[] }
    | { type: "RESET_USER" };
