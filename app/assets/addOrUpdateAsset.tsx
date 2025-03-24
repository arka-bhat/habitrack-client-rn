import React, { useState } from "react";
import { TextInput, Text, Pressable, StatusBar, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardToolbar,
} from "react-native-keyboard-controller";
// import DateTimePicker from "@react-native-community/datetimepicker";

import Header from "@components/Header";
import { ImagePickerMultiple } from "@components/ImagePicker";
import DropdownPicker from "@/components/DropdownPicker";
import DateTimePicker from "@components/DateTimePicker";
import {
    backgroundColors,
    placeholderColors,
    placeholderTextColors,
    textColors,
} from "@constants/TailwindClassNameConstants";
import { colors, mergeClassNames } from "@utils/TailwindUtils";
import { useColorScheme } from "nativewind";
import Dropdown from "@/components/CustomDropdown";

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
    const { colorScheme } = useColorScheme();
    const colorMode = colorScheme === "dark" ? "dark" : "light";

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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                            options={[
                                { label: "Option 1", value: "1" },
                                { label: "Option 2", value: "2" },
                                { label: "Option 3", value: "3" },
                                { label: "Option 4", value: "4" },
                                { label: "Option 5", value: "5" },
                                { label: "Option 6", value: "6" },
                            ]}
                            onSelect={(value) => Alert.alert("Selected:", value)}
                            closeOnSelect={false}
                            containerClassName={mergeClassNames("h-12", placeholderColors)}
                            placeholderTextClassName={mergeClassNames(
                                "font-base-semibold text-base opacity-[0.54]",
                                placeholderTextColors
                            )}
                            labelClassName={mergeClassNames(
                                "font-base-semibold text-base",
                                placeholderTextColors
                            )}
                            dropdownContainerClassName={mergeClassNames(
                                "border rounded mt-1",
                                placeholderColors
                            )}
                            backdropClassName='bg-light-secondary-200'
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
                        />
                    </View>

                    {/* Manufacture Date */}
                    <View className='flex flex-row justify-around'>
                        <View className='pb-5 items-center'>
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
                        <View className='pb-5 items-center'>
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
                                "flex-1 px-3 rounded-md h-12 tracking-wide text-base font-base-semibold border leading-tight",
                                textColors,
                                placeholderColors
                            )}
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
                            placeholderTextColor={colors[colorMode].secondary[600]}
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
