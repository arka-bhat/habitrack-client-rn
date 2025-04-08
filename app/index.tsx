import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import { Text, Pressable, ActivityIndicator, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colorScheme, useColorScheme } from "nativewind";

import { LangCode, initalizeI18Next } from "@/i18n";
import { mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import i18next from "i18next";
import { useAuthStore } from "@/store/AuthStore";
import { useUserStore } from "@/store/UserStore";

const theme = process.env.COLOR_THEME as "light" | "dark" | "system" | undefined;
colorScheme.set(theme || "system");

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(console.warn);

// Set the animation options. This is optional.
SplashScreen.setOptions({
    duration: 400,
    fade: true,
});

const Main = () => {
    const [appIsReady, setAppIsReady] = useState(false);
    const [i18nReady, setI18nReady] = useState(false);
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { hydrate, userLanguage } = useUserStore();

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                await Promise.all([
                    Font.loadAsync({
                        "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
                        "SpaceGrotesk-Light": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
                        "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
                        "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
                        "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
                    }),
                    useAuthStore.persist.rehydrate(),
                    useUserStore.persist.rehydrate(),
                ]);

                // await hydrateUser();
                // await hydrateAuth();

                // Add a small delay to ensure the hydration is processed
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Now initialize i18n with whatever language we've got
                const currentLang = useUserStore.getState().userLanguage || LangCode.en;
                await initalizeI18Next(currentLang);
                setI18nReady(true);

                const { token, isHydrated } = useAuthStore.getState();
                const { onboarding } = useUserStore.getState();

                setTimeout(() => {
                    if (token) {
                        router.replace("/home");
                    } else {
                        switch (onboarding.stage) {
                            case "user_registration":
                                router.replace("/auth/onboarding/userRegistration");
                                break;
                            case "property_registration":
                                router.replace("/auth/onboarding/propertyRegistration");
                                break;
                            case "complete":
                                router.replace("/home");
                                break;
                            default:
                                router.replace("/auth/phoneInput");
                        }
                    }
                }, 1000);
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
        if (appIsReady && i18nReady) {
            console.log("Language ", userLanguage);
            //     setTimeout(() => {
            //         if (token) {
            //             router.replace("/home");
            //         } else {
            //             switch (onboarding.stage) {
            //                 case "user_registration":
            //                     router.replace("/auth/onboarding/userRegistration");
            //                     break;
            //                 case "property_registration":
            //                     router.replace("/auth/onboarding/propertyRegistration");
            //                     break;
            //                 case "complete":
            //                     router.replace("/home");
            //                     break;
            //                 default:
            //                     router.replace("/auth/phoneInput");
            //             }
            //         }
            //     }, 1000);
        }
    }, [appIsReady, i18nReady]);

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

            <Pressable onPress={toggleColorScheme}>
                <Text className={mergeClassNames("text-lg font-base-bold", textColors)}>
                    Current theme: {colorScheme} Current lang: {userLanguage}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default Main;
