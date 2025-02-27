<template>
  <view class="homeCollapse-page">
    <view class="open-content">
      <view class="left" @tap="toJump(1)">
        <view class="left">{{
          inquirySearch[flow]
            ? inquirySearch[flow].srcTitle || $t('inquiry.pleaseCheck')
            : $t('inquiry.pleaseCheck')
        }}</view>
        <view class="foreign">{{
          inquirySearch[flow]
            ? inquirySearch[flow].srcTitleEn || "Select"
            : "Select"
        }}</view>
      </view>

      <view class="center">
        <view class="ico-line ico-line-left"></view>
        <view class="ico-arrow-right"></view>
        <view class="ico-line ico-line-right"></view>
      </view>

      <view class="right" @tap="toJump(2)">
        <view>{{
          inquirySearch[flow]
            ? inquirySearch[flow].descTitle || $t('inquiry.pleaseCheckTo')
            : $t('inquiry.pleaseCheckTo')
        }}</view>
        <view class="foreign">{{
          inquirySearch[flow]
            ? inquirySearch[flow].descTitleEn || "Select"
            : "Select"
        }}</view>
      </view>
    </view>
    <view class="check-box">
      <button type="default" class="shortcut-price" @tap="toQuickOrder" v-if="flow == 1">
        {{ $t('inquiry.quickBtn') }}
      </button>
      <button class="check-price" @tap="toSearchInquiry">{{ $t('inquiry.traditionalOrder') }}</button>
    </view>

    <!-- 历史询价 -->
    <view v-if="historyList[flow] && historyList[flow].length > 0" class="inquiry-history">
      <view class="title">{{ $t('inquiry.historicalRoute') }}</view>
      <view class="history-list">
        <view v-for="(item, index) in historyList[flow]" :key="index" class="item" @tap="toJumpDetail(item)">
          <view class="left">
            <view class="city">{{ item.startPos.title }}</view>
            <view>{{ item.weight }}kg</view>
            <view class="squares">{{ item.squares }}CBM</view>
          </view>
          <view class="center">
            <view class="ico-his-right"></view>
          </view>
          <view class="right">
            <view class="city">{{ item.endPos.title }}</view>
            <view>{{ item.transCount }}{{ item.transUnit }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { inquiryHistory } from "@/api/inquiry";
import { onLaunch, onShow, onUnload } from '@dcloudio/uni-app'
// 获取当前路由实例
const route = useRoute();
const props = defineProps({
  flow: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["searchInquiryCallback"]);
const lang = ref("");
const searchData = reactive({});
const historyList = reactive({});
const inquirySearch = reactive({
  1: {
    srcTitle: "",
    srcTitleEn: "",
    descTitle: "",
    descTitleEn: "",
    srcScode: "",
    destScode: "",
  },
  2: {
    srcTitle: "",
    srcTitleEn: "",
    descTitle: "",
    descTitleEn: "",
    srcScode: "",
    destScode: "",
  },
  3: {
    srcTitle: "",
    srcTitleEn: "",
    descTitle: "",
    descTitleEn: "",
    srcScode: "",
    destScode: "",
  },
  4: {
    srcTitle: "",
    srcTitleEn: "",
    descTitle: "",
    descTitleEn: "",
    srcScode: "",
    destScode: "",
  },
  5: {
    srcTitle: "",
    srcTitleEn: "",
    descTitle: "",
    descTitleEn: "",
    srcScode: "",
    destScode: "",
  },
});

// Lifecycle
onMounted(() => {

});

onShow(() => {
  Object.keys(inquirySearch).forEach((key) => {
    inquirySearch[key] = {
      srcTitle: "",
      srcTitleEn: "",
      descTitle: "",
      descTitleEn: "",
      srcScode: "",
      destScode: "",
    };
  });
})

watch(
  () => route.fullPath,
  (to, from) => {
    const departure = uni.getStorageSync("departure");

    if (departure) {
      const departureData = JSON.parse(departure);
      departureData.forEach((element) => {
        inquirySearch[element.flow].srcTitle = element.city;
        inquirySearch[element.flow].srcTitleEn = element.cityEn;
        inquirySearch[element.flow].srcScode = element.scode;
      });
    }
    const destination = uni.getStorageSync("destination");
    // const destinationData = JSON.parse(destination);
    if (destination) {
      const destinationData = JSON.parse(destination);
      destinationData.forEach((element) => {
        inquirySearch[element.flow].descTitle = element.city;
        inquirySearch[element.flow].descTitleEn = element.cityEn;
        inquirySearch[element.flow].destScode = element.scode;
      });
    }
  },
  { immediate: true } // Run the effect immediately on component mount
);

// 快速下单
const toQuickOrder = () => {
  const inquirySearchData = inquirySearch[props.flow];
  if (!inquirySearchData.srcTitle) {
    uni.showToast({
      title: "请选择起运地",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (!inquirySearchData.descTitle) {
    uni.showToast({
      title: "请选择目的地",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  uni.navigateTo({
    url: `/pages/inquiry/quickOrder?srcTitle=${inquirySearchData.srcTitle}&srcTitleEn=${inquirySearchData.srcTitleEn}&srcScode=${inquirySearchData.srcScode}&descScode=${inquirySearchData.destScode}&descTitle=${inquirySearchData.descTitle}&descTitleEn=${inquirySearchData.descTitleEn}`
  });
}

// Methodsc
const toSearchInquiry = () => {
  const inquirySearchData = inquirySearch[props.flow];
  if (!inquirySearchData.srcTitle) {
    uni.showToast({
      title: "请选择起运地",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  if (!inquirySearchData.descTitle) {
    uni.showToast({
      title: "请选择目的地",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  Object.assign(searchData, inquirySearchData);
  searchData.flow = props.flow;
  emit("searchInquiryCallback", searchData);
};

const toJump = (type) => {
  uni.navigateTo({
    url: `/pages/inquiry/components/addressList/index/index?flow=${props.flow}&type=${type}`,
  });
};

const toJumpDetail = (item) => {
  // 创建一个参数对象
  const params = reactive({
    srcTitle: item.startPos.title,
    srcTitleEn: item.startPos.titleEn,
    srcScode: item.startPos.scode,
    descTitle: item.endPos.title,
    destScode: item.endPos.scode,
    descTitleEn: item.endPos.titleEn,
    transCount: item.transCount,
    transUnit: item.transUnit,
    flow: item.flowId,
    squares: item.squares,
    weight: item.weight,
  });

  // 根据条件添加其他参数
  if (item.zxTransKind != null) {
    params.transKind = item.zxTransKind.value;
  }
  if (item.otherCompany != null) {
    params.companyName = item.otherCompany.value;
  }
  if (item.expressKind != null) {
    params.packageKind = item.expressKind.value;
  }
  if (item.portSpecKind != null) {
    params.portSpecKind = item.portSpecKind;
  }
  if (item.productAttr) {
    params.products = item.productAttr;
  }

  // 根据 flow 跳转到不同的页面
  let path = "";
  switch (props.flow) {
    case "1":
      path = "/pages/inquiry/dedicatedLine/index"; // 专线
      break;
    case "2":
      path = "/pages/inquiry/intAirport"; // 国际机场
      break;
    case "3":
      path = "/pages/inquiry/intPort"; // 国际港口
      break;
    case "4":
      path = "/pages/inquiry/intExpress"; // 国际快递
      break;
    case "5":
      path = "/pages/inquiry/intRail"; // 国际铁路
      break;
    default:
      console.error("无效的 flow");
      return;
  }

  // 使用 uni.navigateTo 跳转页面
  uni.navigateTo({
    url: `${path}?${Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&")}`,
  });
};

const inquiryHistoryData = () => {
  uni.showLoading();
  inquiryHistory({ flow: props.flow }).then((res) => {
    if (res.code === 200) {
      historyList[props.flow] = res.data;
      uni.hideLoading();
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        mask: true,
      });
      uni.hideLoading();
    }
  });
};

watch(
  () => props.flow,
  () => {
    if (props.flow) {
      inquiryHistoryData();
    }
  },
  { immediate: true }
);

// onUnload(() => {
//   Object.keys(inquirySearch).forEach((key) => {
//     inquirySearch[key] = {
//       srcTitle: "",
//       srcTitleEn: "",
//       descTitle: "",
//       descTitleEn: "",
//       srcScode: "",
//       destScode: "",
//     };
//   });
// });

// Expose state and methods
defineExpose({
  lang,
  searchData,
  historyList,
  inquirySearch,
  toSearchInquiry,
  toJump,
  toJumpDetail,
  inquiryHistoryData
});
</script>

<style lang="scss" scoped>
.homeCollapse-page {
  width: 94%;
  margin: 24rpx auto;
  margin-bottom: 60rpx;
}

.open-content {
  display: flex;
  align-items: center;
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
  line-height: 1;

  .left,
  .right {
    flex: 1;
    text-overflow: ellipsis;

    .foreign {
      margin-top: 10rpx;
      font-size: 26rpx;
      color: #999999;
    }
  }

  .left {
    text-align: left;
    width: 300rpx;
    word-wrap: break-word;
  }

  .right {
    text-align: right;
  }

  .center {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .ico-line {
      width: 54rpx;
      height: 6rpx;
    }

    .ico-line-left {
      background: url("@/static/order/ico-line-left.png") no-repeat;
      background-size: contain;
    }

    .ico-line-right {
      background: url("@/static/order/ico-line-right.png") no-repeat;
      background-size: contain;
    }

    .ico-arrow-right {
      width: 22rpx;
      height: 34rpx;
      background: url("@/static/inquiry/ico-arrow-right.png") no-repeat;
      background-size: contain;
    }
  }
}

.check-box {
  display: flex;
  align-items: center;

  .shortcut-price {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    width: 600rpx;
    height: 88rpx;
    background: #ffffff;
    border-radius: 50rpx;
    font-size: 28rpx;
    border: 1rpx solid #df3030;
    color: #df3030;
    margin-right: 30rpx;
  }

  .check-price {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    width: 600rpx;
    height: 88rpx;
    background: #df3030;
    border-radius: 50rpx;
    font-size: 28rpx;
    color: #ffffff;
  }
}

.inquiry-history {
  margin-top: 30rpx;
  margin-left: 20rpx;

  .title {
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #999999;
  }

  .history-list {
    display: flex;
  }

  .item {
    display: flex;
    padding: 14rpx 8rpx;
    background: #fbfbfb;
    border: 2rpx solid #e1e1e1;
    border-radius: 16rpx;
    margin-right: 30rpx;
    margin-left: -20rpx;

    &:nth-of-type(even) {
      margin-right: 40rpx; //历史询价记录只展示两个
    }

    .left,
    .right {
      flex: 1;
      width: 106rpx;
      word-wrap: break-word;
      font-size: 22rpx;
      color: #999;

      .city {
        margin-bottom: 6rpx;
        font-size: 26rpx;
        color: #333;
      }

      .squares {
        width: 150rpx;
      }
    }

    .center {
      .ico-his-right {
        margin-top: 12rpx;
        width: 38rpx;
        margin-right: 10rpx;
        height: 6rpx;
        background: url("@/static/inquiry/ico-his-right.png") no-repeat;
        background-size: contain;
      }
    }

    .left {
      min-width: 138rpx;
      margin-right: 10rpx;
    }

    .right {
      text-align: right;
    }
  }
}
</style>