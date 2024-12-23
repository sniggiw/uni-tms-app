<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>
    </view>
</template>

<script setup>
import { getCustomerInfo } from "@/api/other";
import { useOtherStore, useAuthStore } from "@/stores";
const otherStore = useOtherStore();
const authStore = useAuthStore();

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

</script>

<style lang="scss" scoped></style>
