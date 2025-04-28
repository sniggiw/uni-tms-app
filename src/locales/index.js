import { createI18n } from "vue-i18n";
import zhHans from "./lang/zh-Hans.js";
import en from "./lang/en.js";

const i18n = createI18n({
    legacy: false,
    locale: uni.getLocale() || "zh-Hans",
    fallbackLocale: "zh-Hans",
    messages: {
        "zh-Hans": zhHans,
        en,
    },
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
});

export default i18n;
