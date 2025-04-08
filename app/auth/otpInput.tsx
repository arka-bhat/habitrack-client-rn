import { useState, useEffect } from "react";
import { View, StatusBar, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView, KeyboardProvider } from "react-native-keyboard-controller";
import { router } from "expo-router";
import { useAuthStore } from "@/store/AuthStore"; // Import your auth store

import OTPInput from "@/components/OTPInput";
import { mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";

const OTPVerificationScreen = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [countdown, setCountdown] = useState(60);
    const {
        otpPhoneNumber,
        otpCooldownExpires,
        startOTPCountdown,
        resetOTPState,
        recordOTPAttempt,
        verifyOTP,
        otpAttempts,
    } = useAuthStore();

    useEffect(() => {
        if (otpPhoneNumber) {
            startOTPCountdown(otpPhoneNumber);
        }
    }, []);

    useEffect(() => {
        if (!otpCooldownExpires) {
            setCountdown(0);
            return;
        }

        // Calculate initial remaining time
        const updateCountdown = () => {
            const remaining = Math.max(0, Math.ceil((otpCooldownExpires - Date.now()) / 1000));
            setCountdown(remaining);
            return remaining;
        };

        // Set initial value
        let remaining = updateCountdown();

        // Only start interval if there's time remaining
        if (remaining > 0) {
            const timer = setInterval(() => {
                remaining = updateCountdown();
                if (remaining <= 0) {
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [otpCooldownExpires]);

    const handleVerify = async (code: string): Promise<void> => {
        if (!code || code.length !== 6) {
            alert("Please enter the complete 6-digit code");
            return;
        }

        try {
            const success = await verifyOTP(code);
            if (success) {
                router.push("/auth/onboarding/userRegistration");
            } else {
                recordOTPAttempt();
                alert("Invalid verification code");
            }
        } catch (error) {
            alert("Verification failed. Please try again.");
        }
    };

    const handleResendCode = async (): Promise<void> => {
        if (countdown > 0) return;

        if (otpAttempts == 5) {
            alert("You have reached the maximum number of attempts. Please try again later.");
            return;
        }
        if (otpPhoneNumber) {
            await startOTPCountdown(otpPhoneNumber);
            // Call your API to resend OTP here
            alert("New verification code sent!");
        }
    };

    const handleChangeNumber = (): void => {
        resetOTPState();
        router.back();
    };

    return (
        <SafeAreaView className={mergeClassNames("flex-1", backgroundColors)}>
            <StatusBar barStyle='default' />
            <KeyboardProvider>
                <KeyboardAwareScrollView className='flex-1' bottomOffset={62}>
                    <View className='flex-1 px-6 py-8'>
                        {/* Header */}
                        <View className='mb-8'>
                            <Text
                                className={mergeClassNames(
                                    "mb-2 text-2xl font-base-bold",
                                    textColors
                                )}
                            >
                                Phone Verification
                            </Text>
                            <Text className='text-light-secondary-500 dark:text-dark-secondary-400 text-base'>
                                Enter the 6-digit code sent to {otpPhoneNumber}
                            </Text>
                        </View>

                        {/* OTP Input */}
                        <View className='flex-row justify-between mb-6'>
                            <OTPInput
                                keyboardType='number-pad'
                                length={6}
                                onCodeFilled={handleVerify}
                                containerClassName='mb-6'
                                inputClassName='w-12 h-12 bg-light-secondary-100 dark:bg-dark-secondary-800 
                                    border-light-secondary-200 dark:border-dark-secondary-700 
                                    text-light-fg dark:text-dark-fg rounded-lg'
                            />
                        </View>

                        {/* Resend Code */}
                        <Pressable
                            className='items-center mb-6'
                            onPress={handleResendCode}
                            disabled={countdown > 0}
                        >
                            <Text
                                className={`font-base-medium ${
                                    countdown > 0
                                        ? "text-light-secondary-400 dark:text-dark-secondary-500"
                                        : "text-light-primary-400 dark:text-dark-primary-400"
                                }`}
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                            </Text>
                        </Pressable>

                        {/* Change number */}
                        <Pressable className='items-center mb-6' onPress={handleChangeNumber}>
                            <Text className='font-base-medium text-light-primary-400 dark:text-dark-primary-400'>
                                Change your number
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default OTPVerificationScreen;
