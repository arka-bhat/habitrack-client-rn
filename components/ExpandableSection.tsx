import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import CollapsableContainer from "@/components/CollapsibleContainer";
import useColorMode from "@/hooks/useColorMode";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import { textColors } from "@/constants/TailwindClassNameConstants";

interface ExpandableSectionProps {
    title: string;
    titleTextClassName?: string;
    children: React.ReactNode;
}

const ExpandableSection = ({ title, titleTextClassName, children }: ExpandableSectionProps) => {
    const { colorMode } = useColorMode();

    const [expanded, setExpanded] = useState(false);
    const arrowRotation = useSharedValue(0);

    // Toggle expand/collapse
    const toggleExpand = () => {
        setExpanded(!expanded);
        arrowRotation.value = expanded ? withTiming(0) : withTiming(180);
    };

    // Animated style for arrow rotation
    const arrowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${arrowRotation.value}deg` }],
        };
    });

    return (
        <View className='mb-4 overflow-hidden'>
            <TouchableWithoutFeedback onPress={toggleExpand}>
                <View className='flex flex-row justify-between items-center py-4'>
                    <Text className={mergeClassNames(titleTextClassName ?? textColors)}>
                        {title}
                    </Text>
                    <Animated.View style={arrowStyle}>
                        <Ionicons name='chevron-up' size={24} color={colors[colorMode].fg} />
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>

            <CollapsableContainer expanded={expanded}>
                <View>{children}</View>
            </CollapsableContainer>
        </View>
    );
};

export default ExpandableSection;
