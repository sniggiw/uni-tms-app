<template>
  <view class="inquiryHome-page">
    <swiper
      class="swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
    >
      <!-- swiper-item 组件 -->
      <swiper-item v-for="(item, index) in bannerData" :key="index">
        <!-- image 标签 -->
        <image
          src="https://www.gosun2.com/tms-app/profile\\\\\\20221022\\55ca068bda4246838f2ab211707c7b42.png"
          class="banner-image"
          mode="widthFix"
        ></image>
      </swiper-item>
    </swiper>
    <!-- 折叠面板 -->
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
        <!-- 机场到机场 -->
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
          <HomeCollapseItem
            :flow="activeName"
            @searchInquiryCallback="searchInquiryCallback"
          ></HomeCollapseItem>
        </uni-collapse-item>
        <!-- 港口 -->
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
          <HomeCollapseItem
            :flow="activeName"
            @searchInquiryCallback="searchInquiryCallback"
          ></HomeCollapseItem>
        </uni-collapse-item>
        <!-- 快递 -->
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
          <HomeCollapseItem
            :flow="activeName"
            @searchInquiryCallback="searchInquiryCallback"
          ></HomeCollapseItem>
        </uni-collapse-item>
        <!-- 铁路 -->
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
          <HomeCollapseItem
            :flow="activeName"
            @searchInquiryCallback="searchInquiryCallback"
          ></HomeCollapseItem>
        </uni-collapse-item>
      </uni-collapse>
    </view>
    <!-- 底部热门城市 -->
    <view class="hot">
      <view class="hot-title">
        <view>热门城市</view>
        <view class="line"></view>
      </view>
      <view class="hot-list" v-for="(item, index) in hotToday" :key="index">
        <view class="title">
          <view class="title-line"></view>
          {{ item.flowTemplateTitle }}
        </view>
        <view class="hot-list-content">
          <view
            class="custom-card list-item"
            v-for="(channel, channelIndex) in item.channels"
            :key="channelIndex"
            @click="toJumpList(channel, item.flowTemplateId)"
          >
            <template v-if="channel.mark === 'HOT'">
              <view class="ico-hot"></view>
            </template>
            <template v-if="channel.mark === 'SALE'">
              <view class="ico-sale"></view>
            </template>
            <view class="steps">
              <view class="ico-start">
                <view class="font">
                  <template v-if="item.flowTemplateId === 2">
                    <!-- 国际机场 -->
                    {{ channel.startPos.scode }}
                    <text class="desc">{{ channel.startPos.title }}</text>
                  </template>
                  <template v-else>
                    {{ channel.startPos.title }}
                  </template>
                </view>
              </view>
              <view class="dotted"></view>
              <view class="ico-end">
                <view class="font">
                  <template v-if="item.flowTemplateId === 2">
                    <!-- 国际机场 -->
                    {{ channel.endPos.scode }}
                    <text class="desc">{{ channel.endPos.title }}</text>
                  </template>
                  <template v-else>
                    {{ channel.endPos.title }}
                  </template>
                </view>
              </view>
            </view>
            <view class="item-division">
              <view class="round left-round"></view>
              <view class="line"></view>
              <view class="round right-round"></view>
            </view>
            <template
              v-if="
                (item.flowTemplateId == 1 ||
                  item.flowTemplateId == 2 ||
                  item.flowTemplateId == 4 ||
                  item.flowTemplateId == 5) &&
                lang == 'en_US'
              "
            >
              <view class="item-last"> ${{ channel.price }} </view>
            </template>
            <!-- 港口流程不展示单价 -->
            <template v-if="item.flowTemplateId != 3">
              <view class="item-last"> ￥{{ channel.price }} </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <!-- 货物信息弹窗组件 -->
    <CargoInfoDialog
      ref="show"
      :searchData="searchData"
      :flow="activeName"
    ></CargoInfoDialog>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive, toRefs } from "vue";
import { getBannerData, inquiryHotToday } from "@/api/inquiry";
import HomeCollapseItem from "../inquiry/components/homeComponent/index.vue";
import CargoInfoDialog from "../inquiry/components/cargoInfoDialog/index.vue";
const indicatorDots = ref(true);
const autoplay = ref(true);
const interval = ref(2000);
const duration = ref(500);
const activeName = ref("1");
const searchData = ref({});
const showCargoInfo = ref(false);
const show = ref(true);
const hotToday = ref([]);
const lang = ref('')
const data = reactive({
  bannerParams: {
    kind: "询价首页",
    pageNum: 1, // 当前页数
    pageSize: 20, // 分页大小
  },
});
const { bannerParams } = toRefs(data);
// const bannerData = ref([]);
const bannerData = ref([
  {
    image:
      "https://www.gosun2.com/tms-app/profile\\\\\\20221022\\55ca068bda4246838f2ab211707c7b42.png",
  },
  {
    image:
      "https://www.gosun2.com/tms-app/profile\\\\\\20221022\\55ca068bda4246838f2ab211707c7b42.png",
  },
  { image: "https://via.placeholder.com/600x300?text=Banner3" },
]);
onMounted(() => {
  // bannerList();
  inquiryHotTodayData();
  lang.value = uni.getStorageSync("lang");
});
function bannerList() {
  getBannerData(bannerParams.value).then((response) => {
    bannerData.value = response.rows;
    console.log("@@", bannerData.value);
  });
}
function searchInquiryCallback(data) {
  // console.log('@@',data)
  searchData.value = data;
  show.value.openPopup();
}

