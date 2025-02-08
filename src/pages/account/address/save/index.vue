<template>
  <view class="address-add">
    <view class="add-deliver-goods">
      <uni-forms :model="form" ref="formRef">
        <view class="custom-card container1">
          <uni-forms-item label="发货人" required>
            <uni-easyinput :inputBorder="false" placeholder="请输入发货人" />
          </uni-forms-item>
          <uni-forms-item label="发货人电话" required>
            <view class="area-phone">
              <view class="phone-prefix">
                <view>+86</view>
                <view class="ico-phone"></view>
              </view>
              <uni-easyinput placeholder="请输入发货人电话" />
            </view>
          </uni-forms-item>
          <uni-forms-item label="所在地区" required>
            <uni-easyinput :inputBorder="false" placeholder="请选择所在地区" />
          </uni-forms-item>
          <uni-forms-item label="详细地址" required>
            <uni-easyinput :inputBorder="false" placeholder="请输入详细地址" />
          </uni-forms-item>
        </view>
      </uni-forms>
    </view>
    <view class="footer-btn">
      <button @tap="onSubmit">保存</button>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
// import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
// import Api from "@/api/index.js";
// import SelectComponent from "@/components/selectComponent";
// import utils from "@/assets/js/utils";

// const store = useStore();
const route = useRoute();
const router = useRouter();

const kind = ref(route.query.kind); // 1 发货 2 收货
const kindName = reactive({
  发货人: "consignor", // 发货
  收货人: "consignee", // 收货
});
// const patternPhone = ref(utils.regExp.phone);
const showPicker = ref(false);
const form = reactive({
  kind: route.query.kind,
  realname: "",
  phone1: "",
  area: "",
  phone2: "",
  phone3: "",
  addr: "",
  cityCode: "", // 市编码
  cityName: "", // 市名称
  countryCode: "", // 国家编码
  countryName: "", // 国家名称
  provinceCode: "", // 省份编码
  provinceName: "", // 省份名称
  phonePrefix: "+86", // 手机号码前缀
});
const addAddreeePreFixForm = reactive({
  kind: route.query.kind,
  realname: "",
  phone1: "",
  area: "",
  phone2: "",
  phone3: "",
  addr: "",
  cityCode: "", // 市编码
  cityName: "", // 市名称
  countryCode: "", // 国家编码
  countryName: "", // 国家名称
  provinceCode: "", // 省份编码
  provinceName: "", // 省份名称
  phonePrefix: "+86", // 手机号码前缀
});
const params = reactive({
  lang: "en",
  level: "1",
});
const phonePrefixParams = reactive({
  lang: "zh",
  level: "1",
});
const city = ref([]); //收货人城市
const detailAddresss = ref({}); // 详情
const areaPhonePre = ref([]);
const lang = ref("");
const phonePreFixPage = ref("");

const showToast = (message, duration = 2000) => {
  uni.showToast({ title: message, icon: "none", duration });
};
// const addressInfo = computed(() => store.state.addressInfo);

onMounted(() => {
  console.log("@@", kind.value);
  // if (route.query.id) {
  //   // 编辑发货、收货地址情况
  //   getDetailAddresss();
  //   setTimeout(() => {
  //     phonePreFixPage.value = "saveAddressList";
  //     // let departure = utils.getStore("savePhonePrefix"); // 国家手机区号-编辑地址
  //     if (departure) {
  //       form.phonePrefix = departure;
  //       // setTimeout(() => {
  //       //   utils.removeStore("savePhonePrefix"); //赋值完及时清除
  //       // }, 150);
  //     }
  //   }, 400);
  // } else {
  //   phonePreFixPage.value = "addressList";
  // }
  // getCity();
  // getPhonePrefix();
  // lang.value = localStorage.getItem("lang");

  // // let phonePrefix = utils.getStore("addPhonePrefix");
  // if (phonePrefix) {
  //   // 国家手机区号-新增地址
  //   form.phonePrefix = phonePrefix;
  //   // setTimeout(() => {
  //   //   utils.removeStore("addPhonePrefix"); //赋值完及时清除
  //   // }, 150);
  // }
  // if (JSON.parse(localStorage.getItem("addAddressData")) != null) {
  //   Object.assign(
  //     addAddreeePreFixForm,
  //     JSON.parse(localStorage.getItem("addAddressData"))
  //   );
  //   form.realname = addAddreeePreFixForm.realname;
  //   form.phone1 = addAddreeePreFixForm.phone1;
  //   form.area = addAddreeePreFixForm.area;
  //   form.phone2 = addAddreeePreFixForm.phone2;
  //   form.phone3 = addAddreeePreFixForm.phone3;
  //   form.addr = addAddreeePreFixForm.addr;
  //   form.cityCode = addAddreeePreFixForm.cityCode;
  //   form.cityName = addAddreeePreFixForm.cityName;
  //   form.countryCode = addAddreeePreFixForm.countryCode;
  //   form.countryName = addAddreeePreFixForm.countryName;
  //   form.provinceCode = addAddreeePreFixForm.provinceCode;
  //   form.provinceName = addAddreeePreFixForm.provinceName;
  // }
});

