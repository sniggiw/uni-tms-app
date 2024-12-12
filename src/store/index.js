import { ref } from "vue";
import { defineStore } from "pinia";

export const useIndexStore = defineStore(
    "index",
    () => {
        const indexInfo = ref({});

        const setIndexInfo = (info) => {
            indexInfo.value = info;
        };

        const clearIndexInfo = () => {
            indexInfo.value = {};
        };

        return {
            indexInfo,
            setIndexInfo,
            clearIndexInfo,
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