function inquiryHotTodayData() {
  inquiryHotToday().then((response) => {
    hotToday.value = response.data;
    // bannerData.value = response.rows;
    // console.log("@@", bannerData.value);
  });
}
</script>

<style lang="scss" scoped>
.inquiryHome-page {
  .swiper {
    width: 100%;
    height: 450rpx; /* 根据需要调整高度 */
  }

  .swiper-item {
    width: 100%;
    height: 100%;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
  .container {
    border-radius: 40rpx 40rpx 0px 0px;
    margin: 50rpx 30rpx;
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
          .uni-collapse-item__wrap {
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
  .hot {
    margin-top: 60rpx;

    .hot-title {
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;

      .line {
        margin: 14rpx auto 0;
        width: 36rpx;
        height: 6rpx;
        background: #df3030;
        border-radius: 4rpx;
      }
    }

    .hot-list {
      padding: 30rpx;
      .title {
        display: flex;
        align-items: center;
        font-size: 36rpx;
        color: #333333;

        .title-line {
          margin-right: 20rpx;
          width: 6rpx;
          height: 30rpx;
          background: #df3030;
          border-radius: 4rpx;
        }
      }
    }

    .hot-list-content {
      display: flex;
      flex-wrap: wrap;
      margin: 20rpx 0 0 0;

      .list-item {
        position: relative;
        width: 336rpx;
        height: 260rpx;
        background: #fff;
        border-radius: 10rpx;
        margin-right: 16rpx;
        margin-bottom: 30rpx;

        &:nth-of-type(even) {
          margin-right: 0;
        }

        .ico-hot {
          position: absolute;
          top: 0;
          right: 0;
          width: 82rpx;
          height: 40rpx;
          background: url("../../static/inquiry/ico-hot.png") no-repeat;
          background-size: contain;
        }

        .ico-sale {
          position: absolute;
          top: 0;
          right: 0;
          width: 82rpx;
          height: 40rpx;
          background: url("../../static/inquiry/ico-sale.png") no-repeat;
          background-size: contain;
        }

        .steps {
          margin: 28rpx 20rpx 0;

          .ico-start,
          .ico-end {
            position: relative;
            width: 30rpx;
            height: 30rpx;
            background: url("../../static/inquiry/ico-start.png") no-repeat;
            background-size: contain;

            .font {
              position: absolute;
              top: -2rpx;
              left: 30rpx;
              width: 160rpx;
              font-size: 30rpx;
              color: #333333;
              line-height: 40rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              .desc {
                margin-left: 14rpx;
                font-size: 24rpx;
                color: #999999;
                line-height: 40rpx;
                vertical-align: middle;
              }
            }
          }

          .dotted {
            //虚线样式
            font-weight: bold;
            width: 6rpx;
            height: 44rpx;
            margin: 8rpx 12rpx;
            font-size: 36rpx;
            border-left: 6rpx dotted #e0e0e3;
          }

          .ico-end {
            margin-left: 2.5rpx;
            width: 25rpx;
            background: url("../../static/inquiry/ico-end.png") no-repeat;
            background-size: contain;
          }
        }

        .item-division {
          position: relative;
          padding-top: 30rpx;

          .round {
            width: 16rpx;
            height: 16rpx;
            background: #f9f9fa;
            border-radius: 8rpx;
            margin-top: 22rpx;
          }

          .left-round {
            position: absolute;
            left: -8rpx;
            top: 0;
          }

          .right-round {
            position: absolute;
            right: -8rpx;
            top: 0;
          }

          .line {
            margin: 0.8rpx;
            border-bottom: 2rpx dashed #b3b5ba;
          }
        }

        .item-last {
          display: flex;
          align-items: center;
          justify-content: right;
          margin: 0 24rpx;
          height: 76rpx;
          font-size: 34rpx;
          font-weight: bold;
          color: #df3030;
          line-height: 50rpx;
        }
      }
    }
  }
}
</style>