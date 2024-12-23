import axios from "axios";
import { useAuthStore } from "../stores";

const authStore = useAuthStore();
const request = axios.create({
    // baseURL: "https://www.gosun2.com/tms-app",
    timeout: 60000,
});

// 添加请求拦截器
request.interceptors.request.use(
    // 在发送请求之前做些什么
    function (config) {
        config.headers["Content-Language"] = localStorage.getItem("lang") ? localStorage.getItem("lang") : "zh_CN"; // 语言
        config.headers["X-Request-Client"] = "web"; // 客户端来源:默认web

        if (authStore?.authInfo?.token) {
            config.headers["Authorization"] = "Bearer " + authStore?.authInfo?.token;
        }

        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
request.interceptors.response.use(
    // 对响应数据做点什么
    function (response) {
        if (response.data.code === 401) {
            authStore.clearAuthInfo();
            uni.showToast({
                title: response.data.msg,
                icon: "error",
                duration: 1500,
                success: () => {
                    setTimeout(() => {
                        uni.navigateTo({
                            url: "/pages/login/index",
                        });
                    }, 1500);
                },
            });
        }

        return response.data;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default request;
