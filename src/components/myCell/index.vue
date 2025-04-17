<template>
  <view class="my-cell" @tap="onClick">
    <!-- 左侧标题 -->
    <view class="my-cell__title">
      <slot name="title">{{ title }}</slot>
    </view>

    <!-- 中间内容 -->
    <view class="my-cell__value">
      <slot name="value">{{ value }}</slot>
    </view>

    <!-- 右侧插槽 -->
    <view class="my-cell__right">
      <slot name="right">
        <!-- 默认右侧图标 -->
        <uni-icons v-if="isLink" type="arrowright" size="16" color="#969799"></uni-icons>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  isLink: {
    type: Boolean,
    default: false
  }
});

// 定义 emits
const emit = defineEmits(['click']);

// 点击事件处理函数
const onClick = () => {
  emit('click');
};
</script>

<style scoped>
.my-cell {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 2rpx solid #ebedf0;
}

.my-cell__title {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.my-cell__value {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: #969799;
}

.my-cell__right {
  margin-left: 10rpx;
  display: flex;
  align-items: center;
}
</style>