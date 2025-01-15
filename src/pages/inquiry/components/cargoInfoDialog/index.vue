<template>
  <!-- 货物弹窗信息 -->
  <view class="cargoInfoDialog-page">
    <uni-popup ref="show" type="dialog" @change="handlePopupChange">
      <uni-popup-dialog
        :duration="2000"
        :before-close="true"
        @close="close"
        @confirm="confirm"
        confirmText="下一步"
      >
        <!-- 弹窗内容 -->
        <template v-slot:default>
          <uni-forms :model="form" ref="formRef">
            <view class="dialog-title">
              <text class="one-flow">
                <img
                  src="@/static/inquiry/one-select.png"
                  alt=""
                  class="one-select"
                />
                货物信息
              </text>
              <img
                src="@/static/inquiry/ico-cargo-info.png"
                class="title-ico"
              />
              <text class="second-flow">
                <img
                  src="@/static/inquiry/second-notSelect.png"
                  alt=""
                  class="one-select"
                />
                包含属性
              </text>
            </view>
            <view class="input-form" v-if="flow == 1">
              <view class="cargo-type">
                <!-- 专线 -->
                <view class="cargo-type-title"> 运输方式 </view>
                <view class="cargo-type-value">
                  <view
                    class="value-item"
                    :class="{ active: form.transKind == item.value }"
                    v-for="(item, index) in transKind"
                    :key="index"
                    @tap="form.transKind = item.value"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>

              <uni-forms-item
                label="重量KG"
                required
                :name="['weight']"
                :rules="[{ required: true, errorMessage: '请输入重量KG' }]"
              >
                <uni-easyinput
                  placeholder="请输入重量KG"
                  v-model="form.weight"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item
                label="方数CBM"
                required
                :name="['squares']"
                :rules="[{ required: true, errorMessage: '请输入方数' }]"
              >
                <uni-easyinput
                  placeholder="请输入方数"
                  v-model="form.squares"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item
                label="件数"
                required
                :name="['transCount']"
                :rules="[{ required: true, errorMessage: '请输入件数' }]"
              >
                <uni-easyinput
                  placeholder="请输入件数"
                  v-model="form.transCount"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
                <uni-data-select
                  v-model="form.transUnit"
                  :localdata="transUnitData"
                  :clear="false"
                ></uni-data-select>
              </uni-forms-item>
              <uni-forms-item label="派送城市">
                <uni-data-select
                  v-model="form.destCity"
                  :localdata="receiverCity"
                  :clear="false"
                ></uni-data-select>
              </uni-forms-item>
              <uni-forms-item label="最大长度">
                <uni-easyinput
                  placeholder="请输入最大长度(CM)"
                  v-model="form.maxLong"
                  clearable
                  :inputBorder="false"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item label="最大宽度">
                <uni-easyinput
                  placeholder="请输入最大宽度(CM)"
                  v-model="form.maxWidth"
                  clearable
                  :inputBorder="false"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item label="最大高度">
                <uni-easyinput
                  placeholder="请输入最大高度(CM)"
                  v-model="form.maxHeight"
                  clearable
                  :inputBorder="false"
                ></uni-easyinput>
              </uni-forms-item>
            </view>
            <!-- 机场-快递-铁路 -->
            <view class="input-form" v-if="flow == 2 || flow == 4 || flow == 5">
              <view class="cargo-type" v-if="flow == 4">
                <!-- 专线 -->
                <view class="cargo-type-title"> 包裹类型 </view>
                <view class="cargo-type-value">
                  <view
                    class="value-item"
                    :class="{ active: form.packageKind == item.value }"
                    v-for="(item, index) in packageKind"
                    :key="index"
                    @tap="form.packageKind = item.value"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>
              <view v-if="flow == 5">
                <view>承运商</view>
                <uni-data-select
                  v-model="form.destCity"
                  :localdata="range"
                  :clear="false"
                ></uni-data-select>
              </view>
              <uni-forms-item
                label="重量KG"
                required
                :name="['weight']"
                :rules="[{ required: true, errorMessage: '请输入重量KG' }]"
              >
                <uni-easyinput
                  placeholder="请输入重量KG"
                  v-model="form.weight"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item
                label="方数CBM"
                required
                :name="['squares']"
                :rules="[{ required: true, errorMessage: '请输入方数' }]"
              >
                <uni-easyinput
                  placeholder="请输入方数"
                  v-model="form.squares"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
              </uni-forms-item>
              <uni-forms-item
                label="件数"
                required
                :name="['transCount']"
                :rules="[{ required: true, errorMessage: '请输入件数' }]"
              >
                <uni-easyinput
                  placeholder="请输入件数"
                  v-model="form.transCount"
                  clearable
                  :inputBorder="false"
                  type="number"
                ></uni-easyinput>
                <uni-data-select
                  v-model="form.transUnit"
                  :localdata="transUnitData"
                  :clear="false"
                ></uni-data-select>
              </uni-forms-item>
            </view>
            <!-- 港口 -->
            <view class="input-form" v-if="flow == 3">
              <view class="cargo-type">
                <view class="cargo-type-title"> 装箱类型 </view>
                <view class="cargo-type-value">
                  <view
                    class="value-item"
                    :class="{ active: form.portSpecKind == item.value }"
                    v-for="(item, index) in portSpecKind"
                    :key="index"
                    @tap="form.portSpecKind = item.value"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>
              <view v-if="form.portSpecKind == '整柜'">
                <uni-forms-item
                  label="柜量"
                  required
                  :name="['transCount']"
                  :rules="[{ required: true, errorMessage: '请输入柜量' }]"
                >
                  <uni-easyinput
                    placeholder="请输入柜量"
                    v-model="form.transCount"
                    clearable
                    :inputBorder="false"
                    type="number"
                  ></uni-easyinput>
                </uni-forms-item>
              </view>
              <view v-if="form.portSpecKind == '散货'">
                <uni-forms-item
                  label="方数(CBM)"
                  required
                  :name="['squares']"
                  :rules="[{ required: true, errorMessage: '请输入重量KG' }]"
                >
                  <uni-easyinput
                    placeholder="请输入方数"
                    v-model="form.squares"
                    clearable
                    :inputBorder="false"
                    type="number"
                  ></uni-easyinput>
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </template>
      </uni-popup-dialog>
    </uni-popup>
    <CategoryDialog
      ref="showCategory"
      @backOffDialog="backOffDialog"
      :searchData="form"
    ></CategoryDialog>
  </view>
