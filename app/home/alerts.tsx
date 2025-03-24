import { useEffect, useRef } from "react";
import { Animated, Text, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@components/Header";
import { textColors } from "@constants/TailwindClassNameConstants";
import { mergeClassNames } from "@utils/TailwindUtils";

const NoAlerts = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(45)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
            }}
            className='items-center justify-center'
        >
            <View className='items-center'>
                <Text className={mergeClassNames("mb-2 font-base-bold text-xl", textColors)}>
                    No Alerts
                </Text>

                <Text
                    className={mergeClassNames(
                        "font-base-regular text-base text-center",
                        textColors
                    )}
                >
                    You do not have any alerts right now
                </Text>
            </View>
        </Animated.View>
    );
};

const Alerts = () => {
    const alerts = [];
    return (
        <SafeAreaView className='flex-1 bg-light-background dark:bg-dark-background'>
            <StatusBar barStyle='default' />
            {/* Header */}
            <View className='flex px-2'>
                <Header>
                    <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                        Alerts
                    </Text>
                </Header>
            </View>
            <View className='flex flex-1 px-6'>
                {!alerts.length ? (
                    <NoAlerts />
                ) : (
                    <Text className='font-base-bold text-light-fg dark:text-dark-fg'>Alerts</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Alerts;
