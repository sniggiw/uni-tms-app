<template>
  <view class="scrollText" ref="outer">
    <view class="st-inner" :class="{ 'st-scrolling': needToScroll }">
      <text class="st-section" ref="inner">{{ text }}</text>
      <text class="st-section" v-if="needToScroll">{{ text }}</text>
      
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue';

// 数据
const outer = ref(null); // 外层容器
const inner = ref(null); // 内层文本
const needToScroll = ref(false); // 是否需要滚动
const text = ref(''); // 显示的文本

// 获取插槽内容
const slots = useSlots();

// 检查当前元素是否需要滚动
const check = () => {
  setText();
  nextTick(() => {
    const flag = isOverflow();
    needToScroll.value = flag;
  });
};

// 判断子元素宽度是否大于父元素宽度，超出则需要滚动，否则不滚动
const isOverflow = () => {
  const outerWidth = getWidth(outer.value);
  const innerWidth = getWidth(inner.value);
  return innerWidth > outerWidth;
};

// 获取元素宽度
const getWidth = (el) => {
  const { width } = el.getBoundingClientRect();
  return width;
};

// 获取到父组件传过来的内容复传给 this.text
const setText = () => {
  text.value =
    (slots.default &&
      slots.default().reduce((res, it) => res + (it.children || ''), '')) ||
    '';
};

// 增加定时器，隔一秒 check 一次
let checkTimer = null;
const startCheck = () => {
  checkTimer = setInterval(check, 1000);
  check();
};

// 关闭定时器
const stopCheck = () => {
  clearInterval(checkTimer);
};

// 生命周期钩子
onMounted(() => {
  startCheck();
});

onBeforeUnmount(() => {
  stopCheck();
});
</script>

<style scoped>
.scrollText {
  overflow: hidden;
  white-space: nowrap;
}

.st-inner {
  display: inline-block;
}

.st-scrolling .st-section {
  padding: 0 5px;
}

/* 向左匀速滚动动画 */
.st-scrolling {
  animation: scroll 8s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translate3d(0%, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>