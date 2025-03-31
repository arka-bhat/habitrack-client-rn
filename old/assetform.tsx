import React, { useState } from "react";
import { TextInput, Text, Pressable, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";

import Header from "@/components/Header";
import Dropdown from "@/components/DropdownPicker";
import DateTimePicker from "@/components/DateTimePicker";
import { ImagePickerMultiple } from "@/components/ImagePicker";
import useColorMode from "@/hooks/useColorMode";
import {
    backgroundColors,
    placeholderColors,
    textColors,
} from "@/constants/TailwindClassNameConstants";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import AssetCategories from "@/constants/AssetCategories";

// Define the type for the asset form data
type AssetFormData = {
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    displayName: string;
    category: string;
    location: string;
    size: string;
    manufactureDate: string;
    installDate: string;
    warranties: string;
    notes: string;
    images: string[];
};

const AssetForm = () => {
    const { colorMode } = useColorMode();

    const [formData, setFormData] = useState<AssetFormData>({
        name: "",
        brand: "",
        model: "",
        serialNumber: "",
        displayName: "",
        category: "",
        location: "",
        size: "",
        manufactureDate: "",
        installDate: "",
        warranties: "",
        notes: "",
        images: [],
    });

    // Function to handle date change
    const handleDateChange = (key: keyof AssetFormData, date: Date) => {
        setFormData({ ...formData, [key]: date.toISOString() });
    };

    const handleInputChange = (key: keyof AssetFormData, value: string | string[]) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        console.log("Form Data:", formData);
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
                        Add Asset
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
                    {/* Name */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Name
                        </Text>
                        <TextInput
                            placeholder='Product Name'
                            value={formData.name}
                            onChangeText={(text) => handleInputChange("name", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Brand */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Brand
                        </Text>
                        <TextInput
                            placeholder='Enter the brand'
                            value={formData.brand}
                            onChangeText={(text) => handleInputChange("brand", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Model */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Model
                        </Text>
                        <TextInput
                            placeholder='Enter the model'
                            value={formData.model}
                            onChangeText={(text) => handleInputChange("model", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Serial Number */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Serial Number
                        </Text>
                        <TextInput
                            placeholder='Enter the serial number'
                            value={formData.serialNumber}
                            onChangeText={(text) => handleInputChange("serialNumber", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Display Name */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Display Name
                        </Text>
                        <TextInput
                            placeholder='Enter a display name'
                            value={formData.displayName}
                            onChangeText={(text) => handleInputChange("displayName", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Category */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Category
                        </Text>
                        <Dropdown
                            insideScrollView={true}
                            minHeight={170}
                            options={AssetCategories}
                            onSelect={(value) => handleInputChange("category", value)}
                            closeOnSelect={true}
                            containerClassName={mergeClassNames(
                                "h-12 rounded-lg border dark:border-light-secondary-500",
                                placeholderColors
                            )}
                            placeholderClassName='border rounded-lg'
                            arrowColor={colors[colorMode].secondary[600]}
                            placeholderTextClassName={mergeClassNames(
                                "font-base-semibold text-base text-light-secondary-600"
                            )}
                            labelClassName={mergeClassNames(
                                "font-base-semibold text-base",
                                textColors
                            )}
                            dropdownContainerClassName={mergeClassNames(
                                "w-full border rounded-lg mt-1 dark:border-light-secondary-500",
                                placeholderColors
                            )}
                            optionClassName={mergeClassNames(
                                "font-base-semibold text-base",
                                textColors
                            )}
                            backdropClassName='bg-light-secondary-500/20 dark:bg-dark-secondary-500/40'
                        />
                    </View>

                    {/* Location */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Location
                        </Text>
                        <TextInput
                            placeholder='Enter location'
                            value={formData.location}
                            onChangeText={(text) => handleInputChange("location", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Manufacture and Install Date */}
                    <View className='flex flex-row justify-around'>
                        {/* Manufacture Date */}
                        <View className='pb-5 flex-col items-center'>
                            <Text
                                className={mergeClassNames(
                                    "text-base font-base-medium mb-1",
                                    textColors
                                )}
                            >
                                Manufacture Date
                            </Text>
                            <DateTimePicker
                                currentDate={new Date(formData?.manufactureDate || new Date())}
                                onChange={(date: Date) =>
                                    handleDateChange("manufactureDate", date || new Date())
                                }
                            />
                        </View>

                        {/* Install Date */}
                        <View className='pb-5 flex-col items-center'>
                            <Text
                                className={mergeClassNames(
                                    "text-base font-base-medium mb-1",
                                    textColors
                                )}
                            >
                                Install Date
                            </Text>
                            <DateTimePicker
                                currentDate={new Date(formData?.installDate || new Date())}
                                onChange={(date: Date) =>
                                    handleDateChange("installDate", date || new Date())
                                }
                            />
                        </View>
                    </View>

                    {/* Warranties */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Warranties
                        </Text>
                        <TextInput
                            placeholder='warranties'
                            value={formData.warranties}
                            onChangeText={(text) => handleInputChange("warranties", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold leading-tight border dark:border-light-secondary-500",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Product Images */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Product Image
                        </Text>
                        <ImagePickerMultiple
                            images={formData.images}
                            onImageSelect={(value) => handleInputChange("images", value)}
                        >
                            <></>
                        </ImagePickerMultiple>
                    </View>

                    {/* Notes */}
                    <View className='pb-5'>
                        <Text
                            className={mergeClassNames(
                                "text-base font-base-medium mb-1",
                                textColors
                            )}
                        >
                            Notes
                        </Text>
                        <TextInput
                            multiline
                            placeholder='Enter notes'
                            value={formData.notes}
                            onChangeText={(text) => handleInputChange("notes", text)}
                            className={mergeClassNames(
                                "flex-1 px-3 pt-2 rounded-md h-40 tracking-wide text-base font-base-semibold border",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors["light"].secondary[600]}
                        />
                    </View>

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleSubmit}
                        className='w-full rounded-md p-4 items-center bg-light-primary-400 dark:bg-dark-primary-500 active:bg-light-primary-500 dark:active:bg-dark-primary-600 mb-20'
                    >
                        <Text className='text-white font-base-medium'>Submit</Text>
                    </Pressable>
                </KeyboardAwareScrollView>
                <KeyboardToolbar />
            </KeyboardProvider>
        </SafeAreaView>
    );
};

export default AssetForm;
