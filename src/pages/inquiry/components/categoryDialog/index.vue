<template>
  <!-- 货物分类-询价首页弹框 -->
  <view class="category">
    <uni-popup
      ref="showCategory"
      :showCancelButton="false"
      :showConfirmButton="false"
    >
      <uni-popup-dialog
        :duration="2000"
        :before-close="true"
        @close="closeCateforyPopup"
        @confirm="onSubmit"
        confirmText="货物价格"
        title="  "
      >
        <!-- 弹窗内容 -->
        <template v-slot:default>
          <view class="title">
            <uni-icons type="arrowleft" @click="backOff" />
            <span class="one">
              <img
                src="@/static/inquiry/one-notSelect.png"
                alt=""
                class="one-select"
              />
              货物信息
            </span>
            <img src="@/static/inquiry/ico-category.png" class="title-ico" />
            <span class="second">
              <img
                src="@/static/inquiry/second-select.png"
                alt=""
                class="one-select"
              />
              货物属性
            </span>
          </view>
          <form @submit="onSubmit">
            <view class="cargo-type">
              <view class="cargo-type-value">
                <view
                  class="value-item"
                  :class="{ active: getProductsActive(item.value) }"
                  v-for="(item, index) in products"
                  :key="index"
                  @click="checkProducts(item.value, index)"
                >
                  {{ item.name }}
                </view>
              </view>
            </view>
            <view
              class="warning-tip"
              v-for="(item, index) in rejection"
              :key="index"
            >
              <uni-icons type="warning" class="ico-warning" />

              {{ item.value }}
            </view>
            <!-- <view class="btn">
              <button class="confirm" type="default" id="obtain">
                获取价格
              </button>
            </view> -->
          </form>
        </template>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  computed,
  defineEmits,
  defineProps,
} from "vue";
import { getDictTypes } from "../../../../api/common"; // 导入 utils 文件中的方法

