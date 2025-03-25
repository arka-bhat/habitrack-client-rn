import { Text, StatusBar, View, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import SettingsCategory, { SettingsOptionItem } from "@/components/Settings";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import useColorMode from "@/hooks/useColorMode";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";

interface MenuCategory {
    title: string;
    options: SettingsOptionItem[];
}

const ProfileCard = ({ user }: { user?: any }) => {
    return (
        <View className='rounded-2xl py-4 relative overflow-hidden'>
            {/* Background Design with App Icon */}
            <View className='absolute top-[-0.5rem] right-[-0.5rem] opacity-10'>
                <Image source={require("../../assets/icons/ios-light.png")} className='w-24 h-24' />
            </View>

            {/* User Profile Section */}
            <View className='flex-row items-center gap-4 pb-4'>
                <Image
                    source={{ uri: user.profileImage }}
                    className='w-24 h-24 rounded-full border-2 border-light-primary-400 dark:border-dark-primary-400'
                />
                <View>
                    <Text className={mergeClassNames("font-base-bold text-2xl", textColors)}>
                        {user.name}
                    </Text>
                    <Text className={mergeClassNames("text-lg font-base-regular", textColors)}>
                        {user.email}
                    </Text>
                    <Text className='text-basee font-base-medium text-light-primary-400 dark:text-dark-primary-400 mt-1'>
                        {user.plan}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const Profile = () => {
    const { colorMode } = useColorMode();

    const menuData: MenuCategory[] = [
        {
            title: "Orders",
            options: [
                {
                    icon: "bag-outline",
                    label: "Your orders",
                    onPress: () => {},
                },
                {
                    icon: "heart-outline",
                    label: "Favorite orders",
                    onPress: () => {},
                },
            ],
        },
        {
            title: "Payment",
            options: [
                {
                    icon: "card-outline",
                    label: "Saved cards",
                    onPress: () => {},
                },
                {
                    icon: "receipt-outline",
                    label: "Payment history",
                    onPress: () => {},
                },
                {
                    icon: "cash-outline",
                    label: "Refund status",
                    onPress: () => {},
                },
            ],
        },
        {
            title: "Account",
            options: [
                {
                    icon: "person-outline",
                    label: "Edit profile",
                    onPress: () => {},
                },
                {
                    icon: "shield-checkmark-outline",
                    label: "Privacy settings",
                    onPress: () => {},
                },
                {
                    icon: "trash-outline",
                    label: "Delete account",
                    onPress: () => {
                        Alert.alert(
                            "Delete Account",
                            "Are you sure you want to delete your account?\nThis action cannot be undone.",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => {
                                        console.log("Delete account");
                                    },
                                },
                            ]
                        );
                    },
                },
            ],
        },
    ];

    return (
        <SafeAreaView className={mergeClassNames("flex-1", backgroundColors)}>
            <StatusBar barStyle='default' />
            {/* Header */}
            <View className='flex px-2'>
                <Header>
                    <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                        Profile
                    </Text>
                </Header>
            </View>

            {/* Profile Card */}
            <View className='flex flex-1 px-6'>
                <ScrollView className='flex pt-2' showsVerticalScrollIndicator={false}>
                    <ProfileCard
                        user={{
                            name: "John Doe",
                            email: "johndoe@gmail.com",
                            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
                            plan: "Paid Plan",
                        }}
                    />

                    {menuData.map((category, index) => (
                        <SettingsCategory
                            key={`category-${index}`}
                            title={category.title}
                            options={category.options}
                            colorMode={colorMode}
                            colors={colors}
                        />
                    ))}

                    {/* Version */}
                    <View className='flex items-center justify-center mt-20 mb-16'>
                        <Text className='font-base-bold text-2xl text-gray-500 dark:text-gray-400'>
                            HabiTrack
                        </Text>
                        <Text className='font-base-medium text-gray-500 dark:text-gray-400'>
                            Version 1.0
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
