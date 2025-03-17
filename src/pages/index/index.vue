<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>
        <button @tap="judgeInuqieyPage">询价</button>
        <button @tap="judgeToTestCustomPopPickerComponentPage">跳转 测试自定义的地区查找组件 页面</button>
    </view>
</template>

<script setup>
import { getCustomerInfo, getAllAreaList } from "@/api/other";
import { useOtherStore, useAuthStore, useAreaStore } from "@/stores";

const otherStore = useOtherStore();
const authStore = useAuthStore();
const areaStore = useAreaStore();

const getCustomerInfoData = async () => {
    const res = await getCustomerInfo();

    if (res.code == 200) {
        console.log("custom info", res);
    }
};

getCustomerInfoData();

const clearAuthInfoData = () => {
    authStore.clearAuthInfo();
    getCustomerInfoData();
};

const judgeToLoginPage = () => {
    uni.navigateTo({
        url: "/pages/login/index",
    });
};

const judgeInuqieyPage = () => {
    uni.navigateTo({
        url: "/pages/inquiry/index",
    });
};

const judgeToTestCustomPopPickerComponentPage = () => {
    uni.navigateTo({
        url: "/pages/testCustomPopPickerComponent/index",
    });
};
</script>

<style lang="scss" scoped></style>
