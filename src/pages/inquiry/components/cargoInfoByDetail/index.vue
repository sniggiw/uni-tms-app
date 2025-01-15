<template>
  <view class="cargo-info-by-detail">
    <uni-forms @submit="onSubmit" :model="form" ref="formRef">
      <view class="top">
        <uni-forms-item
          label="重量(KG)"
          required
          :name="['weight']"
          :rules="[{ required: true, errorMessage: '请填写重量' }]"
        >
          <uni-easyinput
            type="number"
            v-model="form.weight"
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item label="方数" required>
          <uni-easyinput
            type="number"
            v-model="form.squares"
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item label="件数" required>
          <uni-easyinput
            type="number"
            v-model="form.transCount"
            :inputBorder="false"
          />
          <uni-data-select
            v-model="form.transUnit"
            :localdata="transUnit"
            :clear="false"
          />
        </uni-forms-item>
      </view>
      <view class="top" v-if="flow == 1">
        <uni-forms-item label="派送城市">
          <uni-data-select
            v-model="form.destCity"
            class="destCity-select"
            :localdata="receiverCityData"
          />
        </uni-forms-item>
        <uni-forms-item label="最大长度">
          <uni-easyinput type="number" v-model="form.maxLong" :border="false" />
        </uni-forms-item>
        <uni-forms-item label="最大宽度">
          <uni-easyinput type="number" v-model="form.maxWidth" />
        </uni-forms-item>
        <uni-forms-item label="最大高度">
          <uni-easyinput type="number" v-model="form.maxHeight" />
        </uni-forms-item>
      </view>
      <!-- 货物品名选择 -->
      <view class="choiceProduct">
        <view class="cargo-type">
          <view class="cargo-type-value">
            <view
              class="value-item"
              :class="{ active: getProductsActive(item.value) }"
              v-for="(item, index) in products"
              :key="index"
              @tap="checkProducts(item.value)"
            >
              {{ item.name }}
            </view>

            <!-- <template v-if="lang === 'en_US'">
              <view
                class="value-en"
                :class="{ active: getProductsActive(item.value) }"
                v-for="(item, index) in products"
                :key="index"
                @click="checkProducts(item.value)"
              >
                {{ item.name }}
              </view>
            </template> -->
          </view>
        </view>
        <view class="footer-btn">
          <button class="close" @click="close">关闭</button>
          <button class="confirm" @click="onSubmit">获取价格</button>
        </view>
      </view>
    </uni-forms>
  </view>
</template>
<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getDictTypes } from "@/api/common";
// import SelectComponent from '@/components/selectComponent.vue';
// import Api from '@/api/index.js';

const props = defineProps({
  searchData: {
    type: Object,
    default: () => ({}),
  },
  Kind: {
    type: [String, Number],
    default: "0",
  },
  receiverCityData: {
    type: Array,
    default: () => [],
  },
});

const lang = ref(uni.getStorageSync("lang"));
const showTransUnit = ref(false);
const transUnit = ref([]);
const products = ref([]);
const flow = ref("");
const transKind = ref(uni.getStorageSync("transKind"));
const form = reactive({
  weight: "",
  transCount: "",
  transUnit: "",
  squares: "",
  maxHeight: "",
  maxLong: "",
  maxWidth: "",
  destCity: "",
  products: [],
});
const formRef = ref(null);
const getProductsActive = computed(() => (value) => {
  return form.products.includes(value);
});

