import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/utils/TailwindUtils";

export default function Layout() {
    const { colorScheme } = useColorScheme();
    const colorMode = colorScheme === "dark" ? "dark" : "light";

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // Use your tailwind colors for active and inactive states
                tabBarActiveTintColor: colors[colorMode].primary[400], // Primary color
                tabBarInactiveTintColor: colors[colorMode].secondary[500], // Secondary muted color
                tabBarStyle: {
                    backgroundColor: colors[colorMode].background, // Background color
                    borderTopColor: colors[colorMode].muted, // Border color
                },
                tabBarButton: (props) => (
                    <Pressable
                        {...props}
                        android_ripple={null} // This disables the ripple effect
                        android_disableSound={true} // Optional: also disables the sound
                        style={props.style}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name='dashboard'
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='home-outline' size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='alerts'
                options={{
                    title: "Alerts",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='notifications-outline' size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name='settings-outline' size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
