<template>
  <view class="content">
    <!-- 顶部 -->
    <view class="search" id="app">
      <view class="head">
        <view
          >{{ srcCountry }}<text>{{ srcCountryEn }}</text></view
        >
        <view>
          <image src="@/static/inquiry/UPS.png" alt="" />
          <text class="text">专线</text>
        </view>
        <view
          >{{ destCountry }}<text>{{ destCountryEn }}</text></view
        >
      </view>
      <view class="products-attr"></view>
    </view>
    <view class="container">
      <!-- 费用表 -->
      <view class="custom-card listem">
        <view class="tolo">{{ inquiryDetail.title }}</view>
        <view class="fontSize">
          <view
            >时效说明:<text>{{ inquiryDetail.needTimesDesc }}</text></view
          >
          <view
            >运输方式:<text>{{ inquiryDetail.transDeviceType }}</text></view
          >
          <!-- <view>
            <template v-if="inquiryDetail.pricingType === '按重量'">
              {{ $t('inquiry.specBegin') }}:
            </template>
            <template v-if="inquiryDetail.pricingType === '按体积'">
              {{ $t('inquiry.volume') }}:
            </template>
            <template v-if="inquiryDetail.pricingType === '按数量'">
              {{ $t('inquiry.chargeQuantity') }}:
            </template>
            <template v-if="inquiryDetail.pricingType === '按首续重'">
              {{ $t('inquiry.specBegin') }}:
            </template>
            <text>{{ inquiryDetail.statSpec }}</text>
          </view> -->
          <!-- 底部预估价格＝ 基础价格 + 选取的服务费用  当列表页price<0的时，则为面谈-->
          <template v-if="price > 0">
            <view class="price">
              总价:
              <view class="totalPrice"
                >{{ inquiryDetail.currencySymbol
                }}{{ inquiryDetail.totalPrice }}</view
              >
            </view>
          </template>
          <template v-if="price < 1">
            <view class="price" @tap.stop="service()">
              总价:
              <view class="totalPrice">咨询在线客服</view>
            </view>
          </template>
          <view class="ion" @tap="search">
            明细
            <view type="down" size="15" :class="[state ? 'g' : 'a']"></view>
          </view>
        </view>
        <template v-if="inquiryDetail.pricingType !== '按首续重'">
          <view class="price-list" v-if="priceA">
            <view class="price-title">
              <view>费用项</view>
              <view>单价</view>
              <view>总价</view>
            </view>
            <template v-if="price > 0">
              <view class="price-item">
                <view>运费</view>
                <view v-if="inquiryDetail.pricingType === '按重量'"
                  >{{ inquiryDetail.currencySymbol }}{{ price }}/kg</view
                >
                <view v-if="inquiryDetail.pricingType === '按体积'"
                  >{{ inquiryDetail.currencySymbol }}{{ price }}/CBM</view
                >
                <view v-if="inquiryDetail.pricingType === '按数量'"
                  >{{ inquiryDetail.currencySymbol }}{{ price }}/PCS</view
                >
                <view class="price"
                  >{{ inquiryDetail.currencySymbol
                  }}{{ inquiryDetail.totalPrice }}</view
                >
              </view>
            </template>

            <template v-if="price < 1">
              <view class="price-item">
                <view>运费</view>
                <view>咨询在线客服</view>
                <view class="price">咨询在线客服</view>
              </view>
            </template>
          </view>
        </template>
        <!-- 2023.7.19 新增空运小包情况 -->
        <template v-else>
          <view class="price-list" v-if="priceA">
            <view class="price-title">
              <view>费用项</view>
              <view>首重0.5KG</view>
              <view>续重(0.5KG)</view>
            </view>
            <template v-if="price > 0">
              <view class="price-item">
                <view>运费</view>
                <view>{{ inquiryDetail.currencySymbol }}{{ price }}</view>
                <view class="price"
                  >{{ inquiryDetail.currencySymbol
                  }}{{ inquiryDetail.continuePrice }}</view
                >
              </view>
              <view class="price-item">
                <view>总价</view>
                <view></view>
                <view
                  >{{ inquiryDetail.currencySymbol
                  }}{{ inquiryDetail.totalPrice }}</view
                >
              </view>
            </template>

            <template v-if="price < 1">
              <view class="price-item">
                <view>运费</view>
                <view>咨询在线客服</view>
                <view class="price">咨询在线客服</view>
              </view>
            </template>
          </view>
        </template>
      </view>
      <!-- 派送费 -->
      <!-- <view class="custom-card-delivery">
        <van-cell :title="$t('inquiry.destCity')" v-model="destCity" />
        <template v-if="deliveryFeeDisplay === '面谈' || deliveryFeeDisplay === 'interview'">
          <van-cell :title="$t('inquiry.deliveryFee')" :value="$t('inquiry.portInterview')" />
        </template>
        <template v-else>
          <van-cell :title="$t('inquiry.deliveryFee')" v-model="deliveryFeeDisplay" />
        </template>
      </view> -->
      <template v-if="serviceBillsDetailVos.length > 0">
        <view class="custom-card list">
          <view>
            <view class="title">如果您的货物满足以下费用请勾选</view>
            <CheckboxGroup v-model="serviceBillsDetailVosCheckState">
              <view v-for="(item, index) in serviceBillsDetailVos" :key="index">
                <view class="absence-price" v-if="item.isTotalItem === 0">
                  {{ item.costItem }}
                  <text
                    >总价{{ inquiryDetail.currencySymbol
                    }}{{ item.costPrice }}</text
                  >
                </view>
                <view v-if="item.isTotalItem === 1">
                  <Checkbox :value="item" class="check" @tap="checkServe(item)">
                    {{ item.costItem }}
                  </Checkbox>
                  <view class="total"
                    >总价{{ inquiryDetail.currencySymbol
                    }}{{ getPrice(item.costPrice * item.num) }}</view
                  >
                  <!-- 步进器 -->
                  <view v-if="item.ster">
                    <view
                      class="ster"
                      v-if="item.templateServiceKind === '按数量'"
                    >
                      <uni-number-box
                        v-model="item.num"
                        theme="round"
                        button-size="22"
                        @plus="item.num++"
                        @minus="item.num--"
                        :min="1"
                      />
                      <view
                        >单价{{ inquiryDetail.currencySymbol
                        }}{{ getPrice(item.costPrice) }}/{{ item.unit }}</view
                      >
                    </view>
                  </view>
                  <view class="memo">{{ item.memo }}</view>
                </view>
              </view>
            </CheckboxGroup>
          </view>
        </view>
      </template>
      <template v-if="feeBillsDetailVos.length > 0">
        <view class="custom-card list">
          <view class="title">如果您的货物满足以下费用请勾选</view>
          <CheckboxGroup v-model="feeBillsDetailVosCheckState">
            <view v-for="(item, index) in feeBillsDetailVos" :key="index">
              <view class="absence-price" v-if="item.isTotalItem === 0">
                {{ item.costItem }}{{ $t("inquiry.notTotalPrice") }}
                <text
                  >总价{{ inquiryDetail.currencySymbol
                  }}{{ item.costPrice }}</text
                >
              </view>
              <view v-if="item.isTotalItem === 1">
                <Checkbox :value="item" class="check" @tap="checkServe(item)">
                  {{ item.costItem }}
                </Checkbox>
                <view class="total"
                  >总价{{ inquiryDetail.currencySymbol
                  }}{{ getPrice(item.costPrice * item.num) }}</view
                >
                <!-- 步进器 -->
                <view v-if="item.ster">
                  <view
                    class="ster"
                    v-if="item.templateServiceKind === '按数量'"
                  >
                    <uni-number-box
                      v-model="item.num"
                      theme="round"
                      button-size="22"
                      @plus="item.num++"
                      @minus="item.num--"
                      :min="1"
                    />
                    <view
                      >单价{{ inquiryDetail.currencySymbol
                      }}{{ getPrice(item.costPrice) }}/{{ item.unit }}</view
                    >
                  </view>
                </view>
                <view class="memo">{{ item.memo }}</view>
              </view>
            </view>
          </CheckboxGroup>
        </view>
      </template>
      <!-- 产品介绍 -->
      <view class="custom-card foot">
        <view class="title">可运产品</view>
        <view class="hx"></view>
        <!-- 寄运规则 -->
        <view class="rule">
          <view class="bg"></view>
          <view class="tit">运输规则</view>
          <view class="matter" ref="sidebarBox">
            <view ref="p2" class="rule-text">
              <view v-html="inquiryDetail.shippingRules"></view>
            </view>
            <!-- <view class="button" id="button" @tap="getMore">
              <view type="down" size="15" :class="[state ? 'g' : 'a']"></view>
            </view> -->
          </view>
        </view>
        <!-- 注意事项 -->
        <view class="rule">
          <view class="bg"></view>
          <view class="tit">可运产品</view>
          <view class="matter" ref="matterBox">
            <view ref="p2" class="rule-text">
              <view v-html="inquiryDetail.noteDetail"></view>
            </view>
            <!-- <view class="button" @tap="getMaters">
              <view type="down" size="15" :class="[state ? 'g' : 'a']"></view>
            </view> -->
          </view>
        </view>
        <!-- 赔偿标准 -->
        <view class="rule">
          <view class="bg"></view>
          <view class="tit">可运产品</view>
          <view class="matter" ref="measureBox">
            <view ref="p2" class="rule-text">
              <view v-html="inquiryDetail.compensationStandard"></view>
            </view>
            <!-- <view class="button" @tap="getMeasure">
              <view type="down" size="15" :class="[state ? 'g' : 'a']"></view>
            </view> -->
          </view>
        </view>
      </view>
    </view>
    <!-- 底部下单 -->
    <view class="detailLast">
      <view class="detailContent">
        <view class="title">
          <view>预估费用</view>
          <view class="price">{{ getPrice(totalPrice) }}</view>
        </view>
        <view class="detail" @tap="searchPrice">
          明细
          <view type="down" size="15" :class="[detal ? 'g' : 'a']"></view>
        </view>
        <view class="placeOrderButton">
          <button type="default cust-btn" @tap="placeOrder()">立即下单</button>
        </view>
      </view>
      <view class="detailText" v-if="contentDetail">
        <view
          >运费总价：{{ inquiryDetail.currencySymbol
          }}{{ inquiryDetail.totalPrice }}</view
        >
        <view
          class="content-listem"
          v-for="(item, index) in feeBillsDetailVosCheckState.concat(
            serviceBillsDetailVosCheckState
          )"
          :key="index"
        >
          <view>附加费：{{ item.name }}{{ item.costItem }}</view>
          <view
            >{{ inquiryDetail.currencySymbol
            }}{{ getPrice(item.costPrice * item.num) }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { useI18n } from 'vue-i18n';
import { getInquiryZxDetail, postinquiryHistory } from "@/api/inquiry";
import CheckboxGroup from "../../../components/checkboxGroup/index.vue";
import Checkbox from "../../../components/checkbox/index.vue";
// const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const lang = ref("");
const price = ref(route.query.price);
const weight = ref(route.query.weight);
const srcCountry = ref(route.query.srcCountry);
const srcCountryEn = ref(route.query.srcCountryEn);
const destCountry = ref(route.query.destCountry);
const destCountryEn = ref(route.query.destCountryEn);
const squares = ref(route.query.squares);
const transCount = ref(route.query.transCount);
const destCity = ref(route.query.destCity);
const inquiryDetail = ref({});
const feeBillsDetailVos = ref([]);
const serviceBillsDetailVos = ref([]);
const priceA = ref(true);
const state = ref(false);
const detal = ref(false);

const matter = ref(false);
const measure = ref(false);
const contentDetail = ref(false);
const feeBillsDetailVosCheckState = ref([]);
const getMoreCon = ref(false);
const getmatersCon = ref(false);
const getmeasureCon = ref(false);
const queryPriceHistoryId = ref("");
const serviceBillsDetailVosCheckState = ref([]);
const searchA = reactive({
  id: route.query.channelId,
  weight: route.query.weight,
  squares: route.query.squares,
  transCount: route.query.transCount,
});
const historyParams = reactive({
  channelId: route.query.channel,
  flowId: 1,
  flowTitle: "专线流程",
  weight: route.query.weight,
  productAttr: route.query.products.split(),
  zxTransKind: route.query.transKind,
  squares: route.query.squares,
  startAddress: {
    scode: route.query.srcScode,
    title: route.query.srcCountry,
    titleEn: route.query.srcCountryEn,
  },
  endAddress: {
    scode: route.query.destScode,
    title: route.query.destCountry,
    titleEn: route.query.destCountryEn,
  },
  transUnit: route.query.transUnit,
  transCount: route.query.transCount,
  price: route.query.price,
});
const confirmPopup = ref(false);
const isBind = ref(false);

onMounted(() => {
  getInquiryZxDetailData();
  historyKeep();
  lang.value = uni.getStorageSync("lang");
  // setTimeout(() => {
  //   const sourHeight = sidebarBox.value.offsetHeight;
  //   if (uni.getSystemInfoSync().windowHeight / 2 + 100 < sourHeight) {
  //     getMoreCon.value = true;
  //     getmatersCon.value = true;
  //     getmeasureCon.value = true;
  //     getsendCon.value = true;
  //     sidebarBox.value.style.height =
  //       uni.getSystemInfoSync().windowHeight / 2 + 100 + "px";
  //     matterBox.value.style.height =
  //       uni.getSystemInfoSync().windowHeight / 2 + 100 + "px";
  //     measureBox.value.style.height =
  //       uni.getSystemInfoSync().windowHeight / 2 + 100 + "px";
  //     sendBox.value.style.height =
  //       uni.getSystemInfoSync().windowHeight / 2 + 100 + "px";
  //   }
  // }, 1);

  // uni.pageScrollTo({
  //   scrollTop: 0,
  //   duration: 0,
  // });
});

const totalPrice = computed(() => {
  if (price.value > 0) {
    // 初始值为 inquiryDetail.value.totalPrice
    const p0 = inquiryDetail.value.totalPrice * 1;

    // 计算 feeBillsDetailVosCheckState.value 的总和
    const checkStateTotal = feeBillsDetailVosCheckState.value.reduce(
      (total, item) => total + item.costPrice * item.num,
      0
    );

    // 计算 serviceBillsDetailVosCheckState.value 的总和
    const serviceBillsTotal = serviceBillsDetailVosCheckState.value.reduce(
      (total, item) => total + item.costPrice * item.num,
      0
    );

    // 返回 p0 + checkStateTotal + serviceBillsTotal
    return p0 + checkStateTotal + serviceBillsTotal;
  }

  if (price.value < 1) {
    // 计算 feeBillsDetailVosCheckState.value 的总和
    const checkStateTotal = feeBillsDetailVosCheckState.value.reduce(
      (total, item) => total + item.costPrice * item.num,
      0
    );

    // 计算 serviceBillsDetailVosCheckState.value 的总和
    const serviceBillsTotal = serviceBillsDetailVosCheckState.value.reduce(
      (total, item) => total + item.costPrice * item.num,
      0
    );

    // 返回 checkStateTotal + serviceBillsTotal
    return checkStateTotal + serviceBillsTotal;
  }

  // 默认返回 0
  return 0;
});

const getInquiryZxDetailData = () => {
  getInquiryZxDetail(searchA).then((res) => {
    uni.showLoading();
    if (res.code === 200) {
      uni.hideLoading();
      inquiryDetail.value = res.data;
      const mergeAndDeduplicate = (arr1, arr2) => {
        const map = new Map();

        // 遍历第一个数组
        arr1.forEach((item) => {
          if (!map.has(item.costItem)) {
            map.set(item.costItem, item);
          }
        });

        // 遍历第二个数组
        arr2.forEach((item) => {
          if (!map.has(item.costItem)) {
            map.set(item.costItem, item);
          }
        });

        // 返回去重后的数组
        return Array.from(map.values());
      };

      // 更新 serviceBillsDetailVos 和 feeBillsDetailVos
      serviceBillsDetailVos.value = mergeAndDeduplicate(
        serviceBillsDetailVos.value,
        res.data.serviceBillsDetailVos
      );

      feeBillsDetailVos.value = mergeAndDeduplicate(
        feeBillsDetailVos.value,
        res.data.feeBillsDetailVos
      );

      // 设置 num 和 ster 字段
      serviceBillsDetailVos.value.forEach((item) => {
        item.num = 1;
        item.ster = false;
      });

      feeBillsDetailVos.value.forEach((item) => {
        item.num = 1;
        item.ster = false;
      });
    } else {
      uni.hideLoading();
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  });
};

const getPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const historyKeep = () => {
  const params = JSON.parse(JSON.stringify(historyParams));
  postinquiryHistory(params).then((res) => {
    if (res.code === 200) {
      queryPriceHistoryId.value = res.data;
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  });
};

const getMore = () => {
  getMoreCon.value = !getMoreCon.value;
  if (getMoreCon.value) {
    sidebarBox.value.style.height = "auto";
  } else {
    sidebarBox.value.style.height = "138px";
  }
  sidebarBox.value = !sidebarBox.value;
};

const getMaters = () => {
  getmatersCon.value = !getmatersCon.value;
  if (getmatersCon.value) {
    matterBox.value.style.height = "auto";
  } else {
    matterBox.value.style.height = "138px";
  }
  matter.value = !matter.value;
};

const getMeasure = () => {
  getmeasureCon.value = !getmeasureCon.value;
  if (getmeasureCon.value) {
    measureBox.value.style.height = "auto";
  } else {
    measureBox.value.style.height = "138px";
  }
  measure.value = !measure.value;
};

const checkServe = (item) => {
  if (item.templateServiceKind !== "单次") {
    item.ster = !item.ster;
  }
};

const search = () => {
  priceA.value = !priceA.value;
  state.value = !state.value;
};

const searchPrice = () => {
  detal.value = !detal.value;
  contentDetail.value = !contentDetail.value;
};

const placeOrder = () => {
  const queryParams = {
    channelId: inquiryDetail.value.id,
    channelCode: inquiryDetail.value.channelCode,
    weight: weight.value,
    squares: squares.value,
    transUnit: historyParams.transUnit,
    products: historyParams.productAttr,
    title: inquiryDetail.value.title,
    transCount: transCount.value,
    price: price.value,
    unit: inquiryDetail.value.unit,
    queryPriceHistoryId: queryPriceHistoryId.value,
    destCity: destCity.value,
  };

  // 移除缓存数据
  uni.removeStorageSync("sendInfo");
  uni.removeStorageSync("receiveInfo");

  // 跳转到指定页面并传递参数
  uni.navigateTo({
    url: `/pages/inquiry/dedicatedLine/orders?${Object.keys(queryParams)
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&')}`
  });
};

const getTip = async () => {
  try {
    const tipParams = {
      type: "2",
    };
    const res = await Api.getCustomerTips(tipParams);
    if (res.code === 200) {
      isBind.value = res.data;
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const closePopup = () => {
  const queryParams = {
    channelId: inquiryDetail.value.id,
    channelCode: inquiryDetail.value.channelCode,
    weight: weight.value,
    squares: squares.value,
    transUnit: route.query.transUnit,
    products: route.query.products,
    title: inquiryDetail.value.title,
    transCount: transCount.value,
    price: price.value,
    unit: inquiryDetail.value.unit,
    queryPriceHistoryId: queryPriceHistoryId.value,
  };
  uni.removeStorageSync("sendInfo");
  uni.removeStorageSync("receiveInfo");
  router.push({
    path: "/order/dl/placeOrder/first",
    query: queryParams,
  });
};

const jumpUpdateInfo = () => {
  router.push({
    path: "/account/updateInfo",
  });
};

const service = () => {
  if (uni.getStorageSync("areaNumber") !== "+86") {
    router.push({
      path: "/account/whatsApp",
    });
  } else {
    router.push({
      path: "/account/wechat",
    });
  }
};
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.content {
  .a {
    //明细icon公共样式
    display: inline-block;
    width: 30rpx;
    height: 16rpx;
    background: url("../../static/common/arrows.png") no-repeat;
    background-size: contain;
    transform: rotate(-360deg);
    transition: all 0.5s;
    transition: all 0.5s;
  }

  .g {
    display: inline-block;
    width: 30rpx;
    height: 16rpx;
    background: url("../../static/common/arrows.png") no-repeat;
    background-size: contain;
    transform: rotate(-180deg);
    transition: all 0.5s;
  }

  //顶部样式
  .search {
    display: flex;
    flex-wrap: wrap;
    padding: 0rpx 0rpx 50rpx 30rpx;
    background: #df3030;
    height: 298rpx;

    .head {
      width: 670rpx;
      height: 120rpx;
      font-size: 40rpx;
      margin: 10rpx 10rpx;
      color: #ffffff;
      display: flex;
      text-align: center;

      > view {
        width: 30rpx;
        height: 160rpx;
        flex: 1;
        padding: 0rpx 40rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      > view > text {
        display: block;
        width: 200rpx;
        height: 32rpx;
        font-size: 24rpx;
        margin: 10rpx -28rpx;
        color: #bbbbbb;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      image {
        margin: 0rpx 30rpx -14rpx;
        width: 60rpx;
        height: 60rpx;
      }

      .text {
        margin-left: -30rpx;
      }
    }

    .products-attr {
      width: 690rpx;
      height: 114rpx;
      margin: 0rpx 30rpx;
      font-size: 32rpx;
      color: #ffffff;
      border-top: 1rpx solid #ebedf0;

      > view {
        margin: 30rpx 14rpx;
        float: left;
      }

      .products-content {
        width: 400rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }

      .icon-en {
        image {
          margin-top: -10rpx;
          width: 120rpx;
          height: 60rpx;
        }
      }
    }
  }

  .custom-card-delivery {
    width: 690rpx;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0rpx 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
    border-radius: 30rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
  }

  .container {
    position: relative;
    top: -40rpx;
    left: 0;
    overflow: hidden;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    background: #f9f9fa;

    .title {
      //div盒子标题公共样式
      width: 100%;
      font-size: 34rpx;
      color: black;
      margin: 30rpx;
    }

    //第一个div样式
    .listem {
      width: 690rpx;
      margin: 20rpx 30rpx 30rpx;

      .tolo {
        font-size: 34rpx;
        color: black;
        margin: 30rpx;
        margin-top: 20rpx;
        padding-top: 10rpx;
      }

      image {
        margin-left: 580rpx;
        width: 110rpx;
        height: 54rpx;
      }

      .fontSize {
        margin: 30rpx 0rpx;
        width: 690rpx;
        padding-bottom: 20rpx;
        font-size: 28rpx;
        color: #c1c0c0;
        border-top: 2rpx solid #ebedf0;

        > view {
          margin: 20rpx 50rpx;

          > text {
            font-size: 28rpx;
            color: #333333;
          }
        }

        .ion {
          //点击明细隐藏费用项样式
          width: 160rpx;
          margin: -50rpx 520rpx 30rpx;
        }

        .price {
          display: flex;

          .totalPrice {
            //单独设置预估费用样式
            font-size: 32rpx;
            width: 360rpx;
            word-wrap: break-word;
            word-break: break-all;
            color: #df3030;
            margin-top: -4rpx;
          }
        }
      }

      .price-list {
        //费用项表格样式
        font-size: 30rpx;
        margin-top: -40rpx;

        .price-title,
        .price-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 630rpx;
          border-radius: 16rpx;
          margin: 24rpx 0rpx 24rpx 30rpx;

          > view {
            flex: 1;
            text-align: center;
            margin-left: 40rpx;

            &:first-child {
              text-align: center;
              width: 100rpx;
              flex: none;
            }
          }

          .unit {
            text-align: center;
            width: 220rpx;
            flex: none;
          }
        }

        .price-title {
          background: #f5f8f9;
          height: 88rpx;
          color: #666666;
        }

        .price-item {
          position: relative;

          &::after {
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            right: 30rpx;
            bottom: 0;
            left: 30rpx;
            transform: scaleY(0.5);
          }

          .price {
            font-size: 28rpx;
          }
        }
      }
    }

    //第二个div复选框样式
    .list {
      width: 690rpx;
      margin: 20rpx 30rpx 30rpx;

      > view {
        margin-bottom: 40rpx;
        font-size: 30rpx;
      }

      .title {
        font-size: 31rpx;
      }

      .check {
        height: 96rpx;
        margin: 26rpx 40rpx 20rpx;
        font-size: 28rpx;
        padding-top: 20rpx;
        border-top: 2rpx solid #ebedf0;

        // //复选框标题宽度设置
        // /deep/.van-checkbox__label {
        //   width: 350rpx;
        //   margin-right: 10rpx;
        //   word-wrap: break-word;
        // }
      }

      .memo {
        margin: 20rpx 0rpx -20rpx 40rpx;
        font-size: 24rpx;
        color: #999999;
        width: 640rpx;
        word-wrap: break-word;
      }

      //复选框总价样式
      .total {
        font-size: 30rpx;
        margin-top: -87rpx;
        margin-left: 440rpx;
      }

      //不计入总价样式
      .absence-price {
        border-top: 2rpx solid #ebedf0;
        font-size: 30rpx;
        margin: 60rpx 50rpx;
        padding-top: 16rpx;

        > text {
          display: block;
          font-size: 30rpx;
          margin: 10rpx 4rpx;
          color: #333333;
        }
      }

      .ster {
        display: flex;
        align-items: center;
        margin: 20rpx 0rpx 0rpx 50rpx;
        font-size: 28rpx;
        .uni-numbox {
          margin-right: 190rpx;
        }

        //累加器单价样式
        // > view {
        //   font-size: 28rpx;
        //   margin-top: -40rpx;
        //   margin-left: 444rpx;
        // }
      }
    }

    //第三个div产品介绍
    .foot {
      width: 690rpx;
      height: auto;
      background: #ffffff;
      box-shadow: 0rpx 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
      border-radius: 30rpx 30rpx 30rpx 30rpx;
      opacity: 1;
      margin: 0rpx 30rpx 200rpx;

      .hx {
        width: 690rpx;
        height: 2rpx;
        background: #dee2e4;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        opacity: 1;
      }

      .title {
        font-size: 31rpx;
      }

      .tit {
        margin-left: 30rpx;
        font-size: 31rpx;
        color: black;
      }

      .rule-text {
        font-size: 31rpx;
      }

      .rule {
        margin: 30rpx 30rpx;
        padding-top: 30rpx;
        position: relative;

        .bg {
          float: left;
          width: 10rpx;
          height: 42rpx;
          background: #df3030;
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          opacity: 1;
        }

        .matter {
          width: 630rpx;
          background: #fcfcfc;
          border-radius: 14rpx 14rpx 14rpx 14rpx;
          opacity: 1;
          border: 2rpx solid #dee2e4;
          margin-top: 20rpx;
          font-size: 32rpx;
          color: #333333;
          overflow: hidden;
          word-wrap: break-word;

          > view {
            width: 582rpx;
            margin: 16rpx 12rpx 60rpx 20rpx;
            background-color: #fcfcfc;
          }

          .button {
            position: absolute;
            text-align: center;
            bottom: -56rpx;
            margin-top: 210rpx;
            width: 590rpx;
            height: 46rpx;
            margin-left: 20rpx;
            background: #ffffff;
            box-shadow: 0rpx 4rpx 10rpx 2rpx rgba(196, 196, 196, 0.34);
            border-radius: 8rpx 8rpx 8rpx 8rpx;

            // .van-icon:before {
            //   //点击明细隐藏费用项样式
            //   width: 100rpx;
            //   margin: 10rpx;
            //   color: #666666;
            // }
          }
        }
      }
    }
  }

  //底部按钮样式
  .detailLast {
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    height: 200rpx;
    background: #ffffff;
    box-shadow: 0rpx -12rpx 16rpx 4rpx rgba(230, 220, 220, 0.3);
    opacity: 1;

    .detailContent {
      display: flex;
      width: 740rpx;
      height: 140rpx;
      margin-top: 10rpx;

      .title {
        width: 140rpx;
        font-size: 30rpx;
        margin: 18rpx 56rpx;

        .price {
          font-size: 30rpx;
          color: #df3030;
          margin-top: 10rpx;
        }
      }

      .detail {
        width: 110rpx;
        font-size: 28rpx;
        margin-left: -40rpx;
        margin-top: 20rpx;
        color: #999999;
      }

      .placeOrderButton {
        margin: 14rpx 34rpx;

        > uni-button {
          position: fixed;
          width: 374rpx;
          height: 88rpx;
          line-height: 88rpx;
          text-align: center;
          background: #df3030;
          color: #ffffff;
          border-radius: 100rpx;
          border: 2rpx solid #df3030;
          font-size: 30rpx;
        }
      }
    }

    .detailText {
      width: 750rpx;
      background: #ffffff;
      font-size: 30rpx;
      position: fixed;
      bottom: 200rpx;
      border-radius: 30rpx 30rpx 0rpx 0rpx;
      color: #333333;
      padding: 50rpx;
      text-align: center;

      .content-listem {
        display: flex;
        color: #333333;

        > view {
          width: 200rpx;
          flex: 1;
          margin: 4rpx 0rpx;
        }
      }
    }
    :deep(.uni-popup__wrapper) {
      bottom: 205rpx;
    }
  }
}
</style>