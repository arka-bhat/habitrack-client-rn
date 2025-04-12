import React, { useCallback, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import Swipeable, {
    SwipeableMethods,
    SwipeableProps,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import useColorMode from "@/hooks/useColorMode";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";

interface SwipeActionButtonsProps {
    onClose: () => void;
    onAction: () => void;
    label: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    labelClassName?: string;
    iconContainerClassName?: string;
    swipeActionClassName?: string;
}

interface SwipeableItemProps extends Omit<SwipeableProps, "children"> {
    children?: React.ReactNode;
    leftActions?: React.ReactNode;
    rightActions?: React.ReactNode;
    animationDuration?: number;
    onSwipeStart?: () => void;
}

export const LeftActionButton = React.memo(
    ({
        onClose,
        onAction,
        label,
        iconName,
        iconSize,
        iconColor,
        labelClassName,
        iconContainerClassName,
        swipeActionClassName,
    }: SwipeActionButtonsProps) => {
        const { colorMode } = useColorMode();
        return (
            <Pressable
                className={mergeClassNames(
                    "flex-1 justify-center items-start pl-5",
                    swipeActionClassName ?? ""
                )}
                onPress={() => {
                    onAction();
                    onClose();
                }}
            >
                <View className={mergeClassNames("items-center", iconContainerClassName ?? "")}>
                    <Ionicons
                        name={iconName}
                        size={iconSize}
                        color={iconColor ? iconColor : colors[colorMode].fg}
                    />
                </View>
                <Text className={mergeClassNames(labelClassName ?? "text-white font-semibold")}>
                    {label}
                </Text>
            </Pressable>
        );
    }
);

export const RightActionButton = React.memo(
    ({
        onClose,
        onAction,
        label,
        iconName,
        iconSize,
        iconColor,
        labelClassName,
        iconContainerClassName,
        swipeActionClassName,
    }: SwipeActionButtonsProps) => {
        const { colorMode } = useColorMode();
        return (
            <Pressable
                className={mergeClassNames(
                    "flex-1 justify-center items-end pr-5",
                    swipeActionClassName ?? ""
                )}
                onPress={() => {
                    onAction();
                    onClose();
                }}
            >
                <View className={mergeClassNames("items-center", iconContainerClassName ?? "")}>
                    <Ionicons
                        name={iconName}
                        size={iconSize}
                        color={iconColor ? iconColor : colors[colorMode].fg}
                    />
                </View>
                <Text className={mergeClassNames(labelClassName ?? "text-white font-semibold")}>
                    {label}
                </Text>
            </Pressable>
        );
    }
);

const SwipeableItem = React.forwardRef<SwipeableMethods, SwipeableItemProps>(
    ({
        id,
        children,
        leftActions,
        rightActions,
        animationDuration = 200,
        onSwipeStart,
        ...swipeableProps
    }: SwipeableItemProps) => {
        const AnimatedView = Animated.createAnimatedComponent(View);

        const swipeableRef = useRef<SwipeableMethods>(null);
        const translateX = useSharedValue(0);

        const animatedStyles = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));

        const handleSwipeableOpen = useCallback(
            (direction: "left" | "right") => {
                onSwipeStart?.();
                translateX.value = withTiming(direction === "left" ? -100 : 100, {
                    duration: animationDuration,
                });
            },
            [animationDuration, translateX]
        );

        const handleSwipeableClose = useCallback(() => {
            translateX.value = withTiming(0, { duration: animationDuration });
        }, [animationDuration, translateX]);

        return (
            <Swipeable
                ref={swipeableRef}
                friction={2}
                leftThreshold={100} // Increased for multiple actions
                rightThreshold={100}
                renderLeftActions={() => leftActions}
                renderRightActions={() => rightActions}
                onSwipeableOpen={handleSwipeableOpen}
                onSwipeableClose={handleSwipeableClose}
                {...swipeableProps}
            >
                <AnimatedView style={animatedStyles}>{children}</AnimatedView>
            </Swipeable>
        );
    }
);

export default React.memo(SwipeableItem);
