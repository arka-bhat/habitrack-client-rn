import { Text, TextProps } from "react-native";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const I18nText = (props: TextProps & { translationKey: string }) => {
    const { translationKey, ...textProps } = props;

    return <Text {...textProps}>{i18n.t(translationKey)}</Text>;
};

export default I18nText;
