<template>
  <view class="my-index-bar">
    <!-- 内容区域 -->
    <scroll-view
      scroll-y
      class="content"
      :scroll-into-view="activeId"
      @scroll="onScroll"
    >
      <view
        v-for="(group, index) in data"
        :key="index"
        :id="`group-${index}`"
        class="group"
      >
        <view class="group-title">{{ group.group }}</view>
        <view class="group-items">
          <view
            v-for="(item, i) in group.addrs"
            :key="i"
            class="group-item"
            @click="handleItemClick(item)"
          >
            {{ item.title }} ({{ item.titleEn }})
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 右侧索引导航 -->
    <view class="index-bar">
      <view
        v-for="(group, index) in data"
        :key="index"
        class="index-item"
        :class="{ active: index === activeIndex }"
        @click="scrollToGroup(index)"
      >
        {{ group.group }}
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['item-click'], // 定义事件
  setup(props, { emit }) {
    const activeId = ref(''); // 当前激活的 ID
    const activeIndex = ref(0); // 当前激活的索引项

    // 滚动到指定分组
    const scrollToGroup = (index) => {
      activeId.value = `group-${index}`;
      activeIndex.value = index;
    };

    // 监听滚动事件
    const onScroll = (event) => {
      const scrollTop = event.detail.scrollTop;
      const groups = document.querySelectorAll('.group');

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const rect = group.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          activeIndex.value = i;
          break;
        }
      }
    };

    // 点击内容项
    const handleItemClick = (item) => {
      emit('item-click', item); // 触发事件，返回所选的参数
    };

    // 初始化时滚动到第一个分组
    onMounted(() => {
      scrollToGroup(0);
    });

    return {
      activeId,
      activeIndex,
      scrollToGroup,
      onScroll,
      handleItemClick,
    };
  },
};
</script>

<style scoped>
.my-index-bar {
  position: relative;
  height: 100vh;
}

.content {
  height: 100%;
  overflow-y: auto;
}

.group {
  padding: 10px 0;
}

.group-title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  background-color: #f5f5f5;
}

.group-items {
  padding: 10px;
}

.group-item {
  padding: 5px 0;
  cursor: pointer;
}

.index-bar {
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.index-item {
  padding: 2px 5px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
}

.index-item.active {
  color: #007aff;
  font-weight: bold;
}
</style>