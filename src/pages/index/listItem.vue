<template>
  <view class="list-item-page">
    <view class="custom-card list-item" v-for="item in orderList" :key="item.orderCode">
      <view class="item-top">
        <view class="order-code">
          {{ item.orderCode }}
          <i class="ico-copy" @tap.stop="copyCode(item.orderCode)"></i>
        </view>

        <view class="order-status">{{ item.showStepTitle }}</view>
      </view>
      <view class="item-center" @tap="toDetail(item)">
        <view class="left">{{ item.orderBeginAddr }}</view>
        <view class="center">
          <view class="ico-line ico-line-left"></view>
          <template v-if="item.flowTemplateId === 2">
            <!-- 飞机 -->
            <view class="transport-type ico-air"></view>
          </template>
          <template v-else-if="item.flowTemplateId === 4">
            <!-- 快递、陆运 -->
            <view class="transport-type ico-car"></view>
          </template>
          <template v-else-if="item.flowTemplateId === 5">
            <!-- 铁路 -->
            <view class="transport-type ico-railway"></view>
          </template>
          <template v-else-if="item.flowTemplateId === 3">
            <!-- 海运 -->
            <view class="transport-type ico-sea"></view>
          </template>
          <template v-else>
            <!-- 默认物流 -->
            <view class="transport-type ico-logistics-default"></view>
          </template>
          <view class="ico-line ico-line-right"></view>
        </view>
        <view class="right">{{ item.orderEndAddr }}</view>
      </view>
      <view class="item-bottom" v-if="item.totalPrice || item.createdTime">
        <view class="time" v-if="item.createdTime">
          <view>{{ item.createdTime.split(' ')[0] }}</view>
          <view>日期</view>
        </view>
      </view>
      <view class="item-division">
        <view class="round left-round"></view>
        <view class="line"></view>
        <view class="round right-round"></view>
      </view>
      <template v-if="flowCode === 'PENDING'">
        <view class="opinion-container" v-if="item.stepDesc">
          <view class="opinion">修改意见：{{ item.stepDesc }}</view>
        </view>
      </template>
      <template v-if="flowCode === 'PROBLEM'">
        <view class="opinion-container" v-if="item.eventTitle || item.result">
          <view class="opinion">问题说明：{{ item.eventTitle }}</view>
          <view class="opinion">处理情况：{{ item.result }}</view>
        </view>
      </template>
      <view class="btn">
        <template
          v-if="[1, 2, 3, 4, 5].includes(item.flowTemplateId) && item.flowOrder === 1 && flowCode !== 'PROBLEM'">
          <button @tap.stop="service">我要催单</button>
          <button @tap.stop="service">取消订单</button>
        </template>

        <template v-if="item.flowTemplateId == 1">
          <button type="default" @tap.stop="checkedQRCode(item)">发货面单下载</button>
          <button @tap="jumpAddress(item)">电商收货地址</button>
        </template>

        <!-- 箱单上传 -->
        <template
          v-if="pendingState === 'UPLOAD' || ((pendingState === 'CONFIRM' || pendingState === 'REORDERED' || pendingState === 'SHIP' || item.flowOrder === 1 || item.flowOrder === 2 || item.flowOrder === 3) && item.flowTemplateId === 1)">
          <button type="default" @tap.stop="goJump(item, 'UPLOAD')">箱单上传</button>
        </template>
        <template v-if="pendingState === 'REORDERED'">
          <button type="default" @tap.stop="goJump(item, pendingState)">修改订单</button>
        </template>
        <template v-else-if="pendingState === 'SHIP'">
          <button type="default" @tap.stop="goJump(item, pendingState)">安排发货</button>
        </template>
        <template v-else-if="pendingState === 'CONFIRM'">
          <button type="default" @tap.stop="goJump(item, pendingState)">入库确认</button>
        </template>
        <template v-else-if="pendingState === 'CONFIRM_BILL'">
          <button type="default" @tap.stop="goJump(item, pendingState)">帐单确认</button>
        </template>
        <template v-else-if="pendingState === 'ADD'">
          <button type="default" @tap.stop="goJump(item, pendingState)">补充订舱资料</button>
        </template>
        <template v-else-if="pendingState === 'PAID'">
          <button type="default" @tap.stop="goJump(item, pendingState)">支付</button>
        </template>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// import { useStore } from 'vuex';
import { onLaunch } from '@dcloudio/uni-app';

// const store = useStore();
const emit = defineEmits(['checkedQRCode']);

