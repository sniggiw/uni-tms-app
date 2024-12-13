import { createSSRApp } from "vue";
import App from "./App.vue";
import "./assets/global.scss";

import pinia from "./stores";

export function createApp() {
    const app = createSSRApp(App);

    app.use(pinia);

    return {
        app,
    };
}
