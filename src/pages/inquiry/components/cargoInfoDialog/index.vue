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
        title="  "
      >
        <!-- 弹窗内容 -->
        <template v-slot:default>
          <view class="dialog-title">
            <text class="one-flow">
              <img
                src="@/static/inquiry/one-select.png"
                alt=""
                class="one-select"
              />
              货物信息
            </text>
            <img src="@/static/inquiry/ico-cargo-info.png" class="title-ico" />
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
            <view>
              <view>重量KG</view>
              <uni-easyinput
                placeholder="请输入重量"
                v-model="form.weight"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput
            ></view>
            <view>
              <view>方数CBM</view>
              <uni-easyinput
                placeholder="请输入方数"
                v-model="form.squares"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput
            ></view>
            <view>
              <view>件数</view>
              <uni-easyinput
                placeholder="请输入件数"
                v-model="form.transCount"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput>
              <uni-data-select
                v-model="form.transUnit"
                :localdata="range"
                :clear="false"
              ></uni-data-select>
            </view>
            <view>
              <view>派送城市</view>
              <uni-data-select
                v-model="form.destCity"
                :localdata="range"
                :clear="false"
              ></uni-data-select>
            </view>
            <view>
              <view>最大长度</view>
              <uni-easyinput
                placeholder="请输入最大长度(CM)"
                v-model="form.maxLong"
                clearable
                :inputBorder="false"
              ></uni-easyinput
            ></view>
            <view>
              <view>最大宽度</view>
              <uni-easyinput
                placeholder="请输入最大宽度(CM)"
                v-model="form.maxWidth"
                clearable
                :inputBorder="false"
              ></uni-easyinput
            ></view>
            <view>
              <view>最大高度</view>
              <uni-easyinput
                placeholder="请输入最大高度(CM)"
                v-model="form.maxHeight"
                clearable
                :inputBorder="false"
              ></uni-easyinput
            ></view>
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
            <view>
              <view>重量KG</view>
              <uni-easyinput
                placeholder="请输入重量"
                v-model="form.weight"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput
            ></view>
            <view>
              <view>方数CBM</view>
              <uni-easyinput
                placeholder="请输入方数"
                v-model="form.squares"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput
            ></view>
            <view>
              <view>件数</view>
              <uni-easyinput
                placeholder="请输入件数"
                v-model="form.transCount"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput>
              <uni-data-select
                v-model="form.transUnit"
                :localdata="range"
                :clear="false"
              ></uni-data-select>
            </view>
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
              <view>柜量</view>
              <uni-easyinput
                placeholder="请输入柜量"
                v-model="form.squares"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput>
            </view>
            <view v-if="form.portSpecKind == '散货'">
              <view>方数(CBM)</view>
              <uni-easyinput
                placeholder="请输入方数"
                v-model="form.squares"
                clearable
                :inputBorder="false"
                type="number"
              ></uni-easyinput>
            </view>
          </view>
        </template>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
const show = ref(null);
const form = reactive({
  transKind: "",
  weight: "",
  transCount: "",
  transUnit: "CTN",
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

const range = ref([
  { value: "CTN", text: "CTN" },
  { value: "PALLET", text: "PALLET" },
  { value: "WOODEN CASE", text: "WOODEN CASE" },
  { value: "WOODEN FRAME", text: "WOODEN FRAME" },
  { value: "SACKS", text: "SACKS" },
  { value: "FLIGHT CASE", text: "FLIGHT CASE" },
  { value: "IRON FRAME", text: "IRON FRAME" },
]);

const transKind = ref([
  { value: "空运", name: "空运" },
  { value: "海运", name: "海运" },
  { value: "陆运", name: "陆运" },
]);

const packageKind = ref([
  { value: "包裹", name: "包裹" },
  { value: "文件", name: "文件" },
]);

const portSpecKind = ref([
  { value: "整柜", name: "整柜" },
  { value: "散货", name: "散货" },
]);

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
const emit = defineEmits(["close"]);

// 监听弹窗状态变化
const handlePopupChange = (e) => {
  if (!e.show) {
    emit("close"); // 如果弹窗关闭，通知父组件
  }
};

const close = () => {
  // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
  // ...
  show.value.close();
};

const confirm = (value) => {
  // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
  // ...
  // console.log(value);
  show.value.close();
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
    display:contents;
    text-align: center;
  }
  .dialog-title{
    position: relative;
    text-align: center;
    margin: 12rpx;
    font-size: 36rpx;
    color: #333333;
   
   
    .title-ico{
      width: 50rpx;
      height: 10rpx;
      margin: 0rpx 18rpx 8rpx 12rpx;
    }
    .one-flow{
      font-size: 30rpx;
      color: #DE3031;
    }
    .one-select{
      width: 30rpx;
      height: 34rpx;
      margin-bottom: -4rpx;
    }
    .second-flow{
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