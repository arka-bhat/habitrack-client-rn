// /** @type {import('tailwindcss').Config} */
import { Config } from "tailwindcss/types/config";

/** @type {Config} */
const config: Config = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    plugins: [],
    theme: {
        extend: {
            colors: {
                light: {
                    // General usage
                    fg: "#1A1A1A", // Main text color in light mode
                    background: "#F5F6FB", //"#F8F9FA", // Main background color in light mode

                    // Primary - Used for buttons, highlights, and key actions
                    primary: {
                        100: "#FFE6D5", // Lightest shade - Hover effects, background accents
                        200: "#FFC8A3",
                        300: "#FFA870",
                        400: "#FF8C42", // Default Primary Orange - Buttons, CTAs
                        500: "#E67329", // Slightly Darker - Active states
                        600: "#CC5C17",
                        700: "#B3470A",
                        800: "#8C3600",
                        900: "#662700", // Darkest - Rarely used, maybe for emphasis
                    },

                    // Secondary - Used for less prominent UI elements (borders, subtitles)
                    secondary: {
                        100: "#F1F3F5", // Very Light Gray - Backgrounds, disabled elements
                        150: "#E1E3E9",
                        200: "#D6DAE0",
                        300: "#BCC2CC",
                        400: "#A3ABB8",
                        500: "#6C757D", // Default Secondary Gray - Secondary text
                        600: "#5B636B",
                        650: "#777C8F",
                        700: "#4A5259",
                        800: "#383F45",
                        900: "#252A2F", // Darkest - Rarely used
                    },

                    // Tertiary - Used for links, secondary buttons, or alerts
                    tertiary: {
                        100: "#E0ECFF", // Lightest Blue - Background accents
                        200: "#BFD7FF",
                        300: "#99C2FF",
                        400: "#75ADFF",
                        500: "#4C9AFF", // Default Tertiary Blue - Links, icons
                        600: "#3D8BFF",
                        700: "#2E77E0",
                        800: "#1F64C2",
                        900: "#0F509E", // Darkest - Strong emphasis
                    },

                    muted: "#E0E0E0", // Used for dividers, disabled states, less emphasis
                },

                dark: {
                    // General usage
                    fg: "#EAEAEA", // Main text color in dark mode
                    background: "#18171D", //"#121212", // Main background color in dark mode

                    // Primary - Used for buttons, highlights, and key actions
                    primary: {
                        100: "#FFDCC2", // Lightest shade - Hover effects, background accents
                        200: "#FFBB8F",
                        300: "#FF9B5D",
                        400: "#FF7C35",
                        500: "#FF5E10", // Default Primary Orange - Buttons, CTAs
                        600: "#E65100", // Active states
                        700: "#B84300",
                        800: "#8C3600",
                        900: "#662700", // Darkest - Rarely used
                    },

                    // Secondary - Used for less prominent UI elements (borders, subtitles)
                    secondary: {
                        100: "#D4D6DA", // Very Light Gray - Backgrounds, disabled elements
                        200: "#B8BCC2",
                        300: "#9CA2A9",
                        400: "#808893",
                        500: "#646E7D", // Default Secondary Gray - Secondary text
                        600: "#4E5863",
                        700: "#3A424E",
                        750: "#2F2F37",
                        800: "#252D38",
                        850: "#202028",
                        900: "#111722", // Darkest - Rarely used
                    },

                    // Tertiary - Used for links, secondary buttons, or alerts
                    tertiary: {
                        100: "#CCDFFF", // Lightest Blue - Background accents
                        200: "#99C2FF",
                        300: "#66A3FF",
                        400: "#3384FF",
                        500: "#0070F3", // Default Tertiary Blue - Links, icons
                        600: "#005ECE",
                        700: "#0049A3",
                        800: "#00357A",
                        900: "#00214F",
                    },

                    muted: "#272727", // Used for dividers, disabled states, less emphasis
                },
            },
            fontFamily: {
                sans: ["SpaceGrotesk-Regular"],
                "base-bold": ["SpaceGrotesk-Bold"],
                "base-light": ["SpaceGrotesk-Light"],
                "base-medium": ["SpaceGrotesk-Medium"],
                "base-regular": ["SpaceGrotesk-Regular"],
                "base-semibold": ["SpaceGrotesk-SemiBold"],
            },
            opacity: {
                base: "0.54",
            },
        },
    },
};

export default config;
