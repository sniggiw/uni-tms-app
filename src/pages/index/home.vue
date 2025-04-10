<template>
  <view class="home-page">
    <!-- 顶部logo图片 -->
    <view class="gradual">
      <view class="first" v-for="(item, index) in companyLogo" :key="index">
        <image class="imgage" src="https://www.gosun2.com/tms-app/profile/20221226/08d85df686cc432f8f95a83c65e12da0.png"
          @tap="jumpBanner(item.jumpUrl)" />
      </view>
    </view>

    <!-- 顶部公告 -->
    <view class="order-data">
      <view class="notice">
        <view>
          <image class="notice-img" :src="lang === 'zh_CN'
            ? '../../static/common/home-zhNotice.png'
            : '../../static/common/home-EnNotice.png'
            " />
        </view>

        <view class="notice-container">
          <view class="notice-content" :style="{ transform: `translateY(${translateY}px)` }">
            <view class="notice-item" v-for="(item, index) in notice" :key="index">
              {{ item.title }}
            </view>
          </view>
        </view>
      </view>

      <view class="data-box">
        <view class="box-top">
          <view class="left" @tap="jumpInquiry">
            <view class="h1">{{$t('orderList.systemInquiry')}}</view>
            <view class="text">{{$t('orderList.systemInquiryH2')}}</view>
            <view class="left-icon"></view>
          </view>
          <view class="center" @tap="service">
            <view class="h1">{{$t('orderList.artificialInquiry')}}</view>
            <view class="text">{{$t('orderList.artificialInquiryH2')}}</view>
            <view class="center-icon"></view>
          </view>
          <view class="right" @tap="jumpStatistical">
            <view class="h1">{{$t('inquiry.collect')}}</view>
            <view class="text">{{$t('orderList.collectH2')}}</view>
            <view class="right-icon"></view>
          </view>
        </view>
        <view class="box-bottom">
          <view class="left" @tap="jumpPending">
            <view class="tit">{{$t('orderList.pending')}}:</view>
            <view>{{ pendNum }}</view>
          </view>
          <view class="right" @tap="jumpProcess">
            <view class="tit">{{$t('orderList.process')}}:</view>
            <view>{{ processNum }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <!-- <view class="banner-home">
      <swiper class="my-swipe" :autoplay="2000" indicator-color="white" :indicator-dots="true">
        <swiper-item v-for="(banner, index) in banner" :key="index">
          <image class="swiperImg" :src="banner.imgFilePath" @tap="jumpBanner(banner.jumpUrl)" />
        </swiper-item>
      </swiper>
    </view> -->

    <!-- 营销宣传图入口 -->
    <view class="market-banner" @tap="jumpMarketHome">
      <view class="zh-bg" v-if="lang === 'zh_CN'"></view>
      <view class="en-bg" v-else></view>
    </view>

    <!-- 运力工具  中东运力  中东生活服务 -->
    <view class="tool-box">
      <!-- 中东生活服务 -->
      <view class="tool-bottom">
        <view class="tool-title">
          <view class="title-line"></view>{{$t('orderList.services')}}
        </view>
        <view class="item">
          <view v-for="(item, index) in services" :key="index" @tap="jumpServices(item.jumpUrl)">
            <image class="imgage" :src="item.imgFilePath" />
            <view class="title" v-if="item.jumpUrl">{{ item.title }}</view>
            <view class="title-null" v-else>{{ item.title }}</view>
          </view>
        </view>
      </view>

      <!-- 中东运力 -->
      <view class="bottom">
        <view class="tool-title">
          <view class="title-line"></view>{{$t('orderList.capacity')}}
        </view>
        
        <swiper class="bottom-swipe" indicator-color="#ebedf0" indicator-active-color="rgb(221, 49, 47)" :indicator-dots="true">
          <swiper-item>
            <view class="item-swipe">
              <view class="item-swiper" v-for="(item, index) in transportFirst" :key="index"
                @tap="jumpArticle(item.title)">
                <image class="imgage" :src="item.imgFilePath" />
                <view class="title" v-if="item.jumpUrl">{{ item.title }}</view>
                <view class="title-null" v-else>{{ item.title }}</view>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="item-swipe">
              <view class="item-swiper" v-for="(item, index) in transportSecond" :key="index"
                @tap="jumpArticle(item.title)">
                <image class="imgage" :src="item.imgFilePath" />
                <view class="title" v-if="item.jumpUrl">{{ item.title }}</view>
                <view class="title-null" v-else>{{ item.title }}</view>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="item-swipe">
              <view class="item-swiper" v-for="(item, index) in transportThird" :key="index"
                @tap="jumpArticle(item.title)">
                <image class="imgage" :src="item.imgFilePath" />
                <view class="title" v-if="item.jumpUrl">{{ item.title }}</view>
                <view class="title-null" v-else>{{ item.title }}</view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 运力工具 -->
      <view class="top">
        <view class="tool-title">
          <view class="title-line"></view>{{$t('orderList.tools')}}
        </view>
        <view class="item">
          <view v-for="(item, index) in tools" :key="index" @tap="jumpTools(item.jumpUrl)">
            <image class="imgage" :src="item.imgFilePath" />
            <view class="title" v-if="item.jumpUrl">{{ item.title }}</view>
            <view class="title-null" v-else>{{ item.title }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 合作伙伴 -->
    <!-- <view class="last-bottom" @tap="jumpOfficer">
      <image :src="lang === 'zh_CN'
        ? '../../static/common/home-lastZhOfficer.png'
        : '../../static/common/home-lastEnOfficer.png'
        " />
    </view> -->

    <!-- 点击响铃公告弹窗 -->
    <!-- <uni-popup ref="popup" type="center">
      <view class="announcement-popup">
        <image src="../../assets/images/home-popupBackground.png" class="popup-image" />
        <view class="popup-title">{{ $t("inquiry.announcement") }}</view>
        <view class="popup" v-html="content"></view>
        <view class="button" @tap="closePopup">
          <image src="../../assets/images/home-popupButton.png" />
          <text>{{ $t("inquiry.popupText") }}</text>
        </view>
      </view>
    </uni-popup> -->
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getNewIndex, orderIndex, orderPendingIndex, orderProcessing, getCustomerInfoData } from "@/api/common";
import { onShow } from '@dcloudio/uni-app';

// Props
const props = defineProps({
  number: {
    type: Number,
  },
});

// Emits
const emit = defineEmits(["update:number"]);

// Reactive data
const show = ref(false);
const companyLogo = ref([]);
const notice = ref([]);
const content = ref("");
const totalOrderNumber = ref("");
const unfinishedOrderNumber = ref("");
const banner = ref([]);
const tools = ref([]);
const services = ref([]);
const partner = ref([]);
const transport = ref([]);
const pop = ref(true);
const showWarning = ref(false);
const messageWarn = ref({});
const confirmButtonColor = ref("#666");
const confirmButtonText = ref("");
const readTime = ref(3);
const isshow = ref(true);
const gettime = ref("");
const lang = ref("");
const transportFirst = ref([]);
const transportSecond = ref([]);
const transportThird = ref([]);
const distributorApproved = ref("");
const userPhone = ref("");
const distributorId = ref("");
const morningShowPopup = ref(false);
const afternoonShowPopup = ref(false);
const nightShowPopup = ref(false);
const morningArticle = ref([]);
const afternoonArticle = ref([]);
const nightArticle = ref([]);
const orderInfo = ref({
  total: { amounts: [] },
  unfinished: { amounts: [] },
});
const pendNum = ref("");
const processNum = ref("");
const pendingNum = ref(1);
const processingNum = ref(2);
const areaPhonePrefix = ref("");
const BuyForMeForm = ref({
  pageNum: 1,
  pageSize: 1,
  kind: "buyForMeHome",
});
const searchForMeFrom = ref({
  pageNum: 1,
  pageSize: 1,
  kind: "searchForMeHome",
});
const searchForMebanner = ref([]);
const buyForMebanner = ref([]);
const member = ref("");

const currentNotice = ref("");
const noticeList = ref([]);
const translateY = ref(0); // 控制垂直滚动的偏移量
const itemHeight = ref(0); // 每条公告的高度
const currentIndex = ref(0); // 当前显示的公告索引

// 开始滚动
const startScroll = () => {
  const query = uni.createSelectorQuery();
  query.select('.notice-item').boundingClientRect(data => {
    if (data) {
      itemHeight.value = data.height; // 获取每条公告的高度
      setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % noticeList.value.length; // 更新索引
        translateY.value = -currentIndex.value * itemHeight.value; // 计算偏移量
      }, 3000); // 3秒切换一次
    } else {
      console.error('未找到 .notice-item 元素');
    }
  }).exec();
};

