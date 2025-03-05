<template>
  <view class="query-track">
    <view class="top-search">
      <uni-search-bar v-model="orderCode" cancelButton="none" radius="50"
        :placeholder="$t('orderList.orderCodePlaceholder')"></uni-search-bar>
      <view type="text" @tap="getOrderTracksData" class="search-btn">{{ $t('common.search') }}</view>
    </view>
    <view class="container" v-if="orderTracks.length > 0">
      <uni-steps :options="orderTracks" active-icon="/static/order/ico-track-checked.png" :active="active" direction="column"/>
    </view>
    <EmptyComponent v-else />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { loadLanguageAsync } from "@/i18n";
import { useRoute } from 'vue-router';
import { getOrderTracks } from "@/api/common";
import { useI18n } from 'vue-i18n';
import EmptyComponent from "../../../../components/EmptyComponent/index.vue";
const i18n = useI18n();

const orderCode = ref('');
const orderTracks = ref([]);
const route = useRoute();
const active = ref('1')

onMounted(() => {
  getOrderTracksData();
  const lang = route.query.lang;
  if (!lang) {
    const languag = uni.getStorageSync('queryTrackLang');
    if (languag) {
      i18n.locale.value = languag;
    }
  } else {
    i18n.locale.value === 'zh' ? 'zh_CN' : 'en_US'
  }
});

const getOrderTracksData = async () => {
  try {
    uni.showLoading();
    const res = await getOrderTracks({ orderCode: orderCode.value });
    uni.hideLoading();
    if (res.code === 200) {
      orderTracks.value = res.data.reverse().map(item => {
        return {
          title: item.orderDesc,  // 将 orderDesc 改为 title
          desc: item.createdTime  // 将 createdTime 改为 desc
        };
      });
    } else {
      uni.showToast({
        title: res.msg,
        duration: 2000,
        icon:"none"
      });
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.query-track {
  padding-top: 10px;
  background: #f9f9fa;

  .top-search {
    display: flex;
    align-items: center;

    :deep(.uni-searchbar) {
      width: 85%;

      .uni-searchbar__box {
        background-color: #ffffff !important;
      }
    }

    .uni-button:after {
      border: 0 !important;
    }

    .search-btn {
      color: #323233;
    }
  }

  .container {
    margin: 30rpx 30rpx 30rpx;
    :deep(.uni-steps__column-check){
      background-image: url('../../../../static/order/ico-track-checked.png') no-repeat;
      background-size: contain;
      width: 46rpx;
      height: 46rpx;
    }
  }
}
</style>