<template>
  <view class="place-order">
    <view class="opinion" v-if="flowInstLog && flowInstLog.id">
      <view class="time">{{ flowInstLog.createdTime }}</view>
      <view class="desc"
        >{{ flowInstLog.stepResult }}&nbsp;&nbsp;{{
          flowInstLog.stepDesc
        }}</view
      >
    </view>
    <uni-forms :model="form" :rules="rules" ref="formRef">
      <view class="custom-card container1" id="app">
        <uni-forms-item label="渠道" required>
          <uni-easyinput
            v-model="form.baseInfo.title"
            disabled
            :inputBorder="false"
          />
        </uni-forms-item>
        <!-- 付款方式 -->
        <uni-forms-item label="付款方式" required name="baseInfo.payKind">
          <uni-data-select
            v-model="form.baseInfo.payKind"
            :localdata="payKind"
            placeholder="请选择付款方式"
            :clear="false"
          />
        </uni-forms-item>
        <!-- 订单类型 -->
        <uni-forms-item label="订单类型" required name="baseInfo.packageKind">
          <uni-data-select
            v-model="form.baseInfo.packageKind"
            :localdata="orderType"
            placeholder="请选择订单类型"
            :clear="false"
          />
        </uni-forms-item>
        <!-- 入库类型 -->
        <uni-forms-item label="入库类型" name="baseInfo.sendPlanKind" required>
          <uni-data-select
            v-model="form.baseInfo.sendPlanKind"
            :localdata="incomingType"
            placeholder="请选择入库类型"
            :clear="false"
          />
        </uni-forms-item>
        <uni-forms-item label="是否单证报关" name="baseInfo.isSingle" required>
          <uni-data-select
            v-model="form.baseInfo.isSingle"
            :localdata="sysYesNo"
            placeholder="请选择是否单证报关"
            :clear="false"
          />
        </uni-forms-item>
        <!-- 预计交货日期 -->
        <uni-forms-item label="预计交货日期" required>
          <uni-datetime-picker
            type="date"
            v-model="form.baseInfo.wantBeginDate"
            placeholder="请选择预计交货日期"
          />
        </uni-forms-item>
        <!-- FBA货物选择 -->
        <uni-forms-item label="FBA货物">
          <switch
            style="transform: scale(0.8)"
            @change="clickSwitch"
            class="select-switch"
            color="rgb(223, 48, 48)"
          />
        </uni-forms-item>
        <template v-if="form.baseInfo.isFba === '是'">
          <uni-forms-item label="FBA仓库" required>
            <uni-data-select
              v-model="form.baseInfo.fbaWarehouseName"
              :localdata="fbaWarehouseName"
              placeholder=""
              :clear="false"
            />
          </uni-forms-item>
          <!-- FBA编号 -->
          <uni-forms-item label="FBA编号" required>
            <uni-easyinput v-model="form.baseInfo.fbaCode" placeholder="" />
          </uni-forms-item>
          <!-- Amazon RID -->
          <uni-forms-item label="amazonRID" required>
            <uni-easyinput v-model="form.baseInfo.amazonRID" placeholder="" />
          </uni-forms-item>
        </template>
      </view>
      <!-- 发货人 -->
      <view class="custom-card container2">
        <uni-forms-item label="发货人">
          <uni-easyinput
            v-model="form.sendInfo.senderName"
            placeholder="请输入发货人"
            :border="true"
          />
          <button @tap="checkAddress('发货人')" class="choice-btn">选择</button>
        </uni-forms-item>
        <uni-forms-item label="发货人电话">
          <view class="area-phone">
            <view class="phone-prefix">
              <view>{{ form.sendInfo.senderPhonePrefix }}</view>
              <view class="ico-phone"></view>
            </view>
            <uni-easyinput
              v-model="form.sendInfo.senderPhone"
              placeholder="请输入发货人电话"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="发货人地区">
          <uni-data-select
            v-model="form.sendInfo.area"
            placeholder="请选择发货人地区"
          />
        </uni-forms-item>
        <uni-forms-item label="详细地址">
          <uni-easyinput
            v-model="form.sendInfo.senderAddr"
            placeholder="请输入详细地址"
          />
        </uni-forms-item>
      </view>
      <!-- 收货人 -->
      <view class="custom-card container3">
        <!-- <uni-cell :title="$t('orderDetail.lang')" :value="lang" /> -->
        <uni-forms-item label="收货人">
          <uni-easyinput
            v-model="form.receiveInfo.receiverName"
            placeholder="请输入收货人"
          />
          <button @tap="checkAddress('收货人')" class="choice-btn">选择</button>
        </uni-forms-item>
        <uni-forms-item label="收货人电话1">
          <view class="area-phone">
            <view class="phone-prefix">
              <view>{{ form.receiveInfo.receiverPhonePrefix }}</view>
              <view class="ico-phone"></view>
            </view>
            <uni-easyinput
              v-model="form.receiveInfo.receiverPhone"
              placeholder="请输入收货人电话"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="收货人国家">
          <uni-data-picker
            :localdata="receiveInfoCity"
            popup-title="请选择收货人国家"
            :map="{ text: 'areaName', value: 'areaScode' }"
            v-model="selectedRegion"
            @change="handleReceiveInfoChange"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="详细地址">
          <uni-easyinput
            v-model="form.receiveInfo.receiverAddr"
            placeholder=""
          />
        </uni-forms-item>
      </view>
      <!-- 派送人城市 -->
      <view class="custom-card container3" v-if="receiverShow">
        <uni-forms-item label="$t('orderDetail.receivCity')">
          <uni-data-select
            v-model="spareReceiverCountryName"
            :localdata="receiverCityData"
            placeholder="$t('orderDetail.receivCityPlaceholder')"
          />
        </uni-forms-item>
      </view>
      <!-- 唛头 -->
      <view class="custom-card container4">
        <uni-forms-item label="如有其他属性请备注">
          <uni-easyinput
            v-model="form.attrInfo.productsAttrDesc"
            placeholder=""
          />
        </uni-forms-item>
        <uni-forms-item label="唛头">
          <uni-easyinput v-model="form.attrInfo.shippingMark" placeholder="" />
        </uni-forms-item>
      </view>
      <!-- 货物中文名 —— 图片上传 -->
      <view class="custom-card container5">
        <!-- <uni-cell :title="$t('inquiry.productsAttr')" :value="form.attrInfo.productsAttr" /> -->
        <template v-if="showLang === 'zh_CN' || areaPhonePreFix != '+968'">
          <uni-forms-item label="中文品名">
            <uni-easyinput
              v-model="form.productsInfo.productsCn"
              placeholder="请输入中文品名"
            />
          </uni-forms-item>
          <uni-forms-item label="英文品名">
            <uni-easyinput
              v-model="form.productsInfo.productsOthers"
              placeholder="请输入英文品名"
            />
          </uni-forms-item>
        </template>
        <template v-else>
          <uni-forms-item label="英文品名">
            <uni-easyinput
              v-model="form.productsInfo.productsOthers"
              placeholder=""
            />
          </uni-forms-item>
          <uni-forms-item label="中文品名">
            <uni-easyinput
              v-model="form.productsInfo.productsCn"
              placeholder=""
            />
          </uni-forms-item>
        </template>
        <uni-forms-item label="总箱数">
          <uni-easyinput
            v-model="form.productsInfo.transCount"
            placeholder="$t('goods.transCountPlaceholder')"
          />
          <uni-data-select
            v-model="form.productsInfo.transUnit"
            :localdata="transUnit"
            :clear="false"
          />
        </uni-forms-item>
        <uni-forms-item label="重量(KG)">
          <uni-easyinput v-model="form.productsInfo.weight" placeholder="" />
        </uni-forms-item>
        <uni-forms-item label="方数">
          <uni-easyinput v-model="form.productsInfo.squares" placeholder="" />
        </uni-forms-item>
        <uni-forms-item label="参考重量区间单价">
          <uni-easyinput
            v-model="form.productsInfo.queryPrice"
            placeholder=""
            disabled
          />
        </uni-forms-item>
        <view class="photo-upload">
          <view class="title">外观图片上传</view>
          <view class="content">
            <uni-file-picker
              v-model="form.productsInfo.lookPictures"
              :auto-upload="false"
              @success="afterRead"
              @fail="beforeRead"
              @delete="beforeDelete"
            />
          </view>
        </view>
      </view>
      <!-- 发货信息 -->
      <view class="custom-card container5">
        <uni-forms-item label="收货仓库" required>
          <uni-data-picker
            :localdata="warehouseList"
            popup-title="请选择仓库"
            :map="{ text: 'title', value: 'title' }"
            v-model="form.sendPlanInfo.warehouse"
            @change="handleWarehouseChange"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="" v-if="form.sendPlanInfo.warehouse">
          <view>
            {{
              warehouse.contactMan +
              " " +
              warehouse.contactPhone +
              " " +
              warehouse.addr
            }}
          </view>
        </uni-forms-item>
        <uni-forms-item label="" v-if="form.sendPlanInfo.warehouse">
          <view>{{ warehouse.memo }}</view>
        </uni-forms-item>
        <uni-forms-item label="" v-if="form.sendPlanInfo.warehouse">
          <button class="copy-btn" @tap="onCopy">一键复制仓库地址</button>
        </uni-forms-item>
        <uni-forms-item label="货运方式">
          <uni-data-picker
            :localdata="transKind"
            popup-title="请选择货运方式"
            :map="{ text: 'name', value: 'value' }"
            v-model="form.sendPlanInfo.transKind"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item
          v-if="
            form.sendPlanInfo.transKind === '快递送货' ||
            form.sendPlanInfo.transKind === 'express delivery'
          "
          label="快递单号"
        >
          <uni-easyinput v-model="form.sendPlanInfo.transNum" />
        </uni-forms-item>
        <uni-forms-item
          v-if="
            form.sendPlanInfo.transKind === '司机送货' ||
            form.sendPlanInfo.transKind === 'driver delivery'
          "
          label="车牌号码"
        >
          <uni-easyinput v-model="form.sendPlanInfo.transNum" />
        </uni-forms-item>
        <uni-forms-item
          v-if="
            form.sendPlanInfo.transKind === '物流送货' ||
            form.sendPlanInfo.transKind === 'logistics delivery'
          "
          label="物流单号"
        >
          <uni-easyinput v-model="form.sendPlanInfo.transNum" />
        </uni-forms-item>
      </view>
      <!-- 箱单上传 -->
      <view class="order-batch">
        <view class="container1">
          <button @tap="downloadOrderTemplate(templateUrl)" class="operat-btn">
            <i class="ico-download"></i>
            <text>下载装箱单文件</text>
          </button>
          <uni-file-picker
            file-mediatype="all"
            class="operat-btn"
            accept=".pdf,.xls,.doc,.jpg,.png,.docx,.xlsx,.zip,.7z,.rar"
            ><i class="ico-upload"></i>装箱单附件上传</uni-file-picker
          >
        </view>
        <view
          class="custom-card container2"
          v-if="form.productsInfo.packingList.length > 0"
        >
          <view
            v-for="(item, index) in form.productsInfo.packingList"
            :key="index"
            :title="item.title"
          >
            <button @tap="deleteFile(item.title)">
              {{ $t("common.delete") }}
            </button>
          </view>
        </view>
      </view>
      <!-- 运输协议 -->
      <Agreement ref="agreement" class="agreement-age" />
      <view class="footerBtn">
        <button @tap="onSubmit">提交订单</button>
      </view>
    </uni-forms>
    <uni-popup ref="confirmPopup" type="dialog">
      <uni-popup-dialog
        title="$t('confirmTips.confirmOrder')"
        @confirm="onConfirm"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