const props = defineProps({
  showCategory: {
    type: Boolean,
    default: false,
  },
  searchData: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:showCategory", "backOffDialog"]);

// State
const lang = ref("");
const showPopover = ref(false);
const products = ref([]);
const includeGoods = ref([]);
const rejection = ref([]);
const form = reactive({
  include: "",
  products: [],
});
const showCategory = ref(false);
// Lifecycle
onMounted(() => {
  lang.value = uni.getStorageSync("lang");
  // 回显
  const isIncludeGoods = uni.getStorageSync("isIncludeGoods");
  if (isIncludeGoods) {
    form.include = isIncludeGoods.include;
    if (isIncludeGoods.products instanceof Array)
      form.products = isIncludeGoods.products;
  }
});

const fetchDataByFlow = (flow) => {
  let dicTitles = "";
  if (flow === "2") {
    dicTitles = "机场设置.拒收货物,机场设置.货物属性";
  } else if (flow === "3") {
    dicTitles = "港口设置.拒收货物,港口设置.货物属性";
  } else if (flow === "4") {
    dicTitles = "快递设置.拒收货物,快递设置.货物属性";
  } else if (flow === "5") {
    dicTitles = "铁路设置.拒收货物,铁路设置.货物属性";
  }
  if (dicTitles) {
    getDictTypes({ dicTitles }).then((response) => {
      rejection.value = response.data[dicTitles.split(",")[0]];
      products.value = response.data[dicTitles.split(",")[1]];
    });
  }
};

const fetchDataByTransKind = (transKind) => {
  let dicTitles = "";
  if (transKind === "空运" || transKind === "Air") {
    dicTitles = "专线设置.拒收货物.空运,专线设置.货物属性.空运";
  } else if (transKind === "海运" || transKind === "Sea") {
    dicTitles = "专线设置.拒收货物.海运,专线设置.货物属性.海运";
  } else if (transKind === "陆运" || transKind === "Land") {
    dicTitles = "专线设置.拒收货物.陆运,专线设置.货物属性.陆运";
  }
  if (dicTitles) {
    getDictTypes({ dicTitles }).then((response) => {
      rejection.value = response.data[dicTitles.split(",")[0]];
      products.value = response.data[dicTitles.split(",")[1]];
    });
  }
};

watch(
  () => props.searchData.flow,
  (newVal) => {
    if (newVal) {
      fetchDataByFlow(newVal);
    }
  },
  { immediate: true }
);

// 根据 transKind 获取数据字典
watch(
  () => props.searchData.transKind,
  (newVal) => {
    if (newVal) {
      fetchDataByTransKind(newVal);
    }
  },
  { immediate: true }
);

const getProductsActive = computed(() => {
  return (value) => {
    let products = form.products;
    let bool = false;
    if (products && products.length > 0) {
      products.forEach((element) => {
        if (element === value) {
          bool = true;
        }
      });
    }
    return bool;
  };
});

// 打开弹窗
const openCateforyPopup = () => {
  showCategory.value.open();
};

// 关闭弹窗
const closeCateforyPopup = () => {
  showCategory.value.close();
  emit("update:showCategory", !props.showCategory);
  emit("backOffDialog");
  // emit("close"); // 通知父组件弹窗已关闭
};

// Methods
const onSubmit = () => {
  const searchData = props.searchData;
  searchData.products = [];
  if (form.include === "每次" || form.include === "本次") {
    if (form.include === "每次") {
      uni.setStorageSync(
        "isIncludeGoods",
        JSON.stringify({ include: form.include, products: form.products })
      );
    } else if (form.include === "本次") {
      uni.removeStorageSync("isIncludeGoods");
    }
    // 查询条件反选
    const newArray = products.value
      .filter((item) => !form.products.includes(item.value))
      .map((item) => item.value);
    searchData.products = newArray;
  } else {
    searchData.products = form.products;
  }
  if (searchData.products.length <= 0) {
    uni.showToast({
      title: "请选择货物属性",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  emit("update:showCategory", !props.showCategory);
  const pathMap = {
    1: "/pages/inquiry/dedicatedLine",
    2: "/pages/inquiry/intAirport",
    3: "/pages/inquiry/intPort",
    4: "/pages/inquiry/intExpress",
    5: "/pages/inquiry/intRail",
  };
  const path = pathMap[searchData.flow] || "";
  uni.navigateTo({
    url: `${path}?${Object.keys(searchData)
      .map((key) => `${key}=${encodeURIComponent(searchData[key])}`)
      .join("&")}`,
  });
  uni.removeStorageSync("departure");
  uni.removeStorageSync("destination");
};

const checkProducts = (value) => {
  if (form.products.includes(value)) {
    form.products = form.products.filter((item) => item !== value);
  } else {
    form.products.push(value);
  }
};

const backOff = () => {
  emit("update:showCategory", !props.showCategory);
  emit("backOffDialog");
};

// const close = () => {
//   emit("update:showCategory", !props.showCategory);
// };

// 暴露方法给父组件
defineExpose({
  openCateforyPopup,
  closeCateforyPopup,
});
</script>

<style lang="scss" scoped>
.category {
  :deep(.uni-popup) {
    .title {
      position: relative;
      text-align: center;
      padding: 30rpx;
      font-size: 36rpx;
      color: #333333;
      border-bottom: 2rpx solid #e2e2e2;
      .uni-icons-close {
        position: absolute;
        top: 34rpx;
        right: 30rpx;
        font-size: 36rpx;
        color: #999999;
      }
      .uni-icons-arrowleft {
        position: absolute;
        top: 34rpx;
        left: 24rpx;
        font-size: 40rpx;
        color: #999999;
      }
      .title-ico {
        width: 30rpx;
        height: 10rpx;
        margin: 0px 18rpx 8rpx 12rpx;
      }
      .one {
        font-size: 30rpx;
        color: #999999;
      }
      .one-select {
        width: 30rpx;
        height: 34rpx;
        margin-bottom: -4rpx;
      }
      .second {
        font-size: 30rpx;
        color: #de3031;
      }
    }
    .uni-dialog-title {
      display: none;
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
        bottom: -10rpx;
        left: 32rpx;
        border-bottom: 2rpx solid #ebedf0;
        transform: scaleY(0.5);
      }
      .cargo-type-title {
        flex: 1;
        text-align: left;
        color: #666666;
        font-size: 30rpx;
      }
      .cargo-type-value {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .value-item {
          min-height: 101%;
          padding: 12rpx 26rpx;
          margin-left: 30rpx;
          margin-bottom: 30rpx;
          background: rgba(153, 153, 153, 0.15);
          color: #666666;
          border-radius: 36rpx;
          border: 0.2rpx solid rgba(153, 153, 153, 0.15);
          font-size: 28rpx;
          line-height: 1;
        }
        .value-en {
          padding: 12rpx 26rpx;
          min-width: 240rpx;
          margin-left: 16rpx;
          margin-bottom: 30rpx;
          background: rgba(153, 153, 153, 0.15);
          color: #666666;
          border-radius: 36rpx;
          border: 0.2rpx solid rgba(153, 153, 153, 0.15);
          font-size: 28rpx;
          line-height: 1;
        }
        .active {
          color: #de302f;
          background: #ffffff;
          border: 2rpx solid #df3030;
        }
      }
    }
    .include-goods {
      .cargo-type-value {
        .value-item {
          margin-bottom: 0;
        }
      }
    }
    .warning-tip {
      position: relative;
      margin: 30rpx 30rpx 50rpx 30rpx;
      padding-left: 50rpx;
      text-align: left;
      font-size: 26rpx;
      color: #f27a33;
      line-height: 40rpx;
      .ico-warning {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 42rpx;
        height: 42rpx;
        background: url("@/static/inquiry/ico-warning.png") no-repeat;
        background-size: contain;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      margin: 30rpx 0;
      .confirm {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 420rpx;
        height: 88rpx;
        box-shadow: 0px 2rpx 4rpx 2rpx rgba(221, 49, 47, 0.15);
        border-radius: 40rpx;
        font-size: 28rpx;
        background: #dd312f;
        color: #ffffff;
      }
    }
  }
}
</style>