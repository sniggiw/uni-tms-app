import { createSSRApp } from "vue";
import App from "./App.vue";
import "./assets/global.scss";
import VueI18n from "@/locales"

import pinia from "./stores";

export function createApp() {
    const app = createSSRApp(App);
    
    app.use(pinia);
    app.use(VueI18n);
    return {
        app,
    };
}
