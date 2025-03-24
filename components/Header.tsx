import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors } from "@/constants/TailwindClassNameConstants";
import React from "react";

interface HeaderProps {
    children: React.ReactNode;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconPosition?: "left" | "right";
    iconSize?: number;
    iconColor?: string;
    onIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    children,
    iconName,
    iconPosition = "right",
    iconColor,
    iconSize,
    onIconPress,
}) => {
    const { colorScheme } = useColorScheme();
    const colorMode = colorScheme === "dark" ? "dark" : "light";

    return (
        <View
            className={mergeClassNames(
                "flex-row justify-between items-center mb-4 px-4 py-3 h-15",
                backgroundColors,
                Platform.OS === "android" ? "mt-3" : "mt-2"
            )}
        >
            {iconPosition === "left" ? (
                <>
                    <TouchableOpacity onPress={onIconPress} className='justify-start'>
                        <Ionicons
                            name={iconName}
                            size={iconSize}
                            color={iconColor ? iconColor : colors[colorMode].fg}
                        />
                    </TouchableOpacity>
                    <View className='flex-1 justify-center items-center'>{children}</View>
                    <View className='w-10' />
                </>
            ) : (
                <>
                    <View className='w-10' />
                    <View className='flex-1 justify-center items-center'>{children}</View>
                    <TouchableOpacity onPress={onIconPress} className='w-10 justify-end'>
                        <Ionicons
                            name={iconName}
                            size={iconSize}
                            color={iconColor ? iconColor : colors[colorMode].fg}
                        />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default Header;