import { getDictTypes, getWarehouseList, getOrderTemplate } from "@/api/common";
import { getCity } from "@/api/other";
import Agreement from "../../../components/agreement/index.vue";
// import Compressor from 'compressorjs';
// import CustomSelect from "../../../components/selectComponent/index.vue";
// 响应式数据
const showConfirm = ref(false);
const id = ref("");
const timeType = ref(1);
const showDateTimePicker = ref(false);
const payKind = ref([]);
const fbaWarehouseName = ref([]);
const sysYesNo = ref([]);
const productsAttr = ref([]);
const transUnit = ref([]);
const flowInstLog = ref({});
const fileList = ref([]);
const language = ref([]);
const lang = ref("English");
const form = reactive({
  baseInfo: {
    amazonRID: "",
    channelCode: "",
    channelId: "",
    fbaCode: "",
    fbaWarehouseName: "",
    isFba: "否",
    isSingle: "",
    payKind: "",
    wantBeginDate: "",
    wantEndDate: "",
    title: "",
    packageKind: "",
    sendPlanKind: "",
  },
  sendInfo: {
    cityCode: "",
    countryCode: "",
    id: "",
    provinceCode: "",
    senderAddr: "",
    senderCityName: "",
    senderCountryName: "",
    senderName: "",
    senderPhone: "",
    senderProvinceName: "",
    senderPhonePrefix: "+86",
  },
  receiveInfo: {
    receiverLang: "en",
    cityCode: "",
    countryCode: "",
    id: "",
    provinceCode: "",
    receiverAddr: "",
    receiverCityName: "",
    receiverCountryName: "",
    receiverEmail: "",
    receiverName: "",
    receiverPhone1: "",
    receiverPhone2: "",
    receiverPhone3: "",
    receiverProvinceName: "",
    receiverPhonePrefix: "+971",
  },
  attrInfo: {
    productsAttr: "",
    productsAttrDesc: "",
    shippingMark: "",
  },
  productsInfo: {
    lookPictures: [],
    packingList: [],
    productsCn: "",
    productsOthers: "",
    squares: "",
    transCount: "",
    transUnit: "",
    weight: "",
    queryPrice: "",
    finalPriceUnt: "",
    finalPrice: "",
  },
  sendPlanInfo: {
    transKind: "",
    transNum: "",
    warehouse: "",
    warehouseId: "",
  },
  queryPriceHistoryId: "",
});
const rules = {
  "baseInfo.payKind": {
    rules: [
      {
        required: true,
        errorMessage: "请选择付款方式",
      },
    ],
  },
  "baseInfo.packageKind": {
    rules: [
      {
        required: true,
        errorMessage: "请选择订单类型",
      },
    ],
  },
  "baseInfo.sendPlanKind": {
    rules: [
      {
        required: true,
        errorMessage: "请选择入库类型",
      },
    ],
  },
  "baseInfo.isSingle": {
    rules: [
      {
        required: true,
        errorMessage: "请选择是否单证报关",
      },
    ],
  },
  "baseInfo.wantBeginDate": {
    rules: [
      {
        required: true,
        errorMessage: "请选择预计交货日期",
      },
    ],
  },
  "sendInfo.senderName": {
    rules: [
      {
        required: true,
        errorMessage: "请输入发货人",
      },
    ],
  },
  "sendInfo.senderPhone": {
    rules: [
      {
        required: true,
        errorMessage: "请输入发货人电话",
      },
    ],
  },
  "sendInfo.area": {
    rules: [
      {
        required: true,
        errorMessage: "请选择发货人地区",
      },
    ],
  },
  "sendInfo.senderAddr": {
    rules: [
      {
        required: true,
        errorMessage: "请输入详细地址",
      },
    ],
  },
  "receiveInfo.receiverName": {
    rules: [
      {
        required: true,
        errorMessage: "请输入收货人",
      },
    ],
  },
  "receiveInfo.receiverPhone": {
    rules: [
      {
        required: true,
        errorMessage: "请输入收货人电话",
      },
    ],
  },
  "receiveInfo.receiverAddr": {
    rules: [
      {
        required: true,
        errorMessage: "请输入详细地址",
      },
    ],
  },
  "productsInfo.transCount": {
    rules: [
      {
        required: true,
        errorMessage: "请输入总箱数",
      },
    ],
  },
  "productsInfo.weight": {
    rules: [
      {
        required: true,
        errorMessage: "请输入重量",
      },
    ],
  },
  "productsInfo.squares": {
    rules: [
      {
        required: true,
        errorMessage: "请输入方数",
      },
    ],
  },
};
const templateUrl = ref("");
const zxPackingList = ref([]);
const transKind = ref([]);
const warehouseList = ref([]);
const warehouse = ref({});
const columns = ref([]);
const type = ref(1);
const orderType = ref([]);
const incomingType = ref([]);
const receiveInfoParams = reactive({
  lang: "en",
  level: "1",
});
const receiveInfoCity = ref([]);
const phonePrefixParams = reactive({
  lang: "zh",
  level: "1",
});
const areaPhonePre = ref([]);
const phonePrefixLang = ref("");
const showLang = ref("");
const areaPhonePreFix = ref("");