watch(
  props.searchData,
  (newVal, oldVal) => {
    Object.assign(form, newVal);
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);

// onLoad(() => {
//   getDictTypesData();
// });

onMounted(() => {
  getDictTypesData();
});

onLoad((options) => {
  flow.value = options.flow;
});

const getDictTypesData = () => {
  getDictTypes({
    dicTitles: "询价货物属性,专线设置.件数单位",
  }).then((response) => {
    products.value = response.data["询价货物属性"];
    transUnit.value = response.data["专线设置.件数单位"].map((item) => ({
      ...item,
      text: item.name,
    }));

    // language.value = [
    //   { name: "简体中文", value: "zh" },
    //   { name: "English", value: "en" },
    //   { name: "Español", value: "es" },
    //   { name: "اللغة العربية", value: "ar" },
    // ];
    // if (id.value) {
    //   orderInfoZx();
    // } else {
    //   getCityData({ lang: form.receiveInfo.receiverLang });
    // }
    // if (receiverCityParams.channelCode) {
    //   receiverCity();
    // }
  });
};
// 定义 emit
const emit = defineEmits(["closeFloor", "cargoInfoCallback"]);

const selectTransUnit = (item) => {
  form.transUnit = item.name;
  showTransUnit.value = false;
};

const checkProducts = (value) => {
  const index = form.products.indexOf(value);
  if (index > -1) {
    form.products.splice(index, 1);
  } else {
    form.products.push(value);
  }
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then((res) => {
      if (form.products.length > 0) {
        emit("cargoInfoCallback", form);
      } else {
        uni.showToast({
          title: "请选择货物品名",
          duration: 2000,
          icon:'none'
        });
      }
    })
    .catch((err) => {
      uni.showToast({
        title: "请填写完必填选项",
        duration: 2000,
        icon:'none'
      });
    });
};

const close = () => {
  emit("closeFloor");
};
</script>

<style lang="scss" scoped>
.cargo-info-by-detail {
  background: #f9f9f9;
  padding-top: 10rpx;
  :deep(.uni-forms-item__content) {
    display: flex;
    text-align: right;
    .uni-easyinput__content {
      text-align: right;
      border: 0;
    }
    .uni-select {
      border: none !important;
    }
    .uni-date-editor--x {
      border: none !important;
    }
    .uni-switch-wrapper {
      display: flex;
      justify-content: flex-end;
    }
    .select-switch {
      position: absolute;
      right: 10rpx;
    }
    .uni-data-tree {
      .input-value-border {
        border: none !important;
      }
      .uni-data-tree-input {
        .input-value {
          text-align: center !important;
        }
        .selected-list,
        .selected-area {
          display: block;
          text-align: end;
          margin-right: 10rpx;
        }
      }
    }
    .uni-forms-item__error {
      right: 25rpx;
      top: 50rpx;
    }
    .copy-btn {
      border: 2rpx solid #df3030;
      border-radius: 200rpx;
      text-align: center;
      color: #df3030;
      font-size: 26rpx;
      padding: 0rpx 50rpx 0rpx 50rpx;
      margin: 20rpx 0rpx 20rpx 0rpx;
      height: 70rpx;
      line-height: 70rpx;
      background: #ffffff;
      position: absolute;
      right: 15rpx;
      bottom: -20rpx;
    }
    .choice-btn {
      border-radius: 100rpx;
      border: 2rpx solid #df3030;
      background: #fff;
      font-size: 28rpx;
      color: #df3030;
      height: 50rpx;
      line-height: 50rpx;
      margin-top: 10rpx;
      margin-left: 15rpx;
    }
  }
  :deep(.uni-forms-item__label) {
    width: 200rpx !important;
  }
  :deep(.uni-forms-item) {
    border-bottom: 2rpx solid #ebedf0;
    padding: 10rpx;
    margin-bottom: 0rpx;
  }

  .top {
    width: 690rpx;
    margin: 30rpx auto;
    background: #ffffff;
    box-shadow: 0rpx 0.8rpx 0.8rpx 0.8rpx rgba(0, 0, 0, 0.1);
  }

  .cargo-type {
    position: relative;
    padding: 26rpx 30rpx;
    display: flex;
    align-items: center;

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 32rpx;
      bottom: 0;
      left: 32rpx;
      border-bottom: 1px solid #ebedf0;
      transform: scaleY(0.5);
    }

    .cargo-type-value {
      display: flex;
      align-items: center;

      .value-item,
      .value-en {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110rpx;
        height: 50rpx;
        margin-left: 30rpx;
        background: rgba(153, 153, 153, 0.15);
        color: #666666;
        border-radius: 36rpx;
        border: 0.2rpx solid rgba(153, 153, 153, 0.15);
        font-size: 28rpx;
      }

      .value-en {
        min-width: 300rpx;
      }

      .active {
        color: #de302f;
        background: #ffffff;
        border: 2rpx solid #df3030;
      }
    }
  }

  .choiceProduct {
    .cargo-type {
      padding: 26rpx 30rpx;

      .cargo-type-value {
        flex-wrap: wrap;

        .value-item,
        .value-en {
          width: auto;
          height: auto;
          min-width: 220rpx;
          padding: 12rpx 26rpx;
          margin-left: 10rpx;
          margin-bottom: 30rpx;
        }
      }
    }
    .footer-btn {
      display: flex;
      align-items: center;
      padding: 20rpx;
    }

    .close,
    .confirm {
    }

    .close {
      background: #ffffff;
      box-shadow: 0rpx 1.6rpx 1.6rpx 1.6rpx rgba(221, 49, 47, 0.1);
      color: #dd312f;
    }

    .confirm {
      background: #dd312f;
      box-shadow: 0rpx 1.6rpx 1.6rpx 1.6rpx rgba(221, 49, 47, 0.1);
      color: #ffffff;
    }
  }
}
</style>