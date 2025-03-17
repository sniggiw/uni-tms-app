import { ref } from "vue";

// 防抖 hook
export function useDebounce(fn, delay = 300) {
    // 定义一个定时器
    const timer = ref(null);

    // 定义一个防抖函数
    const debouncedFn = (...args) => {
        // 如果定时器存在，则清除定时器
        if (timer.value) {
            clearTimeout(timer.value);
        }
        // 设置定时器，延迟执行传入的函数
        timer.value = setTimeout(() => {
            fn(...args);
        }, delay);
    };

    // 返回防抖函数
    return debouncedFn;
}
