<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>
        <button @tap="handleShowCustomPopupPicker">显示自定义弹出层选择器</button>

        <view
            >当前选中的地点为：{{
                Object.entries(selectAreaText)
                    .map(([key, value]) => value)
                    .filter((item) => !!item)
                    .join("-")
            }}</view
        >
        <view
            >当前选中地点的 areaCode 为：{{
                Object.entries(selectAreaCode)
                    .map(([key, value]) => value)
                    .filter((item) => !!item)
                    .join("-")
            }}</view
        >

        <CustomPopupPicker
            ref="customPopupPickerRef"
            v-model="selectedValue"
            :columns="columns"
            @pickerChange="handleChangeSelectAreaText"
            @headerBtnStart="handleStart"
            @headerBtnEnd="handleEnd"
            @changeOriginAreaList="handleChangeOriginAreaList"
        />
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores";
import { useAreaList } from "@/hooks/area";
import CustomPopupPicker from "@/components/CustomPopupPicker";

const authStore = useAuthStore();

const clearAuthInfoData = () => {
    authStore.clearAuthInfo();
    getCustomerInfoData();
};

const judgeToLoginPage = () => {
    uni.navigateTo({
        url: "/pages/login/index",
    });
};

const { originAreaList, countryList, provinceList, cityList, selectAreaText, selectAreaCode, changeSelectAreaText, changeOriginAreaList } = useAreaList();

const customPopupPickerRef = ref(null);

// CustomPopupPicker 组件中初始选中的值，是一个数组，数组中的每一项对应 columns 中的每一列的索引（三列都要给默认值）
const selectedValue = ref([0, 0, 0]);

// 传递给 CustomPopupPicker 组件的 columns 数据
const columns = computed(() => {
    return [countryList.value, provinceList.value, cityList.value];
});

// 显示 CustomPopupPicker 组件
const handleShowCustomPopupPicker = () => {
    customPopupPickerRef.value.show();
};

// 隐藏 CustomPopupPicker 组件
const handleStart = () => {
    customPopupPickerRef.value.close();
};

const handleEnd = () => {
    console.log("handleEnd");
};

/**
 * 当 CustomPopupPicker 组件中某一列的值发生变化时，触发该函数
 *
 * @param newValue 新的数组索引值 如：[1, 0, 0]
 * @param oldValue 旧的数组索引值 如：[0, 0, 0]
 */
const handleChangeSelectAreaText = (newValue, oldValue) => {
    // 找到新旧数组中发生变化的某一（多）项的索引，push 到 changedIndices 数组中
    const changedIndices = [];
    for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] !== oldValue[i]) {
            changedIndices.push(i);
        }
    }

    // 如果 changedIndices 数组中存在元素，则说明某一（多）列的值发生了变化，此时需要更新 CustomPopupPicker 组件中对应列的值（展示的值）
    if (changedIndices?.length > 0) {
        changeSelectAreaText(changedIndices[0], newValue[changedIndices[0]]);
    }
};

/**
 * 修改 CustomPopupPicker 组件中的 columns 数据
 * @param isSearch 是否是在搜索条件下
 * @param val 是否有输入搜索内容
 */
const handleChangeOriginAreaList = (isSearch = false, val = "") => {
    changeOriginAreaList(isSearch, val);
};
</script>

<style lang="scss" scoped></style>
