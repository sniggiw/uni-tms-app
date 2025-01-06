<template>
  <view>
    <view class="agress_con">
      <view
        class="checkbox"
        :class="{ checked: checked }"
        @tap="check"
      ></view>
      <view>
        <text @tap="check">我同意该协议</text>
        <text
          class="agreement-name"
          @tap="
            openAgreement
          "
          v-for="(item, index) in argeementList"
          :key="index"
          >《{{ item.contentKind }}》</text
        >
      </view>
    </view>
    <uni-popup ref="popup" type="bottom" :is-mask-tap="false">
      <!-- <uni-tabs v-model="activeTab">
        <uni-tab
          v-for="(item, index) in argeementList"
          :key="index"
          :title="item.contentKind"
        >
          <view class="bg"></view>
          <view class="content">
            <view class="agreement" v-html="item.content"></view>
          </view>
        </uni-tab>
      </uni-tabs> -->
      <view class="fullscreen-popup">
        <uni-segmented-control
          :current="current"
          @clickItem="onClickItem"
          styleType="text"
          activeColor="#df3030"
          :mask-tap="false"
        ></uni-segmented-control>
        <view class="" style="height: auto; overflow-y: auto">
          <view v-show="current === 0" class="content">
            <view v-for="(item, index) in argeementList" :key="index">
              <view v-html="item.content" class="agreement"></view>
            </view>
          </view>
        </view>
        <view class="footer-btn">
          <button @tap="agreement">确认</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { commonListArgeement } from "@/api/common";

// 定义 props
const props = defineProps({
  contentKind: {
    type: String,
    default: "运输条款",
  },
});

// 定义响应式变量
const lang = ref(localStorage.getItem("lang"));
const read = ref(false);
const activeTab = ref(0);
const argeementList = ref([]);
const checked = ref(false);
const showAgreement = ref(false);
const popup = ref(null);
const current = ref(0);
const items = ref(["运输条款"]);

onMounted(() => {
  commonListArgeementData();
});

// 获取协议列表
const commonListArgeementData = () => {
  const params = { contentKind: props.contentKind };
  commonListArgeement(params).then((res) => {
    if (res.code === 200) {
      argeementList.value = res.data;
    } else {
      showToast(res.msg);
    }
  });
};

// 确认协议
const agreement = () => {
  popup.value.close();
  read.value = true;
  if (read.value) {
    checked.value = true;
  }
};

const openAgreement = () => {
  popup.value.open();
};

// 切换复选框状态
const check = () => {
  if (read.value) {
    checked.value = !checked.value;
  } else {
    popup.value.open();
    uni.showToast({
      title: "请您阅读并确认运输条款",
      duration: 1000,
    });
  }
};

// 获取复选框状态
const getChecked = () => checked.value;

const onClickItem = (e) => {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex;
  }
};

// 暴露给模板使用的变量和方法
defineExpose({
  getChecked,
});
</script>

<style lang="scss" scoped>
/* 底部全屏弹窗样式 */
.fullscreen-popup {
  width: 100%;
  height: 100vh; /* 占满全屏 */
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 内容从顶部开始 */
  position: relative;
  padding: 60rpx;
}
.agress_con {
  position: relative;
  padding-left: 46rpx;
  padding-bottom: 30rpx;
  color: #666666;
  font-size: 26rpx;
  text-align: left;

  .checkbox {
    position: absolute;
    left: 6rpx;
    top: 0;
    display: block;
    width: 32rpx;
    height: 32rpx;
    background: url("../../static/common/unchecked.png") no-repeat;
    background-size: contain;

    &.checked {
      background: url("../../static/common/checked.png") no-repeat;
      background-size: contain;
    }
  }

  .agreement-name {
    margin-left: 10rpx;
    color: #2b7bfa;
  }
}

.uni-popup {
  overflow: hidden;
  .content {
    position: relative;
    top: 0rpx;
    left: 0;
    background: #f9f9fa;
    overflow-y: auto;
    height: 100%;
    // border-radius: 40rpx 40rpx 0 0;
    font-size: 28rpx;
    color: #666;

    .agreement {
      background: #ffffff;
      padding: 0rpx;
      box-shadow: 0 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
      border-radius: 30rpx;
      text-indent: 4em;
      white-space: pre-wrap;
    }
  }

  .footer-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20rpx;
    background: #fff;
    box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.1);
  }
}
</style>