</template>

<script setup>
import CategoryDialog from "../../components/categoryDialog/index.vue";
import { ref, reactive, onMounted, watch, defineEmits, defineProps } from "vue";
import { getDictTypes } from "@/api/common";
import { listReceiverCity } from "@/api/inquiry";
const show = ref(null);
const form = reactive({
  transKind: "",
  weight: "",
  transCount: "",
  transUnit: "",
  packageKind: "",
  squares: "",
  companyName: "",
  portSpecKind: "整柜",
  flow: "",
  maxHeight: "", //最大高度 2024-4-23新增-仅专线流程需要触发接口,传参数给后端计算派送费使用
  maxLong: "", //最大长度 2024-4-23新增-仅专线流程需要触发接口,传参数给后端计算派送费使用
  maxWidth: "", //最大宽度 2024-4-23新增-仅专线流程需要触发接口,传参数给后端计算派送费使用
  destCity: "", //目的地城市 2024-4-23新增-仅专线流程需要触发接口,传参数给后端计算派送费使用
  // containers:'',
});
const showCategory = ref(true);
const transKind = ref([]);
const transUnitData = ref([]);
const packageKind = ref([]);
const portSpecKind = ref([]);
const range = ref([]);
const receiverCity = ref([]);
const formRef = ref(null);
const popupShow = ref(false);
// Props
const props = defineProps({
  // show: {
  //   type: Boolean,
  //   default: false,
  // },
  flow: {
    type: String,
    default: "",
  },
  searchData: {
    type: Object,
    default: () => {},
  },
});

watch(
  () => popupShow.value,
  (newVal) => {
    if (newVal) {
      listReceiverCityData();
    }else{
      form.destCity = ''
    }
  },
  { immediate: true }
);

onMounted(() => {
  let dicTitles =
    "专线设置.运输类别,专线设置.件数单位,快递设置.包裹类型,港口设置.装箱类型";
  getDictTypes({ dicTitles }).then((response) => {
    transKind.value = response.data["专线设置.运输类别"];
    transUnitData.value = response.data["专线设置.件数单位"].map((item) => ({
      ...item,
      text: item.name,
    }));
    packageKind.value = response.data["快递设置.包裹类型"];
    portSpecKind.value = response.data["港口设置.装箱类型"];
    if (transKind.value && transKind.value.length > 0) {
      form.transKind = transKind.value[0].value;
    }
    if (transUnitData.value && transUnitData.value.length > 0) {
      form.transUnit = transUnitData.value[0].value;
    }
    if (packageKind.value && packageKind.value.length > 0) {
      form.packageKind = packageKind.value[0].name;
    }
    if (portSpecKind.value && portSpecKind.value.length > 0) {
      form.portSpecKind = portSpecKind.value[0].name;
    }
  });
});

