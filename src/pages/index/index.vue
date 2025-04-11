<template>
  <view class="index-page">
    <view class="bg"></view>
    <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
      activeColor="#ffff"></uni-segmented-control>
    <view class="content">
      <!-- 首页 -->
      <view v-show="current === 0">
        <home class="home-page" />
      </view>
      <!-- 待我处理 -->
      <view v-show="current === 1">
        <uni-list v-if="showFirstListPage && pendingList.length > 0">
          <listItem :orderList="pendingList" :flowCode="flowCode" :pendingState="pendingState" />
        </uni-list>
        <view class="hand-container" v-if="!showFirstListPage && orderPending.length > 0">
          <view class="list-box" v-for="(item, index) in orderPending" :key="index" @tap="showFirstList(item)">
            <view :class="`ico ico-${item.pendingState.toLowerCase()}`"></view>
            <template v-if="item.pendingState === 'REORDERED'">
              <view>有订单需要您重新下单,可能是您下单时提交的资料有误</view>
            </template>
            <template v-else-if="item.pendingState === 'SHIP'">
              <view>有订单需要您安排发货</view>
            </template>
            <template v-else-if="item.pendingState === 'UPLOAD'">
              <view>有订单，需要您箱单资料</view>
            </template>
            <template v-else-if="item.pendingState === 'CONFIRM'">
              <view>有订单我方已入库，需要您入库确认</view>
            </template>
            <template v-else-if="item.pendingState === 'CONFIRM_BILL'">
              <view>有订单，需要您确认运费帐单</view>
            </template>
            <template v-else-if="item.pendingState === 'ADD'">
              <view>有订单，需要您补充订舱资料（传线不用）</view>
            </template>
            <template v-else-if="item.pendingState === 'PAID'">
              <view>有订单，需要您支付运费帐单</view>
            </template>
            <view class="num">{{ item.orderCount }}</view>
          </view>
        </view>
        <EmptyComponent v-if="showFirstListPage && pendingList.length <= 0" />
        <EmptyComponent v-if="!showFirstListPage && orderPending.length <= 0" />
      </view>
      <!-- 后台处理中 -->
      <view v-show="current === 2">
        <view class="search-btn">
          <uni-search-bar v-model="orderCode" @confirm="completionOrderProcess" :radius="100" cancelButton="none"
            placeholder="请输入订单编码"></uni-search-bar>
          <view @tap="completionOrderProcess">查询</view>
        </view>
        <template v-if="completOrderList.length > 0">
          <uni-list>
            <listItem :orderList="completOrderList" />
          </uni-list>
        </template>
        <EmptyComponent v-else />
      </view>
      <!-- 已完成 -->
      <view v-show="current === 3">
        <view class="search-btn">
          <uni-search-bar v-model="orderCode" @confirm="completedOrderProcess" :radius="100" cancelButton="none"
            placeholder="请输入订单编码"></uni-search-bar>
          <view @tap="completedOrderProcess">查询</view>
        </view>
        <template v-if="completedOrderList.length > 0">
          <uni-list>
            <listItem :orderList="completedOrderList" />
          </uni-list>
        </template>
        <EmptyComponent v-else />
      </view>
      <!-- 问题件 -->
      <view v-show="current === 4">
        <view class="search-btn">
          <uni-search-bar v-model="orderCode" @confirm="problemOrderProcess" :radius="100" cancelButton="none"
            placeholder="请输入订单编码"></uni-search-bar>
          <view @tap="problemOrderProcess">查询</view>
        </view>
        <template v-if="problemOrderList.length > 0">
          <uni-list>
            <listItem :orderList="problemOrderList" />
          </uni-list>
        </template>
        <EmptyComponent v-else />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import home from "./home.vue";
import listItem from "./listItem.vue";
import { orderProcessing, orderPendingIndex, orderPendingList } from "@/api/common";
import EmptyComponent from "../../components/EmptyComponent/index.vue";
import { onLaunch, onShow, onLoad } from '@dcloudio/uni-app';
const current = ref(0);
const items = ref(["首页", "待我处理", "后台处理中", "已完成", "问题件"]);
const orderPending = ref([]); // 待我处理汇总
const pendingList = ref([]); //待我处理列表
const completOrderList = ref([]); // 后台处理中列表数据
const completedOrderList = ref([]); // 已完成列表数据
const problemOrderList = ref([]); //问题件列表数据
const orderCode = ref('');
const orderNum = ref('');
const pendingState = ref('');
const flowCode = ref(''); //查询条件
const showFirstListPage = ref(false); //待我处理tabs默认隐藏

