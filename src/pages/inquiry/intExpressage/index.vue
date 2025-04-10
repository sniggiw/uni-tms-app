<template>
  <view>

  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount,provide } from "vue";
import { getInquiryZxData, listReceiverCity } from "@/api/inquiry";
import { getDictTypes } from "@/api/common";
import { onLoad } from "@dcloudio/uni-app";
import EmptyComponent from "../../../components/EmptyComponent/index.vue";
import CargoInfoByDetail from "../components/cargoInfoByDetail/index.vue";
import dropdownMenu from "../../../components/dropdownMenu/index.vue";
import dropdownItem from "../../../components/dropdownMenu/item.vue";
import addressList from "../../inquiry/components/addressList/index"
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style lang="scss" scoped>

</style>