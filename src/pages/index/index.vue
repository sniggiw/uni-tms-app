<template>
    <view class="index-page">
        <button @tap="getCityData">点击获取城市数据</button>
        <button @tap="clearOtherData">清除城市数据</button>

        <view>城市数据：</view>
        <view v-for="item in otherStore?.otherData[0]?.children" :key="item.id">{{ item.areaName }}</view>
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
</script>

<style lang="scss" scoped></style>
