import { ExpoConfig } from "expo/config";

const environment = process.env.NODE_ENV || "development";

const config: ExpoConfig = {
    name: environment === "production" ? "HabiTrack" : "HabiTrack (Dev)",
    slug: "habitrack",
    scheme: "habitrack",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.arkabhat.habitrack",
        icon: {
            light: "./assets/icons/ios-light.png",
            dark: "./assets/icons/ios-dark.png",
            tinted: "./assets/icons/ios-tinted.png",
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/icons/adaptive-icon.png",
            monochromeImage: "./assets/icons/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        softwareKeyboardLayoutMode: "pan",
        package: "com.arkabhat.habitrack",
    },
    web: {
        bundler: "metro",
        favicon: "./assets/icons/favicon.png",
    },
    plugins: [
        "expo-router",
        "expo-localization",
        [
            "expo-splash-screen",
            {
                image: "./assets/icons/splash-icon-dark.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#F5F6FB",
                _comment: "same as bg light background from tailwind config",
                dark: {
                    image: "./assets/icons/splash-icon-light.png",
                    backgroundColor: "#18171D",
                    _comment: "same as bg dark background from tailwind config",
                },
            },
        ],
        [
            "expo-location",
            {
                locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
            },
        ],
        [
            "expo-notifications",
            {
                icon: "./assets/icons/ios-light.png",
                color: "#F5F6FB",
                defaultChannel: "default",
                sounds: [],
                enableBackgroundRemoteNotifications: false,
            },
        ],
        [
            "expo-image-picker",
            {
                photosPermission: "Allow $(PRODUCT_NAME) to access your photos",
                cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
            },
        ],
    ],
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: "8f3520e8-26fb-4f40-982d-31d547ed80a9",
        },
    },
};

export default config;
