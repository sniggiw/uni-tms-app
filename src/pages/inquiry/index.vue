<template>
  <view class="inquiryHome-page">
    <swiper
      class="swiper"
      circular
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
    >
      <swiper-item>
        <view class="swiper-item uni-bg-red">A</view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item uni-bg-green">B</view>
      </swiper-item>
      <swiper-item>
        <view class="swiper-item uni-bg-blue">C</view>
      </swiper-item>
    </swiper>
    <view class="container">
      <uni-collapse accordion v-model="activeName">
        <uni-collapse-item
          name="1"
          :open="true"
          title-border="none"
          :show-arrow="false"
        >
          <template v-slot:title>
            <view class="collapseItem">
              <view class="collapseItem-title">
                <view class="ico-logistics-default"></view>
                <view :class="activeName === '1' ? 'active' : ''"
                  >专线门到门</view
                >
                <i class="ico-put-away" v-if="activeName === '1'"></i>
                <i class="ico-open" v-else></i>
              </view>
            </view>
          </template>
          <HomeCollapseItem
            :flow="activeName"
            @searchInquiryCallback="searchInquiryCallback"
          ></HomeCollapseItem>
        </uni-collapse-item>

        <uni-collapse-item name="2" title-border="none" :show-arrow="false">
          <template v-slot:title>
            <view class="collapseItem">
              <view class="collapseItem-title">
                <view class="ico ico-air"></view>
                <view :class="activeName === '2' ? 'active' : ''"
                  >机场到机场</view
                >
                <i class="ico-put-away" v-if="activeName === '2'"></i>
                <i class="ico-open" v-else></i>
              </view>
            </view>
          </template>
        </uni-collapse-item>
        <uni-collapse-item name="3" title-border="none" :show-arrow="false">
          <template v-slot:title>
            <view class="collapseItem">
              <view class="collapseItem-title">
                <view class="ico ico-sea"></view>
                <view :class="activeName === '3' ? 'active' : ''"
                  >港口到港口</view
                >
                <i class="ico-put-away" v-if="activeName === '3'"></i>
                <i class="ico-open" v-else></i>
              </view>
            </view>
          </template>
        </uni-collapse-item>
        <uni-collapse-item name="4" title-border="none" :show-arrow="false">
          <template v-slot:title>
            <view class="collapseItem">
              <view class="collapseItem-title">
                <view class="ico ico-car"></view>
                <view :class="activeName === '4' ? 'active' : ''"
                  >国际快递</view
                >
                <i class="ico-put-away" v-if="activeName === '4'"></i>
                <i class="ico-open" v-else></i>
              </view>
            </view>
          </template>
        </uni-collapse-item>
        <uni-collapse-item name="5" title-border="none" :show-arrow="false">
          <template v-slot:title>
            <view class="collapseItem">
              <view class="collapseItem-title">
                <view class="ico ico-railway"></view>
                <view :class="activeName === '5' ? 'active' : ''"
                  >国际铁路</view
                >
                <i class="ico-put-away" v-if="activeName === '5'"></i>
                <i class="ico-open" v-else></i>
              </view>
            </view>
          </template>
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, toRefs } from "vue";
// import { getBannerData } from "@/api/common";
import HomeCollapseItem from "../inquiry/components/homeComponent/index.vue";
const background = ref(["color1", "color2", "color3"]);
const indicatorDots = ref(true);
const autoplay = ref(true);
const interval = ref(2000);
const duration = ref(500);
const activeName = ref("1");
const searchData = ref({});
const showCargoInfo = ref(false);
const data = reactive({
  bannerParams: {
    kind: "询价首页",
    pageNum: 1, // 当前页数
    pageSize: 20, // 分页大小
  },
});
const { bannerParams } = toRefs(data);
const bannerData = ref([]);
onMounted(() => {
  // bannerList();
});
// function bannerList() {
//   getBannerData(bannerParams.value).then((response) => {});
// }
function searchInquiryCallback(data) {
  searchData.value = data;
  showCargoInfo.value = true;
}
</script>

<style lang="scss" scoped>
.uni-margin-wrap {
  width: 690rpx;
  width: 100%;
}
.swiper {
  height: 300rpx;
}
.swiper-item {
  display: block;
  height: 300rpx;
  line-height: 300rpx;
  text-align: center;
}
.swiper-list {
  margin-top: 40rpx;
  margin-bottom: 0;
}
.uni-common-mt {
  margin-top: 60rpx;
  position: relative;
}
.info {
  position: absolute;
  right: 20rpx;
}
.uni-padding-wrap {
  width: 550rpx;
  padding: 0 100rpx;
}
.inquiryHome-page {
  .container {
    border-radius: 40rpx 40rpx 0px 0px;
    margin: 26rpx 30rpx;
    .uni-collapse {
      font-size: 32rpx;
      color: #333333;
      :deep(.uni-collapse-item) {
        overflow: hidden;
        box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        .collapseItem {
          position: relative;
          padding: 40rpx 40rpx 20rpx;
          .uni-collapse-item__wrap{
            padding-bottom: 30rpx;
          }
          .collapseItem-title {
            display: flex;
            align-items: center;
          }

          .active {
            color: #df3030;
          }
          .ico-open {
            display: inline-block;
            width: 44rpx;
            height: 44rpx;
            background: url("../../static/inquiry/ico-open.png") no-repeat;
            background-size: contain;
            position: absolute;
            right: 20rpx;
          }

          .ico-put-away {
            display: inline-block;
            width: 44rpx;
            height: 44rpx;
            background: url("../../static/inquiry/ico-put-away.png") no-repeat;
            background-size: contain;
            position: absolute;
            right: 20rpx;
          }
          .ico {
            display: inline-block;
          }
          .ico-logistics-default {
            margin-right: 32rpx;
            width: 60rpx;
            height: 60rpx;
            background: url("../../static/common/ico-logistics-default.png")
              no-repeat;
            background-size: contain;
          }
          .ico-air {
            margin-right: 36rpx;
            width: 60rpx;
            height: 60rpx;
            background: url("../../static/inquiry/ico-air.png") no-repeat;
            background-size: contain;
          }

          .ico-car {
            margin-right: 46rpx;
            width: 60rpx;
            height: 60rpx;
            background: url("../../static/common/ico-car.png") no-repeat;
            background-size: contain;
          }

          .ico-sea {
            margin-right: 42rpx;
            width: 60rpx;
            height: 60rpx;
            background: url("../../static/inquiry/ico-sea.png") no-repeat;
            background-size: contain;
          }

          .ico-railway {
            margin-right: 44rpx;
            width: 60rpx;
            height: 60rpx;
            background: url("../../static/inquiry/ico-railway.png") no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>