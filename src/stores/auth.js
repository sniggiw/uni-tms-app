import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore(
    "auth",
    () => {
        const authInfo = ref(null);

        const setAuthInfo = (info) => {
            authInfo.value = info;
        };

        const clearAuthInfo = () => {
            authInfo.value = null;
        };

        return {
            authInfo,
            setAuthInfo,
            clearAuthInfo,
        };
    },
    // 持久化
    // H5 页面的写法
    {
        persist: {
            enabled: true,
            strategies: [{
                // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
                storage: localStorage,
            }],
        },
    }
    // 小程序中的写法
    // {
    //     persist: {
    //         storage: {
    //             getItem(key) {
    //                 return uni.getStorageSync(key);
    //             },
    //             setItem(key, value) {
    //                 return uni.setStorageSync(key, value);
    //             },
    //         },
    //     },
    // }
);
