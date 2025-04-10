<template>
  <view>

  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount,provide } from "vue";
import { getInquiryZxData, listReceiverCity } from "@/api/inquiry";
import { getDictTypes } from "@/api/common";
import { onLoad } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style lang="scss" scoped>

</style>