<template>
  <!-- 专线询价列表 -->
  <view class="content" id="app">
    <!-- 顶部 -->
    <view class="search">
      <view class="city-info">
        <!-- 起运地下拉 -->
        <view>
          {{ searchParams.srcTitle }}
        </view>
        <view class="city-info-center">
          <image src="@/static/inquiry/icon-right.png" />
        </view>
        <!-- 目的地下拉 -->
        <view>
          {{ searchParams.descTitle }}
        </view>
      </view>
      <view class="size-num"
        >{{ searchParams.weight }}kg | {{ searchParams.squares }}CBM |
        {{ searchParams.transCount }}{{ searchParams.transUnit }}</view
      >
      <dropdown-menu class="cargoInfo-content">
        <dropdown-item ref="cargoInfo" title=" ">
          <view class="popupTxet">
            <CargoInfoByDetail
              :searchData="searchParams"
              @closeFloor="closeFloor"
              @cargoInfoCallback="cargoInfoCallback"
              :Kind="searchParams.transKind"
              :receiverCityData="receiverCity"
              ref="cargoInfoByDetailRef"
            ></CargoInfoByDetail>
          </view>
        </dropdown-item>
      </dropdown-menu>
    </view>
    <view class="container">
      <!-- 价格筛选 -->
      <view class="choice">
        <dropdown-menu activeColor="#ee0a24" sticky>
          <dropdown-item
            title="全部"
            :options="sort"
            v-model="searchParams.sort"
            @change="getInquiryZx"
          >
          </dropdown-item>
          <dropdown-item
            title="运输方式"
            :options="transKind"
            v-model="searchParams.transKind"
            @change="getInquiryZx"
          >
          </dropdown-item>
        </dropdown-menu>
      </view>
      <!-- 内容div -->
      <template v-if="inquiryList.length > 0">
        <view class="center" v-for="(item, index) in inquiryList" :key="index">
          <view class="title">
            <template v-if="lang === 'zh_CN'">
              <image
                class="imgage"
                :src="require('@/static/inquiry/ico-nothan.png')"
                fit="contain"
                v-if="item.taxIncluded == true"
              />
              <image
                class="imgage"
                :src="require('@/static/inquiry/ico-nohan.png')"
                fit="contain"
                v-if="item.taxIncluded == false"
              />
            </template>
            <template v-if="lang === 'en_US'">
              <image
                class="dutyImgage-En"
                :src="require('@/static/inquiry/ico-en-nothan.png')"
                fit="contain"
                v-if="item.taxIncluded == true"
              />
              <image
                class="imgage-En"
                :src="require('@/static/inquiry/ico-en-nohan.png')"
                fit="contain"
                v-if="item.taxIncluded == false"
              />
            </template>
            <view
              class="tit"
              @click="
                placeOrder(
                  item.id,
                  item.price,
                  item.channelCode,
                  item.transKind,
                  item.channelId,
                  item.deliveryFeeDisplay,
                  item.destCity
                )
              "
              >{{ item.title }}</view
            >
          </view>
          <view class="parameter">
            <view class="leftBox">
              <view>
                运输方式:
                <text>{{ item.transKind }}</text>
              </view>
              <view>
                渠道编码:
                <text>{{ item.channelCode }}</text>
              </view>
              <view>
                目的地:
                <text>{{ item.destCountry }}</text>
              </view>
              <view>
                价格标题:
                <text>{{ item.priceTitle }}</text>
              </view>
              <view>
                时效说明
                <text></text>
                <text>{{ item.needTimesDesc }}</text>
              </view>
              <!-- <view>
                <template v-if="item.pricingType == '按重量'">
                  {{ $t('inquiry.specBegin') }}:
                </template>
                <template v-if="item.pricingType == '按体积'">
                  {{ $t('inquiry.volume') }}:
                </template>
                <template v-if="item.pricingType == '按数量'">
                  {{ $t('inquiry.chargeQuantity') }}:
                </template>
                <template v-if="item.pricingType == '按首续重'">
                  {{ $t('inquiry.specBegin') }}:
                </template>
                <text>{{ item.statSpec }}</text>
              </view> -->
              <view>
                派送城市:
                <text>{{ item.destCity }}</text>
              </view>
              <view>
                派送费:
                <template
                  v-if="
                    item.deliveryFeeDisplay == '面谈' ||
                    item.deliveryFeeDisplay == 'interview'
                  "
                >
                  <text>面谈</text>
                </template>
                <template v-else>
                  <text>{{ item.deliveryFeeDisplay }}</text>
                </template>
              </view>
            </view>
            <view class="right">
              <template v-if="item.price > 0">
                <view class="top" v-if="item.pricingType == '按重量'"
                  >{{ item.currencySymbol }}{{ item.price }}/KG</view
                >
                <view class="top" v-if="item.pricingType == '按体积'"
                  >{{ item.currencySymbol }}{{ item.price }}/CBM</view
                >
                <view class="top" v-if="item.pricingType == '按数量'"
                  >{{ item.currencySymbol }}{{ item.price }}/PCS</view
                >
                <view
                  class="continue-price"
                  v-if="item.pricingType == '按首续重'"
                >
                  <view>{{ $t("inquiry.continuePrice") }}</view>
                  {{ item.currencySymbol }}{{ item.continuePrice }}/0.5KG
                  {{ item.currencySymbol }}{{ item.price }}/0.5KG
                </view>
                <button
                  class="jumpDetail"
                  @tap="
                    placeOrder(
                      item.id,
                      item.price,
                      item.channelCode,
                      item.transKind,
                      item.channelId,
                      item.deliveryFeeDisplay,
                      item.destCity
                    )
                  "
                >
                  点击查价
                </button>
              </template>
              <template v-if="item.price < 1">
                <button class="jumpDetail" @click.stop="service()">
                  联系客服
                </button>
              </template>
            </view>
          </view>
          <view class="divider"></view>
          <view
            class="matter"
            ref="sidebarBox"
            @tap="
              placeOrder(
                item.id,
                item.price,
                item.channelCode,
                item.transKind,
                item.channelId,
                item.deliveryFeeDisplay,
                item.destCity
              )
            "
          >
            <view ref="p1">
              <view v-html="item.note"></view>
            </view>
          </view>
        </view>
      </template>
      <EmptyComponent v-else />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { getInquiryZxData, listReceiverCity } from "@/api/inquiry";
