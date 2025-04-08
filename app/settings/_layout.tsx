import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='logout' />
        </Stack>
    );
};

export default gestureHandlerRootHOC(Layout);
