import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface CollapsibleContainerProps {
    children: React.ReactNode;
    expanded: boolean;
}

const CollapsibleContainer = ({ children, expanded }: CollapsibleContainerProps) => {
    const [height, setHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const onLayoutHeight = event.nativeEvent.layout.height;

        if (onLayoutHeight > 0 && height !== onLayoutHeight) {
            setHeight(onLayoutHeight);
        }
    };

    const collapsableStyle = useAnimatedStyle(() => {
        animatedHeight.value = expanded ? withTiming(height) : withTiming(0);

        return {
            height: animatedHeight.value,
            overflow: "hidden", // Ensure content is clipped during animation
        };
    }, [expanded, height]);

    return (
        <Animated.View style={collapsableStyle}>
            <View style={{ position: "absolute" }} onLayout={onLayout}>
                {children}
            </View>
        </Animated.View>
    );
};

export default CollapsibleContainer;
