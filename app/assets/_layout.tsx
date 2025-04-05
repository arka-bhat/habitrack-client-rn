import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='[id]' />
            <Stack.Screen name='addOrUpdate' />
            <Stack.Screen name='delete' />
        </Stack>
    );
};

export default gestureHandlerRootHOC(Layout);
