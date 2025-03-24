import { View, TextInput, TextInputProps } from "react-native";
import { useTranslation } from "react-i18next";

const I18NTextInput = (props: TextInputProps & { placeholderTranslationKey: string }) => {
    const { placeholderTranslationKey, ...textInputProps } = props;
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
