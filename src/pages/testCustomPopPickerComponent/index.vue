<template>
    <view class="testCustomPopPickerComponentPage">
        <uni-forms :modelValue="formData">
            <view class="itemWrap">
                <!-- 发货人地址 -->
                <uni-forms-item label-width="90px" label="发货人地区" name="shipperRegion" @tap="handleShowCustomPopupPicker('shipperRegion')">
                    <view class="regionWrap">
                        <view v-if="shipperRegionText" class="region">{{ shipperRegionText }}</view>
                        <view v-else class="region_unSelected">请选择发货人地区</view>
                        <uni-icons type="right" size="20" color="#999"></uni-icons>
                    </view>
                </uni-forms-item>

                <uni-forms-item label-width="90px" label="详细地址" name="shipperAddress">
                    <uni-easyinput type="text" v-model="formData.shipperAddress" placeholder="请输入详细地址" :inputBorder="false" :clearable="false" style="text-align: right" />
                </uni-forms-item>

                <!-- 收货人地址 -->
                <uni-forms-item label-width="90px" label="收货人地区" name="consigneeRegion" @tap="handleShowCustomPopupPicker('consigneeRegion')">
                    <view class="regionWrap">
                        <view v-if="consigneeRegionText" class="region">{{ consigneeRegionText }}</view>
                        <view v-else class="region_unSelected">请选择收货人地区</view>
                        <uni-icons type="right" size="20" color="#999"></uni-icons>
                    </view>
                </uni-forms-item>
            </view>
        </uni-forms>

        <view class="btnFixed">
            <view class="btn" @click="handleSubmit">提交</view>
        </view>

        <CustomPopupPicker
            v-if="isShowCustomPopupPicker"
            ref="customPopupPickerRef"
            v-model="formData[currentRegionType == 'shipperRegion' ? 'shipperRegion' : 'consigneeRegion']"
            v-model:currentAreaList="currentAreaList"
            @headerBtnStart="handleStart"
            @headerBtnEnd="handleEnd"
            @destroyCustomPopupPicker="handleDestroyCustomPopupPicker"
        />
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useAreaStore } from "@/stores/area";
import { useAreaList } from "@/hooks/area";
import CustomPopupPicker from "@/components/CustomPopupPicker/index.vue";

const areaStore = useAreaStore();

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

    // 收货人地址
    consigneeRegion: {
        countryText: "",
        provinceText: "",
        cityText: "",
        countryAreaCode: "",
        provinceAreaCode: "",
        cityAreaCode: "",
    },
});

const shipperRegionText = computed(() => {
    return mergeStr({
        countryText: formData.shipperRegion.countryText,
        provinceText: formData.shipperRegion.provinceText,
        cityText: formData.shipperRegion.cityText,
    });
});

const consigneeRegionText = computed(() => {
    return mergeStr({
        countryText: formData.consigneeRegion.countryText,
        provinceText: formData.consigneeRegion.provinceText,
        cityText: formData.consigneeRegion.cityText,
    });
});

// 当存在多个位置需要使用到 CustomPopupPicker 组件时，为了避免多次创建 CustomPopupPicker 组件，可以在采用动态传递参数的方式，通过传递不同的参数来控制显示 CustomPopupPicker 组件该显示什么内容
// 现在的 demo 是有两个情况，一是发货人地区，用 shipperRegion 来表示，二是收货人地区，用 consigneeRegion 来表示
const currentRegionType = ref("");

const currentAreaList = ref([]);

const mergeStr = (obj) => {
    return Object.values(obj).filter(Boolean).join("-");
};

const customPopupPickerRef = ref(null);

const isShowCustomPopupPicker = ref(false);

const handleDestroyCustomPopupPicker = (status) => {
    isShowCustomPopupPicker.value = status;
};

// 显示 CustomPopupPicker 组件
const handleShowCustomPopupPicker = async (val) => {
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

const handleSubmit = () => {
    console.log("handleSubmit", formData);
};

onMounted(() => {
    currentAreaList.value = currentRegionType.value == "aaa" ? areaStore.area.enCountryList : areaStore.area.cnAreaList;

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

    position: relative;

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

    .btnFixed {
        position: fixed;
        bottom: 0;
        left: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 150rpx;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        background-color: #fff;
        box-shadow: 0 4rpx 4rpx 3rpx rgba(0, 0, 0, 0.2);

        .btn {
            width: 80%;
            height: 80rpx;
            font-size: 30rpx;
            border-radius: 40rpx;
            color: #fff;
            background-color: red;

            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
