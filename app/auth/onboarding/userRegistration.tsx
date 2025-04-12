import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";
import { router } from "expo-router";

import { useUserStore } from "@/store/UserStore";
import { useAuthStore } from "@/store/AuthStore";
import { isUserFieldKey, UserInput, validateUser } from "@/types/user";
import Header from "@/components/Header";
import FormField, { FormFieldsProps } from "@/components/Form";
import { mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";

const UserResigtration = () => {
    const { createProfile, setOnboardingStage, saveTempOnboardingData } = useUserStore();
    const { otpPhoneNumber } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Partial<UserInput>>({
        name: undefined,
        email: undefined,
        phoneNumber: undefined,
    });

    const formFields: FormFieldsProps[] = [
        {
            key: "name",
            label: "Your Name",
            inputType: "name",
            required: true,
        },
        {
            key: "email",
            label: "Email",
            inputType: "email",
            required: false,
        },
    ];

    useEffect(() => {
        setOnboardingStage("user_registration");
        formData.phoneNumber = otpPhoneNumber ?? undefined;
    }, []);

    const handleInputChange = (key: string, value: any) => {
        if (isUserFieldKey(key)) {
            const sanitizedValue = !value && value !== false ? undefined : value;

            setFormData((prev) => ({
                ...prev,
                [key]: sanitizedValue,
            }));

            if (errors[key]) {
                setErrors((prev) => ({ ...prev, [key]: "" }));
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const validation = validateUser(formData);

        console.log(formData);
        if (!validation.success) {
            console.log("here");
            setErrors(
                validation.error.issues.reduce<Record<string, string>>((acc, issue) => {
                    const key = issue.path[0];
                    if (typeof key === "string" && isUserFieldKey(key)) {
                        acc[key] = issue.message;
                    }
                    return acc;
                }, {})
            );
            console.log(validation.error.issues);
            setIsSubmitting(false);
            return;
        }

        try {
            await saveTempOnboardingData({ user: validation.data });

            await createProfile(validation.data);
            router.replace("/auth/onboarding/propertyRegistration");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView
            className={mergeClassNames("flex-1", backgroundColors)}
            edges={["top", "left", "right"]}
        >
            <StatusBar barStyle='default' />
            <View className='flex px-2'>
                <Header>
                    <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                        Register yourself
                    </Text>
                </Header>
            </View>
            <KeyboardProvider>
                <KeyboardAwareScrollView
                    className='px-6 pt-2 pb-4 border-b'
                    bottomOffset={62}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    nestedScrollEnabled={true}
                >
                    {formFields.map((field) => (
                        <FormField
                            key={field.key}
                            config={field}
                            value={formData[field.key as keyof UserInput] ?? ""}
                            onChange={handleInputChange}
                            error={!!errors[field.key]}
                            errorMessage={errors[field.key] ?? ""}
                        />
                    ))}

                    <Pressable
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className='w-full rounded-md p-4 items-center bg-light-primary-400 dark:bg-dark-primary-500 active:bg-light-primary-500 dark:active:bg-dark-primary-600 mb-20'
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color='white' />
                        ) : (
                            <Text className='text-white font-base-medium'>Next</Text>
                        )}
                    </Pressable>
                </KeyboardAwareScrollView>
                <KeyboardToolbar />
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default UserResigtration;
