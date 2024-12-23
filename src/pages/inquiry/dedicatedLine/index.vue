<template>
  <!-- 专线询价列表 -->
  <view class="content" id="app">
    <!-- 顶部 -->
    <view class="search">
      <view class="city-info">
        <!-- 起运地下拉 -->
        <!-- <van-dropdown-menu duration="0.5" active-color="#DF3030">
          <van-dropdown-item v-model="searchParams.srcTitle" ref="srcTitle" :disabled="closeAddressList">
            <template #title>
              <view class="src-country">
                <view>
                  <i class="ico-select"></i>
                  {{ searchParams.srcTitle }}
                </view>
                <view class="desc">
                  {{ searchParams.srcTitleEn }}
                </view>
              </view>
            </template>
            <view class="popupTxet">
              <addressList @checkCityCallback="checkCityCallback" :isDialog="true" flow="1" type="1">
              </addressList>
            </view>
          </van-dropdown-item>
        </van-dropdown-menu> -->
        <!-- <view class="city-info-center">
          <image src="@/assets/images/icon-right.png" alt />
        </view> -->
        <!-- 目的地下拉 -->
        <!-- <van-dropdown-menu duration="0.5" active-color="#DF3030">
          <van-dropdown-item v-model="searchParams.descTitle" ref="descTitle" :title="searchParams.descTitle" :disabled="closeAddressList">
            <template #title>
              <view class="dest-country">
                <view>
                  <i class="ico-select"></i>
                  {{ searchParams.descTitle }}
                </view>
                <view class="desc">
                  {{ searchParams.descTitleEn }}
                </view>
              </view>
            </template>
            <view class="popupTxet">
              <addressList @checkCityCallback="checkCityCallback" :isDialog="true" flow="1" type="2">
              </addressList>
            </view>
          </van-dropdown-item>
        </van-dropdown-menu> -->
      </view>
      <view class="productsAttr">{{ searchParams.weight }}kg | {{ searchParams.squares }}CBM |
        {{ searchParams.transCount }}{{ searchParams.transUnit }}</view>
      <!-- <van-dropdown-menu duration="0.5" :close-on-click-outside="false" :z-index="5500">
        <van-dropdown-item ref="cargoInfo" class="dropdown-cargoInfoBy" @open="handleDropdownOpen" @close="handleDropdownClose">
          <template #title>
            <i class="ico-arrow-up"></i>
          </template>
          <view class="popupTxet">
            <CargoInfoByDetail :searchData="searchParams" @closeFloor="closeFloor"
              @cargoInfoCallback="cargoInfoCallback" :Kind="searchParams.transKind" :receiverCityData="receiverCity"></CargoInfoByDetail>
          </view>
        </van-dropdown-item>
      </van-dropdown-menu> -->
    </view>
    <view class="container">
      <!-- 价格筛选 -->
      <view class="choice">
        <!-- <van-dropdown-menu>
          <van-dropdown-item :title="$t('inquiry.sort')" v-model="searchParams.sort" :options="sort"
            @change="getInquiryZx" />
          
          <van-dropdown-item :title="$t('inquiry.zxtransKind')" ref="item" class="right" v-model="searchParams.transKind" :options="transKind"
            @change="getInquiryZx">
          </van-dropdown-item>
        </van-dropdown-menu> -->
      </view>
      <!-- 内容div -->
      <template v-if="inquiryList.length > 0">
        <view class="center" v-for="(item, index) in inquiryList" :key="index">
          <view class="title">
            <template v-if="lang === 'zh_CN'">
              <van-image class="imgage" :src="require('@/assets/images/ico-nothan.png')" fit="contain" v-if="item.taxIncluded == true" />
              <van-image class="imgage" :src="require('@/assets/images/ico-nohan.png')" fit="contain" v-if="item.taxIncluded == false" />
            </template>
            <template v-if="lang === 'en_US'">
              <van-image class="dutyImgage-En" :src="require('@/assets/images/ico-en-nothan.png')" fit="contain" v-if="item.taxIncluded == true" />
              <van-image class="imgage-En" :src="require('@/assets/images/ico-en-nohan.png')" fit="contain" v-if="item.taxIncluded == false" />
            </template>
            <view class="tit" @click="placeOrder(item.id, item.price, item.channelCode, item.transKind, item.channelId, item.deliveryFeeDisplay, item.destCity)">{{ item.title }}</view>
          </view>
          <view class="parameter" @click="placeOrder(item.id, item.price, item.channelCode, item.transKind, item.channelId, item.deliveryFeeDisplay, item.destCity)">
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
                <template v-if="item.deliveryFeeDisplay == '面谈' || item.deliveryFeeDisplay == 'interview'">
                  <text>{{ $t('inquiry.portInterview') }}</text>
                </template>
                <template v-else>
                  <text>{{ item.deliveryFeeDisplay }}</text>
                </template>
              </view>
            </view>
            <view class="right">
              <template v-if="item.price > 0">
                <view class="top" v-if="item.pricingType == '按重量'">{{ item.currencySymbol }}{{ item.price }}/KG</view>
                <view class="top" v-if="item.pricingType == '按体积'">{{ item.currencySymbol }}{{ item.price }}/CBM</view>
                <view class="top" v-if="item.pricingType == '按数量'">{{ item.currencySymbol }}{{ item.price }}/PCS</view>
                <view class="continue-price" v-if="item.pricingType == '按首续重'">
                  <view>{{ $t('inquiry.continuePrice') }}</view>
                  {{ item.currencySymbol }}{{ item.continuePrice }}/0.5KG {{ item.currencySymbol }}{{ item.price }}/0.5KG
                </view>
                <van-button class="jumpDetail">点击查价</van-button>
              </template>
              <template v-if="item.price < 1">
                <van-button class="jumpDetail" @click.stop="service()"> 联系客服 </van-button>
              </template>
            </view>
          </view>
          <view class="divider"></view>
          <view class="matter" ref="sidebarBox" @click="placeOrder(item.id, item.price, item.channelCode, item.transKind, item.channelId, item.deliveryFeeDisplay, item.destCity)">
            <!-- <view ref="p1">
              <view v-html="item.note"></view>
            </view> -->
          </view>
        </view>
      </template>
      <!-- <van-empty :description="$t('common.notData')" v-else>
        <template #image>
          <image src="@/assets/images/ico-notData.png" alt="">
        </template>
      </van-empty> -->
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { getInquiryZxData } from "@/api/inquiry";
// import addressList from "@/views/components/addressList/index.vue"; // 起运地目的地列表
// import CargoInfoByDetail from "@/views/inquiry/components/cargoInfoByDetail/index.vue";

