<template>
  <view class="dropdown-menu" :style="customStyle">
    <slot></slot>
  </view>
</template>

<script setup>
import { provide, ref, watch, computed } from "vue";
const props = defineProps({
  //激活颜色
  activeColor: {
    type: String,
    default: "#3395DC",
  },
  //是否吸顶
  sticky: {
    type: Boolean,
    default: false,
  },
});

//样式设置
const customStyle = computed(() => {
  return props.sticky
    ? {
        position: "sticky",
        // #ifdef H5
        top: "44px",
        // #endif
        // #ifndef H5
        top: 0,
        // #endif
      }
    : null;
});

//当前打开的项（以标题标识）
const currentDropItem = ref("");
provide("activeColor", props.activeColor);
provide("currentDropItem", currentDropItem);
</script>

<style lang="scss" scoped>
.dropdown-menu {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-sizing: border-box;

  &::after {
    display: none;
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: #f2f2f2;
  }
}

/**
 * 兼容小程序端
 */
:deep(dropdown-item) {
  flex: 1;
  width: 0;
}
</style>
