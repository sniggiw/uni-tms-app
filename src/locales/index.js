
import { createI18n } from "vue-i18n"
import zh from "./lang/zh"
import en from "./lang/en"
// console.log("当前系统语言", uni.getLocale())
const defaultLang = uni.getStorageSync("lang") || "zh"
// console.log("当前系统语言", defaultLang, typeof defaultLang)

const i18n = createI18n({
  locale: defaultLang || "zh",
  messages: {
    en,
    zh
  },
  fallbackLocale: "zh", // 回退语言
  legacy: false
})

export default i18n

