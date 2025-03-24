import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import { Text, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colorScheme, useColorScheme } from "nativewind";

import i18nConfig from "@i18n/i18n";
import { mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import i18next from "i18next";

const theme = process.env.COLOR_THEME as "light" | "dark" | "system" | undefined;
colorScheme.set(theme || "system");

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 400,
    fade: true,
});

const Main = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const { colorScheme, toggleColorScheme } = useColorScheme();

    const initI18N = () => {
        i18nConfig.initalizeI18Next();
    };

    const viewLogin = false;

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync({
                    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
                    "SpaceGrotesk-Light": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
                    "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
                    "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
                    "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
                });

                initI18N();
                i18next.changeLanguage("en");
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady) {
            setTimeout(() => {
                if (viewLogin) {
                    router.replace("/auth/phoneInput");
                } else {
                    router.replace("/home");
                }
            }, 1000);
        }
    }, [appIsReady]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return (
            <SafeAreaView
                className={mergeClassNames("flex-1 justify-center items-center", backgroundColors)}
            >
                <ActivityIndicator size='large' color='#000' />
            </SafeAreaView>
        );
        return null;
    }

    return (
        <SafeAreaView
            className={mergeClassNames("flex-1 justify-center items-center", backgroundColors)}
            onLayout={onLayoutRootView}
        >
            <StatusBar barStyle='default' />
            <Text className={mergeClassNames("text-5xl font-base-bold", textColors)}>
                HabiTrack
            </Text>

            <TouchableOpacity onPress={toggleColorScheme}>
                <Text className={mergeClassNames("text-lg font-base-bold", textColors)}>
                    Current theme: {colorScheme}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Main;