import { getDictTypes } from "@/api/common";
import { onLoad } from "@dcloudio/uni-app";
import EmptyComponent from "../../../components/EmptyComponent/index.vue";
// import addressList from "@/views/components/addressList/index.vue"; // 起运地目的地列表
import CargoInfoByDetail from "../components/cargoInfoByDetail/index.vue";
import dropdownMenu from "../../../components/dropdownMenu/index.vue";
import dropdownItem from "../../../components/dropdownMenu/item.vue";
// 定义 props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  searchData: {
    type: Object,
    default: () => ({}),
  },
});
// 定义响应式变量
const lang = ref(""); // 登录时选择的语言

const transKind = ref([]); // 运输方式筛选数据来源
const inquiryList = ref([]); // 请求专线列表
const paramsData = ref({});
const searchParams = reactive({
  // 首页接收数据传参
  pageNum: 1, // 当前页数
  pageSize: 100, // 分页大小
  transKind: props.searchData.transKind,
  weight: props.searchData.weight,
  squares: props.searchData.squares,
  products: props.searchData.products,
  srcTitle: props.searchData.srcCountry, // 起运国家名
  srcScode: props.searchData.srcScode, // 起运地编码
  srcTitleEn: props.searchData.srcCountryEn, // 起运国家英文名
  transUnit: props.searchData.transUnit,
  transCount: props.searchData.transCount,
  descTitle: props.searchData.destCountry, // 目的地国家名
  descScode: props.searchData.destScode, // 目的地编码
  descTitleEn: props.searchData.destCountryEn, // 目的地国家英文名
  sort: "1", // 默认不传，价格传1，时效传2
  destCity: props.searchData.destCity, // 目的地城市
  maxHeight: props.searchData.maxHeight, // 最大高度
  maxLong: props.searchData.maxLong, // 最大长度
  maxWidth: props.searchData.maxWidth, // 最大宽度
});
const closeAddressList = ref(false);
const receiverCity = ref([]);
const homeTop = ref(0);
const sort = ref([
  {
    name: "价格",
    value: "1",
  },
  {
    name: "时效",
    value: "2",
  },
]);
const cargoInfoByDetailRef = ref(null);
const cargoInfo = ref(null);

