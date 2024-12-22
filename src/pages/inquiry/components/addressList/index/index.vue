<template>
  <view class="addressList-page">
    <view class="top-search">
      <uni-search-bar
        v-model="search.addr"
        @confirm="inquiryAddrData"
        cancelButton="none"
        radius="50"
      ></uni-search-bar>
      <button type="default" @tap="inquiryAddrData">搜索</button>
    </view>
    <MyIndexBar :data="addrList" @item-click="handleItemClick"></MyIndexBar>
  </view>
</template>

<script setup>
import { inquiryAddr } from "@/api/inquiry";
import { ref, onMounted, reactive, toRefs, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import MyIndexBar from "../../../components/indexBar/index.vue";
const addrList = ref([]);
const search = reactive({
  flow: "", // 业务流程ID：1-专线流程，2-国际机场流程，3-国际港口流程，4-国际快递流程，5-国际铁路流程,可用值:AIRPORT,EXPRESS,PORT,TRAIN,ZX	query	false
  type: "", // 类型：1-起运地，2-目的地,可用值:DEST,SRC	query	false
  addr: "", // 地址：用于查询	query	false
  kind: "", // 运送类型;整柜/散货；港口时使用
});

onMounted(() => {
  inquiryAddrData();
});

onLoad((options) => {
  search.flow = options.flow;
  search.type = options.type;
});

// const transformedItems = computed(() => {
//   return addrList.value.map((item) => ({
//     letter: item.group, // 将 group 改为 letter
//     items: item.addrs, // 将 addrs 改为 item
//   }));
// });

function inquiryAddrData() {
  uni.showLoading({
    title: "加载中...",
    mask: true,
  });
  inquiryAddr(search).then((response) => {
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
  if (search.type === "1") {
    // 起运地
    let departure = uni.getStorageSync("departure");
    if (departure) {
      departure = JSON.parse(departure);
      let bool = false;
      departure.forEach((element) => {
        if (element.flow === search.flow && element.type === search.type) {
          element.city = item.title;
          element.cityEn = item.titleEn;
          element.scode = item.scode;
          bool = true;
        }
      });
      if (!bool) {
        // 不存在该线路数据
        departure.push({
          flow: search.flow,
          type: search.type,
          city: item.title,
          cityEn: item.titleEn,
          scode: item.scode,
        });
      }
    } else {
      departure = [];
      departure.push({
        flow: search.flow,
        type: search.type,
        city: item.title,
        cityEn: item.titleEn,
        scode: item.scode,
      });
    }
    uni.setStorageSync("departure", JSON.stringify(departure));
  } else if (search.type === "2") {
    // 目的地
    let destination = uni.getStorageSync("destination");
    if (destination) {
      destination = JSON.parse(destination);
      let bool = false;
      destination.forEach((element) => {
        if (
          element.flow === search.flow &&
          element.type === search.type
        ) {
          element.city = item.title;
          element.cityEn = item.titleEn;
          element.scode = item.scode;
          bool = true;
        }
      });
      if (!bool) {
        // 不存在该线路数据
        destination.push({
          flow: search.flow,
          type: search.type,
          city: item.title,
          cityEn: item.titleEn,
          scode: item.scode,
        });
      }
    } else {
      destination = [];
      destination.push({
        flow: search.flow,
        type: search.type,
        city: item.title,
        cityEn: item.titleEn,
        scode: item.scode,
      });
    }
    uni.setStorageSync("destination", JSON.stringify(destination));
  }
  // 返回上一页
  uni.navigateBack({
    delta: 1, // 默认值是1，表示返回的页面层数
  });
};
</script>

<style lang="scss" scoped>
.addressList-page {
  .top-search {
    display: flex;
    align-items: center;
    .uni-searchbar {
      width: 80%;
    }
    .uni-button:after {
      border: 0 !important;
    }
  }
}
</style>