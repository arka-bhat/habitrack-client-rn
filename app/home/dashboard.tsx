import { useEffect } from "react";
import { Text, View, Image, Pressable, StatusBar, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Header from "@/components/Header";
import Dropdown from "@/components/DropdownPicker";
import ExpandableSection from "@/components/ExpandableSection";
import useColorMode from "@/hooks/useColorMode";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";

const NoContent = () => {
    const fadeAnim = useSharedValue(0);
    const translateYAnim = useSharedValue(65);

    const handleAddAsset = (): void => {
        router.navigate("/assets/addOrUpdateAsset");
    };

    useEffect(() => {
        fadeAnim.value = withTiming(1, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
        });
        translateYAnim.value = withTiming(0, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
            transform: [{ translateY: translateYAnim.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle} className='items-center justify-center'>
            {/* No Content image */}
            <View className='mb-8 w-full'>
                <Image
                    source={{ uri: "https://picsum.photos/1920/1200" }}
                    className='w-full h-60 rounded-lg '
                    resizeMode='stretch'
                />
            </View>

            <View className='items-center'>
                <Text className={mergeClassNames("font-base-bold text-xl mb-2", textColors)}>
                    You haven't added any assets yet
                </Text>

                <Text
                    className={mergeClassNames(
                        "font-base-regular text-base text-center",
                        textColors
                    )}
                >
                    Add your assets to keep track of their warranty and service history
                </Text>

                <Pressable
                    className='w-full mt-6 mb-4 p-4 rounded-md items-center bg-light-primary-400 dark:bg-dark-primary-500 active:bg-light-primary-500 dark:active:bg-dark-primary-600'
                    onPress={handleAddAsset}
                >
                    <Text className='text-white font-base-medium'>Add Asset</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
};

const DashboardContent = () => {
    // Example FAQ data
    const faqData = [
        {
            title: "How to place an order",
            content:
                "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit cards and digital wallets.",
        },
        {
            title: "Shipping and delivery",
            content:
                "We typically process orders within 1-2 business days. Standard shipping takes 3-5 business days, while express shipping delivers your items within 1-2 business days. You can track your package using the tracking number provided in your order confirmation email.",
        },
        {
            title: "Returns and refunds",
            content:
                "If you're not satisfied with your purchase, you can return it within 30 days for a full refund. Items must be in their original condition and packaging. Once we receive your return, we'll process your refund within 5-7 business days.",
        },
    ];

    return (
        <ScrollView className='flex-1 py-4' showsVerticalScrollIndicator={false}>
            <Text className={mergeClassNames("`text-2xl font-base-bold mb-6", textColors)}>
                Frequently Asked Questions
            </Text>

            {faqData.map((item, index) => (
                <ExpandableSection
                    key={`faq-${index}`}
                    title={item.title}
                    titleTextClassName={mergeClassNames("text-base font-base-medium", textColors)}
                >
                    <Text
                        className={mergeClassNames(
                            "text-base font-base-regular leading-6 py-4",
                            textColors
                        )}
                    >
                        {item.content}
                    </Text>
                </ExpandableSection>
            ))}
        </ScrollView>
    );
};

const Dashboard = () => {
    const { colorMode } = useColorMode();

    const content = [];
    return (
        <SafeAreaView className={mergeClassNames("flex flex-1", backgroundColors)}>
            <StatusBar barStyle='default' />
            {/* Header */}
            <View className='flex px-2'>
                <Header
                    iconName='search-outline'
                    onIconPress={() => console.log("icon press")}
                    iconSize={24}
                >
                    {/* <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                        Dashboard
                    </Text> */}
                    <Dropdown
                        centeredDropdown={true}
                        insideScrollView={false}
                        minHeight={130}
                        dropdownWidth='60%'
                        options={[
                            { label: "Option 1", value: "1" },
                            { label: "Option 2", value: "2" },
                        ]}
                        onSelect={(value) => Alert.alert(`Selected option: ${value}`)}
                        closeOnSelect={true}
                        containerClassName={mergeClassNames("h-15 w-52", backgroundColors)}
                        placeholderClassName='bg-transparent'
                        placeholderTextClassName={mergeClassNames(
                            "font-base-semibold text-base",
                            textColors
                        )}
                        labelClassName={mergeClassNames("font-base-semibold text-base", textColors)}
                        dropdownContainerClassName={mergeClassNames(
                            "rounded-lg mt-1 shadow-sm",
                            backgroundColors
                        )}
                        optionClassName={mergeClassNames(
                            "font-base-semibold text-base",
                            textColors
                        )}
                        backdropClassName='bg-light-secondary-200/30 rounded-lg'
                        lastElement={
                            <Pressable
                                className={mergeClassNames(
                                    "flex-row h-20 mx-3 py-4 justify-between border-t-hairline dark:border-light-secondary-200",
                                    backgroundColors
                                )}
                                onPress={() => Alert.alert("Add new property")}
                            >
                                <Text
                                    className={mergeClassNames("font-base-medium", textColors)}
                                    numberOfLines={1}
                                >
                                    Add a new property
                                </Text>
                                <Ionicons name='add' size={20} color={colors[colorMode].fg} />
                            </Pressable>
                        }
                    />
                </Header>
            </View>
            {/* Content */}
            <View className='flex-1 px-6'>
                {!content.length ? (
                    <NoContent />
                ) : (
                    <>
                        <Text className={mergeClassNames("font-base-bold", textColors)}>
                            Dashboard
                        </Text>
                        <DashboardContent />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Dashboard;
