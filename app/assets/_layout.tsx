import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='addOrUpdateAsset' />
            <Stack.Screen name='deleteAsset' />
        </Stack>
    );
};

export default gestureHandlerRootHOC(Layout);
