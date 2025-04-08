import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormField, { FormFieldsProps } from "@/components/Form";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import { mergeClassNames } from "@/utils/TailwindUtils";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";
import Header from "@/components/Header";
import { resetAndNavigate } from "@/utils/NavigationHelpers";
import { PropertyInput, validateProperty } from "@/types/property";
import { usePropertyStore } from "@/store/PropertyStore";
import { useUserStore } from "@/store/UserStore";

const PropertyResigtration = () => {
    const formFields: FormFieldsProps[] = [
        {
            key: "name",
            label: "Property Name",
            placeholder: "Give your property a name (e.g. My House)",
            inputType: "name",
            required: true,
        },
        {
            key: "addressLine1",
            label: "Street Address",
            inputType: "addressLine1",
            required: true,
        },
        {
            key: "addressLine2",
            label: "Apt/Unit",
            inputType: "addressLine2",
        },
        {
            key: "city",
            label: "City",
            inputType: "city",
            required: true,
        },
        {
            key: "state",
            label: "State",
            inputType: "state",
            required: true,
        },
        {
            key: "country",
            label: "Country",
            inputType: "country",
            options: [
                { label: "United States", value: "US" },
                { label: "Canada", value: "CA" },
                { label: "Mexico", value: "MX" },
                { label: "India", value: "IN" },
                // Add more countries as needed
            ],
            required: true,
        },
        {
            key: "postalCode",
            label: "Zip Code",
            inputType: "postalCode",
            required: true,
        },
    ];

    const blankPropertyFormData: Partial<PropertyInput> = {
        name: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        state: undefined,
        postalCode: undefined,
    };

    const { saveProperty } = usePropertyStore();
    const { setOnboardingStage, completeOnboarding } = useUserStore();

    const [formData, setFormData] = useState<Partial<PropertyInput>>(blankPropertyFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setOnboardingStage("property_registration");
    }, []);

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
        const validation = validateProperty(formData);

        if (!validation.success) {
            console.log(validation.error.issues);
            console.log(formData);
            setErrors(
                validation.error.issues.reduce<Record<string, string>>((acc, issue) => {
                    const key = issue.path[0];
                    if (typeof key === "string") {
                        acc[key] = issue.message;
                    }
                    return acc;
                }, {})
            );
            setIsSubmitting(false);
            return;
        }

        try {
            const success = await saveProperty(validation.data);
            if (success) {
                completeOnboarding();
                resetAndNavigate("/home/dashboard");
            } else {
                Alert.alert("Error", "Failed to save property");
            }
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
            <KeyboardProvider>
                <View className='flex px-2'>
                    <Header>
                        <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                            Add your property
                        </Text>
                    </Header>
                </View>
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
                            value={formData[field.key as keyof PropertyInput] ?? ""}
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

export default PropertyResigtration;
