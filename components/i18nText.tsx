import { Text, TextProps } from "react-native";
import { useTranslation } from "react-i18next";

interface I18nTextProps extends TextProps {
    translationKey: string;
}

const I18nText: React.FC<I18nTextProps> = (props) => {
    const { translationKey, ...textProps } = props;
    const { t } = useTranslation();

    return <Text {...textProps}>{t(translationKey)}</Text>;
};

export default I18nText;
