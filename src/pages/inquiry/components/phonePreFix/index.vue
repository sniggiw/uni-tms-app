<template>
  <view class="addressList-page">
    <view class="top-search">
      <uni-search-bar v-model="search.addr" @confirm="phonePrefixData" cancelButton="none" radius="50"
        :placeholder="$t('inquiry.enterCity')"></uni-search-bar>
      <view type="text" @tap="phonePrefixData" class="search-btn">{{ $t('common.search') }}</view>
    </view>
    <MyIndexBar :data="addrList" @item-click="handleItemClick" class="my-indexBar"></MyIndexBar>
  </view>
</template>

<script setup>
import { getPhonePrefix } from "@/api/inquiry";
import { ref, onMounted, reactive, toRefs, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import MyIndexBar from "../../components/indexBar/second.vue";

const addrList = ref([]);
const search = reactive({
  lang: '',
  phonePrefix: "",
});
const page = ref('');

onMounted(() => {
  phonePrefixData();
});

onLoad((options) => {
  page.value = options.pageKind; // 获取页面参数
});

function phonePrefixData() {
  uni.showLoading({
    title: "加载中...",
    mask: true,
  });
  getPhonePrefix(search).then((response) => {
    if (response.code === 200) {
      addrList.value = response.data;
      uni.hideLoading();
    } else {
      uni.showToast({
        title: response.msg,
        icon: "none",
        mask: true,
      });
      uni.hideLoading();
    }
  });
}

const handleItemClick = (item) => {
  if (page.value === 'login') { // 登录页
    uni.setStorageSync('loginPhonePrefix', JSON.stringify(item.phonePrefix));
    uni.navigateBack({
      delta: 1 // 返回上一页
    });
    return
  } 
  if (page.value === 'zxSenderPhonePrefix') { // 专线下单页-发货人
    uni.setStorageSync('senderPhonePrefix', JSON.stringify(item.phonePrefix));
    uni.navigateBack({
      delta: 1 // 返回上一页
    });
    return
  } 
  if (page.value === 'zxReceiverPhonePrefix') { // 专线下单页-收货人
    uni.setStorageSync('receiverPhonePrefix', JSON.stringify(item.phonePrefix));
    uni.navigateBack({
      delta: 1 // 返回上一页
    });
    return
  } 
  if (page.value === 'addressList') { // 发货、收货新增地址
    uni.setStorageSync('addPhonePrefix', JSON.stringify(item.phonePrefix));
    uni.navigateBack({
      delta: 1 // 返回上一页
    });
    return
  } 
  if (page.value === 'saveAddressList') { // 发货、收货编辑地址
    uni.setStorageSync('savePhonePrefix', JSON.stringify(item.phonePrefix));
    uni.navigateBack({
      delta: 1 // 返回上一页
    });
    return
  }

};
</script>

<style lang="scss" scoped>
.addressList-page {
  background: #f9f9fa;

  .top-search {
    display: flex;
    align-items: center;
    background: #DF3030;

    .uni-searchbar {
      width: 85%;
    }

    .uni-button:after {
      border: 0 !important;
    }

    .search-btn {
      color: #fff;
    }
  }
}
</style>