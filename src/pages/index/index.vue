<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>
        <button @tap="handleShowCustomPopupPicker">显示自定义弹出层选择器</button>
        <CustomPopupPicker
            ref="customPopupPickerRef"
            v-model="selectedValue"
            :columns="columns"
            @headerBtnStart="handleHideCustomPopupPicker"
            @headerBtnEnd="handleShowCustomPopupPicker"
        />
    </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores";
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

const columns = ref([
    ["选项1", "选项2", "选项3", "选项4", "选项5"],
    ["选项A", "选项B", "选项C", "选项D", "选项E"],
]);

const selectedValue = ref([2, 1]);

const customPopupPickerRef = ref(null);

const handleShowCustomPopupPicker = () => {
    customPopupPickerRef.value.show();
};

const handleHideCustomPopupPicker = () => {
    customPopupPickerRef.value.close();
};
</script>

<style lang="scss" scoped></style>
