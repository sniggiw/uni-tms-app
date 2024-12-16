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
        /**
         * 假设请求地址是 http://localhost:3000/tms-app/login
         * 实际最后请求的地址是 https://www.gosun2.com/tms-app/login -> 将 http://localhost:3000/tms-app/ 替换成了 /，得到 /login，然后拼接到 https://www.gosun2.com/tms-app 后面
         */
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