const receiverCityParams = reactive({
  channelCode: "",
});
const receiverCityData = ref([]);
const receiverShow = ref(false);
const spareReceiverCountryName = ref("");
const agreement = ref("");
const selectedRegion = ref([]);
const formRef = ref("");

// 生命周期钩子
onLoad((options) => {
  id.value = options.id;
  // products.value = options.products ? options.products.split(',') : [];
  form.baseInfo.channelCode = options.channelCode;
  form.baseInfo.channelId = options.channelId;
  form.baseInfo.title = options.title;
  form.attrInfo.productsAttr = options.products
    ? String(options.products).replaceAll(",", ";")
    : "";
  form.productsInfo.squares = options.squares;
  form.productsInfo.transCount = options.transCount;
  form.productsInfo.transUnit = options.transUnit;
  form.productsInfo.weight = options.weight;
  form.productsInfo.finalPriceUnt = options.unit;
  form.queryPriceHistoryId = options.queryPriceHistoryId;

  // if (options.regPhone) {
  //   form.regPhone = options.regPhone;
  // }
  // if (options.price < 1) {
  //   form.productsInfo.queryPrice = "inquiry.interview";
  //   form.productsInfo.finalPrice = '0';
  // }
  // if (options.price > 0) {
  //   form.productsInfo.queryPrice = options.price;
  //   form.productsInfo.finalPrice = options.price;
  // }

  // getOrderTemplate();
  // phonePrefixLang.value = uni.getStorageSync('lang');
});

