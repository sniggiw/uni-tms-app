<template>
    <uni-popup ref="popupRef" background-color="#fff" border-radius="24rpx 24rpx 0 0">
        <view class="popup-content">
            <view class="popup-header-btns">
                <view class="popup-header-btns-start" @tap="handleHeaderBtnStart">取消</view>
                <view class="popup-header-btns-end" @tap="handleHeaderBtnEnd">确定</view>
            </view>

            <!-- 搜索 -->
            <view class="popup-search-box">
                <view class="popup-search-box-input">
                    <uni-icons type="search" size="20" color="#999" @tap="handleSearch"></uni-icons>
                    <input type="text" placeholder="请输入搜索内容" />
                    <uni-icons type="close" size="20" color="#999" @tap="handleClearSearchContent"></uni-icons>
                </view>
                <view class="popup-search-box-btn" @tap="handleSearch">查询</view>
            </view>

            <!-- 列表，默认为一列，可多列 -->
            <CustomPicker />
        </view>
    </uni-popup>
</template>

<script setup>
import { ref } from "vue";
import CustomPicker from "@/components/CustomPicker";

const popupRef = ref(null);

// 显示弹出层选择器
const handleShow = () => {
    console.log("show");
    popupRef.value.open("bottom");
};

// 隐藏弹出层选择器
const handleHide = () => {
    console.log("hide");
    popupRef.value.close();
};

// 顶部左边按钮点击事件
const handleHeaderBtnStart = () => {
    console.log("btn end");
    handleHide();
};

// 顶部右边按钮点击事件
const handleHeaderBtnEnd = () => {
    console.log("btn start");
    handleHide();
};

// 搜索按钮点击事件
const handleSearch = () => {
    console.log("search");
};

// 清除搜索内容按钮点击事件
const handleClearSearchContent = () => {
    console.log("clear search content");
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
}
</style>
