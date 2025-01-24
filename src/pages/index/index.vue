<template>
    <view class="index-page">
        <button @tap="judgeToLoginPage">跳转 login</button>
        <button @tap="clearAuthInfoData">清除登录状态</button>
        <button @tap="handleShowCustomPopupPicker">显示自定义弹出层选择器</button>
        <CustomPopupPicker
            ref="customPopupPickerRef"
            v-model="selectedValue"
            :columns="columns"
            @pickerChange="handleChangeSelectAreaText"
            @headerBtnStart="handleHideCustomPopupPicker"
            @headerBtnEnd="handleShowCustomPopupPicker"
        />
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import CustomPopupPicker from "@/components/CustomPopupPicker";
import { useAuthStore } from "@/stores";
import { useAreaList } from "@/hooks/area";

const { originAreaList, countryList, provinceList, cityList, selectAreaCode, changeSelectAreaText } = useAreaList();

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

const customPopupPickerRef = ref(null);

const handleShowCustomPopupPicker = () => {
    customPopupPickerRef.value.show();
};

const handleHideCustomPopupPicker = () => {
    customPopupPickerRef.value.close();
};

const columns = computed(() => {
    return [countryList.value, provinceList.value, cityList.value];
});

const selectedValue = ref([0, 0, 0]);

const handleChangeSelectAreaText = (newValue, oldValue) => {
    const changedIndices = [];
    for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] !== oldValue[i]) {
            changedIndices.push(i);
        }
    }
    if (changedIndices?.length > 0) {
        changeSelectAreaText(changedIndices[0], newValue[changedIndices[0]]);
    }
};
</script>

<style lang="scss" scoped></style>