// 生命周期钩子
onMounted(() => {
  lang.value = uni.getStorageSync("lang");
  getInquiryZx();
  let dicTitles = "专线设置.运输类别,专线设置.件数单位";
  getDictTypes({ dicTitles }).then((response) => {
    transKind.value = response.data["专线设置.运输类别"];
  });
  listReceiverCityData();
});

onLoad((options) => {
  // 将 options.products 转换为数组
  if (options.products && !Array.isArray(options.products)) {
    options.products = [options.products];
  } else if (!options.products) {
    options.products = []; // 如果 options.products 不存在，初始化为空数组
  }
  Object.assign(searchParams, options);
});

onBeforeUnmount(() => {
  const app = document.getElementById("app");
  homeTop.value = app.scrollTop || 0;
});

const getInquiryZx = () => {
  uni.showLoading({
    title: "加载中...",
    mask: true,
  });
  let params = JSON.parse(JSON.stringify(searchParams));
  if (params.products && params.products.length > 0) {
    params.products = params.products.toString();
  }
  inquiryList.value = [];
  getInquiryZxData(params).then((res) => {
    if (res.code === 200) {
      const resData = res.rows;
      inquiryList.value = [...inquiryList.value, ...resData];
      if (inquiryList.value.length >= res.total) {
        // 所有数据加载完成
      }
      uni.hideLoading();
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
      uni.hideLoading();
    }
  });
};

const cargoInfoCallback = (data) => {
  Object.assign(searchParams, data);
  getInquiryZx();
  closeFloor();
};

const closeFloor = () => {
  // 手动控制菜单的显示
  cargoInfo.value.onClose();
};

const placeOrder = (
  id,
  price,
  channelCode,
  transKind,
  channelId,
  deliveryFeeDisplay,
  destCity
) => {
  uni.navigateTo({
    url: `/pages/inquiry/dedicatedLine/channelDetail?channelId=${id}&price=${price}&channelCode=${channelCode}&transKind=${transKind}&channel=${channelId}&title=${props.searchData.title}&weight=${searchParams.weight}&srcCountry=${searchParams.srcTitle}&srcScode=${searchParams.srcScode}&srcCountryEn=${searchParams.srcTitleEn}&squares=${searchParams.squares}&products=${searchParams.products}&destCountry=${searchParams.descTitle}&destCountryEn=${searchParams.descTitleEn}&destScode=${searchParams.descScode}&transCount=${searchParams.transCount}&transUnit=${searchParams.transUnit}&destCity=${destCity}&deliveryFeeDisplay=${deliveryFeeDisplay}`,
  });
};

const checkCityCallback = (data) => {
  if (data.type == "1") {
    // 起运地
    searchParams.srcTitle = data.title;
    searchParams.srcScode = data.scode;
    searchParams.srcTitleEn = data.titleEn;
  } else if (data.type == "2") {
    // 目的地
    searchParams.descTitle = data.title;
    searchParams.descScode = data.scode;
    searchParams.descTitleEn = data.titleEn;
    searchParams.destCity = "";
    // listReceiverCityData();
  }
  getInquiryZx();
};

