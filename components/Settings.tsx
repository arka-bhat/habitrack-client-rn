import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { mergeClassNames } from "../utils/TailwindUtils";
import { textColors } from "@/constants/TailwindClassNameConstants";

// Interface for an individual setting option
interface SettingsOptionProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    isLast: boolean;
    textColors: string;
    colorMode: "light" | "dark";
    colors: {
        light: Record<string, Record<number, string>>;
        dark: Record<string, Record<number, string>>;
    };
}

// Interface for a settings option item in the data structure
export interface SettingsOptionItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}

// Interface for the main settings category component
interface SettingsCategoryProps {
    title: string;
    options: SettingsOptionItem[];
    colorMode: "light" | "dark";
    colors: {
        light: Record<string, Record<number, string>>;
        dark: Record<string, Record<number, string>>;
    };
}

// Main component for a settings category
const SettingsCategory: React.FC<SettingsCategoryProps> = ({
    title,
    options,
    colorMode,
    colors,
}) => {
    return (
        <View className='rounded-md pt-4'>
            {/* Category Title */}
            {/* add flex-row if want to apply bottom border only to the text */}
            <View className='mb-2'>
                <Text
                    className={mergeClassNames("text-sm uppercase font-base-regular ", textColors)}
                >
                    {title}
                </Text>
            </View>

            {/* Render all options in this category */}
            {options.map((option, index) => (
                <SettingsOption
                    key={`${title}-option-${index}`}
                    icon={option.icon}
                    label={option.label}
                    onPress={option.onPress}
                    isLast={index === options.length - 1}
                    textColors={textColors}
                    colorMode={colorMode}
                    colors={colors}
                />
            ))}
        </View>
    );
};

// Individual setting option component
const SettingsOption: React.FC<SettingsOptionProps> = ({
    icon,
    label,
    onPress,
    isLast,
    textColors,
    colorMode,
    colors,
}) => {
    return (
        <TouchableOpacity className='py-3 flex-row justify-between items-center' onPress={onPress}>
            <View className='flex-row items-center gap-3'>
                <View className='bg-light-secondary-150 dark:bg-dark-secondary-750 w-8 h-8 rounded-full flex items-center justify-center'>
                    <Ionicons name={icon} size={18} color={colors[colorMode].secondary[650]} />
                </View>

                <Text className={mergeClassNames("text-lg font-base-medium", textColors)}>
                    {label}
                </Text>
            </View>
            <Ionicons
                name='chevron-forward-sharp'
                size={20}
                color={colors[colorMode].secondary[750]}
            />
        </TouchableOpacity>
    );
};

export default SettingsCategory;