watch(
  form,
  (val, oldval) => {
    if (!route.query.id) {
      localStorage.setItem("addAddressData", JSON.stringify(form));
    }
  },
  { deep: true }
);

const jumpPhonePreFix = () => {
  getParams(); // 城市下拉框赋值
  setTimeout(() => {
    router.push({
      path: "/address/phone",
      query: {
        lang: lang.value,
        page: phonePreFixPage.value,
        kind: kind.value,
      },
    });
  }, 150);
};

const getPhonePrefix = () => {
  Api.getCity(phonePrefixParams).then((res) => {
    if (res.code === 200) {
      res.data.forEach((element) => {
        areaPhonePre.value.push({
          //登录页手机号码前缀数据
          areaPhonePre: element.phonePrefix,
        });
      });
    }
  });
};

const getCity = () => {
  Api.getCity(params).then((res) => {
    if (res.code === 200) {
      city.value = [...city.value, ...res.data];
    } else {
      showToast(res.msg);
    }
  });
};

const getDetailAddresss = () => {
  Api.getDetailContract({ id: route.query.id }).then((res) => {
    if (res.code === 200) {
      const resData = res.data;
      Object.assign(form, resData);

      if (resData.phonePrefix == null) {
        form.phonePrefix = "+86";
      }
    } else {
      showToast(res.msg);
    }
  });
};

const validator = (val) => {
  return /1\d{10}/.test(val);
};

const clean = () => {
  form.provinceCode = "";
  form.provinceName = "";
  form.area = "";
};

const onSubmit = () => {
  getParams();
  if (form.id) {
    // 编辑
    editAddressMethod();
  } else {
    // 新增
    addAddressMethod();
  }
};

const addAddressMethod = () => {
  $loading.show();
  Api.addContract(form).then((res) => {
    $loading.hide();
    if (res.code === 200) {
      // showToast($t("common.saveSuccess"));
      router.go(-1);
      localStorage.removeItem("addAddressData");
    } else {
      showToast(res.msg);
    }
  });
};

const editAddressMethod = () => {
  $loading.show();
  Api.editContract(form).then((res) => {
    $loading.hide();
    if (res.code === 200) {
      // showToast($t("common.saveSuccess"));
      router.go(-1);
    } else {
      showToast(res.msg);
    }
  });
};

const getParams = () => {
  // 城市数据
  let address = $refs.area.getValues();
  if (address) {
    address.forEach((element, index) => {
      if (index === 0) {
        form.countryCode = element.areaCode;
        form.countryName = element.areaName;
      } else if (index === 1) {
        form.provinceCode = element.areaCode;
        form.provinceName = element.areaName;
      } else if (index === 2) {
        form.cityCode = element.areaCode;
        form.cityName = element.areaName;
      }
    });
  }
};

onBeforeUnmount(() => {
  localStorage.removeItem("addAddressData");
});
</script>


<style lang="scss" scoped>
.address-add {
  .add-deliver-goods {
    .container1 {
      padding: 15rpx;
      margin: 40rpx;
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
        .uni-switch-wrapper {
          display: flex;
          justify-content: flex-end;
        }
        .select-switch {
          position: absolute;
          right: 10rpx;
        }
        .uni-forms-item__error {
          right: 25rpx;
          top: 50rpx;
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
              margin-top: 8rpx;
            }
          }
        }
      }
      :deep(.uni-forms-item) {
        padding: 10rpx;
        margin-bottom: 0rpx;
      }
    }
  }
}
</style>