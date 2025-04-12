// components/FormField.tsx
import React from "react";
import { View, Text, TextInput } from "react-native";
import Dropdown from "@/components/DropdownPicker";
import DateTimePicker from "@/components/DateTimePicker";
import ImagePicker, { ImagePickerMultiple } from "@/components/ImagePicker";
import useColorMode from "@/hooks/useColorMode";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import { placeholderColors, textColors } from "@/constants/TailwindClassNameConstants";

export interface FormFieldsProps {
    key: string;
    label: string;
    inputType:
        | "text"
        | "name"
        | "email"
        | "date"
        | "dropdown"
        | "image"
        | "images"
        | "textarea"
        | "addressLine1"
        | "addressLine2"
        | "city"
        | "state"
        | "postalCode"
        | "country"
        | "phone";
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    multiline?: boolean;
    maxLength?: number;
    dropdownHeight?: number;
}

interface FormProps {
    config: FormFieldsProps;
    value: any;
    onChange: (key: string, value: any) => void;
    errorMessage?: string;
    error?: boolean;
}

const Form = ({ config, value, onChange, error, errorMessage }: FormProps) => {
    const { colorMode } = useColorMode();
    const { key, placeholder, label, inputType, required, options, dropdownHeight } = config;

    const baseInputClasses = mergeClassNames(
        "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border",
        error ? "border-red-500" : "dark:border-light-secondary-500"
    );

    const renderInput = () => {
        switch (inputType) {
            // Text Inputs (Generic)
            case "text":
            case "textarea":
                return (
                    <TextInput
                        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        multiline={inputType === "textarea"}
                        numberOfLines={inputType === "textarea" ? 4 : 1}
                        textAlignVertical={inputType === "textarea" ? "top" : "center"}
                        className={mergeClassNames(
                            baseInputClasses,
                            inputType === "textarea" ? "h-40 pt-2" : "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Name Input
            case "name":
                return (
                    <TextInput
                        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='default'
                        autoCapitalize='words'
                        textContentType='name'
                        autoComplete='name'
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Email Input
            case "email":
                return (
                    <TextInput
                        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        textContentType='emailAddress'
                        autoComplete='email'
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Address Line 1 (Primary Street)
            case "addressLine1":
                return (
                    <TextInput
                        placeholder={placeholder ?? "Street Address"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='default'
                        autoCapitalize='words'
                        textContentType='fullStreetAddress' // iOS
                        autoComplete='address-line1' // Android (other possible: street-address)
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Address Line 2 (Apt/Unit)
            case "addressLine2":
                return (
                    <TextInput
                        placeholder={placeholder ?? "Apt, Suite, or Building"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='default'
                        autoCapitalize='none'
                        textContentType='none' // iOS (no standard for line 2)
                        autoComplete='address-line2' // Android
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // City
            case "city":
                return (
                    <TextInput
                        placeholder={placeholder ?? "City"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='default'
                        autoCapitalize='words'
                        textContentType='addressCity' // iOS
                        autoComplete='postal-address-locality' // Android
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // State/Province
            case "state":
                return (
                    <TextInput
                        placeholder={placeholder ?? "State/Province"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='default'
                        autoCapitalize='words'
                        textContentType='addressState' // iOS
                        autoComplete='postal-address-region' // Android
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Postal Code
            case "postalCode":
                return (
                    <TextInput
                        placeholder={placeholder ?? "Zip/Postal Code"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='numbers-and-punctuation'
                        textContentType='postalCode' // iOS
                        autoComplete='postal-code' // Android
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Dropdown (Country)
            case "country":
                return (
                    <Dropdown
                        insideScrollView={true}
                        minHeight={dropdownHeight ?? 170}
                        options={options || []}
                        onSelect={(value) => onChange(key, value)}
                        closeOnSelect={true}
                        containerClassName={mergeClassNames(
                            "h-12 rounded-lg border dark:border-light-secondary-500",
                            placeholderColors,
                            error ? "border-red-500" : "dark:border-light-secondary-500"
                        )}
                        placeholderClassName=' rounded-lg'
                        arrowColor={colors[colorMode].secondary[600]}
                        placeholderTextClassName={mergeClassNames(
                            "font-base-semibold text-base text-light-secondary-600"
                        )}
                        labelClassName={mergeClassNames("font-base-semibold text-base", textColors)}
                        dropdownContainerClassName={mergeClassNames(
                            "w-full rounded-lg mt-1 border dark:border-light-secondary-500",
                            placeholderColors,
                            error ? "border-red-500" : "dark:border-light-secondary-500"
                        )}
                        optionClassName={mergeClassNames(
                            "font-base-semibold text-base",
                            textColors
                        )}
                        backdropClassName='bg-light-secondary-500/20 dark:bg-dark-secondary-500/40'
                    />
                );

            // Phone Number
            case "phone":
                return (
                    <TextInput
                        placeholder={placeholder ?? "Phone Number"}
                        value={value}
                        onChangeText={(text) => onChange(key, text)}
                        keyboardType='phone-pad'
                        textContentType='telephoneNumber' // iOS
                        autoComplete='tel' // Android
                        className={mergeClassNames(
                            baseInputClasses,
                            "h-12",
                            textColors,
                            placeholderColors
                        )}
                        placeholderTextColor={colors[colorMode].secondary[600]}
                    />
                );

            // Date Picker
            case "date":
                return (
                    <View
                        className={mergeClassNames(
                            "h-12 justify-center",
                            error ? "border border-red-500 rounded-md" : ""
                        )}
                    >
                        <DateTimePicker
                            currentDate={value ? new Date(value) : new Date()}
                            onChange={(date) => onChange(key, date.toISOString())}
                        />
                    </View>
                );

            // Image Pickers
            case "image":
                return (
                    <ImagePicker
                        image={value || ""}
                        onImageSelect={(image) => onChange(key, image)}
                    >
                        {" "}
                        <></>{" "}
                    </ImagePicker>
                );
            case "images":
                return (
                    <ImagePickerMultiple
                        images={value || []}
                        onImageSelect={(images) => onChange(key, images)}
                    >
                        {" "}
                        <></>{" "}
                    </ImagePickerMultiple>
                );

            default:
                return null;
        }
    };

    return (
        <View className='pb-5'>
            <View className='flex-row items-center'>
                <Text className={mergeClassNames("text-base font-base-medium mb-1", textColors)}>
                    {label}
                </Text>
                {required && <Text className='text-red-500 ml-1'>*</Text>}
            </View>
            {renderInput()}
            {error && errorMessage && (
                <Text className='text-red-500 text-sm mt-1'>{errorMessage}</Text>
            )}
        </View>
    );
};

export default Form;
