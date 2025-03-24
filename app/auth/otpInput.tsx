import { useState } from "react";
import {
    View,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView, KeyboardProvider } from "react-native-keyboard-controller";
import { router } from "expo-router";

import OTPInput from "@components/OTPInput";
import { resetAndNavigate } from "@utils/NavigationHelpers";
import { mergeClassNames } from "@utils/TailwindUtils";
import { backgroundColors, textColors } from "@constants/TailwindClassNameConstants";

const OTPVerificationScreen = () => {
    const [verificationCode, setVerificationCode] = useState("");

    const handleVerify = (code: string): void => {
        // Validate code and proceed
        setVerificationCode(code);
        console.log("OTP Code:", code);
        if (!code || code.length !== 6) {
            alert("Please enter the complete 6-digit code");
            return;
        }
        resetAndNavigate("/home/dashboard");
    };

    const handleResendCode = (): void => {
        alert("Code re-sent to your number!");
        console.log("resend code");
    };

    const handleChangeNumber = (): void => {
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
                                Enter the 6 digit verification code sent to your phone number
                            </Text>
                        </View>

                        {/* OTP Input */}
                        <View className='flex-row justify-between mb-6'>
                            <OTPInput
                                length={6}
                                onCodeFilled={(code) => {
                                    handleVerify(code);
                                }}
                                containerClassName='mb-6'
                                inputClassName='w-12 h-12 bg-light-secondary-100 dark:bg-dark-secondary-800 
                                         border-light-secondary-200 dark:border-dark-secondary-700 
                                         text-light-fg dark:text-dark-fg rounded-lg'
                            />
                        </View>

                        {/* Resend Code */}
                        <TouchableOpacity
                            className='items-center mb-6'
                            onPress={() => handleResendCode()}
                        >
                            <Text className='font-base-medium text-light-primary-400 dark:text-dark-primary-400'>
                                Resend Code
                            </Text>
                        </TouchableOpacity>

                        {/* Change number*/}
                        <TouchableOpacity
                            className='items-center mb-6'
                            onPress={() => handleChangeNumber()}
                        >
                            <Text className='font-base-medium text-light-primary-400 dark:text-dark-primary-400'>
                                Change your number
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default OTPVerificationScreen;
