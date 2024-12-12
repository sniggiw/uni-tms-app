<template>
    <view class="index-page">
        <view class="info-container">
            <view class="info-item">姓名：{{ indexStore.indexInfo.name || "空" }}</view>
            <view class="info-item">年龄：{{ indexStore.indexInfo.age || "空" }}</view>
        </view>

        <view class="btn-container">
            <view class="save-btn" @tap="saveIndexInfo()">添加并保存页面信息</view>
            <view class="clear-btn" @tap="clearIndexInfo()">清除页面信息</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from "vue";
import { useIndexStore } from "@/store/index";

const indexStore = useIndexStore();

const saveIndexInfo = () => {
    indexStore.setIndexInfo({ name: "张三", age: 18 });
};

const clearIndexInfo = () => {
    indexStore.clearIndexInfo();
};
</script>

<style lang="scss" scoped>
.index-page {
    padding: 20px;
    width: 100vw;
    height: 100vh;

    .info-container {
        margin-bottom: 10px;
        width: 100%;
    }

    .btn-container {
        display: flex;
        view {
            margin-right: 10px;
            padding: 5px 10px;
            border-radius: 6px;
            color: #fff;
        }

        .save-btn {
            background-color: #27ae60;
        }

        .clear-btn {
            background-color: #e74c3c;
        }
    }
}
</style>