const showNextNotice = () => {
  currentNotice.value = noticeList.value[currentIndex.value];
  currentIndex.value = (currentIndex.value + 1) % noticeList.value.length;
  setTimeout(showNextNotice, 5000); // 5秒切换一次
};

// Lifecycle hooks
onShow(() => {
  document.body.setAttribute("style", "background:#EAECF1");
  getNewIndexData();
  orderIndexData();
  getCustomerInfo();
  // confirmButtonText.value = $t("common.determine");
  lang.value = uni.getStorageSync("lang");
  orderPendingIndexData();
  orderProcess();
  showNextNotice();
  setTimeout(() => {
    startScroll();
  }, 500); // 延迟 100ms 确保 DOM 渲染完成
});

onBeforeUnmount(() => {
  document.body.removeAttribute("style");
});

// toast提示
const showToast = (message, duration = 2000) => {
  uni.showToast({ title: message, icon: "none", duration });
};

// Methods
const orderIndexData = async () => {
  try {
    const res = await orderIndex();
    if (res.code === 200) {
      orderInfo.value = res.data;
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    // console.error(error);
  }
};

// const getTimeState = () => {
//   const timeNow = new Date();
//   const hours = timeNow.getHours();

//   if (hours >= 0 && hours <= 11.9) {
//     if (!document.cookie.includes("morningAd=")) {
//       morningArticleList();
//       morningCookie();
//       morningShowPopup.value = true;
//     }
//   } else if (hours >= 12 && hours <= 18.9) {
//     if (!document.cookie.includes("afternoonAd=")) {
//       afternoonArticleList();
//       afternoonCookie();
//       afternoonShowPopup.value = true;
//     }
//   } else if (hours >= 19 && hours <= 24) {
//     if (!document.cookie.includes("nightAd=")) {
//       nightArticleList();
//       nightCookie();
//       nightShowPopup.value = true;
//     }
//   }
// };

// const morningCookie = () => {
//   const d = new Date();
//   d.setTime(d.getTime() + 600 * 60 * 1000);
//   document.cookie = "morningAd=morning-ad;expires=" + d.toGMTString();
// };

// const afternoonCookie = () => {
//   const d = new Date();
//   d.setTime(d.getTime() + 420 * 60 * 1000);
//   document.cookie = "afternoonAd=afternoon-ad;expires=" + d.toGMTString();
// };

// const nightCookie = () => {
//   const d = new Date();
//   d.setTime(d.getTime() + 420 * 60 * 1000);
//   document.cookie = "nightAd=night-ad;expires=" + d.toGMTString();
// };

// const morningArticleList = async () => {
//   const params = { kind: "首页弹窗.早上推荐" };
//   try {
//     const res = await Api.serviceRecommend(params);
//     if (res.code === 200) {
//       morningArticle.value = res.data;
//     } else {
//       $toast({ message: $t("middle.toast"), duration: 2000 });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// const afternoonArticleList = async () => {
//   const params = { kind: "首页弹窗.下午推荐" };
//   try {
//     const res = await Api.serviceRecommend(params);
//     if (res.code === 200) {
//       afternoonArticle.value = res.data;
//     } else {
//       $toast({ message: $t("middle.toast"), duration: 2000 });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// const nightArticleList = async () => {
//   const params = { kind: "首页弹窗.晚上推荐" };
//   try {
//     const res = await Api.serviceRecommend(params);
//     if (res.code === 200) {
//       nightArticle.value = res.data;
//     } else {
//       $toast({ message: $t("middle.toast"), duration: 2000 });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const getBuyForMeBanner = async () => {
  try {
    const res = await Api.getBanner(BuyForMeForm.value);
    if (res.code === 200) {
      buyForMebanner.value = res.rows;
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    // console.error(error);
  }
};

const getSearchForMeBanner = async () => {
  try {
    const res = await Api.getBanner(searchForMeFrom.value);
    if (res.code === 200) {
      searchForMebanner.value = res.rows;
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    // console.error(error);
  }
};

const jumpNotice = (item) => {
  show.value = true;
  content.value = item.content;
};

const openPopup = () => {
  pop.value = !pop.value;
};

const closePopup = () => {
  pop.value = !pop.value;
};

const jumpOverSeas = () => {
  $router.push({ path: "/overseas/overseasPromotion" });
};

const jumpStatistical = () => {
  $router.push({ path: "/order/statCopy" });
};

const jumpInquiry = () => {
  $router.push({ path: "/inquiry/home" });
};

const jumpMarketHome = () => {
  if (member.value === 1) {
    $router.push({ path: "/market/marketHome" });
  } else if (member.value === 0) {
    $router.push({ path: "/market/marketPromotion" });
  } else if (member.value === 2) {
    showToast($t("marketing.stop"));
  }
};

const jumpOfficer = () => {
  if (distributorApproved.value === -2) {
    $toast({ message: $t("officer.failureToast"), duration: 2000 });
  } else if (distributorApproved.value === -1) {
    $router.push({ path: "/account/becomeIndex" });
  } else if (distributorApproved.value === 0) {
    $toast({ message: $t("officer.underReviewToast"), duration: 2000 });
  } else if (distributorApproved.value === 1) {
    $router.push({
      path: "/account/officerIndex",
      query: { lang: lang.value, distributorId: distributorId.value },
    });
  } else if (distributorApproved.value === 2) {
    $toast({ message: $t("officer.notPassed"), duration: 2000 });
  }
};

const getNewIndexData = async () => {
  uni.showLoading({ title: "加载中..." });
  try {
    const res = await getNewIndex();
    uni.hideLoading();
    if (res.code === 200) {
      companyLogo.value = res.data.companyLogo;
      notice.value = [...notice.value, ...res.data.notice];
      totalOrderNumber.value = res.data.totalOrderNumber;
      unfinishedOrderNumber.value = res.data.unfinishedOrderNumber;
      banner.value = [...banner.value, ...res.data.baseBanner];
      tools.value = [...tools.value, ...res.data.tools];
      transport.value = [...transport.value, ...res.data.transport];
      services.value = [...services.value, ...res.data.services];
      partner.value = [...partner.value, ...res.data.partner];
      const size = 4;
      const result = [];
      for (let i = 0; i < transport.value.length; i += size) {
        const slice = transport.value.slice(i, i + size);
        result.push(slice);
      }
      transportFirst.value = result[0];
      transportSecond.value = result[1];
      transportThird.value = result[2];
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    console.error(error);
  }
};

const jumpBanner = (url) => {
  if (
    url === "http://m.ylt-global.com" ||
    url === "http://www.ylt-global.com/"
  ) {
    window.location.href = url;
  } else if (url) {
    window.location.href = url;
  }
};

const jumpTools = (url) => {
  if (url) {
    window.location.href = url;
  } else {
    showToast($t("middle.toast"));
  }
};

const jumpArticle = (title) => {
  $router.push({ path: "/order/article", query: { kind: title } });
};

const jumpServices = (url) => {
  if (url === "jumpEmea") {
    $router.push({ path: "/order/middleEastern" });
  } else if (url === "https://www.whobest.cn/") {
    $router.push({
      path: "/inquiry/banner",
      query: { url: "https://www.whobest.cn/" },
    });
  } else if (url === "jumpOverseas") {
    $router.push({ path: "/overseas/overseasAddress" });
  } else if (url === "jumpBuyForMe") {
    $router.push({ path: "/order/buyForMe" });
  } else if (url === "jumpSearchForMe") {
    $router.push({ path: "/order/searchForMe" });
  } else if (url) {
    window.location.href = url;
  } else {
    showToast($t("middle.toast"));
  }
};

const jumpPartner = (url) => {
  if (
    url === "http://m.ylt-global.com" ||
    url === "http://www.ylt-global.com/"
  ) {
    window.location.href = url;
  } else if (url) {
    window.location.href = url;
  }
};

const orderPendingIndexData = async () => {
  try {
    const res = await orderPendingIndex();
    if (res.code === 200) {
      pendNum.value = res.data.reduce(
        (prev, item) => prev + item.orderCount,
        0
      );
    } else {
      showToast(res.msg);
    }
  } catch (error) {

  }
};

const orderProcess = async () => {
  try {
    const res = await orderProcessing({ flowCode: "PROCESSING" });
    if (res.code === 200) {
      processNum.value = res.total;
    } else {
      showToast(res.msg);
    }
  } catch (error) {
    // console.error(error);
  }
};

const jumpPending = () => {
  emit("update:number", pendingNum.value);
};

const jumpProcess = () => {
  emit("update:number", processingNum.value);
};

const getCustomerInfo = async () => {
  try {
    const res = await getCustomerInfoData();
    if (res.code === 200) {
      // if (res.data.areaPhonePrefix !== "+86") {
      //   getBuyForMeBanner();
      //   getSearchForMeBanner();
      // }
      // $utils.setCookie("userName", res.data.realname, 168);
      // $utils.setCookie("referrerName", res.data.recommendName, 168);
      // $utils.setCookie("referrerPhone", res.data.recommendPhone, 168);
      // $utils.setCookie("areaNumber", res.data.areaPhonePrefix, 168);
      // $utils.setCookie("areaCode", res.data.areaCode, 168);
      // $utils.setCookie("userPhone", res.data.regPhone, 168);
      // member.value = res.data.memberStatus;
      // distributorApproved.value = res.data.distributorApproved;
      // userPhone.value = res.data.userPhone;
      // userName.value = res.data.userName;
      // areaPhonePrefix.value = res.data.areaPhonePrefix;
      // distributorId.value = res.data.distributorId;
    }
  } catch (error) {
    console.error(error);
  }
};

const service = () => {
  if ($utils.getCookie("areaNumber") !== "+86") {
    $router.push({ path: "/account/whatsApp" });
  } else {
    $router.push({ path: "/account/wechat" });
  }
};

const getToast = () => {
  $toast({ message: $t("middle.toast"), duration: 2000 });
};
</script>

<style lang="scss" scoped>
.home-page {
  background: #ffffff;
  margin-bottom: -60rpx;
  // .message-pop-up {
  //   ::v-deep .van-dialog {
  //     //弹窗背景图
  //     background: url(../../assets/images/dialog-background.png) no-repeat;
  //     background-size: 654rpx, 0rpx;
  //     border-radius: 0rpx 52rpx 0rpx 0rpx;

  //     .van-dialog__header {
  //       padding-top: 30rpx;
  //       padding-bottom: 20rpx;
  //       font-size: 34rpx;
  //     }

  //     .van-dialog__content {
  //       margin-top: 126rpx;
  //       max-height: 600rpx;
  //       min-height: 200rpx;
  //       padding: 0 40rpx;
  //       overflow-y: auto;
  //       font-size: 30rpx;
  //       color: #DF3030;

  //       h1,
  //       h2 {
  //         text-align: center;
  //         margin-left: 12rpx;
  //       }
  //     }

  //     .van-dialog__confirm {
  //       background: linear-gradient(180deg, #FFBC39 0%, #FE651A 100%);
  //       color: #ffffff !important;
  //       margin-top: 10rpx;
  //       border-radius: 0rpx 0rpx 24rpx 24rpx !important;
  //     }
  //   }

  //   .content {
  //     white-space: pre-wrap;

  //     h1,
  //     h2 {
  //       text-align: center;
  //     }
  //   }
  // }

  .gradual {
    height: 120rpx;

    .imgage {
      width: 100%;
      height: 134rpx;
      /* 禁止长按保存图片 */
      // pointer-events: none;
    }
  }

  .order-data {
    position: relative;

    .notice {
      display: flex;
      align-items: center;
      background-color: transparent;
      background: #FFFFFF;
      box-shadow: 0rpx 2rpx 4rpx 2rpx rgba(221, 49, 47, 0.03);

      .notice-img {
        width: 74rpx;
        height: 52rpx;
        margin-left: 30rpx;
      }

      .notice-swipe {
        //轮播图内容
        height: 80rpx;
        line-height: 80rpx;
        font-size: 26rpx;
        color: #666666;

        .van-swipe-item {
          margin-left: 40rpx;
        }
      }

      .notice-container {
        height: 40px;
        /* 容器高度 */
        overflow: hidden;
        position: relative;
      }

      .notice-content {
        transition: transform 0.5s ease;
        /* 添加过渡效果 */
      }

      .notice-item {
        height: 40px;
        /* 每条公告的高度 */
        line-height: 40px;
        margin-left: 30rpx;
      }
    }

    .data-box {
      background-size: 100% 100%;
      background-size: cover;
      width: 690rpx;
      margin: 0 auto;
      border-radius: 24rpx;

      .box-top {
        display: flex;
        margin: 0rpx 0rpx 0rpx 0rpx;
        padding-top: 30rpx;

        .left,
        .center,
        .right {
          flex: 1;
          text-align: center;

          >view {
            margin: 0 auto;

            >img {
              width: 80rpx;
              height: 80rpx;
              text-align: center;
              margin: 0 auto;
            }
          }

          .h1 {
            font-size: 28rpx;
            font-weight: 500;
            color: #333333;
            padding-top: 20rpx;
          }
        }

        .left {
          width: 210rpx;
          background: linear-gradient(132deg, #F2FFFC 0%, #D4FFF6 100%);
          box-shadow: 0rpx 0rpx 6rpx 2rpx rgba(0, 196, 148, 0.15);
          border-radius: 12rpx;

          .text {
            font-size: 26rpx;
            margin-top: 6rpx;
            margin-bottom: 20rpx;
            color: #00C494;
          }

          .left-icon {
            display: inline-block;
            width: 80rpx;
            height: 80rpx;
            background: url("../../static/inquiry/icon-system.png") no-repeat;
            background-size: contain;
          }
        }

        .center {
          width: 210rpx;
          background: linear-gradient(134deg, #FBEAEA 0%, #FFF8F8 0%, #FFE8E8 100%);
          box-shadow: 0rpx 0rpx 6rpx 2rpx rgba(253, 106, 106, 0.15);
          border-radius: 12rpx;
          margin-left: 30rpx;

          .text {
            font-size: 26rpx;
            margin-top: 6rpx;
            margin-bottom: 20rpx;
            color: #FD6A6A;
          }

          .center-icon {
            display: inline-block;
            width: 80rpx;
            height: 80rpx;
            background: url("../../static/inquiry/icon-labour.png") no-repeat;
            background-size: contain;
          }
        }

        .right {
          width: 210rpx;
          background: linear-gradient(314deg, #E4D9FF 0%, #F8F5FF 100%);
          box-shadow: 0rpx 0rpx 6rpx 2rpx rgba(135, 103, 240, 0.15);
          border-radius: 12rpx;
          margin-left: 30rpx;

          .text {
            font-size: 26rpx;
            margin-top: 6rpx;
            margin-bottom: 20rpx;
            color: #8767F0;
          }

          .right-icon {
            display: inline-block;
            width: 80rpx;
            height: 80rpx;
            background: url("../../static/inquiry/icon-collect.png") no-repeat;
            background-size: contain;
          }
        }
      }

      .box-bottom {
        display: flex;
        margin-top: 30rpx;

        .left {
          flex: 1;
          background: #FDEFFF;
          border-radius: 12rpx;
          font-size: 32rpx;
          color: #B40EC6;
          text-align: center;
          padding: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .tit {
            color: #333333;
            font-size: 26rpx;
          }
        }

        .right {
          flex: 1;
          background: #FFEEF2;
          border-radius: 12rpx;
          font-size: 32rpx;
          color: #F2225A;
          text-align: center;
          padding: 20rpx;
          margin-left: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .tit {
            color: #333333;
            font-size: 26rpx;
          }
        }
      }

      .title {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        margin: 0 30rpx;
        padding-top: 20rpx;
        font-weight: 500;
        color: #333333;
        width: 440rpx;
        word-wrap: break-word;

        .title-line {
          margin-right: 20rpx;
          width: 6rpx;
          height: 30rpx;
          background: #DF3030;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
        }
      }

      .data {
        width: 598rpx;
        height: 132rpx;
        background: #FFFFFF;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        opacity: 1;
        margin: 30rpx auto;
        display: flex;

        .left,
        .right {
          margin: 30rpx 0rpx 40rpx 140rpx;
          font-size: 26rpx;
          font-weight: 500;
          color: #333333;

          >view {
            color: #DD312F;
            margin-top: 10rpx;
            margin-left: 32rpx;
          }
        }
      }

      .lastButton {
        display: flex;
        margin-left: 40rpx;

        :deep(.Button) {
          margin-right: 32rpx;
          width: 180rpx;
          height: 72rpx;
          border-radius: 200rpx 200rpx 200rpx 200rpx;
          margin-top: -10rpx;
          background-color: #DF3030;
          color: #FFFFFF;
        }
      }
    }

  }

  .banner-home {
    width: 690rpx;
    height: 210rpx;
    border-radius: 20rpx;
    margin: 20rpx auto;
    margin-top: 24rpx;

    :deep(.my-swipe) {
      width: 98%;
      margin: 0 auto;
      color: #fff;
      font-size: 40rpx;
      height: 220rpx;
      line-height: 220rpx;
      border-radius: 20rpx;

      .van-image {
        /* 禁止长按保存图片 */
        // pointer-events: none;
      }
    }
  }

  .market-banner {
    width: 734rpx;
    margin: -20rpx auto;

    .zh-bg {
      display: inline-block;
      width: 734rpx;
      height: 272rpx;
      background: url("../../static/common/home-zhMarketing.png") no-repeat;
      background-size: contain;
    }

    .en-bg {
      display: inline-block;
      width: 734rpx;
      height: 272rpx;
      background: url("../../static/common/home-enMarketing.png") no-repeat;
      background-size: contain;
    }
  }

  .tool-box {
    width: 690rpx;
    margin: -20rpx auto;
    margin-bottom: 30rpx;
    padding-bottom: 24rpx;

    .top {
      .tool-title {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        margin: 0 20rpx;
        padding-top: 20rpx;
        font-weight: 500;
        color: #333333;
        width: 440rpx;
        word-wrap: break-word;

        .title-line {
          margin-right: 20rpx;
          width: 6rpx;
          height: 30rpx;
          background: #DF3030;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
        }
      }

      .lantern {
        margin-left: 586rpx;
        margin-top: -60rpx;

        >img {
          width: 100rpx;
          height: 76rpx;
        }
      }

      .item {
        width: 690rpx;
        overflow: hidden;
        // background: #FFF7F5;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        margin: 20rpx auto;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;

        >view {
          // flex: 1;
          margin: 24rpx -10rpx 24rpx 32rpx;
          text-align: center;
        }

        .imgage {
          width: 92rpx;
          height: 92rpx;
          margin: 0 auto;
          // pointer-events: none;
        }

        .title {
          width: 144rpx;
          font-size: 24rpx;
          color: #333333;
          font-weight: 500;
          margin-left: 0rpx;
          margin-bottom: 0rpx;
          margin-top: -6rpx;
          word-wrap: break-word;
        }

        .title-null {
          width: 144rpx;
          font-size: 24rpx;
          color: #999999;
          font-weight: 500;
          margin-left: 0rpx;
          margin-bottom: 0rpx;
          margin-top: -6rpx;
          word-wrap: break-word;
        }
      }
    }

    .bottom {
      margin-top: -20rpx;

      .tool-title {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        margin: 0 20rpx;
        padding-top: 20rpx;
        font-weight: 500;
        color: #333333;
        width: 520rpx;
        word-wrap: break-word;

        .title-line {
          margin-right: 20rpx;
          width: 6rpx;
          height: 30rpx;
          background: #DF3030;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
        }
      }

      .item {
        width: 690rpx;
        // background: #FFF7F5;
        border-radius: 24rpx 24rpx 24rpx 24rpx;
        margin: 24rpx auto;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;

        >view {
          // flex: 1;
          margin: 24rpx -10rpx 24rpx 30rpx;
          text-align: center;

          .imgage {
            width: 60rpx;
            height: 60rpx;
            margin-bottom: 10rpx;
            margin-left: 14rpx;
            margin: 10rpx auto;
            // pointer-events: none;
          }

          .title {
            width: 144rpx;
            font-size: 24rpx;
            color: #333333;
            font-weight: 500;
            margin-left: 0rpx;
            margin-top: -6rpx;
            word-wrap: break-word;
          }

          .title-null {
            width: 144rpx;
            font-size: 24rpx;
            color: #999999;
            font-weight: 500;
            margin-left: 0rpx;
            margin-top: -6rpx;
            word-wrap: break-word;
          }
        }
      }
    }
  }

  .tool-bottom {
    margin-top: -20rpx;

    .tool-title {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      margin: 0 20rpx;
      padding-top: 20rpx;
      font-weight: 500;
      color: #333333;
      width: 520rpx;
      word-wrap: break-word;

      .title-line {
        margin-right: 20rpx;
        width: 6rpx;
        height: 30rpx;
        background: #DF3030;
        border-radius: 4rpx 4rpx 4rpx 4rpx;
      }
    }

    .item {
      width: 690rpx;
      // background: #FFF7F5;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      margin: 16rpx auto;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;

      >view {
        // flex: 1;
        margin: 24rpx -10rpx 24rpx 30rpx;
        text-align: center;

        .imgage {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 10rpx;
          margin-left: 14rpx;
          margin: 10rpx auto;
          /* 禁止长按保存图片 */
          // pointer-events: none;
        }

        .title {
          width: 144rpx;
          font-size: 24rpx;
          color: #333333;
          font-weight: 500;
          margin-left: 0rpx;
          margin-top: -6rpx;
          word-wrap: break-word;
        }

        .title-null {
          width: 144rpx;
          font-size: 24rpx;
          color: #999999;
          font-weight: 500;
          margin-left: 0rpx;
          margin-top: -6rpx;
          word-wrap: break-word;
        }
      }
    }
  }

  .bottom-swipe {
    width: 690rpx;
    height: 220rpx;
    margin: 0 auto;
    color: #fff;
    font-size: 40rpx;
    line-height: 160rpx;
    text-align: center;

    .item-swipe {
      display: flex;

      >view {
        // flex: 1;
        margin: 12px -5px 12px 15px;
        text-align: center;

        .imgage {
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
          margin-left: 7px;
          margin: 5px auto;
          /* 禁止长按保存图片 */
          // pointer-events: none;
        }

        .title {
          width: 72px;
          font-size: 12px;
          color: #333333;
          font-weight: 500;
          margin-left: 0px;
          margin-top: -3px;
          word-wrap: break-word;
          margin-top: -58px;
        }

        .title-null {
          width: 72px;
          font-size: 12px;
          color: #999999;
          font-weight: 500;
          margin-left: 0px;
          margin-top: -3px;
          word-wrap: break-word;
          margin-top: -58px;
        }
      }
    }
    :deep(.uni-swiper-dots-horizontal){
      bottom: -80rpx;
    }
  }
}

.last-bottom {
  width: 345px;
  margin: -22px auto;
  // margin-bottom: 20px;
  height: 100px;

  :deep(.uni-image) {
    width: 345px;
    height: 80px;

    >img {
      width: 345px;
      height: 80px;
      // pointer-events: none;
    }
  }

}

.article-popup {

  // .morning-popup,
  // .morning-popup-en {
  //   background-image: url(../../assets/images/common/morningPopup-zh.png);
  //   border-radius: 13px;
  //   background-size: 100% 100%;
  //   background-size: cover;
  //   width: 315px;
  //   height: 438px;

  //   .van-popup--center {
  //     position: relative;
  //     // height: 438px;
  //   }

  //   .bottom-btn {
  //     position: absolute;
  //     width: 165px;
  //     height: 38px;
  //     background: #EBAF3F;
  //     border-radius: 100px;
  //     text-align: center;
  //     line-height: 38px;
  //     color: #FFFFFF;
  //     font-size: 13px;
  //     bottom: 20px;
  //     margin: auto; // 底部居中
  //     left: 0; // 底部居中
  //     right: 0; // 底部居中
  //   }
  // }

  // .morning-popup-en {
  //   background-image: url(../../assets/images/common/morningPopup-en.png);
  //   border-radius: 13px;
  //   background-size: 100% 100%;
  //   background-size: cover;
  //   width: 315px;
  //   height: 438px;
  // }

  // .afternoon-popup,
  // .afternoon-popup-en {
  //   background-image: url(../../assets/images/common/afternoonPopup-zh.png);
  //   border-radius: 13px;
  //   background-size: 100% 100%;
  //   background-size: cover;
  //   width: 315px;
  //   height: 438px;

  //   .van-popup--center {
  //     position: relative;
  //     // height: 438px;
  //   }

  //   .bottom-btn,
  //   .bottom-btn-recruit {
  //     position: absolute;
  //     width: 165px;
  //     height: 38px;
  //     background: #FFFFFF;
  //     border-radius: 100px;
  //     text-align: center;
  //     line-height: 38px;
  //     color: #2D6CA2;
  //     font-size: 13px;
  //     bottom: 20px;
  //     margin: auto; // 底部居中
  //     left: 0; // 底部居中
  //     right: 0; // 底部居中
  //   }

  //   .bottom-btn-recruit {
  //     bottom: 6px;
  //   }
  // }

  // .afternoon-popup-en {
  //   background-image: url(../../assets/images/common/afternoonPopup-en.png);
  //   border-radius: 13px;
  //   background-size: 100% 100%;
  //   background-size: cover;
  //   width: 315px;
  //   height: 438px;
  // }

  //   .night-popup,
  //   .night-popup-en {
  //     background-image: url(../../assets/images/common/nightPopup-zh.png);
  //     border-radius: 13px;
  //     background-size: 100% 100%;
  //     background-size: cover;
  //     width: 315px;
  //     height: 438px;

  //     .van-popup--center {
  //       position: relative;
  //       // height: 438px;
  //     }

  //     .bottom-btn {
  //       position: absolute;
  //       width: 165px;
  //       height: 38px;
  //       background: #5D445A;
  //       border-radius: 100px;
  //       text-align: center;
  //       line-height: 38px;
  //       color: #FFFFFF;
  //       font-size: 13px;
  //       bottom: 20px;
  //       margin: auto; // 底部居中
  //       left: 0; // 底部居中
  //       right: 0; // 底部居中
  //     }
  //   }

  //   .night-popup-en {
  //     background-image: url(../../assets/images/common/nightPopup-en.png);
  //     border-radius: 13px;
  //     background-size: 100% 100%;
  //     background-size: cover;
  //     width: 315px;
  //     height: 438px;
  //   }
  // }

  // .announcement-popup {
  //   .van-popup--center {
  //     border-radius: 13px;
  //     width: 290px;
  //     height: auto;

  //     .popup-image {
  //       width: 290px;
  //       height: 100px;
  //     }

  //     .popup-title {
  //       color: #E85F5B;
  //       margin: 5px 120px;
  //       font-size: 18px;
  //     }

  //     //弹窗样式
  //     .popup {
  //       width: 290px;
  //       height: auto;
  //       font-size: 18px;
  //       text-align: center;
  //       padding: 10px 20px;
  //       margin-bottom: 10px;
  //     }

  //     .button {
  //       >img {
  //         width: 200px;
  //         height: 50px;
  //         margin-left: 45px;
  //         position: relative;
  //       }

  //       >span {
  //         position: absolute;
  //         font-size: 16px;
  //         width: 90px;
  //         margin-left: -132px;
  //         margin-top: 13px;
  //         color: #FFFFFF;
  //       }
  //     }
  //   }

  // }

  .head {
    width: 338px;
    height: 115px;
    margin: 20rpx auto;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 5px 8px #E8E1E14D;
    border-radius: 20rpx;

    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      margin: 0 15px;
      padding-top: 10px;
      color: #333333;
      width: 220px;
      word-wrap: break-word;

      .title-line {
        margin-right: 10px;
        width: 3px;
        height: 15px;
        background: #DF3030;
        border-radius: 2px 2px 2px 2px;
      }
    }

    .data {
      display: flex;
      font-size: 25px;
      margin: 7px 25px;
      width: 100%;

      .left {
        padding: 16px;
        width: 50px;

        >view {
          &:first-child {
            font-size: 15px;
            width: 80px;
            margin-left: -8px;
          }

          &:last-child {
            width: 60px;
            margin: 4px 4px;
            font-size: 15px;
            font-weight: bold;
            color: #DF3030;
          }
        }
      }

      .right {
        padding: 14.5px;
        width: 60px;
        margin: 1px 25px;

        >view {
          &:first-child {
            font-size: 15px;
            width: 120px;

          }

          &:last-child {
            width: 60px;
            margin: 5px 18px 5px;
            font-weight: bold;
            font-size: 15px;
          }
        }

        .price {
          font-size: 15px;
          color: #DF3030;
        }
      }

      .lastButton {
        margin-top: -25px;

        :deep(.Button) {
          width: 110px;
          height: 40px;
          border-radius: 15px;
          margin: -15px 38px;
          margin-bottom: 5px;
          background-color: #DF3030;
          color: #FFFFFF;
        }

        :deep(.button) {
          width: 110px;
          height: 40px;
          border-radius: 15px;
          margin: 1px 38px;
          background-color: #DF3030;
          color: #FFFFFF;
        }
      }

    }
  }

  //工具箱样式
  .workBox {
    width: 345px;
    margin: 26px auto;

    >p {
      font-size: 17px;
      font-weight: 500;
      color: #000000;
      margin: 0 5px;
    }

    .box {
      display: flex;
      flex-wrap: wrap;
      margin: 5px auto;
      width: 370px;

      div {
        width: 165px;
        height: 65px;
        margin: 5px 4px;
        background: #FFFFFF;
        border-radius: 10px 10px 10px 10px;
        display: flex;

        .imgage {
          display: block;
          width: 100%;
          height: 65px;
          margin: 0px auto;
          /* 禁止长按保存图片 */
          // pointer-events: none;

          // /deep/.van-image__img {
          //   border-radius: 10px 10px 10px 10px;
          // }
        }
      }
    }
  }

  //关于我们
  .brief {
    width: 345px;
    margin: 26px auto;

    >p {
      font-size: 17px;
      font-weight: 500;
      color: #000000;
      margin: 0 5px;
    }

    >view {
      display: flex;
      flex-wrap: wrap;
      margin: 5px auto;
      width: 370px;

      .tools {
        width: 165px;
        height: 65px;
        margin: 5px 5px;
        background: #FFFFFF;
        box-shadow: 0px 3px 4px 1px rgba(232, 225, 225, 0.3);
        border-radius: 10px 10px 10px 10px;
        display: flex;

        .imgage {
          display: block;
          width: 100%;
          height: 65px;
          margin: 0px auto;
          /* 禁止长按保存图片 */
          // pointer-events: none;

          // .van-image__img {
          //   border-radius: 10px 10px 10px 10px;
          // }
        }
      }
    }
  }

  //合作伙伴
  .last {
    width: 345px;
    margin: 26px auto;

    >p {
      font-size: 17px;
      font-weight: 500;
      color: #000000;
      margin: 0 5px;
    }

    >view {
      display: flex;
      flex-wrap: wrap;
      margin: 10rpx auto;
      width: 740rpx;

      .tools {
        width: 330rpx;
        height: 150rpx;
        background: #FFFFFF;
        margin: 10rpx 10rpx;
        box-shadow: 0px 3px 4px 1px rgba(232, 225, 225, 0.3);
        border-radius: 20rpx;
        display: flex;

        .images {
          width: 100%;
          height: 150rpx;
          background: #FFFFFF;
          border-radius: 100rpx;
          border-radius: 20rpx;

          // /deep/.van-image__img {
          //   border-radius: 10px 10px 10px 10px;
          // }
        }
      }
    }
  }
}
</style>