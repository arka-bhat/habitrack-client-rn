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
    placeholder?: string;
    label: string;
    inputType: "text" | "name" | "email" | "date" | "dropdown" | "image" | "images" | "textarea";
    required?: boolean;
    options?: { label: string; value: string }[];
}

interface FormProps {
    config: FormFieldsProps;
    value: any;
    onChange: (key: string, value: any) => void;
    errorMessage?: string;
    error?: boolean;
}

const Form: React.FC<FormProps> = ({ config, value, onChange, error, errorMessage }) => {
    const { colorMode } = useColorMode();

    const { key, placeholder, label, inputType, required, options } = config;

    const baseInputClasses = mergeClassNames(
        "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border",
        error ? "border-red-500" : "dark:border-light-secondary-500"
    );

    return (
        <View className='pb-5'>
            <View className='flex-row items-center'>
                <Text className={mergeClassNames("text-base font-base-medium mb-1", textColors)}>
                    {label}
                </Text>
                {required && <Text className='text-red-500 ml-1'>*</Text>}
            </View>

            {inputType === "text" || inputType === "textarea" ? (
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
            ) : inputType === "name" ? (
                <TextInput
                    placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                    value={value}
                    keyboardType='default'
                    autoCapitalize='words'
                    autoCorrect={true}
                    textContentType='name'
                    autoComplete='name'
                    returnKeyType='done'
                    onChangeText={(text) => onChange(key, text)}
                    numberOfLines={1}
                    textAlignVertical={"center"}
                    className={mergeClassNames(
                        baseInputClasses,
                        "h-12",
                        textColors,
                        placeholderColors
                    )}
                    placeholderTextColor={colors[colorMode].secondary[600]}
                />
            ) : inputType === "email" ? (
                <TextInput
                    placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                    value={value}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    textContentType='emailAddress'
                    autoComplete='email'
                    importantForAutofill='yes'
                    onChangeText={(text) => onChange(key, text)}
                    numberOfLines={1}
                    textAlignVertical={"center"}
                    className={mergeClassNames(
                        baseInputClasses,
                        "h-12",
                        textColors,
                        placeholderColors
                    )}
                    placeholderTextColor={colors[colorMode].secondary[600]}
                />
            ) : inputType === "date" ? (
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
            ) : inputType === "dropdown" ? (
                <Dropdown
                    insideScrollView={true}
                    minHeight={170}
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
                    optionClassName={mergeClassNames("font-base-semibold text-base", textColors)}
                    backdropClassName='bg-light-secondary-500/20 dark:bg-dark-secondary-500/40'
                />
            ) : inputType === "image" ? (
                <ImagePicker image={value || ""} onImageSelect={(image) => onChange(key, image)}>
                    <></>
                </ImagePicker>
            ) : inputType === "images" ? (
                <ImagePickerMultiple
                    images={value || []}
                    onImageSelect={(images) => onChange(key, images)}
                >
                    <></>
                </ImagePickerMultiple>
            ) : null}
            {error && errorMessage && (
                <Text className='text-red-500 text-sm mt-1'>{errorMessage}</Text>
            )}
        </View>
    );
};

export default Form;
