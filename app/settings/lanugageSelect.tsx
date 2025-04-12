import { LangCode, LanguageMetadata } from "@/i18n";
import { useUserStore } from "@/store/UserStore";
import { FlatList, Pressable, Text } from "react-native";

const LanguagePicker = () => {
    const { userLanguage, setLanguage } = useUserStore();

    // Get languages dynamically from enum
    const supportedLangs = Object.values(LangCode).map((code) => ({
        code,
        ...LanguageMetadata[code],
    }));

    const handleSelect = (langCode: LangCode) => {
        setLanguage(langCode);
    };

    return (
        <FlatList
            data={supportedLangs}
            renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item.code)}>
                    <Text>
                        {item.flag} {item.name}
                    </Text>
                </Pressable>
            )}
        />
    );
};

export default LanguagePicker;
