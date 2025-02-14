<template>
    <view class="testCustomPopPickerComponentPage">
        <uni-forms :modelValue="formData">
            <view class="itemWrap">
                <uni-forms-item label-width="90px" label="姓名" name="name">
                    <uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" :inputBorder="false" :clearable="false" style="text-align: right" />
                </uni-forms-item>
                <uni-forms-item label-width="90px" label="发货人地区" name="region" @tap="handleShowCustomPopupPicker">
                    <view class="regionWrap">
                        <view v-if="formData.region" class="region">{{ formData.region }}</view>
                        <view v-else class="region_unSelected">请选择发货人地区</view>
                        <uni-icons type="right" size="20" color="#999"></uni-icons>
                    </view>
                </uni-forms-item>
            </view>
        </uni-forms>

        <CustomPopupPicker
            ref="customPopupPickerRef"
            v-model="defaultSelectedValue"
            :columns="columns"
            @pickerChange="handleChangeSelectAreaText"
            @headerBtnStart="handleStart"
            @headerBtnEnd="handleEnd"
            @changeOriginAreaList="handleChangeOriginAreaList"
        />
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAreaList } from "@/hooks/area2";
import CustomPopupPicker from "@/components/CustomPopupPicker/index2.vue";

const formData = reactive({
    name: "",
    region: "",
    counntryText: "",
    provinceText: "",
    cityText: "",
});

const { originAreaList, countryList, provinceList, cityList, selectAreaText, selectAreaCode, defaultSelectAreaIndexArr, changeSelectAreaText, changeOriginAreaList } =
    useAreaList(null);

const customPopupPickerRef = ref(null);

// CustomPopupPicker 组件中初始选中的值，是一个数组，数组中的每一项对应 columns 中的每一列的索引（三列都要给默认值）
const defaultSelectedValue = ref(defaultSelectAreaIndexArr.value);

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
