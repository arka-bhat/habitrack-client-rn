import { View, TextInput, TextInputProps } from "react-native";
import { useTranslation } from "react-i18next";

interface I18NTextInputProps extends TextInputProps {
    placeholderTranslationKey: string;
}

const I18NTextInput = ({ placeholderTranslationKey, ...textInputProps }: I18NTextInputProps) => {
    const { t } = useTranslation(); // Get translation function

    return (
        <View>
            <TextInput
                {...textInputProps}
                placeholder={t(placeholderTranslationKey)} // Translate the placeholder text
            />
        </View>
    );
};

export default I18NTextInput;