const listReceiverCityData = () => {
  let params = {
    descTitle: searchParams.descTitle,
    descScode: searchParams.descScode,
    descTitleEn: searchParams.descTitleEn,
  };
  listReceiverCity(params).then((res) => {
    if (res.code === 200) {
      receiverCity.value = res.rows.map((item) => ({
        ...item,
        text: item.name,
      }));
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  });
};

const service = () => {
  uni.showToast({
    title: "正在开发中",
    icon: "error",
    duration: 1500,
  });
};
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.content {
  background: #f9f9fa;
  .search {
    padding: 30rpx 20rpx 40rpx;
    background: #df3030;
    .popupTxet {
      .cargo-info-by-detail {
        max-height: 800rpx;
        height: auto;
        overflow-y: auto;
      }
    }
    .city-info {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 30rpx;
      font-size: 40rpx;
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);

      // /deep/.van-dropdown-menu {
      //   .dest-country, .src-country {
      //     position: relative;
      //     margin-left: 50rpx;
      //     font-size: 40rpx;
      //     font-weight: 600;
      //     color: #FFFFFF;
      //     > div {
      //       width: 210rpx;
      //       overflow: hidden;
      //       white-space: nowrap;
      //       text-overflow: ellipsis;
      //     }
      //     .ico-select {
      //       position: absolute;
      //       top: 2rpx;
      //       display: inline-block;
      //       width: 32rpx;
      //       height: 32rpx;
      //       background: url("../../../static/inquiry/ico-select.png")
      //         no-repeat;
      //       background-size: contain;
      //     }
      //     .desc {
      //       font-size: 26rpx;
      //       font-weight: 400;
      //       opacity: 0.6;
      //       color: #FFFFFF;
      //     }
      //   }
      //   .src-country {
      //     .ico-select {
      //       left: -50rpx;
      //     }
      //   }
      //   .dest-country {
      //     margin-left: 0;
      //     margin-right: 50rpx;
      //     text-align: right;
      //     .ico-select {
      //       right: -50rpx;
      //     }
      //   }
      //   .popupTxet {
      //     font-size: 28rpx;
      //     .van-index-anchor {
      //       position: static;
      //     }
      //   }
      //   .van-popup--top {
      //     border-radius: 0px 0px 30rpx 30rpx;
      //     max-height: 90%;
      //   }
      // }

      .city-info-center {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex: 1;
        width: 200rpx;
        height: 0px;
        margin: 30rpx 0;
        border: 1px dashed #ffa0a0;
        > uni-image {
          display: block;
          width: 34rpx;
          height: 34rpx;
          pointer-events: none;
        }
      }
    }
    .cargoInfo-content {
      background: #df3030;
    }
    // /deep/.van-dropdown-menu {
    //   flex: 1;
    //   padding: 0;
    //   .van-dropdown-menu__bar {
    //     background: #df3030;
    //     box-shadow:none;
    //     height: auto;
    //   }
    //   .van-dropdown-menu__title {
    //     padding: 0;
    //     &::after {
    //       content: none;
    //     }
    //   }
    //   .van-dropdown-item__content {
    //     // height: 65%;
    //     background: #F9F9FA;
    //   }
    //   .ico-arrow-up {
    //     display: inline-block;
    //     width: 35rpx;
    //     height: 19rpx;
    //     background: url("../../../static/inquiry/ico-arrow-up.png")
    //       no-repeat;
    //     background-size: contain;
    //   }
    // }
    // .dropdown-cargoInfoBy{ //货物属性弹窗高度自适应
    //   /deep/.van-dropdown-item__content {
    //     // height: auto;
    //     // /* 设置高度为自动，以适应内容 */
    //     // max-height: none;
    //     // /* 取消最大高度限制 */
    //     // overflow: visible;
    //     // /* 设置溢出时内容可见 */
    //     max-height: 85%;
    //   }
    // }
    // .size-num {
    //   min-height: 40rpx;
    //   color: #ffffff;
    //   font-size: 30rpx;
    //   margin: 16rpx auto;
    //   text-align: center;
    // }
  }
  .size-num {
    min-height: 40rpx;
    color: #ffffff;
    font-size: 30rpx;
    margin: 16rpx auto;
    text-align: center;
  }
  .container {
    margin-top: -40rpx;
    left: 0;
    overflow: hidden;
    border-radius: 40rpx 40rpx 0px 0px;
    background: #f9f9fa;

    //价格  运输方式筛选样式
    .choice {
      display: flex;
      justify-content: flex-end;
      font-size: 28rpx;
      margin: 0rpx 0px;
    }

    .center {
      width: 690rpx;
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 12rpx 20rpx #e8e1e157;
      border-radius: 30rpx;
      margin: 30rpx 30rpx 40rpx 30rpx;

      .title {
        .imgage {
          width: 114rpx;
          height: 54rpx;
          position: absolute;
          right: -2rpx;
          top: 0;
          pointer-events: none;
        }
        //英文版含税图片
        .dutyImgage-En {
          position: absolute;
          right: -4rpx;
          top: 0;
          width: 210rpx;
          height: 58rpx;
          pointer-events: none;
        }
        //英文版不含税图片
        .imgage-En {
          position: absolute;
          right: 0px;
          top: 0;
          width: 130rpx;
          height: 54rpx;
          pointer-events: none;
        }
        .tit {
          font-size: 34rpx;
          color: #f86e21;
          margin: 10rpx 0px 0px 38rpx;
          padding-top: 60rpx;
          font-weight: 600;
        }
      }
      .bg {
        width: 630rpx;
        height: 2rpx;
        margin: 20rpx 30rpx;
        background: #dee2e4;
      }

      .parameter {
        margin-top: 40rpx;
        font-size: 28rpx;
        height: auto;
        display: flex;
        justify-content: center; /* 垂直居中 */
        align-items: flex-end; /* 底部居中 */

        .leftBox {
          margin: 2rpx 40rpx;
          width: 400rpx;
          height: auto;
          font-size: 28rpx;
          color: #999999;

          > view > uni-text {
            font-size: 26rpx;
            margin-left: 10rpx;
            width: 200rpx;
            color: #333333;
          }
        }

        .bgOne {
          width: 2rpx;
          height: 140rpx;
          background: #dee2e4;
          margin: -146rpx 400rpx;
        }

        .right {
          color: #df3030;
          width: 194rpx;
          margin-right: 45rpx;
          font-size: 40rpx;

          .top {
            margin-left: 16rpx;
            margin-bottom: 10rpx;
            font-size: 28rpx;
            color: #dd312f;
          }
          .continue-price {
            margin-left: 16rpx;
            margin-bottom: 10rpx;
            font-size: 28rpx;
            color: #dd312f;
            word-break: break-all;
            word-wrap: break-word;
          }
          .bottom {
            width: 240rpx;
            height: 20rpx;
          }

          .jumpDetail {
            border-radius: 200rpx;
            background: #f54543;
            color: #ffffff;
            height: 70rpx;
            width: 220rpx;
            line-height: 70rpx;
            font-size: 30rpx;
          }
        }
      }

      .divider {
        width: 630rpx;
        height: 2rpx;
        // border-top:1px dotted #C0C0C0;
        margin: 30rpx 40rpx 36rpx;
        background: #dee2e4;
      }

      .matter {
        height: auto;
        width: 630rpx;
        margin: -20rpx 30rpx;
        word-wrap: break-word;
        font-size: 24rpx;
        color: #f86e21;
        overflow: hidden;

        .get_ct_more {
          height: 136rpx;
          position: absolute;
          bottom: 0px;
          width: 100%;
          background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0) 60%);

          margin-right: 20rpx;
        }
      }
    }
  }
}
</style>