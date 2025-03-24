import React, { useState } from "react";
import { View, Text, Pressable, FlatList, ScrollView } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { mergeClassNames } from "@/utils/TailwindUtils";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    options: Option[];
    onSelect: (value: string) => void;
    placeholder?: string;
    closeOnSelect?: boolean;
    insideScrollView?: boolean; // NEW PROP TO DETECT SCROLLVIEW USAGE
    containerClassName?: string;
    placeholderTextClassName?: string;
    labelClassName?: string;
    placeholderClassName?: string;
    dropdownContainerClassName?: string;
    optionClassName?: string;
    backdropClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
    placeholder = "Select an option",
    closeOnSelect = true,
    insideScrollView = false, // DEFAULT FALSE
    containerClassName = "",
    placeholderTextClassName = "",
    labelClassName = "",
    placeholderClassName = "",
    dropdownContainerClassName = "",
    optionClassName = "",
    backdropClassName = "bg-black/30",
}) => {
    const [selected, setSelected] = useState<Option | null>(null);
    const [open, setOpen] = useState(false);

    const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

    // Animation values
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const arrowRotation = useSharedValue(0);

    const toggleDropdown = () => {
        if (open) {
            height.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 100 });
            arrowRotation.value = withTiming(0, { duration: 200 });
        } else {
            height.value = withTiming(150, { duration: 200 });
            opacity.value = withTiming(1, { duration: 100 });
            arrowRotation.value = withTiming(-180, { duration: 200 });
        }
        setOpen(!open);
    };

    const closeDropdown = () => {
        height.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 100 });
        arrowRotation.value = withTiming(0, { duration: 200 });
        setOpen(false);
    };

    const selectOption = (option: Option) => {
        setSelected(option);
        onSelect(option.value);
        if (closeOnSelect) closeDropdown();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value,
    }));

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${arrowRotation.value}deg` }],
    }));

    return (
        <View className={mergeClassNames("relative w-full", containerClassName)}>
            {open && (
                <Pressable
                    className={mergeClassNames("absolute inset-0", backdropClassName)}
                    onPress={closeDropdown}
                />
            )}

            <Pressable
                onPress={toggleDropdown}
                className={mergeClassNames(
                    "p-3 border rounded flex-row justify-between items-center",
                    placeholderClassName
                )}
            >
                <Text
                    className={mergeClassNames(
                        selected ? labelClassName : placeholderTextClassName
                    )}
                >
                    {selected ? selected.label : placeholder}
                </Text>
                <AnimatedIonicons name='chevron-down' size={20} style={arrowStyle} />
            </Pressable>

            <Animated.View
                className={mergeClassNames(
                    "absolute top-full left-0 w-full z-10",
                    dropdownContainerClassName
                )}
                style={animatedStyle}
            >
                {insideScrollView ? (
                    // USE SCROLLVIEW TO AVOID NESTING FlatList inside ScrollView
                    <ScrollView>
                        {options.map((option) => (
                            <Pressable
                                key={option.value}
                                onPress={() => selectOption(option)}
                                className={mergeClassNames(
                                    "p-3 border-b last:border-b-0",
                                    optionClassName
                                )}
                            >
                                <Text>{option.label}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                ) : (
                    // USE FlatList FOR PERFORMANCE WHEN NOT INSIDE A SCROLLVIEW
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => selectOption(item)}
                                className={mergeClassNames(
                                    "p-3 border-b last:border-b-0",
                                    optionClassName
                                )}
                            >
                                <Text>{item.label}</Text>
                            </Pressable>
                        )}
                    />
                )}
            </Animated.View>
        </View>
    );
};

export default Dropdown;
