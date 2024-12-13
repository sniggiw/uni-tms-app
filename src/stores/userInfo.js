import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore(
    "userInfo",
    () => {
        const userInfo = ref({});

        const setUserInfo = (info) => {
            userInfo.value = info;
        };

        const clearUserInfo = () => {
            userInfo.value = {};
        };

        return {
            userInfo,
            setUserInfo,
            clearUserInfo,
        };
    },
    // 持久化
    // H5 页面的写法
    {
        persist: {
            enabled: true,
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
