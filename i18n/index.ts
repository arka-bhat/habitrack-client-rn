import i18n, { t } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./json/en.json";
import hi from "./json/hi.json";
import es from "./json/es.json";

export enum LangCode {
    en = "en",
    hi = "hi",
    es = "es",
}

type LanguageMeta = {
    name: string;
    flag: string;
    isRTL?: boolean;
};

export const LanguageMetadata: Record<LangCode, LanguageMeta> = {
    [LangCode.en]: { name: "English", flag: "🇬🇧", isRTL: false },
    [LangCode.hi]: { name: "हिन्दी", flag: "🇮🇳" }, // Hindi
    [LangCode.es]: { name: "Español", flag: "🇪🇸" },
};

export const isValidLang = (lang: string): lang is LangCode => {
    return Object.values(LangCode).includes(lang as LangCode);
};

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

let isInitialized = false;

export const initalizeI18Next = (initialLang = LangCode.en) => {
    if (!isInitialized) {
        isInitialized = true;
        return i18n.use(initReactI18next).init({
            debug: false,
            resources,
            lng: initialLang,
            fallbackLng: LangCode.en,
            compatibilityJSON: "v4",
            interpolation: { escapeValue: false },
        });
    }
    return Promise.resolve();
};

// Add this getter
export const isI18nReady = () => isInitialized;
