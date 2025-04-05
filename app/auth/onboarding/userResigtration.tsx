import React, { useState } from "react";
import { ActivityIndicator, Pressable, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormField, { FormFieldsProps } from "@/components/Form";
import { backgroundColors } from "@/constants/TailwindClassNameConstants";
import { mergeClassNames } from "@/utils/TailwindUtils";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";

const userResigtration = () => {
    const formFields: FormFieldsProps[] = [
        {
            key: "name",
            label: "Name",
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

    interface UserFormData {
        [key: string]: string | undefined;
        name: undefined;
        email: undefined;
    }

    const blankUserFormData: UserFormData = {
        name: undefined,
        email: undefined,
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UserFormData>(blankUserFormData);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [key]: "",
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const validationErrors: object[] = []; //validateUser(formData);
        if (Object.keys(validationErrors).length > 0) {
            //setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            console.log("User data submitted:", formData);
            setIsSubmitting(false);
        }, 2000);
    };
    return (
        <SafeAreaView
            className={mergeClassNames("flex-1", backgroundColors)}
            edges={["top", "left", "right"]}
        >
            <StatusBar barStyle='default' />
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
                            value={formData[field.key] ?? ""}
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
                            <Text className='text-white font-base-medium'>Submit</Text>
                        )}
                    </Pressable>
                </KeyboardAwareScrollView>
                <KeyboardToolbar />
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default userResigtration;
