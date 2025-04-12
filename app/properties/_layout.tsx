import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='[id]' />
            <Stack.Screen name='allProperties' />
            <Stack.Screen name='add' />
            <Stack.Screen name='update' />
        </Stack>
    );
};

export default gestureHandlerRootHOC(Layout);
