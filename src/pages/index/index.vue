<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
    </view>
</template>

<script setup>
import { getCity } from "@/api/other";
import { useOtherStore } from "@/stores";
const otherStore = useOtherStore();

const getCityData = async () => {
    const res = await getCity();

    if (res.code == 200) {
        otherStore.setOtherData(res.data);
    }
};

const clearOtherData = () => {
    otherStore.clearOtherData();
};

const judgeToLoginPage = () => {
    uni.navigateTo({
        url: "/pages/login/index",
    });
};
</script>

<style lang="scss" scoped></style>
