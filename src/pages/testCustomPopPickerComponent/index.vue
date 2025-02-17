<template>
    <view class="testCustomPopPickerComponentPage">
        <uni-forms :modelValue="formData">
            <view class="itemWrap">
                <uni-forms-item label-width="90px" label="发货人地区" name="shipperRegion" @tap="handleShowCustomPopupPicker('shipperRegion')">
                    <view class="regionWrap">
                        <view
                            v-if="
                                mergeStr({
                                    countryText: formData.shipperRegion.countryText,
                                    provinceText: formData.shipperRegion.provinceText,
                                    cityText: formData.shipperRegion.cityText,
                                })
                            "
                            class="region"
                            >{{
                                mergeStr({
                                    countryText: formData.shipperRegion.countryText,
                                    provinceText: formData.shipperRegion.provinceText,
                                    cityText: formData.shipperRegion.cityText,
                                })
                            }}</view
                        >
                        <view v-else class="region_unSelected">请选择发货人地区</view>
                        <uni-icons type="right" size="20" color="#999"></uni-icons>
                    </view>
                </uni-forms-item>

                <uni-forms-item label-width="90px" label="详细地址" name="shipperAddress">
                    <uni-easyinput type="text" v-model="formData.shipperAddress" placeholder="请输入详细地址" :inputBorder="false" :clearable="false" style="text-align: right" />
                </uni-forms-item>
            </view>
        </uni-forms>

        <CustomPopupPicker
            v-if="isShowCustomPopupPicker"
            ref="customPopupPickerRef"
            v-model="formData[currentRegionType == 'shipperRegion' ? 'shipperRegion' : '']"
            @headerBtnStart="handleStart"
            @headerBtnEnd="handleEnd"
            @destroyCustomPopupPicker="handleDestroyCustomPopupPicker"
        />
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useAreaList } from "@/hooks/area";
import CustomPopupPicker from "@/components/CustomPopupPicker/index.vue";

const formData = reactive({
    // 发货人地址
    shipperRegion: {
        countryText: "",
        provinceText: "",
        cityText: "",
        countryAreaCode: "",
        provinceAreaCode: "",
        cityAreaCode: "",
    },
    // 发货人详细地址
    shipperAddress: "",
});

const currentRegionType = ref("");

const mergeStr = (obj) => {
    return Object.values(obj).filter(Boolean).join("-");
};

const customPopupPickerRef = ref(null);

const isShowCustomPopupPicker = ref(false);

const handleDestroyCustomPopupPicker = (status) => {
    isShowCustomPopupPicker.value = status;
};

// 显示 CustomPopupPicker 组件
const handleShowCustomPopupPicker = (val) => {
    currentRegionType.value = val;

    isShowCustomPopupPicker.value = true;
    nextTick(() => {
        customPopupPickerRef.value.show();
    });
};

// 隐藏 CustomPopupPicker 组件
const handleStart = () => {
    customPopupPickerRef.value.close();
};

const handleEnd = () => {
    console.log("handleEnd");
};

onMounted(() => {
    formData.shipperRegion.countryText = "中国";
    formData.shipperRegion.provinceText = "江苏省";
    formData.shipperRegion.cityText = "南京市";

    formData.shipperRegion.countryAreaCode = "001";
    formData.shipperRegion.provinceAreaCode = "001010";
    formData.shipperRegion.cityAreaCode = "00101001";
});
</script>

<style lang="scss" scoped>
.testCustomPopPickerComponentPage {
    padding: 26rpx;
    height: 100vh;
    background-color: #f9f9fa;

    .itemWrap {
        padding: 20rpx 40rpx;
        border-radius: 20rpx;
        background-color: #fff;

        .uni-forms-item {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            padding-top: 20rpx;
            padding-bottom: 20rpx;
            border-bottom: 1rpx solid #eee;
        }

        .uni-forms-item:first-child {
            padding-top: 0;
        }

        .uni-forms-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .regionWrap {
            flex: 1;

            display: flex;
            align-items: center;

            padding-left: 20rpx;

            .region {
                margin-left: auto;
                color: rgb(51, 51, 51);
            }

            .region_unSelected {
                margin-left: auto;
                font-size: 24rpx;
                color: #999;
            }
        }
    }
}
</style>
