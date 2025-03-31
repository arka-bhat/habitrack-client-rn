import React, { useState } from "react";
import { Text, Pressable, StatusBar, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";

import { useAssetStore } from "@/store/AssetStore";
import { AssetInput, isAssetFieldKey, validateAsset } from "@/types/asset";
import Header from "@/components/Header";
import FormField, { FormFields } from "@/components/Form";
import { mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import AssetCategories from "@/constants/AssetCategories";

const AssetForm = ({ assetId }: { assetId?: string }) => {
    // Local form state
    const [formData, setFormData] = useState<Partial<AssetInput>>(
        assetId
            ? useAssetStore.getState().getAssetById(assetId) ?? {
                  name: undefined,
                  brand: undefined,
                  model: undefined,
                  serialNumber: undefined,
                  displayName: "",
                  category: "",
                  location: "",
                  size: "",
                  manufactureDate: new Date(),
                  installDate: new Date(),
                  warranties: "",
                  notes: "",
                  images: [],
              }
            : {
                  name: undefined,
                  brand: undefined,
                  model: undefined,
                  serialNumber: undefined,
                  displayName: "",
                  category: "",
                  location: "",
                  size: "",
                  manufactureDate: new Date(),
                  installDate: new Date(),
                  warranties: "",
                  notes: "",
                  images: [],
              }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zustand actions
    const { saveAsset, updateAsset } = useAssetStore();

    const formFields: FormFields[] = [
        {
            key: "name",
            label: "Name",
            inputType: "text",
            required: true,
        },
        {
            key: "brand",
            label: "Brand",
            inputType: "text",
            required: true,
        },
        {
            key: "model",
            label: "Model",
            inputType: "text",
            required: true,
        },
        {
            key: "serialNumber",
            label: "Serial Number",
            inputType: "text",
            required: true,
        },
        {
            key: "displayName",
            label: "Display Name",
            inputType: "text",
        },
        {
            key: "category",
            label: "Category",
            inputType: "dropdown",
            options: AssetCategories,
            required: true,
        },
        {
            key: "location",
            label: "Location",
            inputType: "text",
        },
        {
            key: "manufactureDate",
            label: "Manufacture Date",
            inputType: "date",
        },
        {
            key: "installDate",
            label: "Install Date",
            inputType: "date",
        },
        {
            key: "warranties",
            label: "Warranties",
            inputType: "text",
        },
        {
            key: "images",
            label: "Product Images",
            inputType: "images",
        },
        {
            key: "notes",
            label: "Notes",
            inputType: "textarea",
        },
    ];

    const handleInputChange = (key: string, value: any) => {
        if (isAssetFieldKey(key)) {
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
        // Client-side validation
        const validation = validateAsset(formData);
        if (!validation.success) {
            setErrors(
                validation.error.issues.reduce<Record<string, string>>((acc, issue) => {
                    const key = issue.path[0];
                    if (typeof key === "string" && isAssetFieldKey(key)) {
                        acc[key] = issue.message;
                    }
                    return acc;
                }, {})
            );
            return;
        }

        // Submit to Zustand
        setIsSubmitting(true);
        try {
            const success = assetId
                ? await updateAsset(assetId, validation.data)
                : await saveAsset(validation.data);

            if (success) {
                router.back();
            } else {
                Alert.alert("Error", "Failed to save asset");
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
            <View className='flex px-2'>
                <Header
                    iconName='arrow-back'
                    iconPosition='left'
                    onIconPress={() => router.back()}
                    iconSize={24}
                >
                    <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                        {assetId ? "Edit Asset" : "Add Asset"}
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
                            value={formData[field.key as keyof AssetInput] ?? ""}
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

                    {/* Debug view - remove in production */}
                    {__DEV__ && (
                        <View className='p-4 bg-gray-100'>
                            <Text>Current State:</Text>
                            <Text className='text-xs'>{JSON.stringify(formData, null, 2)}</Text>
                            {Object.keys(errors).length > 0 && (
                                <>
                                    <Text className='mt-2 text-red-500'>Errors:</Text>
                                    <Text className='text-xs'>
                                        {JSON.stringify(errors, null, 2)}
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
                </KeyboardAwareScrollView>
                <KeyboardToolbar />
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default AssetForm;
