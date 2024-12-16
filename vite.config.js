import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [uni()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    server: {
        // 实际最后请求的地址是 https://www.gosun2.com/tms-app
        proxy: {
            "/tms-app": {
                target: "https://www.gosun2.com/tms-app",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/tms-app/, "/"),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
                silenceDeprecations: ["legacy-js-api"],
            },
        },
    },
});
