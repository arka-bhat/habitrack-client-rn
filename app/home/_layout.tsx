import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useColorMode from "@/hooks/useColorMode";
import { colors } from "@/utils/TailwindUtils";

export default function Layout() {
    const { colorMode } = useColorMode();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors[colorMode].primary[400],
                tabBarInactiveTintColor: colors[colorMode].secondary[500],
                tabBarStyle: {
                    backgroundColor: colors[colorMode].background,
                    borderTopColor: colors[colorMode].muted,
                },
                tabBarButton: (props) => (
                    <Pressable
                        {...props}
                        android_ripple={null}
                        android_disableSound={true}
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
