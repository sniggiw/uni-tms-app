<template>
  <!-- 标题栏 -->
  <view class="dropdown-item" :class="{ open: isOpen }" :style="{ color: curretnColor }" @tap="handleClick"
    @touchmove.prevent>
    <text class="title">{{ currentTitle }}</text>
  </view>
  <!-- 下拉弹窗 -->
  <view class="dropdown-popup" :style="{ top: `${dropPopupTop}px`, zIndex, height: dropHeight }" @touchmove.prevent>
    <view class="content" :class="customClass">
      <!-- 插槽 -->
      <slot v-if="hasSlot"></slot>
      <!-- 选项 -->
      <view class="list" v-else>
        <view :class="['item', { active: currentIndex === index }]" v-for="(item, index) in options"
          :key="item.name || index" @tap="onSelect(item, index)">
          <view class="label">{{ item.name }}</view>
          <!-- 勾选图标 -->
          <i v-show="currentIndex === index" class="iconfont icon-gouxuan icon"></i>
        </view>
      </view>
    </view>
    <!-- 顶部遮罩层 -->
    <view class="overly-header" v-show="isOpen" :style="{ height: `${overlyHeight}px` }" @touchmove.prevent></view>
    <!-- 底部遮罩层 -->
    <view class="overly-footer" v-show="isOpen" @tap="onClose" @touchmove.prevent></view>
  </view>
</template>

