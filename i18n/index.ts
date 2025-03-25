import i18n, { t } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./json/en.json";
import hi from "./json/hi.json";
import es from "./json/es.json";

enum LangCode {
    en = "en",
    hi = "hi",
    es = "es",
}

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
    hi: {
        translation: hi,
    },
};

const initalizeI18Next = () => {
    i18n.use(initReactI18next).init({
        debug: false,
        resources,
        lng: LangCode.en,
        fallbackLng: LangCode.en,
        compatibilityJSON: "v4",
        interpolation: {
            escapeValue: false,
        },
    });
};

export default { initalizeI18Next };

export { LangCode };
