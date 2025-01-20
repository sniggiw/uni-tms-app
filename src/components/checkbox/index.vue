<template>
  <view
    class="checkbox"
    :class="{ checked: isChecked, disabled: props.disabled }"
    @tap="handleClick"
  >
    <view class="checkbox-icon">
      <!-- 使用 slot 自定义图标，如果没有传递 slot，则使用默认图标 -->
      <slot name="icon" :checked="isChecked">
        <view class="icon" v-if="isChecked">✔</view>
      </slot>
    </view>
    <view class="checkbox-label">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { inject, computed, watch } from "vue";

// 定义 props
const props = defineProps({
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isDefault: {
    type: Number,
    default: 0,
  },
});

// 获取父组件提供的 toggleCheckbox 方法
const toggleCheckbox = inject("toggleCheckbox");

// 获取父组件的 modelValue，并确保它始终是一个数组
const modelValue = inject("modelValue", () => []);

// 计算当前 checkbox 是否被选中
const isChecked = computed(() => {
  // 确保 modelValue 是一个数组
  const values = Array.isArray(modelValue.value) ? modelValue.value : [];
  return values.includes(props.value);
});

// 监听 isDefault 的变化，当 isDefault 为 1 时自动勾选
watch(
  () => props.isDefault,
  (newVal) => {
    if (newVal === 1 && !isChecked.value) {
      toggleCheckbox(props.value);
    }
  },
  { immediate: true }
);

// 点击事件，调用父组件的方法
const handleClick = () => {
  if (!props.disabled) {
    toggleCheckbox(props.value);
  }
};
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin: 10rpx 0;
  border-radius: 10rpx;
  cursor: pointer;
}

// .checkbox.checked {

//   color: white;

// }

.checkbox.disabled {
  background-color: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.checkbox-icon {
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #ccc;
  border-radius: 50%;
  background-color: white;
}

.checkbox-icon .icon {
  color: white;
  font-size: 32rpx;
}

.checkbox.checked .checkbox-icon {
  background-color: #ee0a24;
  border-color: #ee0a24;
}
</style>