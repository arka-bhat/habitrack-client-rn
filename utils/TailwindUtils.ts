// utils/colors.ts
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

// Types matching the Tailwind color config
type PrimaryColorShade = {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};

type SecondaryColorShade = {
    100: string;
    150: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    650: string;
    700: string;
    750: string;
    800: string;
    850: string;
    900: string;
};

type TertiaryColorShade = {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};

type ColorMode = {
    fg: string;
    background: string;
    primary: PrimaryColorShade;
    secondary: SecondaryColorShade;
    tertiary: TertiaryColorShade;
    muted: string;
};

type AppColors = {
    light: ColorMode;
    dark: ColorMode;
};

// Get the full config
const fullConfig = resolveConfig(tailwindConfig);

// Cast the colors to our type definition
export const colors = fullConfig.theme.colors as unknown as AppColors;

// Create a type-safe function to get colors based on mode
export const getColorsByMode = (mode: "light" | "dark"): ColorMode => {
    return colors[mode];
};

export const mergeClassNames = (...classes: (string | string[])[]): string => {
    const uniqueClasses = new Set<string>();

    classes.forEach((classString) => {
        if (classString) {
            if (Array.isArray(classString)) {
                classString.forEach((cls) => {
                    if (cls) uniqueClasses.add(cls);
                });
            } else {
                classString.split(" ").forEach((cls) => {
                    if (cls) uniqueClasses.add(cls);
                });
            }
        }
    });

    return [...uniqueClasses].join(" ");
};
