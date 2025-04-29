import React, { useEffect, useMemo } from "react";
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
import { useAssetStore } from "@/store/AssetStore";
import { CategorizedAssets } from "@/types/asset";

const NoContent = () => {
    const fadeAnim = useSharedValue(0);
    const translateYAnim = useSharedValue(65);

    const handleAddAsset = (): void => {
        router.navigate("/assets/addOrUpdate");
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

interface DashboardContentProps {
    categorizedAssets: CategorizedAssets;
}

const DashboardContent = ({ categorizedAssets }: DashboardContentProps) => {
    return (
        <ScrollView className='py-4' showsVerticalScrollIndicator={false}>
            {Object.entries(categorizedAssets).map(([categoryKey, { assets, count, label }]) => (
                <ExpandableSection
                    key={categoryKey}
                    title={`${label || categoryKey} (${count})`}
                    titleTextClassName={mergeClassNames("text-lg font-base-bold", textColors)}
                >
                    {/* Assets Grid */}
                    {assets.length > 0 ? (
                        <View className='flex-row flex-wrap justify-between mt-2 border'>
                            {assets.map((asset) => (
                                <View
                                    key={asset.id}
                                    className='w-[48%] mb-4 bg-card dark:bg-card-dark rounded-lg p-3 shadow-sm'
                                >
                                    {/* Asset Image */}
                                    {asset.images?.[0] ? (
                                        <Image
                                            source={{ uri: asset.images[0].uri }}
                                            className='w-full aspect-square rounded-lg mb-2'
                                            resizeMode='cover'
                                        />
                                    ) : (
                                        <View className='w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center'>
                                            <Text
                                                className={mergeClassNames(
                                                    "text-gray-500 dark:text-gray-400",
                                                    textColors
                                                )}
                                            >
                                                No Image
                                            </Text>
                                        </View>
                                    )}

                                    {/* Asset Info */}
                                    <Text
                                        className={mergeClassNames(
                                            "text-sm font-base-medium truncate",
                                            textColors
                                        )}
                                        numberOfLines={1}
                                    >
                                        {asset.displayName || asset.name}
                                    </Text>
                                    {asset.room && (
                                        <Text
                                            className={mergeClassNames(
                                                "text-xs font-base-regular mt-1",
                                                textColors
                                            )}
                                            numberOfLines={1}
                                        >
                                            {asset.room}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text
                            className={mergeClassNames(
                                "text-sm font-base-regular italic mt-2",
                                textColors
                            )}
                        >
                            No assets in this category
                        </Text>
                    )}
                </ExpandableSection>
            ))}
        </ScrollView>
    );
};

const Dashboard = () => {
    const { colorMode } = useColorMode();
    const { assets, getAssetsByRooms } = useAssetStore();

    const categorizedAssets = useMemo(() => {
        return getAssetsByRooms();
    }, [assets]);

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
                {!assets.length ? (
                    <NoContent />
                ) : (
                    <>
                        <DashboardContent categorizedAssets={categorizedAssets} />
                        {console.log(assets)}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Dashboard;
