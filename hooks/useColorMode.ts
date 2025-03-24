import { useColorScheme } from "nativewind";
import { useEffect } from "react";

type ColorMode = "light" | "dark";

interface UseColorModeHook {
    colorMode: ColorMode;
    isDark: boolean;
    isLight: boolean;
    toggleColorMode: () => void;
    setColorMode: (mode: ColorMode) => void;
    nativeWindScheme: "light" | "dark" | undefined;
}

export default function useColorMode(): UseColorModeHook {
    const { colorScheme, setColorScheme } = useColorScheme();

    useEffect(() => {}, [colorScheme]);

    return {
        colorMode: colorScheme === "dark" ? "dark" : "light",
        isDark: colorScheme === "dark",
        isLight: colorScheme === "light",
        toggleColorMode: () => setColorScheme(colorScheme === "dark" ? "light" : "dark"),
        setColorMode: (mode: "light" | "dark") => setColorScheme(mode),
        nativeWindScheme: colorScheme, //nativewind original value
    };
}
