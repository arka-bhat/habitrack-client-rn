import { Stack } from "expo-router";

const AuthLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='userRegistration' />
            <Stack.Screen name='propertyRegistration' />
        </Stack>
    );
};

export default AuthLayout;