const props = defineProps({
  orderList: Array,
  pendingState: String,
  flowCode: String
});

const property = ref('value');

const goJump = (item, pendingState) => {
  if (item.flowTemplateId === 1) {
    // 专线流程
    if (pendingState === 'REORDERED') {
      // store.commit('updateDestroyKeepAlive', Math.random());
      uni.navigateTo({
        url: `/order/dl/placeOrder/first?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'SHIP') {
      uni.navigateTo({
        url: `/order/dl/deliverGoods?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'UPLOAD') {
      uni.navigateTo({
        url: `/order/dl/packingList?id=${item.id}&pendingState=${props.pendingState}&orderCode=${item.orderCode}`
      });
    } else if (pendingState === 'CONFIRM') {
      uni.navigateTo({
        url: `/order/dl/receiptConfirm?id=${item.id}&pendingState=${props.pendingState}&orderCode=${item.orderCode}`
      });
    } else if (pendingState === 'CONFIRM_BILL') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}&orderCode=${item.orderCode}`
      });
    } else if (pendingState === 'PAID') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}`
      });
    }
  } else if (item.flowTemplateId === 2) {
    // 国际机场流程
    if (pendingState === 'REORDERED') {
      uni.navigateTo({
        url: `/inquiry/airportOrders?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'SHIP') {
      uni.navigateTo({
        url: `/order/airport/deliverGoods?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'CONFIRM') {
      uni.navigateTo({
        url: `/order/airport/warehouseConfirm?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'PAID') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}`
      });
    }
  } else if (item.flowTemplateId === 3) {
    // 港口流程
    if (pendingState === 'REORDERED') {
      uni.navigateTo({
        url: `/inquiry/portOrders?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'PAID') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}`
      });
    }
  } else if (item.flowTemplateId === 4) {
    // 国际快递流程
    if (pendingState === 'REORDERED') {
      uni.navigateTo({
        url: `/inquiry/expressOrders?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'SHIP') {
      uni.navigateTo({
        url: `/order/intExpressage/deliverGoods?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'CONFIRM') {
      uni.navigateTo({
        url: `/order/intExpressage/warehouseConfirm?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'PAID') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}`
      });
    }
  } else if (item.flowTemplateId === 5) {
    // 国际铁路流程
    if (pendingState === 'REORDERED') {
      uni.navigateTo({
        url: `/inquiry/railOrders?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'SHIP') {
      uni.navigateTo({
        url: `/order/intRailway/deliverGoods?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'CONFIRM') {
      uni.navigateTo({
        url: `/order/intRailway/warehouseConfirm?id=${item.id}&pendingState=${props.pendingState}`
      });
    } else if (pendingState === 'PAID') {
      uni.navigateTo({
        url: `/order/billConfirm?id=${item.id}&pendingState=${props.pendingState}&flowTemplateId=${item.flowTemplateId}`
      });
    }
  }
};

const service = () => {
  const areaNumber = uni.getStorageSync('areaNumber');
  if (areaNumber !== '+86') {
    uni.navigateTo({ url: "/account/whatsApp" });
  } else {
    uni.navigateTo({ url: "/account/wechat" });
  }
};

const jumpAddress = (item) => {
  uni.navigateTo({
    url: `/account/warehouseAddress?orderCode=${item.orderCode}`
  });
};

const toDetail = (item) => {
  const basePath = {
    1: '/order/dl/orderDetail',
    2: '/order/airport/orderDetail',
    3: '/order/port/orderDetail',
    4: '/order/intExpressage/orderDetail',
    5: '/order/intRailway/orderDetail'
  }[item.flowTemplateId];

  const queryParams = {
    1: `id=${item.id}&flowOrder=${item.flowOrder}&flowTemplateId=${item.flowTemplateId}&orderCode=${item.orderCode}`,
    2: `id=${item.id}&flowOrder=${item.flowOrder}`,
    3: `id=${item.id}&flowOrder=${item.flowOrder}`,
    4: `id=${item.id}&flowOrder=${item.flowOrder}`,
    5: `id=${item.id}&flowOrder=${item.flowOrder}`
  }[item.flowTemplateId];

  uni.navigateTo({
    url: `${basePath}?${queryParams}`
  });
};

const checkedQRCode = (item) => {
  emit('checkedQRCode', item);
};

const copyCode = async (code) => {
  try {
    await uni.setClipboardData({ data: code })
    uni.showToast({ title: t('overseasTaobao.copySuccess'), duration: 2000 })
  } catch (e) {
    uni.showToast({ title: t('overseasTaobao.copyError'), duration: 2000 })
  }
}
</script>

<style lang="scss" scoped>
.list-item-page {
  background: #f9f9fa;
  .list-item {
    background: #fff;
    margin: 30rpx;

    // padding: 10px 10px 5px 10px;
    .item-top {
      display: flex;
      align-items: center;
      padding: 20rpx 30rpx;
      color: #666;
      font-size: 28rpx;
      border-bottom: 2rpx solid #E0E0E3;

      .order-code {
        color: #666666;
        flex: 1;
      }

      .order-status {
        min-width: 140rpx;
        text-align: center;
        padding: 8rpx 20rpx;
        background: rgba(255, 144, 86, 0.06);
        border-radius: 30rpx;
        border: 2rpx solid #FF9056;
        font-size: 26rpx;
        color: #FF9056;
        line-height: 1;
      }

      .ico-copy {
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        background: url("../../static/common/copy.png") no-repeat;
        background-size: contain;
      }
    }

    .item-center {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 132rpx;
      padding: 20rpx 30rpx;
      text-align: center;
      font-weight: bold;
      font-size: 36rpx;

      .left,
      .right {
        flex: 1;
      }

      .left {
        text-align: left;
        width: 250rpx;
        word-wrap: break-word;
      }

      .right {
        text-align: right;
        width: 240rpx;
        word-wrap: break-word;
      }

      .center {
        display: flex;
        align-items: center;

        .ico-line {
          width: 54rpx;
          height: 6rpx;
        }

        .ico-line-left {
          background: url('../../static/order/ico-line-left.png') no-repeat;
          background-size: contain;
        }

        .ico-line-right {
          background: url('../../static/order/ico-line-right.png') no-repeat;
          background-size: contain;
        }

        .transport-type {
          margin: 0 14rpx;
        }

        .ico-air {
          width: 54rpx;
          height: 40rpx;
          background: url('../../static/order/ico-air.png') no-repeat;
          background-size: contain;
        }

        .ico-car {
          width: 58rpx;
          height: 36rpx;
          background: url('../../static/order/ico-car.png') no-repeat;
          background-size: contain;
        }

        .ico-railway {
          width: 46rpx;
          height: 46rpx;
          background: url('../../static/common/ico-railway.png') no-repeat;
          background-size: contain;
        }

        .ico-sea {
          width: 56rpx;
          height: 40rpx;
          background: url('../../static/order/ico-sea.png') no-repeat;
          background-size: contain;
        }

        .ico-logistics-default {
          width: 46rpx;
          height: 46rpx;
          background: url('../../static/order/ico-logistics-default.png') no-repeat;
          background-size: contain;
        }
      }
    }

    .item-division {
      position: relative;
      padding: 20rpx 0;
      height: 2rpx;
      width: 100%;

      .round {
        width: 40rpx;
        height: 40rpx;
        background: #F9F9FA;
        border-radius: 40rpx;
      }

      .left-round {
        position: absolute;
        left: -20rpx;
        top: 0;
      }

      .right-round {
        position: absolute;
        right: -20rpx;
        top: 0;
      }

      .line {
        margin: 0 26rpx;
        border-bottom: 2rpx dashed #B3B5BA;
      }
    }

    .item-bottom {
      margin: 0 30rpx 0;
      padding: 10rpx 0 14rpx;
      display: flex;
      font-size: 30rpx;
      font-weight: bold;

      // border-bottom: 1px solid #E0E0E3;
      .price,
      .time {
        flex: 1;

        div {
          &:last-child {
            margin-top: 10rpx;
            font-size: 26rpx;
            color: #999999;
          }
        }
      }
    }

    .opinion-container {
      margin: 0 30rpx 20rpx;
      padding-top: 10rpx;
      border-bottom: 2rpx solid #E0E0E3;

      .opinion {
        padding-bottom: 30rpx;
        color: #666666;
        font-size: 26rpx;
      }
    }

    .btn {
      text-align: right;

      :deep(>uni-button) {
        display: inline-block;
        margin-left: 20rpx;
        margin-right: 10rpx;
        float: right;
        font-size: 28rpx;
        color: #ffffff;
        height: 70rpx;
        line-height: 70rpx;
        padding: 0 35rpx;
        background: #DF3030;
        border-radius: 40rpx;
        margin-bottom: 20rpx;
      }

      .serach {
        margin-top: -2rpx;
      }
    }
  }
}
</style>