// 打开弹窗
const openPopup = () => {
  show.value.open();
};

// 关闭弹窗
const closePopup = () => {
  show.value.close();
  emit("close"); // 通知父组件弹窗已关闭
};

// 定义 emit
const emit = defineEmits(["close", "update:show"]);

// 监听弹窗状态变化
const handlePopupChange = (e) => {
  popupShow.value = e.show;
  if (!e.show) {
    emit("close"); // 如果弹窗关闭，通知父组件
  }
};

const close = () => {
  show.value.close();
};

const backOffDialog = () => {
  show.value.open();
};

const confirm = () => {
  formRef.value
    .validate()
    .then((res) => {
      show.value.close();
      emit("update:show", !show.value);
      Object.assign(form, props.searchData);
      showCategory.value.openCateforyPopup();
    })
    .catch((err) => {
      uni.showToast({
        title: "请填写完必填选项",
        duration: 2000,
        icon: "none",
      });
    });
};

const listReceiverCityData = () => {
  let params = {
    descTitle: props.searchData.descTitle,
    descScode: props.searchData.destScode,
    descTitleEn: props.searchData.descTitleEn,
  };
  listReceiverCity(params).then((res) => {
    if (res.code === 200) {
      receiverCity.value = res.rows.map((item) => ({
        ...item,
        text: item.name,
      }));
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      });
    }
  });
};

// 暴露方法给父组件
defineExpose({
  openPopup,
  closePopup,
});
</script>

<style lang="scss" scoped>
.cargoInfoDialog-page {
  :deep(.uni-dialog-content) {
    display: contents;
    text-align: center;
  }
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
      right: 0rpx;
      top: 40rpx;
    }
  }
  :deep(.uni-forms-item__label) {
    width: 220rpx !important;
  }
  :deep(.uni-forms-item) {
    border-bottom: 2rpx solid #ebedf0;
    padding: 0rpx;
    margin-bottom: 0rpx;
  }
  :deep(.uni-dialog-title) {
    display: none;
  }
  .dialog-title {
    position: relative;
    text-align: center;
    margin: 12rpx;
    font-size: 36rpx;
    color: #333333;
    padding-top: 30rpx;

    .title-ico {
      width: 50rpx;
      height: 10rpx;
      margin: 0rpx 18rpx 8rpx 12rpx;
    }
    .one-flow {
      font-size: 30rpx;
      color: #de3031;
    }
    .one-select {
      width: 30rpx;
      height: 34rpx;
      margin-bottom: -4rpx;
    }
    .second-flow {
      font-size: 30rpx;
      color: #999999;
    }
  }
  .input-form {
    width: 90%;
    margin: 0 auto;
    .cargo-type {
      position: relative;
      padding: 12rpx 0rpx;
      display: flex;
      align-items: center;

      .cargo-type-title {
        flex: 1;
        text-align: left;
        color: #666666;
        font-size: 30rpx;
        min-width: 120rpx;
      }
      .cargo-type-value {
        display: flex;
        align-items: center;
        .value-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 130rpx;
          height: 50rpx;
          margin-left: 10rpx;
          background: #999999;
          background: rgba(153, 153, 153, 0.15);
          color: #666666;
          border-radius: 36rpx;
          // border: 1px solid #666666;
          font-size: 28rpx;
        }
        .active {
          color: #de302f;
          background: #ffffff;
          border: 2rpx solid #df3030;
        }
        //由于英文版过长，单独给港口设置单独样式
        .port-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 170rpx;
          height: 50rpx;
          margin-left: 30rpx;
          background: #ffffff;
          border-radius: 36rpx;
          border: 2rpx solid #666666;
          font-size: 28rpx;
          color: #666666;
        }
      }
    }
    > uni-view {
      display: flex;
      align-items: center;
      border-bottom: 2rpx solid #ebedf0;
      > uni-view {
        font-size: 30rpx;
        color: #666666;
      }
      :deep(.uni-select) {
        border: 0 !important;
        text-align: right;
      }
      :deep(.uni-easyinput) {
        color: #333333;
        .uni-easyinput__content-input {
          text-align: right;
        }
      }
    }
  }
}
</style>