// 定义 props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  searchData: {
    type: Object,
    default: () => ({})
  }
});

// 定义响应式变量
const lang = ref(''); // 登录时选择的语言
const sort = ref([]); // 排序
const transKind = ref([]); // 运输方式筛选数据来源
const inquiryList = ref([]); // 请求专线列表
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
  sort: '1', // 默认不传，价格传1，时效传2
  destCity: props.searchData.destCity, // 目的地城市
  maxHeight: props.searchData.maxHeight, // 最大高度
  maxLong: props.searchData.maxLong, // 最大长度
  maxWidth: props.searchData.maxWidth, // 最大宽度
});
const closeAddressList = ref(false);
const receiverCity = ref([]);
const homeTop = ref(0);

// 生命周期钩子
onMounted(() => {
  lang.value = localStorage.getItem('lang');
  getInquiryZx();
  // listReceiverCityData();
});

onBeforeUnmount(() => {
  const app = document.getElementById('app');
  homeTop.value = app.scrollTop || 0;
});

// 方法定义
const getInquiryZx = () => {
  let params = JSON.parse(JSON.stringify(searchParams));
  if (params.products && params.products.length > 0) {
    params.products = params.products.toString();
  }
  inquiryList.value = [];
  getInquiryZxData(params).then(res => {
    if (res.code === 200) {
      const resData = res.rows;
      inquiryList.value = [...inquiryList.value, ...resData];
      if (inquiryList.value.length >= res.total) {
        // 所有数据加载完成
      }
    } else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      });
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
};

const handleDropdownOpen = () => {
  document.getElementById('app').style.overflow = 'hidden';
  closeAddressList.value = true;
};

const handleDropdownClose = () => {
  document.getElementById('app').style.overflow = 'auto';
  closeAddressList.value = false;
};