const onClickItem = (e) => {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex;
  }
  if (e.currentIndex === 1) {
    //待我处理
    showFirstListPage.value = false
    flowCode.value = 'PENDING'
    orderPendingIndexData();
  } else if (e.currentIndex === 2) {
    //后台处理中
    completionOrderProcess();
  } else if (e.currentIndex === 3) {
    completedOrderProcess();
  } else if (e.currentIndex === 4) {
    problemOrderProcess();
  }
};

// 待我处理汇总
const orderPendingIndexData = () => {
  uni.showLoading();
  orderPendingIndex().then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      orderNum.value = res.data.reduce((prev, item) => { return prev + item.orderCount }, 0)//待我处理-Badge
      orderPending.value = res.data
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  })
};

// 显示待我处理列表
const showFirstList = (item) => {
  pendingState.value = item.pendingState
  flowCode.value = 'PENDING'
  orderPendingListData(item.pendingState, item.orderIds)
  showFirstListPage.value = true
};

// 待我处理列表
const orderPendingListData = (pendingState, orderIds) => {
  uni.showLoading();
  orderPendingList({
    pendingState: pendingState,
    orderIds: orderIds.toString()
  }).then(res => {
    uni.hideLoading();
    if (res.code === 200) {
      pendingList.value = res.rows
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  })
}

// 后台处理中tabs
const completionOrderProcess = () => {
  uni.showLoading();
  orderProcessing({
    flowCode: 'PROCESSING',
    orderCode: orderCode.value
  }).then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      completOrderList.value = res.rows
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  })
};

// 已完成tabs
const completedOrderProcess = () => {
  uni.showLoading();
  orderProcessing({
    flowCode: 'COMPLETED',
    orderCode: orderCode.value
  }).then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      completedOrderList.value = res.rows
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  })
};

// 问题件tabs
const problemOrderProcess = () => {
  uni.showLoading();
  orderProcessing({
    flowCode: 'PROBLEM',
    orderCode: orderCode.value
  }).then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      problemOrderList.value = res.rows
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  })
};

const searchCompletOrderList = () => {

}

onShow(() => {
  current.value = 0
  const params = uni.getStorageSync('active');
  if (params) {
    current.value = params.activeNum
    // 重新请求后台处理中的tabs数据
    completionOrderProcess();
    // 使用完后可以清除
    uni.removeStorageSync('active');
  }
})
</script>

<style lang="scss" scoped>
.index-page {
  .bg {
    background: #df3030;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20rpx;
    width: 100%;
    font-size: 36rpx;
    color: #ffffff;
  }

  :deep(.uni-list--border-bottom) {
    display: none;
  }

  .segmented-control {
    background: #df3030;
    font-size: 36rpx;
    padding-bottom: 20rpx;
    top: -40rpx;

    :deep(.segmented-control__text) {
      color: #fea6a0 !important;
    }

    :deep(.segmented-control__item--text) {
      color: #ffffff !important;
    }
  }

  .search-btn {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    width: 98%;
    margin: 0 auto;

    :deep(.uni-searchbar) {
      width: 89%;

      .uni-searchbar__box {
        background: #ffffff !important;
        border-radius: 20px;
      }
    }
  }

  .hand-container {
    margin: 40rpx 30rpx 30rpx 30rpx;

    .list-box {
      margin-bottom: 30rpx;
      padding: 24rpx 30rpx;
      box-shadow: 0px 6rpx 8rpx 2rpx rgba(232, 225, 225, 0.3);
      border-radius: 20rpx;
      background: #ffffff;
      font-size: 24rpx;
      color: #333;
      display: flex;
      align-items: center;

      .num {
        display: inline-block;
        padding: 6px 0 6px 15px;
        border-left: 1px solid #D9D9D9;
        font-size: 20px;
        color: #ee0a24;
        font-weight: bold;
        position: absolute;
        right: 80rpx;
      }

      .font {
        width: 140px;
        text-align: center;
        margin: 0 auto;
      }

      .ico {
        display: inline-block;
        margin-right: 15px;
        width: 40px;
        height: 40px;
      }

      .ico-reordered {
        background: url('../../static/order/ico-reordered.png') no-repeat;
        background-size: contain;
      }

      .ico-add {
        background: url('../../static/order/ico-add.png') no-repeat;
        background-size: contain;
      }

      .ico-confirm {
        background: url('../../static/order/ico-confirm.png') no-repeat;
        background-size: contain;
      }

      .ico-confirm_bill {
        background: url('../../static/order/ico-confirm_bill.png') no-repeat;
        background-size: contain;
      }

      .ico-paid {
        background: url('../../static/order/ico-paid.png') no-repeat;
        background-size: contain;
      }

      .ico-ship {
        background: url('../../static/order/ico-ship.png') no-repeat;
        background-size: contain;
      }

      .ico-upload {
        background: url('../../static/order/ico-upload.png') no-repeat;
        background-size: contain;
      }
    }

    .list-box view:nth-child(2) {
      width: 420rpx;
    }
  }

}
</style>