import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { CountryCode } from "libphonenumber-js";

import Header from "@components/Header";
import { backgroundColors, textColors } from "@/constants/TailwindClassNameConstants";
import { mergeClassNames } from "@/utils/TailwindUtils";

// Sample country codes (you'd typically import a more comprehensive list)
const COUNTRY_CODES = [
    { index: 1, code: "+1", country: "United States", iso: "US", flag: "🇺🇸" },
    { index: 2, code: "+44", country: "United Kingdom", iso: "GB", flag: "🇬🇧" },
    { index: 3, code: "+91", country: "India", iso: "IN", flag: "🇮🇳" },
    { index: 4, code: "+86", country: "China", iso: "CN", flag: "🇨🇳" },
    { index: 5, code: "+81", country: "Japan", iso: "JP", flag: "🇯🇵" },
    { index: 6, code: "+49", country: "Germany", iso: "DE", flag: "🇩🇪" },
    { index: 7, code: "+33", country: "France", iso: "FR", flag: "🇫🇷" },
    { index: 8, code: "+7", country: "Russia", iso: "RU", flag: "🇷🇺" },
    { index: 9, code: "+61", country: "Australia", iso: "AU", flag: "🇦🇺" },
    { index: 10, code: "+55", country: "Brazil", iso: "BR", flag: "🇧🇷" },
];

interface CountryCodePickerProps {
    selectedCode: string;
    setSelectedCode: (code: string, iso: CountryCode) => void;
    setSelectedISO: (iso: CountryCode) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
    selectedCode = "+1",
    setSelectedCode,
    setSelectedISO,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(selectedCode);

    const handleCodeSelect = (code: string, iso: CountryCode): void => {
        setCurrentCode(code);
        setSelectedCode(code, iso);
        setSelectedISO(iso as CountryCode);
        setIsModalVisible(false);
    };

    return (
        <View className={mergeClassNames("flex", backgroundColors)}>
            <Pressable
                className='bg-light-secondary-100 dark:bg-dark-secondary-800 rounded-md p-3 mr-2 w-20 h-16 justify-center items-center'
                onPress={() => setIsModalVisible(true)}
            >
                <Text className={mergeClassNames("text-xl font-base-bold", textColors)}>
                    {currentCode}
                </Text>
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType='slide'
                presentationStyle='pageSheet'
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className={mergeClassNames("flex-1", backgroundColors)}>
                    <Header
                        iconName='close'
                        iconSize={24}
                        onIconPress={() => setIsModalVisible(false)}
                    >
                        <Text className={mergeClassNames("text-xl font-base-semibold", textColors)}>
                            Select your country
                        </Text>
                    </Header>

                    <FlatList
                        data={COUNTRY_CODES}
                        keyExtractor={(item) => item.index + ""}
                        renderItem={({ item }) => (
                            <Pressable
                                className='p-4 border-b border-b-slate-300 mx-2.5'
                                onPress={() => handleCodeSelect(item.code, item.iso as CountryCode)}
                            >
                                <View
                                    className={mergeClassNames(
                                        "flex-row justify-between",
                                        textColors
                                    )}
                                >
                                    <Text
                                        className={mergeClassNames(
                                            "text-xl font-base-bold",
                                            textColors
                                        )}
                                    >
                                        {`${item.flag} ${item.country}`}
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default CountryCodePicker;
