// const baseUrl = "https://www.gosun2.com/tms-app";
const baseUrl = "/api";
import { useUserInfoStore } from "@/stores";

const httpInterceptor = {
    // 拦截前出发
    invoke(options) {
        options.url = baseUrl + options.url;
        options.timeout = 10000; // 单位是 ms
        // 添加请求头相关内容
        options.header = {
            ...options.header,
        };

        // 添加 token
        // const token = "xxx";
        // if (token) {
        //     options.header["Authorization"] = token;
        // }
    },
};

uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);

export const http = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            ...options,

            // 请求成功
            success(res) {
                if (res.data.code == 200) {
                    resolve(res.data);
                } else if (res.data.code == 401) {
                    const userInfoStore = useUserInfoStore();
                    userInfoStore.clearUserInfo();
                    uni.navigateTo({ url: "/pages/login/index" });
                    reject(res);
                } else {
                    uni.showToast({
                        icon: "none",
                        title: res.data.msg,
                    });
                    reject(res);
                }
            },
            fail(err) {
                uni.showToast({
                    icon: "none",
                    title: "网络异常",
                });
                reject(err);
            },
        });
    });
};
