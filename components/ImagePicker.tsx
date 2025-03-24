import React from "react";
import { View, Text, Pressable, Image, FlatList } from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import { textColors } from "@/constants/TailwindClassNameConstants";
import useColorMode from "@/hooks/useColorMode";

interface ImagePickerProps {
    children: React.ReactNode;
    value?: string;
    onImageSelect: (value: string) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ children, value, onImageSelect }) => {
    const pickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onImageSelect(result.assets[0].uri);
        }
    };

    return (
        <>
            <Pressable onPress={pickImage}>{children}</Pressable>
            {value && <Image source={{ uri: value }} className='w-24 h-24 mt-2' />}
        </>
    );
};

interface ImagePickerMultipleProps {
    children: React.ReactNode;
    images: string[];
    onImageSelect: (value: string[]) => void;
}

export const ImagePickerMultiple: React.FC<ImagePickerMultipleProps> = ({
    children,
    images,
    onImageSelect,
}) => {
    const { colorMode } = useColorMode();

    const pickImage = async () => {
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);
            const uniqueImages = [...new Set([...images, ...newImages])];
            onImageSelect(uniqueImages);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        onImageSelect(updatedImages);
    };

    return (
        <View>
            {children}

            {images.length !== 0 && (
                <View className='mb-3 border-light-secondary-400 dark:border-dark-secondary-700 rounded-lg py-3 flex min-h-40'>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={images}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ alignItems: "flex-start" }}
                        renderItem={({ item, index }) => (
                            <View className='mr-2'>
                                <Image source={{ uri: item }} className='w-36 h-36 rounded-lg' />
                                <Pressable
                                    className='absolute top-1 right-1 bg-dark-secondary-800 p-1 rounded-full'
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name='close' size={16} color='#fff' />
                                </Pressable>
                            </View>
                        )}
                    />
                </View>
            )}

            <Pressable
                className='flex flex-row items-center justify-center bg-light-secondary-150 dark:bg-dark-secondary-800 p-3 rounded-lg'
                onPress={pickImage}
            >
                <Ionicons name='add' size={20} color={colors[colorMode].fg} />
                <Text className={mergeClassNames("text-base font-base-semibold ml-1", textColors)}>
                    {images.length > 0 ? "Add more images" : "Add images"}
                </Text>
            </Pressable>
        </View>
    );
};

export default ImagePicker;