onMounted(() => {
  // uni.showLoading({ title: '加载中...' });
  getDictTypesData();
  getWarehouseListData();
  getReceiveInfoCityData();
  getOrderTemplateData();
  // getContract();
  // getPhonePrefix();
  showLang.value = uni.getStorageSync("lang");
  areaPhonePreFix.value = getCookie("areaNumber");
});
const dynamicRules = computed(() => {
  const rules = {
    "baseInfo.payKind": {
      rules: [
        {
          required: true,
          errorMessage: "请选择付款方式",
          trigg: "change",
        },
      ],
    },
    "baseInfo.packageKind": {
      rules: [
        {
          required: true,
          errorMessage: "请选择订单类型",
        },
      ],
    },
  };

  if (form.baseInfo.isFba === "是") {
    rules["baseInfo.fbaWarehouseName"] = {
      rules: [{ required: true, errorMessage: "请选择FBA仓库" }],
    };
    rules["baseInfo.fbaCode"] = {
      rules: [{ required: true, errorMessage: "请输入FBA编号" }],
    };
    rules["baseInfo.amazonRID"] = {
      rules: [{ required: true, errorMessage: "请输入Amazon RID" }],
    };
  }

  return rules;
});
// 方法
const getDictTypesData = () => {
  getDictTypes({
    dicTitles:
      "付款方式,专线设置.FBA仓库,询价货物属性,专线设置.件数单位,系统是否, 专线设置.货运方式,专线设置.订单类型,专线设置.入库类型",
  }).then((response) => {
    payKind.value = response.data["付款方式"].map((item) => ({
      ...item,
      text: item.name,
    }));
    fbaWarehouseName.value = response.data["专线设置.FBA仓库"].map((item) => ({
      ...item,
      text: item.name,
    }));
    sysYesNo.value = response.data["系统是否"].map((item) => ({
      ...item,
      text: item.name,
    }));
    productsAttr.value = response.data["询价货物属性"].map((item) => ({
      ...item,
      text: item.name,
    }));
    transUnit.value = response.data["专线设置.件数单位"].map((item) => ({
      ...item,
      text: item.name,
    }));
    transKind.value = response.data["专线设置.货运方式"].map((item) => ({
      ...item,
      text: item.name,
    }));
    orderType.value = response.data["专线设置.订单类型"].map((item) => ({
      ...item,
      text: item.name,
    }));
    incomingType.value = response.data["专线设置.入库类型"].map((item) => ({
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

const clickSwitch = (event) => {
  if (event.detail.value === false) {
    form.baseInfo.isFba = "否";
  } else {
    form.baseInfo.isFba = "是";
  }
};

const handleReceiveInfoChange = (e) => {
  const [receiveCity] = e.detail.value;
  // 将选中的值绑定到表单
  form.receiveInfo.receiverCityName = receiveCity ? receiveCity.text : "";
  form.receiveInfo.cityCode = receiveCity ? receiveCity.value : "";
};

const handleWarehouseChange = (e) => {
  if (e.detail.value && e.detail.value.length > 0) {
    const [warehouseData] = e.detail.value;
    if (warehouseData && warehouseData.text) {
      warehouse.value = warehouseList.value.find(
        (item) => item.title === warehouseData.text
      );
    } else {
      console.error("warehouseData 或 warehouseData.text 不存在");
    }
  }
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

const getReceiveInfoCityData = () => {
  getCity(receiveInfoParams).then((res) => {
    if (res.code === 200) {
      receiveInfoCity.value = res.data;
    } else {
      showToast(res.msg);
    }
  });
};

const getContract = () => {
  Api.getContract().then((res) => {
    if (res.code === 200) {
      form.sendInfo = {
        cityCode: res.data.cityCode,
        countryCode: res.data.countryCode,
        id: res.data.id,
        provinceCode: res.data.provinceCode,
        senderAddr: res.data.addr,
        senderCityName: res.data.cityName,
        senderCountryName: res.data.countryName,
        senderName: res.data.realname,
        senderPhone: res.data.phone1,
        senderProvinceName: res.data.provinceName,
        area: getAllArea(
          res.data.countryName,
          res.data.provinceName,
          res.data.cityName
        ),
        senderPhonePrefix: res.data.phonePrefix || "+86",
      };
    } else {
      showToast(res.msg);
    }
  });
};

const getPhonePrefix = () => {
  Api.getCity(phonePrefixParams).then((res) => {
    if (res.code === 200) {
      areaPhonePre.value = res.data.map((element) => ({
        areaPhonePre: element.phonePrefix,
      }));
    }
  });
};

// const orderInfoZx = () => {
//   uni.showLoading({ title: '加载中...' });
//   Api.orderInfoZx({ id: id.value }).then(res => {
//     uni.hideLoading();
//     if (res.code === 200) {
//       Object.assign(form, res.data);
//       flowInstLog.value = res.data.flowInstLog;
//       warehouse.value = {
//         contactMan: res.data.sendPlanInfo.contactMan,
//         contactPhone: res.data.sendPlanInfo.contactPhone,
//         addr: res.data.sendPlanInfo.addr,
//         memo: res.data.sendPlanInfo.memo,
//       };
//       if (form.attrInfo.productsAttr) {
//         form.attrInfo.productsAttr = form.attrInfo.productsAttr.split(';');
//       }
//       form.sendInfo.area = getAllArea(form.sendInfo.senderCountryName, form.sendInfo.senderProvinceName, form.sendInfo.senderCityName);
//       form.receiveInfo.area = getAllArea(form.receiveInfo.receiverCountryName);
//       getCityData({ lang: form.receiveInfo.receiverLang });
//       spareReceiverCountryName.value = res.data.receiveInfo.receiverCityName;
//       receiverCityParams.channelCode = res.data.baseInfo.channelCode;
//       receiverCity();
//     } else {
//       showToast(res.msg);
//     }
//   });
// };

const receiverCity = () => {
  Api.getReceiverCity(receiverCityParams).then((res) => {
    if (res.code === 200) {
      receiverCityData.value = res.rows;
      receiverShow.value = res.rows.length > 0;
      if (receiverShow.value) {
        spareReceiverCountryName.value = route.query.destCity;
      }
    } else {
      showToast(res.msg);
    }
  });
};

const showDateTimePickerMethod = (type) => {
  timeType.value = type;
  showDateTimePicker.value = true;
};

const onConfirmTime = (value) => {
  if (timeType.value === 1) {
    form.baseInfo.wantBeginDate = dateFormat("YYYY-mm-dd", value);
  } else if (timeType.value === 2) {
    form.baseInfo.wantEndDate = dateFormat("YYYY-mm-dd", value);
  }
  showDateTimePicker.value = false;
};

const onSubmit = () => {
  formRef.value.validate().then((res) => {
    // if (!agreement.value.getChecked()) {
    //   showToast("请阅读运输协议");
    //   return;
    // }
    // showConfirm.value = true;
    console.log('ref',formRef.value)
    console.log("eee", res);
  }).catch((err) => {
    console.log("@@@", err);
    console.log('ref',formRef.value)
    showToast("请填写完必填选项");
  });
};

const onConfirm = () => {
  form.receiveInfo.receiverCityName = spareReceiverCountryName.value;
  const params = { ...form };
  params.attrInfo.productsAttr = params.attrInfo.productsAttr
    .toString()
    .replaceAll(",", ";");
  uni.showLoading({ title: "加载中..." });
  if (id.value) {
    Api.orderResubmit(params).then((res) => {
      uni.hideLoading();
      if (res.code === 200) {
        uni.navigateTo({ url: "/pages/order/list?active=2" });
        showToast("placeOrder.placeOrderSuccess");
      } else {
        showToast(res.msg);
      }
    });
  } else {
    Api.zxOrderSubmit(params).then((res) => {
      uni.hideLoading();
      if (res.code === 200) {
        uni.navigateTo({ url: "/pages/order/list?active=2" });
        showToast("placeOrder.placeOrderSuccess");
      } else {
        showToast(res.msg);
      }
    });
  }
};

const checkAddress = (kind) => {
  uni.navigateTo({
    url: `/pages/account/address?kind=${kind}&sourceUrl=${encodeURIComponent(
      location.href
    )}`,
  });
};

const beforeRead = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    showToast("common.imgUploadTip");
    return false;
  }
  return true;
};

const afterRead = (file) => {
  if (file.file.size < 2 * 1024 * 1024) {
    commonUpload(file);
    return;
  }
  // new Compressor(file.file, {
  //   quality: 0.6,
  //   success(result) {
  //     file.file = result;
  //     commonUpload(file);
  //   },
  //   error(err) {
  //     console.log(err.message);
  //   },
  // });
};

// const commonUpload = (file) => {
//   file.status = 'uploading';
//   file.message = "common.uploading";
//   const formData = new FormData();
//   formData.append('file', file.file);
//   Api.commonUpload(formData).then(res => {
//     if (res.code === 200) {
//       file.status = 'done';
//       const lookPicture = { ...res.data, ...form.productsInfo.lookPictures[form.productsInfo.lookPictures.length - 1] };
//       form.productsInfo.lookPictures[form.productsInfo.lookPictures.length - 1] = lookPicture;
//     } else {
//       file.status = 'failed';
//       file.message = "common.uploadFailed";
//       showToast(res.msg);
//     }
//   }).catch(() => {
//     file.status = 'failed';
//     file.message = "common.uploadFailed";
//   });
// };

const beforeDelete = (file) => {
  form.productsInfo.lookPictures.splice(file.index, 1);
};

const downloadOrderTemplate = () => {
  const fileUrl =
    "https://www.gosun2.com/tms-app/common/download/resource?resource=" +
    encodeURIComponent(templateUrl.value);
  uni.downloadFile({
    url: fileUrl,
    success: (res) => {
      if (res.statusCode === 200) {
        // this.downloadStatus = "下载完成，正在保存...";
        showToast("下载成功");
        // 保存文件到本地
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            // this.downloadStatus = `文件已保存到：${saveRes.savedFilePath}`;
            // 打开文件（可选）
            uni.openDocument({
              filePath: saveRes.savedFilePath,
              success: () => {
                console.log("文件打开成功");
              },
              fail: (err) => {
                console.error("文件打开失败", err);
              },
            });
          },
          fail: (err) => {
            // this.downloadStatus = "文件保存失败";
            console.error("文件保存失败", err);
          },
        });
      } else {
        // this.downloadStatus = "下载失败";
        console.error("下载失败，状态码：", res.statusCode);
      }
    },
    fail: (err) => {
      // this.downloadStatus = "下载失败";
      console.error("下载失败", err);
    },
    complete: () => {
      console.log("下载完成");
    },
  });
  // window.location.href = Api.downloadResource({
  //   resource: encodeURIComponent(path),
  //   downloadName: title,
  // });
};

// const packCommonUpload = (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   Api.commonUpload(formData).then(res => {
//     if (res.code === 200) {
//       showToast('common.processedSuccess');
//       form.productsInfo.packingList.push(res.data);
//     } else {
//       uni.hideLoading();
//       showToast(res.msg);
//     }
//   });
// };

const getOrderTemplateData = () => {
  uni.showLoading({ title: "加载中..." });
  getOrderTemplate({ title: "专线装箱单模板" }).then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      templateUrl.value = res.data.path;
    } else {
      showToast(res.msg);
    }
  });
};

