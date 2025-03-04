<template>
  <view class="my-index-bar">

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content" :scroll-into-view="activeId" @scroll="onScroll">
      <view class="hot-city">
        <view class="title"><i class="line"></i>{{ $t('common.inCommonUse') }}</view>
        <view class="city-list">
          <myCell :title="item.areaName + '  ' + '  ' + item.phonePrefix" v-for="(item, index) in commonMobilePhonesZh"
            :key="index" @click="handleItemClick(item)" class="my-cell" />

          <!-- <view class="custom-card" v-if="search.lang === 'en'">
          <van-cell :title="item.areaName + '  ' + '  ' + item.phonePrefix"
            v-for="(item, index) in commonMobilePhonesEn" :key="index" @click="checkCity(item)" />
        </view> -->
        </view>
      </view>
      <view v-for="(group, index) in data" :key="index" :id="`group-${index}`" class="group">
        <view class="group-title">{{ group.group }}</view>
        <view class="group-items">
          <view v-for="(item, i) in group.phonePrefixList" :key="i" class="group-item" @click="handleItemClick(item)">
            {{ item.areaName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.phonePrefix }}
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 右侧索引导航 -->
    <view class="index-bar">
      <view v-for="(group, index) in data" :key="index" class="index-item" :class="{ active: index === activeIndex }"
        @click="scrollToGroup(index)">
        {{ group.group }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import myCell from "../../../../components/myCell/index.vue";
// 定义 props
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
const commonMobilePhonesZh = ref([
  { areaName: "中国", phonePrefix: "+86", areaScode: "CN" },
  { areaName: "阿联酉", phonePrefix: "+971", areaScode: "AE" },
  { areaName: "沙特阿拉伯", phonePrefix: "+966", areaScode: "SA" },
  { areaName: "墨西哥", phonePrefix: "+52", areaScode: "MX" },
  { areaName: "卡塔尔", phonePrefix: "+974", areaScode: "QA" },
  { areaName: "阿曼", phonePrefix: "+968", areaScode: "OM" },
  { areaName: "伊朗", phonePrefix: "+98", areaScode: "IR" },
]);
const commonMobilePhonesEn = ref([
  { areaName: "China", phonePrefix: "+86", areaScode: "CN" },
  { areaName: "United Arab Emirates", phonePrefix: "+971", areaScode: "AE" },
  { areaName: "Saudi Arabia", phonePrefix: "+966", areaScode: "SA" },
  { areaName: "Mexico", phonePrefix: "+52", areaScode: "MX" },
  { areaName: "Qatar", phonePrefix: "+974", areaScode: "QA" },
  { areaName: "Oman", phonePrefix: "+968", areaScode: "OM" },
  { areaName: "Iran", phonePrefix: "+98", areaScode: "IR" },
]);
// 定义 emits
const emit = defineEmits(['item-click']);

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
</script>

<style lang="scss" scoped>
.my-index-bar {
  position: relative;
  height: 100vh;
}

.hot-city {
  box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
  border-radius: 30rpx;
  margin: 20rpx 30rpx;
  .title {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    font-size: 30rpx;
    color: #666666;
    border-bottom: 2rpx solid #DEE2E4;

    .line {
      display: inline-block;
      margin-right: 20rpx;
      width: 10rpx;
      height: 40rpx;
      background: #DF3030;
      border-radius: 6rpx;
    }
  }

  .hot-city-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20rpx 0px 0px 20rpx;

    .hot-city-item {
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      text-align: center;
      min-width: 146rpx;
      padding: 10rpx 30rpx;
      background: #F6F6F6;
      border-radius: 40rpx;
      font-size: 28rpx;
      color: #666666;
      line-height: normal;
    }
  }

  .my-cell {
    padding: 20rpx 30rpx;
    background: none;
  }
}

.content {
  height: 100%;
  overflow-y: auto;
  
}

.group {
  padding: 20rpx 30rpx;
}

.group-title {
  font-size: 32rpx;
  font-weight: bold;
  padding: 20rpx;

}

.group-items {
  padding: 20rpx;
  box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
  border-radius: 30rpx;
  overflow: hidden;
}

.group-item {
  padding: 20rpx 0;
  cursor: pointer;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #ebedf0;
}

.group-item:last-child {
  border-bottom: none;
}

.index-bar {
  position: fixed;
  top: 50%;
  right: 20rpx;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.index-item {
  padding: 4rpx 10rpx;
  font-size: 24rpx;
  color: #333;
  cursor: pointer;
}

.index-item.active {
  /* color: #007aff; */
  color: #DF3030;
  font-weight: bold;
}
</style>