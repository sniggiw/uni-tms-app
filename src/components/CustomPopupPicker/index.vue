<template>
    <uni-popup ref="popupRef" background-color="#fff" border-radius="24rpx 24rpx 0 0" @change="handlePopupStatusChange">
        <view class="popup-content">
            <view class="popup-header-btns">
                <view class="popup-header-btns-start" @tap="handleHeaderBtnStart">取消</view>
                <view class="popup-header-btns-end" @tap="handleHeaderBtnEnd">确定</view>
            </view>

            <!-- 搜索 -->
            <view class="popup-search-box">
                <view class="popup-search-box-input">
                    <uni-icons type="search" size="20" color="#999" @tap="handleSearch"></uni-icons>
                    <input type="text" placeholder="请输入搜索内容" v-model="searchText" @input="handleSearch" />
                    <uni-icons type="close" size="20" color="#999" @tap="handleClearSearchContent"></uni-icons>
                </view>
                <view class="popup-search-box-btn" @tap="handleSearch">查询</view>
            </view>

            <!-- 列表，默认为一列，可多列 -->
            <picker-view class="popup-picker-view" :value="pickerValue" @change="onPickerChange">
                <picker-view-column
                    v-for="(column, index) in props.currentRegionType == 'consigneeRegion' ? columns.slice(0, 1) : columns"
                    :key="index"
                >
                    <view class="item" v-for="(item, i) in columns[index]" :key="i">
                        <view class="item-text">{{ item }}</view>
                    </view>
                </picker-view-column>
            </picker-view>
        </view>
    </uni-popup>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDebounce } from "@/hooks/debounce";
import { useAreaList } from "@/hooks/area";

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {},
    },
    currentAreaList: {
        type: Array,
        default: () => [],
    },
    currentRegionType: {
        type: String,
    },
});

const emit = defineEmits(["headerBtnStart", "headerBtnEnd", "destroyCustomPopupPicker", "update:modelValue"]);

const {
    originAreaList,
    countryList,
    provinceList,
    cityList,
    selectAreaText,
    selectAreaCode,
    defaultSelectAreaIndexArr,
    changeSelectAreaText,
    changeOriginAreaList,
} = useAreaList({
    areaList: props.currentAreaList,
    columnsLength: props.currentRegionType == "consigneeRegion" ? 1 : 3,
    selectAreaText: { countryText: props.modelValue.countryText, provinceText: props.modelValue.provinceText, cityText: props.modelValue.cityText },
});

const columns = computed(() => {
    return [countryList.value, provinceList.value, cityList.value];
});

const pickerValue = ref(defaultSelectAreaIndexArr.value);

const popupRef = ref(null);

// 搜索框的搜索内容
const searchText = ref("");

const handlePopupStatusChange = (e) => {
    if (!e.show) {
        emit("destroyCustomPopupPicker", e.show);
    }
};

// 选择器改变事件
const onPickerChange = (e) => {
    const newValue = e.detail.value;
    const oldValue = pickerValue.value;

    const changedIndices = newValue.map((value, index) => (value !== oldValue[index] ? index : -1)).filter((index) => index !== -1);

    if (changedIndices.length > 0) {
        const firstChangedIndex = changedIndices[0];
        pickerValue.value = [
            firstChangedIndex === 0 ? newValue[0] : pickerValue.value[0],
            firstChangedIndex === 1 ? newValue[1] : firstChangedIndex === 2 ? pickerValue.value[1] : 0,
            firstChangedIndex === 2 ? newValue[2] : 0,
        ];
    }

    handleChangeSelectAreaText(pickerValue.value, defaultSelectAreaIndexArr.value);
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

// 显示弹出层选择器
const handleShow = () => {
    popupRef.value.open("bottom");
};

// 隐藏弹出层选择器
const handleHide = () => {
    popupRef.value.close();
};

// 顶部左边按钮点击事件
const handleHeaderBtnStart = () => {
    handleHide();
};

// 顶部右边按钮点击事件
const handleHeaderBtnEnd = () => {
    emit("update:modelValue", { ...selectAreaText, ...selectAreaCode.value });
    emit("headerBtnEnd");
    handleHide();
};

// 搜索按钮点击事件
const handleSearch = useDebounce((e) => {
    handleChangeOriginAreaList(true, e.detail.value || searchText.value);
}, 500);

// 清除搜索内容按钮点击事件
const handleClearSearchContent = () => {
    handleChangeOriginAreaList(false, "");
    searchText.value = "";
};

/**
 * 修改 CustomPopupPicker 组件中的 columns 数据
 * @param isSearch 是否是在搜索条件下
 * @param val 是否有输入搜索内容
 */
const handleChangeOriginAreaList = (isSearch = false, val = "") => {
    changeOriginAreaList(isSearch, val);
};

// 暴露方法给父组件使用（注意暴露方法的时候，需要在定义的方法后面，因为方法不会自动提升）
defineExpose({
    show: handleShow,
    hide: handleHide,
});
</script>

<style scoped lang="scss">
$primary-color: #576b95;
$gray-bg-color: #f5f5f5;
$gray-text-color: #969799;

.popup-content {
    padding: 30rpx 30rpx 0;
    height: 60vh;
    border-radius: 24rpx 24rpx 0 0;
    background-color: #fff;

    display: flex;
    flex-direction: column;

    .popup-header-btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;

        .popup-header-btns-start {
            color: $gray-text-color;
        }

        .popup-header-btns-end {
            color: $primary-color;
        }
    }

    .popup-search-box {
        display: flex;
        align-items: center;

        margin-top: 30rpx;

        .popup-search-box-input {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20rpx;
            border-radius: 50rpx;
            background-color: $gray-bg-color;

            input {
                flex: 1;

                margin-left: 20rpx;
                font-size: 28rpx;
            }
        }

        .popup-search-box-btn {
            display: flex;
            align-items: center;
            justify-content: center;

            margin-left: 30rpx;
            font-size: 28rpx;
        }
    }

    .popup-picker-view {
        flex: 1;

        .item {
            display: flex;
            justify-content: center;
            align-items: center;

            .item-text {
                width: 8em;
                font-size: 30rpx;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
