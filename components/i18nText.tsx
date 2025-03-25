import { Text, TextProps } from "react-native";
import i18n from "i18next";

interface I18nTextProps extends TextProps {
    translationKey: string;
}

const I18nText: React.FC<I18nTextProps> = (props) => {
    const { translationKey, ...textProps } = props;

    return <Text {...textProps}>{i18n.t(translationKey)}</Text>;
};

export default I18nText;
