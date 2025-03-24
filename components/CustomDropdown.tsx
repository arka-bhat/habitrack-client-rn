import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    FlatList,
    ScrollView,
    Dimensions,
    LayoutChangeEvent,
    ViewStyle,
} from "react-native";
import { useNavigation } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import useColorMode from "@/hooks/useColorMode";

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    options: Option[];
    onSelect: (value: string) => void;
    minHeight?: number;
    dropdownWidth?: number | string;
    centeredDropdown?: boolean;
    placeholder?: string;
    closeOnSelect?: boolean;
    insideScrollView?: boolean;
    lastElement?: React.ReactNode;
    arrowColor?: string;
    containerClassName?: string;
    placeholderTextClassName?: string;
    labelClassName?: string;
    placeholderClassName?: string;
    dropdownContainerClassName?: string;
    optionContainerClassName?: string;
    optionClassName?: string;
    backdropClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
    minHeight = 150,
    dropdownWidth,
    centeredDropdown = false,
    placeholder = "Select an option",
    closeOnSelect = true,
    insideScrollView = false,
    lastElement,
    arrowColor,
    containerClassName = "",
    placeholderTextClassName = "",
    labelClassName = "",
    placeholderClassName = "",
    dropdownContainerClassName = "",
    optionContainerClassName = "",
    optionClassName = "",
    backdropClassName = "",
}) => {
    const screenWidth = Dimensions.get("window").width;
    const triggerRef = useRef<View>(null);

    const { colorMode } = useColorMode();

    const [selected, setSelected] = useState<Option | null>(null);
    const [open, setOpen] = useState(false);
    const [triggerPosition, setTriggerPosition] = useState({ x: 0, width: 0 });

    const navigation = useNavigation();

    // Animation values
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const arrowRotation = useSharedValue(0);

    const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

    // Compute dropdown width
    const computedDropdownWidth = (() => {
        if (dropdownWidth === undefined) return "100%";
        if (typeof dropdownWidth === "number") return dropdownWidth;
        if (typeof dropdownWidth === "string") {
            // If percentage is provided
            if (dropdownWidth.endsWith("%")) {
                const percentage = parseFloat(dropdownWidth) / 100;
                return screenWidth * percentage;
            }
        }
        return "100%";
    })();

    const onTriggerLayout = (event: LayoutChangeEvent) => {
        const { x, width } = event.nativeEvent.layout;
        setTriggerPosition({ x, width });
    };

    const toggleDropdown = () => {
        if (open) {
            height.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 100 });
            arrowRotation.value = withTiming(0, { duration: 200 });
        } else {
            height.value = withTiming(minHeight, { duration: 200 });
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

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            closeDropdown();
        });
        return unsubscribe;
    }, [navigation, closeDropdown]);

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

    // Calculate dropdown positioning
    const getDropdownPosition = (): ViewStyle => {
        if (!centeredDropdown) {
            return { left: 0, top: "100%" as const };
        }

        if (computedDropdownWidth === "100%") {
            return { left: 0, top: "100%" as const };
        }

        const triggerCenter = triggerPosition.x + triggerPosition.width / 2;
        const dropdownLeft = triggerCenter - computedDropdownWidth / 2;

        return {
            left: dropdownLeft,
            top: "100%" as const,
            position: "absolute",
        };
    };

    return (
        <View className={mergeClassNames("relative", containerClassName)}>
            {open && (
                <Pressable
                    className={mergeClassNames("absolute inset-0 z-10", backdropClassName)}
                    onPress={closeDropdown}
                />
            )}

            <Pressable
                ref={triggerRef}
                onLayout={onTriggerLayout}
                onPress={toggleDropdown}
                className={mergeClassNames(
                    "p-3 flex-row justify-between items-center",
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
                <AnimatedIonicons
                    name='chevron-down'
                    size={20}
                    style={arrowStyle}
                    color={arrowColor || colors[colorMode].fg}
                />
            </Pressable>

            <Animated.View
                className={mergeClassNames("absolute z-20", dropdownContainerClassName)}
                style={[
                    animatedStyle,
                    {
                        width: computedDropdownWidth,
                        ...getDropdownPosition(),
                    },
                ]}
            >
                {insideScrollView ? (
                    <ScrollView>
                        {options.map((option) => (
                            <Pressable
                                key={option.value}
                                onPress={() => selectOption(option)}
                                className={mergeClassNames("p-3", optionContainerClassName)}
                            >
                                <Text className={mergeClassNames(optionClassName)}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                        {lastElement && <View>{lastElement}</View>}
                    </ScrollView>
                ) : (
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => selectOption(item)}
                                className={mergeClassNames("p-3", optionContainerClassName)}
                            >
                                <Text className={mergeClassNames(optionClassName)}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        )}
                        ListFooterComponent={() =>
                            lastElement ? <View>{lastElement}</View> : null
                        }
                    />
                )}
            </Animated.View>
        </View>
    );
};

export default Dropdown;
