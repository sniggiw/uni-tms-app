
import { createI18n } from "vue-i18n"
import zh_CN from "./lang/zh"
import en_US from "./lang/en"
// console.log("当前系统语言", uni.getLocale())
const defaultLang = uni.getStorageSync("lang") || "zh_CN"
// console.log("当前系统语言", defaultLang, typeof defaultLang)

const i18n = createI18n({
  locale: defaultLang || "zh_CN",
  messages: {
    en_US,
    zh_CN
  },
  fallbackLocale: "zh_CN", // 回退语言
  legacy: false
})

export default i18n

