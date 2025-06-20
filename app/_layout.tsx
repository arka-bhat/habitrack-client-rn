import "../global.css";

import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='auth' />
            <Stack.Screen name='home' />
            <Stack.Screen name='user' />
            <Stack.Screen name='assets' />
            <Stack.Screen name='properties' />
        </Stack>
    );
};

export default gestureHandlerRootHOC(Layout);