<script setup>
import {
  computed,
  inject,
  ref,
  onMounted,
  watch,
  useSlots,
  getCurrentInstance,
} from "vue";
const props = defineProps({
  //标题
  title: {
    type: String,
    default: "标题",
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emits = defineEmits(["update:modelValue", "change"]);
const slots = useSlots();

const activeDropdown = inject('activeDropdown')

//是否有插槽
const hasSlot = computed(() => {
  return Object.keys(slots).length > 0;
});

//激活颜色
const activeColor = inject("activeColor");
//当前打开的dropItem项（标签名）
const currentDropItem = inject("currentDropItem");

//当前文字/箭头颜色
const curretnColor = computed(() => {
  return isOpen.value ? activeColor : "#333";
});

//当前标题
const currentTitle = computed(() => {
  return currentIndex.value > -1
    ? props.options[currentIndex.value].name
    : props.title;
});
//是否打开
const isOpen = ref(null);
//动态class
const customClass = computed(() => {
  return isOpen.value === true
    ? "visible"
    : isOpen.value === false
      ? "hidden"
      : null;
});

let timeout = null;

// 修改点击处理逻辑
const handleClick = () => {
  if (timeout) return

  // 点击时立即关闭其他弹窗(点击A弹窗，则关闭B弹窗)
  if (activeDropdown.value !== props.title) {
    activeDropdown.value = null // 触发其他弹窗关闭
  }

  isOpen.value = !isOpen.value

  // 更新全局状态
  if (isOpen.value) {
    activeDropdown.value = props.title
    getDropPopupTop()
  }

  timeout = setTimeout(() => {
    timeout = null
  }, 200)
}
// 修改状态监听逻辑
watch(activeDropdown, (newVal) => {
  // 当全局状态与当前组件不匹配时关闭
  if (newVal !== props.title) {
    isOpen.value = false
  }
})

// 增加自身状态同步
watch(isOpen, (newVal) => {
  if (!newVal && activeDropdown.value === props.title) {
    activeDropdown.value = null
  }
})
onMounted(() => {
  getDropPopupTop();
});

//下拉弹窗距离页面顶部距离
const dropPopupTop = ref(0);
//顶部透明遮罩层高度
const overlyHeight = ref(0);
//下拉弹窗高度
const dropHeight = ref(0);
const instance = getCurrentInstance();
//计算下拉弹窗区域距离页面顶部距离
const getDropPopupTop = () => {
  let query = uni.createSelectorQuery().in(instance);
  query
    .select(".dropdown-item")
    .boundingClientRect((data) => {
      // #ifdef H5
      //H5需要加上导航栏高度，固定44px
      dropPopupTop.value = data.bottom + 44;
      overlyHeight.value = data.top + 44;
      // #endif
      //  #ifndef H5
      dropPopupTop.value = data.bottom;
      overlyHeight.value = data.top;

      // #endif
    })
    .exec();
};

//关闭回调
const onClose = () => {
  isOpen.value = false;
};
//动态控制开关
watch(currentDropItem, (v) => {
  //关闭其他条件的下拉弹窗
  if (v !== props.title) {
    isOpen.value = false;
  }
});
//弹窗层级
const zIndex = ref(-1);
watch(isOpen, (v) => {
  //打开状态显示父容器
  if (v) {
    zIndex.value = 999;
    dropHeight.value = "auto";
    // 禁止父组件滚动
    const app = document.getElementById("app");
    if (app) {
      app.style.overflow = "hidden";
    }
  } else {
    //关闭状态隐藏父容器
    //延迟改变使得关闭动画能完整呈现
    setTimeout(() => {
      zIndex.value = -1;
      dropHeight.value = 0;
      // 恢复父组件滚动
      const app = document.getElementById("app");
      if (app) {
        app.style.overflow = "auto";
      }
    }, 200);
  }
});

//下拉选项当前选中的索引
const currentIndex = ref(-1);

//根据双向绑定值动态设置下拉选中项索引
watch(
  () => props.modelValue,
  (v) => {
    currentIndex.value = props.options.findIndex((item) => item.value === v);
  },
  {
    immediate: true,
  }
);

//选中监听
const onSelect = (item, index) => {
  isOpen.value = false;
  if (index !== currentIndex.value) {
    currentIndex.value = index;
    emits("update:modelValue", item.value);
    emits("change", item.value);
  }
};

// 暴露方法给父组件
defineExpose({
  onClose,
});
</script>

<style lang="scss" scoped>
.dropdown-item {
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  white-space: nowrap;
  text-align: center;
  position: relative;
  z-index: 10;

  // &::after {
  //   display: block;
  //   content: "";
  //   border: 6rpx solid;
  //   border-color: v-bind(curretnColor) transparent transparent transparent;
  //   margin-bottom: -10rpx;
  //   margin-left: 8rpx;
  //   transition: all 0.2s;
  //   transform-origin: center 3rpx;
  // }

  &.open {
    &::after {
      transform: rotate(180deg);
    }
  }
}

.dropdown-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  overflow: hidden;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0);

  .content {
    background-color: #fff;
    min-height: 200rpx;
    position: absolute;
    top: -100%;
    left: 0;
    right: 0;
    z-index: 1000;
    box-sizing: border-box;

    &.visible {
      animation: visibleAnimaFrames 0.2s forwards;
    }

    &.hidden {
      animation: hiddenAnimaFrames 0.5s forwards;
    }

    .list {
      width: 100%;
      padding: 0 35rpx;
      box-sizing: border-box;

      .item {
        width: 100%;
        padding: 30rpx 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        &:not(:last-of-type) {
          border-bottom: 1px solid #f2f2f2;
        }

        .label {
          font-size: 30rpx;
          flex: 1;
          width: 0;
          margin-right: 40rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .icon {
          font-size: 36rpx;
          color: v-bind(activeColor);
        }

        &.active {
          .label {
            color: v-bind(activeColor);
          }
        }
      }
    }
  }

  /* 调整动画时间匹配 JavaScript 逻辑 */
  .content.visible {
    animation: visibleAnimaFrames 0.3s forwards;
  }

  .content.hidden {
    animation: hiddenAnimaFrames 0.3s forwards;
  }
}

/**
 * 打开动画
 */
@keyframes visibleAnimaFrames {
  0% {
    top: -100%;
  }

  100% {
    top: 0;
  }
}

/**
 * 关闭动画
 */
@keyframes hiddenAnimaFrames {
  0% {
    top: 0;
  }

  100% {
    top: -100%;
  }
}

.overly-footer {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);

  z-index: 999;
}

.overly-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 999;
}
</style>
