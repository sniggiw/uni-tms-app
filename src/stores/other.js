import { ref } from "vue";
import { defineStore } from "pinia";

export const useOtherStore = defineStore(
    "other",
    () => {
        const otherData = ref();

        const setOtherData = (data) => {
            otherData.value = data;
        };

        const clearOtherData = () => {
            otherData.value = {};
        };

        return {
            otherData,
            setOtherData,
            clearOtherData,
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
