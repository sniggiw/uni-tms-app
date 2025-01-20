<template>
  <view class="checkbox-group">
    <slot></slot>
  </view>
</template>

<script setup>
import { provide, ref, watch } from "vue";

// 定义 props
const props = defineProps({
  modelValue: {
    type: [Array, String,Number], // 允许 Array 或 String 类型
    default: () => [],
  },
});

// 定义 emit
const emit = defineEmits(["update:modelValue"]);

// 将 modelValue 转换为响应式对象
const modelValue = ref(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]);

// 监听 props.modelValue 的变化
watch(() => props.modelValue, (newValue) => {
  modelValue.value = Array.isArray(newValue) ? newValue : [newValue];
});

// 提供给子组件的方法，用于更新选中的值
const toggleCheckbox = (value) => {
  const index = modelValue.value.indexOf(value);
  const newValue = [...modelValue.value];
  if (index > -1) {
    newValue.splice(index, 1); // 如果已选中，则取消选中
  } else {
    newValue.push(value); // 如果未选中，则添加到选中列表
  }
  modelValue.value = newValue; // 更新响应式数据
  emit("update:modelValue", newValue); // 触发更新事件
};

// 提供给子组件的依赖注入
provide("toggleCheckbox", toggleCheckbox);
provide("modelValue", modelValue); // 传递响应式的 modelValue
</script>

<style lang="scss" scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
}
</style>