const packUpload = (file) => {
  const imgType = ["jpg", "png"];
  const fileType = ["pdf", "xls", "doc", "docx", "xlsx", "zip", "7z", "rar"];
  const fileName = file.name.split(".");
  if (
    fileType.includes(fileName[fileName.length - 1]) ||
    imgType.includes(fileName[fileName.length - 1])
  ) {
    if (imgType.includes(fileName[fileName.length - 1])) {
      if (file.size < 2 * 1024 * 1024) {
        packCommonUpload(file);
        return;
      }
      // new Compressor(file, {
      //   quality: 0.6,
      //   success(result) {
      //     file = result;
      //     if (file.size <= 10 * 1024 * 1024) {
      //       packCommonUpload(file);
      //     } else {
      //       showToast('common.imgUploadTip');
      //     }
      //   },
      //   error(err) {
      //     console.log(err.message);
      //   },
      // });
    }
    if (fileType.includes(fileName[fileName.length - 1])) {
      if (file.size <= 20 * 1024 * 1024) {
        packCommonUpload(file);
      } else {
        showToast("common.fileUploadTip");
      }
    }
  } else {
    showToast("packingList.verificationUploadFormat");
  }
};

const deleteFile = (title) => {
  const index = form.productsInfo.packingList.findIndex(
    (x) => x.title === title
  );
  form.productsInfo.packingList.splice(index, 1);
};

