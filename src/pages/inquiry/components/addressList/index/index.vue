<template>
  <view class="addressList-page">
    <view class="top-search">
      <uni-search-bar v-model="search.addr" @confirm="inquiryAddrData" cancelButton="none" radius="50"></uni-search-bar>
      <button type="default" @tap="inquiryAddrData">搜索</button>
    </view>
    <MyIndexBar :data="addrList" @item-click="handleItemClick"></MyIndexBar>
  </view>
</template>

<script setup>
import { inquiryAddr } from "@/api/inquiry";
import { ref, onMounted, reactive, toRefs, computed } from "vue";
import MyIndexBar from '../../../components/indexBar/index.vue';
const addrList = ref([]);
const search = reactive({
  flow: "1", // 业务流程ID：1-专线流程，2-国际机场流程，3-国际港口流程，4-国际快递流程，5-国际铁路流程,可用值:AIRPORT,EXPRESS,PORT,TRAIN,ZX	query	false
  type: "1", // 类型：1-起运地，2-目的地,可用值:DEST,SRC	query	false
  addr: "", // 地址：用于查询	query	false
  kind: "", // 运送类型;整柜/散货；港口时使用
});

onMounted(() => {
  inquiryAddrData();
});
const transformedItems = computed(() => {
  return  addrList.value.map((item) => ({
    letter: item.group, // 将 group 改为 letter
    items: item.addrs, // 将 addrs 改为 item
  }));
});

function inquiryAddrData() {
  inquiryAddr(search.value).then((response) => {
    addrList.value = response.data;
  });
}

const handleItemClick = (item) =>{
  console.log('@@',item)
}


</script>

<style lang="scss" scoped>
.addressList-page{
  .top-search{
    display: flex;
    align-items: center;
    .uni-searchbar{
      width: 80%;
    }
    .uni-button:after{
      border: 0 !important;
    }
  }
}
</style>