import { Text, StatusBar, View, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/Header";
import SettingsCategory, { SettingsOptionItem } from "@/components/Settings";
import { colors, mergeClassNames } from "@/utils/TailwindUtils";
import useColorMode from "@/hooks/useColorMode";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import { useUserStore } from "@/store/UserStore";
import { useAuthStore } from "@/store/AuthStore";
import { router } from "expo-router";

interface MenuCategory {
    title: string;
    options: SettingsOptionItem[];
}

const ProfileCard = ({ user }: { user?: any }) => {
    const { profile } = useUserStore();
    return (
        <View className='rounded-2xl py-4 relative overflow-hidden'>
            {/* Background Design with App Icon */}
            <View className='absolute top-[-0.5rem] right-[-0.5rem] opacity-10'>
                <Image source={require("../../assets/icons/ios-light.png")} className='w-24 h-24' />
            </View>

            {/* User Profile Section */}
            <View className='flex-row items-center gap-4 pb-4'>
                <Image
                    source={{
                        uri:
                            profile?.image ??
                            require("../../assets/images/default-profile-picture.jpg"),
                    }}
                    className='w-24 h-24 rounded-full border-2 border-light-primary-400 dark:border-dark-primary-400'
                />
                <View>
                    <Text className={mergeClassNames("font-base-bold text-2xl", textColors)}>
                        {profile?.name ?? "Guest User"}
                    </Text>
                    <Text className={mergeClassNames("text-lg font-base-regular", textColors)}>
                        {profile?.email ?? "Guest Email"}
                    </Text>
                    <Text className='text-basee font-base-medium text-light-primary-400 dark:text-dark-primary-400 mt-1'>
                        {profile?.plan === "premium" ? "Premium Plan" : "Free Plan"}
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
            title: "Property Management",
            options: [
                {
                    icon: "home-outline",
                    label: "View Your Properties",
                    onPress: () => router.push("/properties"),
                },
                {
                    icon: "add-circle-outline",
                    label: "Add New Property",
                    onPress: () => router.push("/properties/add"),
                },
                {
                    icon: "swap-horizontal-outline",
                    label: "Transfer Property",
                    onPress: () => router.push("/properties/transfer"),
                },
            ],
        },
        {
            title: "Account Settings",
            options: [
                {
                    icon: "person-outline",
                    label: "Edit Profile",
                    onPress: () => router.push("/profile/edit"),
                },
                {
                    icon: "settings-outline",
                    label: "App Settings",
                    onPress: () => router.push("/settings"),
                },
                {
                    icon: "shield-checkmark-outline",
                    label: "Security",
                    onPress: () => router.push("/security"),
                },
            ],
        },
        {
            title: "Support & Legal",
            options: [
                {
                    icon: "help-circle-outline",
                    label: "Help Center",
                    onPress: () => router.push("/support"),
                },
                {
                    icon: "chatbox-ellipses-outline",
                    label: "Send Feedback",
                    onPress: () => router.push("/feedback"),
                },
                {
                    icon: "document-text-outline",
                    label: "Legal Information",
                    onPress: () => router.push("/legal"),
                },
            ],
        },
        {
            title: "Session",
            options: [
                {
                    icon: "log-out-outline",
                    label: "Log Out",
                    onPress: () => {
                        Alert.alert("Log Out", "Are you sure you want to log out?", [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Log Out",
                                style: "destructive",
                                onPress: () => useAuthStore.getState().clearToken(),
                            },
                        ]);
                    },
                },
                {
                    icon: "trash-outline",
                    label: "Delete Account",
                    onPress: () => {
                        Alert.alert(
                            "Delete Account",
                            "This will permanently remove all your data",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => {
                                        useAuthStore.getState().clearToken();
                                        useUserStore.getState().clearProfile();
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