const onCopy = () => {
  uni.setClipboardData({
    data:
      warehouse.value.contactMan +
      " " +
      warehouse.value.contactPhone +
      " " +
      warehouse.value.addr +
      warehouse.value.memo,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    },
    fail: () => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
    },
  });
};

const showToast = (message, duration = 2000) => {
  uni.showToast({ title: message, icon: "none", duration });
};

const getAllArea = (countryName, provinceName, cityName) => {
  return `${countryName} ${provinceName} ${cityName}`;
};

const dateFormat = (format, date) => {
  // 实现日期格式化逻辑
};

const getCookie = (name) => {
  // 实现获取 Cookie 的逻辑
};

// 监听路由变化
// watch(() => route.path, (to, from) => {
//   if (to !== from) {
//     // 处理路由变化逻辑
//   }
// });

// // 监听 address 变化
// watch(address, (val, oldVal) => {
//   uni.hideLoading();
// }, { deep: true });
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.place-order {
  padding: 40rpx 30rpx 130rpx;
  margin-bottom: 40rpx;
  background: #f9f9fa;
  .custom-card {
    margin-top: 25rpx;
    .photo-upload {
      margin: 15rpx 0rpx 30rpx 15rpx;
      .title {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 25rpx;

        &::after {
          border: 0;
        }
      }
    }
  }
  :deep(.uni-easyinput) {
    .is-disabled {
      color: #333333;
      background-color: #ffffff !important;
    }
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
      right: 25rpx;
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
    width: 220rpx !important;
  }
  :deep(.uni-forms-item) {
    border-bottom: 2rpx solid #ebedf0;
    padding: 10rpx;
    margin-bottom: 0rpx;
  }

  .opinion {
    padding: 20rpx 30rpx;
    margin-bottom: 30rpx;
    background: #fff8e9;
    box-shadow: 0rpx 6rpx 8rpx 2rpx rgba(232, 225, 225, 0.3);
    border-radius: 30rpx;
    border: 2rpx solid #f2deb9;
    color: #e68c57;
    font-size: 28rpx;

    .time {
      margin-bottom: 10rpx;
    }
  }

  :deep(.uni-form) {
    .container1,
    .container2,
    .container3,
    .container4,
    .container5 {
      padding: 15rpx;
      &:last-child {
        margin-bottom: 20rpx;
      }
    }

    .container1 {
      .fba-goods {
        display: flex;
        align-items: center;
        padding: 36rpx 30rpx 36rpx;

        .title {
          flex: 1;
          font-size: 30rpx;
          color: #666;
        }

        .van-switch {
          font-size: 42rpx;
        }
      }

      .fba-goods-border {
        position: relative;

        &::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 30rpx;
          bottom: 0;
          left: 30rpx;
          border-bottom: 2rpx solid #ebedf0;
          transform: scaleY(0.5);
        }
      }
    }

    .container4 {
      padding: 30rpx 30rpx;

      .van-checkbox {
        margin-bottom: 30rpx;

        .van-checkbox__label {
          font-size: 30rpx;
        }

        .ico-unchecked {
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          background: url("../../../../assets/images/common/ico-unchecked.png")
            no-repeat;
          background-size: contain;
        }

        .ico-checked {
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          background: url("../../../../assets/images/common/ico-checked.png")
            no-repeat;
          background-size: contain;
        }
      }

      .other-property {
        padding: 20rpx 30rpx;
        margin-bottom: 20rpx;
        border-radius: 10rpx;
        border: 2rpx solid #aeaeae;

        .uni-field__control {
          text-align: left;
        }
      }
    }

    .container5 {
      .trans-count {
        .van-field__button {
          width: 160rpx;

          .select-component {
            &::after {
              border: 0;
            }

            .van-cell {
              padding: 0;

              &::after {
                border: 0;
              }
            }
          }
        }
      }

      .title {
        position: relative;
        font-size: 28rpx;
        color: #666666;
        padding: 36rpx 30rpx 30rpx;

        &::after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 30rpx;
          bottom: 0;
          left: 30rpx;
          border-bottom: 2rpx solid #ebedf0;
          transform: scaleY(0.5);
        }
      }

      // .query-price {
      //   .van-field__label {
      //     width: 240rpx;
      //   }
      // }

      .upload {
        .title {
          font-size: 36rpx;
          color: #333;
          font-weight: bold;

          &::after {
            border: 0;
          }
        }

        .content {
          margin: 12rpx 30rpx 32rpx;
        }

        .ico-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180rpx;
          height: 180rpx;
          background: #f9f9f9;
          border-radius: 6rpx 6rpx 6rpx 6rpx;
          opacity: 1;
          border: 2rpx dashed #b9b9b9;

          .ico-upload-img {
            width: 70rpx;
            height: 54rpx;
          }
        }

        .van-uploader__preview {
          margin-right: 40rpx;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
        }

        .van-uploader__preview-image {
          width: 180rpx;
          height: 180rpx;
        }

        .van-uploader__preview-delete {
          display: inline-block;
          top: -20rpx;
          right: -20rpx;
          width: 48rpx;
          height: 48rpx;
          background: url("../../../../assets/images/common/ico-upload-close.png")
            no-repeat;
          background-size: contain;
        }
      }
    }
  }
  .agreement-age {
    margin-bottom: 100rpx;
  }
  .footerBtn {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 200rpx;
    max-width: 750rpx;
    background: #ffffff;
    padding: 24rpx 0;
    text-align: center;
    box-shadow: 0rpx -4rpx 8rpx 2rpx rgba(230, 220, 220, 0.3);
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    padding-bottom: 0;
    > uni-button {
      font-size: 28rpx;
      height: 88rpx;
      width: 600rpx;
      line-height: 90rpx;
      padding: 0 30rpx;
      color: #ffffff;
      background: #df3030;
      border-radius: 50rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .order-batch {
    margin-top: 30rpx;
    // .uni-cell__title {
    //   //解决文件名过长  将下载按钮挤压
    //   overflow: hidden;
    //   white-space: nowrap;
    //   text-overflow: ellipsis;
    // }
    .container1 {
      margin: 0 30rpx;
      margin-bottom: 30rpx;
      text-align: center;

      .operat-btn {
        width: 100%;
        height: 100rpx;
        margin-top: 20rpx;
        border-radius: 100rpx;
        line-height: 100rpx;
        padding: 0 45rpx;
        font-size: 28rpx;
        color: #15ce87;
        background: #ffffff;
        border: 2rpx dashed #15ce87;
        &:last-child {
          color: #2a8dff;
          border: 2rpx dashed #2a8dff;
        }
      }
      // .upload {
      //   padding: 0 178rpx;
      //   border: 2rpx dashed #2a8dff;
      //   color: #2a8dff;
      // }
      .ico-download {
        display: inline-block;
        vertical-align: sub;
        margin-right: 32rpx;
        width: 40rpx;
        height: 40rpx;
        background: url("../../../../static/order/ico-download.png");
        background-size: contain;
      }
      .ico-upload {
        display: inline-block;
        vertical-align: sub;
        margin-right: 32rpx;
        width: 40rpx;
        height: 40rpx;
        background: url("../../../../static/order/ico-upload-btn.png");
        background-size: contain;
      }
    }
    .container2 {
      min-height: 40vh;
      width: 690rpx;
      margin-top: 30rpx;
      margin-bottom: 20rpx;
      .uni-cell {
        align-items: center;
      }
      .uni-cell__title {
        font-size: 30rpx;
        flex: 1;
      }
      .van-icon__image {
        margin-right: 20rpx;
        width: 44rpx;
        height: 48rpx;
      }
      .uni-button {
        height: 70rpx;
        background: #ffffff;
        border-radius: 36rpx;
        border: 2rpx solid #df3030;
        font-size: 22rpx;
        padding-left: 10rpx;
        padding-right: 10rpx;
        color: #df3030;
      }
      .uni-button + .uni-button {
        margin-left: 20rpx;
      }
    }
  }
}
.area-phone {
  // 去除手机区号下拉框下划线
  display: flex;
  align-items: center;
  .phone-prefix {
    color: #333333;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    margin-left: 84rpx;
    .ico-phone {
      width: 20rpx;
      height: 10rpx;
      background: url("../../../../static/common/icon-phonePreFix.png")
        no-repeat;
      background-size: contain;
      margin-left: 16rpx;
    }
  }
}
.ico-date {
  width: 33rpx;
  height: auto;
  margin-right: 10rpx;
  vertical-align: text-top;
}
</style>