const placeOrder = (id, price, channelCode, transKind, channelId, deliveryFeeDisplay, destCity) => {
  uni.navigateTo({
    url: `/pages/inquiry/channelDetail?channelId=${id}&price=${price}&channelCode=${channelCode}&transKind=${transKind}&channel=${channelId}&title=${props.searchData.title}&weight=${searchParams.weight}&srcCountry=${searchParams.srcTitle}&srcScode=${searchParams.srcScode}&srcCountryEn=${searchParams.srcTitleEn}&squares=${searchParams.squares}&products=${searchParams.products}&destCountry=${searchParams.descTitle}&destCountryEn=${searchParams.descTitleEn}&destScode=${searchParams.descScode}&transCount=${searchParams.transCount}&transUnit=${searchParams.transUnit}&destCity=${destCity}&deliveryFeeDisplay=${deliveryFeeDisplay}`
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
    searchParams.destCity = '';
    // listReceiverCityData();
  }
  getInquiryZx();
};

// const listReceiverCityData = () => {
//   let params = {
//     descTitle: searchParams.descTitle,
//     descScode: searchParams.descScode,
//     descTitleEn: searchParams.descTitleEn
//   };
//   listReceiverCity(params).then(res => {
//     if (res.code === 200) {
//       receiverCity.value = res.rows;
//     } else {
//       uni.showToast({
//         title: res.msg,
//         icon: 'none',
//         duration: 2000
//       });
//     }
//   });
// };

const service = () => {
  if (uni.getStorageSync('areaNumber') != '+86') {
    uni.navigateTo({
      url: "/pages/account/whatsApp"
    });
  } else {
    uni.navigateTo({
      url: "/pages/account/wechat"
    });
  }
};
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.content {
  
  .search {
    padding: 30rpx 20rpx 40rpx;
    background: #df3030;
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
        img {
          display: block;
          width: 34rpx;
          height: 34rpx;
          pointer-events:none;
        }
      }
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
    // .productsAttr {
    //   min-height: 40rpx;
    //   color: #ffffff;
    //   font-size: 30rpx;
    //   margin: 16rpx auto;
    //   text-align: center;
    // }
  }

  .container {
    position: relative;
    top: -40rpx;
    left: 0;
    overflow: hidden;
    border-radius: 40rpx 40rpx 0px 0px;
    background: #f9f9fa;

    //价格  运输方式筛选样式
    .choice {
      width: 750rpx;
      height: 40rpx;
      background: #f9f9fa;
      display: flex;
      justify-content: flex-end;
      font-size: 28rpx;
      margin: 22rpx 0px;

      // /deep/.van-dropdown-menu__bar {
      //   height: 60rpx;
      //   width: 750rpx;
      //   margin: -16rpx 0px;
      //   background: #f9f9fa;

      //   > div {
      //     background: #f9f9fa;
      //     width: 40rpx;
      //     flex: 1;
      //   }
      // }
      // /deep/ .van-dropdown-menu__title::after {
      //   position: absolute;
      //   top: 50%;
      //   right: -0.10667rem;
      //   margin-top: -0.13333rem;
      //   border: 0.08rem solid;
      //   border-color: transparent transparent #000000 #000000;
      //   -webkit-transform: rotate(-45deg);
      //   transform: rotate(-45deg);
      //   opacity: .8;
      //   content: "";
      // }
      // /deep/.van-dropdown-menu__title--down:after {
      //   margin-top: -0.02667rem;
      //   -webkit-transform: rotate(135deg);
      //   transform: rotate(135deg);
      //   border-color: transparent transparent #ef1a1a #e12121;
      // }
    }

    .center {
      width: 690rpx;
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 12rpx 20rpx #e8e1e157;
      border-radius: 30rpx;
      margin: 30rpx 30rpx 40rpx 30rpx;
      position: relative;
      .title{
      .imgage {
        width: 114rpx;
        height: 54rpx;
        position: absolute;
        right: -2rpx;
        top: 0;
        pointer-events:none;
      }
      //英文版含税图片
      .dutyImgage-En{
        position: absolute;
        right: -4rpx;
        top: 0;
        width: 210rpx;
        height: 58rpx;
        pointer-events:none;
      }
       //英文版不含税图片
      .imgage-En{
        position: absolute;
        right: 0px;
        top: 0;
        width: 130rpx;
        height: 54rpx;
        pointer-events:none;
      }
      .tit {
        font-size: 34rpx;
        color: #F86E21;
        margin: 10rpx 0px 0px 38rpx;
        padding-top: 70rpx;
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
        position: relative;
        .leftBox {
          margin: 2rpx 40rpx;
          width: 400rpx;
          height: auto;
          font-size: 28rpx;
          color: #999999;

          > div > span {
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
          // margin: -37px 210px;
          // margin: 0px 0px 5px -10px;
          width: 194rpx;
          position: absolute;
          bottom: 0px;
          right: 44rpx;
          font-size: 40rpx;
          
          .top {
            margin-left: 16rpx;
            margin-bottom: 10rpx;
            font-size: 28rpx;
            color: #DD312F;
          }
          .continue-price{
            margin-left: 16rpx;
            margin-bottom: 10rpx;
            font-size: 28rpx;
            color: #DD312F;
            word-break: break-all; 
            word-wrap: break-word;
          }
          .bottom{
            width: 240rpx;
            height: 20rpx;
          }
          .interview{
            width: 180rpx;
            height: 100rpx;
            font-size: 30rpx;
            text-align: center;
            background: #DF3030;
            color: #ffffff;
            border-radius: 30rpx;
            border: 1px solid #DF3030;
            >div{
              width: 140rpx;
              margin-left: 20rpx;
              margin-top: 6rpx;
            }
          }
          .jumpDetail{
            border-radius: 200rpx;
            background: #F54543;
            color: #FFFFFF;
            height: 70rpx;
            width: 220rpx;
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
        position: relative;
        height: auto;
        width: 630rpx;
        margin: -20rpx 30rpx;
        word-wrap: break-word;
        font-size: 24rpx;
        color: #F86E21;
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