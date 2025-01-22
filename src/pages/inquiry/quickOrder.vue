<template>
  <view class="quickOrder-page">
    <view class="custom-card container1">
      <uni-forms :model="form" ref="formRef">
        <uni-forms-item
          label="件数"
          required
          :name="['transCount']"
          :rules="[{ required: true, errorMessage: '请填写件数' }]"
        >
          <uni-easyinput
            v-model="form.transCount"
            :inputBorder="false"
            placeholder="请写件数"
          />
          <uni-data-select
            v-model="form.transUnit"
            :localdata="transUnit"
            :clear="false"
          />
        </uni-forms-item>
        <uni-forms-item
          label="运输方式"
          required
          :name="['transKind']"
          :rules="[{ required: true, errorMessage: '请选择运输方式' }]"
        >
          <uni-data-select
            v-model="form.transKind"
            :localdata="transKind"
            placeholder="请选择运输方式"
            :clear="false"
          />
        </uni-forms-item>
        <uni-forms-item
          label="入库类型"
          required
          :name="['sendPlanKind']"
          :rules="[{ required: true, errorMessage: '请选择入库类型' }]"
        >
          <uni-data-select
            v-model="form.sendPlanKind"
            :localdata="incomingType"
            placeholder="请选择入库类型"
            :clear="false"
          />
        </uni-forms-item>
        <uni-forms-item
          label="收货仓库"
          required
          :name="['sendPlanInfo', 'warehouse']"
          :rules="[{ required: true, errorMessage: '请选择仓库' }]"
        >
          <uni-data-picker
            :localdata="warehouseList"
            popup-title="请选择仓库"
            :map="{ text: 'title', value: 'title' }"
            v-model="form.sendPlanInfo.warehouse"
            @change="handleWarehouseChange"
            :clear-icon="false"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item
          label="渠道编码"
          required
          :name="['channelCode']"
          :rules="[{ required: true, errorMessage: '请选择渠道编码' }]"
        >
          <uni-data-picker
            :localdata="codeData"
            popup-title="请选择渠道编码"
            :map="{ text: 'name', value: 'name' }"
            v-model="form.channelCode"
          ></uni-data-picker>
        </uni-forms-item>
      </uni-forms>
    </view>
    <view class="footer-btn">
      <uni-button @tap="onSubmit">快速下单</uni-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getChannelCode } from "@/api/inquiry";
import { getDictTypes, getWarehouseList } from "@/api/common";
import { submitQuick } from "@/api/inquiry";
const searchParams = reactive({
  srcTitle: "",
  srcTitleEn: "",
  srcScode: "",
  descScode: "",
  descTitle: "",
  descTitleEn: "",
});
const form = reactive({
  destDTO: {
    descScode: "",
    descTitle: "",
    descTitleEn: "",
  },
  srcDTO: {
    srcTitle: "",
    srcTitleEn: "",
    srcScode: "",
  },
  sendPlanInfo: {
    addr: "",
    contactMan: "", //联系人姓名
    contactPhone: "", //联系人电话
    memo: "", //备注
    warehouse: "", //收货仓库;公司自有的仓库名称
    warehouseId: "", //	仓库ID
  },
  transKind: "",
  // channelCode: "", // 所属渠道编码
  transCount: "", // 数量
  transUnit: "CTN", // 数量单位
  sendPlanKind: "", // 入库类型
  channelCode: "", //渠道编码
  receiverCityName: "", //收货人城市
});
const transUnit = ref([]);
const incomingType = ref([]);
const transKind = ref([]);
const warehouseList = ref([]);
const formRef = ref(null);
const codeData = ref([]);
const warehouse = ref({});

onMounted(() => {
  channelCodeData();
  getDictTypesData();
  getWarehouseListData();
});

onLoad((options) => {
  Object.assign(searchParams, options);
  form.destDTO.descTitle = options.descTitle;
  form.destDTO.descScode = options.descScode;
  form.destDTO.descTitleEn = options.descTitleEn;
  form.srcDTO.srcTitle = options.srcTitle;
  form.srcDTO.srcTitleEn = options.srcScode;
  form.srcDTO.srcScode = options.srcTitleEn;
});

const getDictTypesData = () => {
  getDictTypes({
    dicTitles: "专线设置.件数单位,专线设置.运输类别,专线设置.入库类型",
  }).then((response) => {
    transUnit.value = response.data["专线设置.件数单位"].map((item) => ({
      ...item,
      text: item.name,
    }));
    incomingType.value = response.data["专线设置.入库类型"].map((item) => ({
      ...item,
      text: item.name,
    }));
    transKind.value = response.data["专线设置.运输类别"].map((item) => ({
      ...item,
      text: item.name,
    }));
  });
};

const channelCodeData = () => {
  getChannelCode(searchParams).then((res) => {
    codeData.value = res.rows;
  });
};

const getWarehouseListData = () => {
  getWarehouseList().then((res) => {
    if (res.code === 200) {
      warehouseList.value = res.rows;
    } else {
      showToast(res.msg);
    }
  });
};

const handleWarehouseChange = (e) => {
  if (e.detail.value && e.detail.value.length > 0) {
    const [warehouseData] = e.detail.value;
    if (warehouseData && warehouseData.text) {
      warehouse.value = warehouseList.value.find(
        (item) => item.title === warehouseData.text
      );
      form.sendPlanInfo.contactMan = warehouse.value.contactMan;
      form.sendPlanInfo.contactPhone = warehouse.value.contactPhone;
      form.sendPlanInfo.warehouseId = warehouse.value.id;
      form.sendPlanInfo.addr = warehouse.value.addr;
      form.sendPlanInfo.memo = warehouse.value.memo;
      form.sendPlanInfo.warehouse = warehouse.value.title;
    } else {
      console.error("warehouseData 或 warehouseData.text 不存在");
    }
  }
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then((res) => {
      submitQuick(form).then((res) => {
        if (res.code === 200) {
          uni.showToast({
            title: "下单成功, 请打印二维码贴在货物上，以便快速仓库入库!",
            duration: 2000,
            icon: "none",
          });
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          });
        }
      });
    })
    .catch((err) => {
      uni.showToast({
        title: "请填写必填选项",
        duration: 2000,
        icon: "none",
      });
    });
};
</script>

<style lang="scss" scoped>
.quickOrder-page {
  background: #f9f9fa !important;
  height: 100vh;
  .container1 {
    margin: 0rpx 30rpx;
    margin-top: 50rpx;

    :deep(.uni-forms-item__content) {
      display: flex;
      text-align: right;
      .uni-easyinput__content {
        text-align: right;
        border: 0;
      }
      .uni-forms-item__error {
        right: 25rpx;
        top: 50rpx;
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
    }
  }
}
</style>