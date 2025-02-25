<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>

        <button @tap="judgeToTestCustomPopPickerComponentPage">跳转 测试自定义的地区查找组件 页面</button>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllAreaList } from "@/api/other";
import { useAuthStore } from "@/stores";
import { useAreaStore } from "@/stores/area";
const authStore = useAuthStore();
const areaStore = useAreaStore();

const clearAuthInfoData = () => {
    authStore.clearAuthInfo();
    getCustomerInfoData();
};

const judgeToLoginPage = () => {
    uni.navigateTo({
        url: "/pages/login/index",
    });
};

const handleGetAllAreaListData = async () => {
    const res = await getAllAreaList();
    areaStore.setArea({ cnAreaList: res[0].data, enCountryAreaList: res[1].data });
};

const judgeToTestCustomPopPickerComponentPage = () => {
    uni.navigateTo({
        url: "/pages/testCustomPopPickerComponent/index",
    });
};

onMounted(() => {
    handleGetAllAreaListData();
});
</script>

<style lang="scss" scoped></style>
