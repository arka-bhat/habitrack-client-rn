import { Stack } from "expo-router";

const AuthLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='phoneInput' />
            <Stack.Screen name='otpInput' />
            <Stack.Screen name='onboarding' />
        </Stack>
    );
};

export default AuthLayout;
