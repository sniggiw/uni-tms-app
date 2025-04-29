import { reactive } from "vue";
import { defineStore } from "pinia";

export const useAreaStore = defineStore(
    "area",
    () => {
        const area = reactive({});

        const setArea = (params) => {
            const keysArr = Object.keys(params);

            keysArr.forEach((key) => {
                if (area.hasOwnProperty(key)) {
                    area[key] = params[key];
                } else {
                    area[key] = params[key];
                }
            });
        };

        const clearArea = () => {
            for (const key in area) {
                delete area[key];
            }
        };

        return {
            area,
            setArea,
            clearArea,
        };
    },
    // 持久化
    // H5 页面的写法
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
                    storage: localStorage,
                },
            ],
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
