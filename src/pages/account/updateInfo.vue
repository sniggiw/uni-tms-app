<template>
  <view class="page personal-info">
    <view class="header">
      <view class="photo">
        <image class="img" src="../../static/account/ico-default-Avatar.png"></image>
      </view>
      <view class="header-info">
        <view class="phone-name">
          <view class="name">{{ formData.realname }}</view>
          <view class="phone">{{ formData.regPhone }}</view>
        </view>
      </view>
    </view>

    <view class="basic-info">
      <uni-forms ref="formRef" :model="formData">
        <!-- 账号类型 -->
        <uni-forms-item :label="t('register.kind')" name="kind">
          <uni-easyinput v-model="formData.kind" disabled :clearable="false" />
        </uni-forms-item>
        <!-- 姓名 -->
        <uni-forms-item :label="t('register.realname')" name="realname"
          :rules="[{ required: true, errorMessage: t('common.require') }]" :required="true">
          <uni-easyinput v-model="formData.realname" :placeholder="t('register.realnamePlaceholder')"
            :clearable="false" />
        </uni-forms-item>
        <!-- 微信 -->
        <uni-forms-item :label="t('register.vx')">
          <uni-easyinput v-model="formData.vx" :placeholder="t('register.vxPlaceholder')" />
        </uni-forms-item>
        <!-- qq -->
        <uni-forms-item :label="t('register.qq')">
          <uni-easyinput v-model="formData.qq" :placeholder="t('register.qqPlaceholder')" />
        </uni-forms-item>
        <!-- email -->
        <uni-forms-item :label="t('register.email')">
          <uni-easyinput v-model="formData.email" :placeholder="t('register.emailPlaceholder')" />
        </uni-forms-item>
        <!-- Facebook -->
        <uni-forms-item :label="t('register.facebook')">
          <uni-easyinput v-model="formData.facebook" :placeholder="t('register.facebookPlaceholder')" />
        </uni-forms-item>
        <!-- 收货人国家 -->
        <uni-forms-item :label="t('register.country')">
          <uni-easyinput v-model="formData.areaName" disabled />
        </uni-forms-item>
        <!-- 城市 -->
        <uni-forms-item :label="t('register.cityCode')">
          <uni-data-select v-model="formData.cityCode" :localdata="cityList"
            :placeholder="t('register.cityPlaceholder')" :clear="false"></uni-data-select>
        </uni-forms-item>
        <template v-if="formData.kind == '企业'">
          <uni-forms-item :label="t('register.entKind')" :required="true">
            <uni-data-select v-model="formData.entKind" :localdata="entKind"
              :placeholder="t('register.entKindPlaceholder')" :clear="false"></uni-data-select>
          </uni-forms-item>
          <uni-forms-item :label="t('register.entName')" name="entName"
            :rules="[{ required: true, errorMessage: t('common.require') }]" :required="true">
            <uni-easyinput v-model="formData.entName" :placeholder="t('register.entNamePlaceholder')" />
          </uni-forms-item>
          <uni-forms-item :label="t('register.entNum')" name="entNum">
            <uni-easyinput v-model="formData.entNum" :placeholder="t('register.entNumPlaceholder')" />
          </uni-forms-item>
        </template>
        <!-- 推荐人电话号码 -->
        <uni-forms-item :label="t('register.recommendPhone')" name="recommendPhone">
          <uni-easyinput v-model="formData.recommendPhone" :placeholder="t('register.recommendPhonePlaceholder')"
            :disabled="!recommendDisabled" />
        </uni-forms-item>
      </uni-forms>
    </view>

    <!-- 底部修改按钮 -->
    <view class="footer-btn">
      <button :disabled="disabledBtn" @click="submitForm">{{ t('common.edit') }}</button>
    </view>

    <!-- 推荐人号码提示信息弹窗 -->
    <uni-popup ref="confirmPopup" type="dialog">
      <uni-popup-dialog :title="t('common.recommendPhoneTip')" :content="t('inquiry.popupText')" @confirm="confirmBtn"
        mode="base"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { updateCustomer, getCustomerInfoData, getDictTypes } from "@/api/common";
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// const store = useStore()
const formRef = ref("")
const confirmPopup = ref(null)
const cityCode = ref(null)

// 数据定义
const showPopup = ref(false)
const loadPage = ref(false)
const entKind = ref([])
const disabledBtn = ref(true)
const kind = ref([])
const formData = ref({
  kind: '',
  realname: '',
  vx: '',
  qq: '',
  facebook: '',
  cityCode: '',
  entKind: '',
  entName: '',
  entNum: '',
  recommendPhone: '',
  email: ""
})
const cityList = ref([])
const recommendDisabled = ref(false)
const headUrl = ref('')
const avatarInfo = ref({
  bizId: '',
  bizKind: '',
  bizName: '',
  url: '',
  ossId: '',
  isPic: '',
  path: '',
})

// 计算属性
const emailRules = computed(() => {
  return formData.value.email ? [{
    required: true,
    pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
    message: t("register.emailTips"),
    trigger: "change"
  }] : [{ required: false }]
})

// 生命周期
onMounted(() => {
  getDictTypesData()
})

// 方法
const getDictTypesData = async () => {
  try {
    const data = await getDictTypes({ dicTitles: '用户类型,用户企业类型' })
    // 客户类型
    kind.value = data.data['用户类型'].map((item) => ({
      ...item,
      text: item.name,
    }));
    if (!formData.value.kind) {
      formData.value.kind = kind.value[0].value
    }
    // 企业类型
    entKind.value = data.data['用户企业类型'].map((item) => ({
      ...item,
      text: item.name,
    }));
    getCustomerInfo()
  } catch (error) {
    // console.error(error)s
  }
}

const getCustomerInfo = async () => {
  try {
    const res = await getCustomerInfoData()
    if (res.code === 200) {
      const resData = res.data
      formData.value = resData
      headUrl.value = res.data.avatarInfo.url
      formData.value.cityCode = resData.provinceName + '-' + resData.cityName
      nextTick(() => {
        loadPage.value = true
      });
      getCityList()
      recommendDisabled.value = !(resData.recommendPhone && resData.recommendPhone !== '')
    } else {
      uni.showToast({ title: res.msg, icon: 'none', duration: 2000 })
    }
  } catch (error) {
    console.error(error)
  } finally {
    uni.hideLoading()
  }
}

const confirmBtn = async () => {
  const params = prepareSubmitData()
  try {
    const res = await updateCustomer(params)
    if (res.code === 200) {
      uni.showToast({ title: t('common.editSuccess'), duration: 2000 })
      uni.navigateBack()
    } else {
      uni.showToast({ title: res.msg, icon: 'none', duration: 2000 })
    }
  } catch (error) {
    console.error(error)
  }
}

const submitForm = () => {
  formRef.value
    .validate()
    .then((res) => {
      const params = prepareSubmitData()
      // 推荐人号码为空的情况下,弹出补充推荐人号码弹窗
      // if (recommendDisabled.value && formData.value.recommendPhone) {
      //   confirmPopup.value.open()
      // }
      updateCustomer(params).then((res) => {
        if (res.code === 200) {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 500);
        } else {
          uni.showToast(res.msg);
        }
      });
    })
    .catch((err) => {
      uni.showToast({
        title: t('common.require'),
        icon: 'none',
        duration: 2000
      })
    });
}

const prepareSubmitData = () => {
  let params = {
    baseInfo: {
      kind: formData.value.kind,
      facebook: formData.value.facebook,
      qq: formData.value.qq,
      realname: formData.value.realname,
      vx: formData.value.vx,
      provinceCode: formData.value.provinceCode,
      provinceName: formData.value.provinceName,
      cityCode: formData.value.cityCode,
      cityName: formData.value.cityName,
      recommendPhone: formData.value.recommendPhone,
      email: formData.value.email
    }
  }

  if (formData.value.kind === '企业') {
    params.entInfo = {
      entKind: formData.value.entKind,
      entName: formData.value.entName,
      entNum: formData.value.entNum
    }
  }

  return params
}

const getCityList = () => {
  // store.state.addressInfo.cityList.forEach(element => {
  //   if (formData.value.areaCode === element.areaScode) {
  //     cityList.value = element.children
  //   }
  // })
}


// 监听器
watch(
  formData,
  (newVal, oldVal) => {
    if (newVal.kind === '个人' || newVal.kind === '企业') {
      if (loadPage.value) {
        // 用户修改了之后放开按钮
        disabledBtn.value = false
      }
    }
  },
  { deep: true }
)

// watch(
//   () => store.state.addressInfo.cityList,
//   (val) => {
//     getCityList()
//   },
//   { deep: true }
// )
</script>

<style lang="scss" scoped>
.personal-info {
  padding-top: 40rpx;
  padding-bottom: 200rpx;

  .confirm-popup {
    width: 630rpx;
    height: 388rpx;
    background: url(../../static/common/confirm-popupTip.png) no-repeat;
    background-size: 630rpx 388rpx;


    .confirm-popup-content {
      margin-top: 160rpx;

      .tit {
        text-align: center;
        color: #333333;
        font-size: 32rpx;
        width: 85%;
        margin: 0 auto;
      }

      .last-btn {
        width: 330rpx;
        margin: 10rpx auto;

        .btn {
          width: 330rpx;
          height: 76rpx;
          background: #DD312F;
          border-radius: 200rpx;
          color: #FFFFFF;
        }
      }
    }
  }

  .bind {
    width: 690rpx;
    height: 100rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 4rpx 8rpx 2rpx rgba(0, 0, 0, 0.03);
    border-radius: 30rpx 30rpx 30rpx 30rpx;
    color: #666666;
    margin: 0 auto;
    margin-bottom: 80rpx;
    font-size: 28rpx;
    line-height: 100rpx;
    padding-left: 40rpx;
    display: flex;
    justify-items: center;

    .bind-right {
      position: absolute;
      right: 80rpx;

      >img {
        width: 12rpx;
        height: 24rpx;
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    padding: 30rpx 30rpx 30rpx 50rpx;

    .photo {
      position: relative;
      margin-right: 30rpx;
      width: 138rpx;
      height: 160rpx;

      .photo-bg {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 138rpx;
        height: 160rpx;
        overflow: hidden;

        background-size: contain;
        z-index: 100;
      }

      >image {
        width: 138rpx;
        height: 100%;
        border-radius: 50%;
      }
    }

    .header-info {
      .phone-name {
        font-size: 36rpx;
        font-weight: bold;
        line-height: 1;

        .phone {
          margin-top: 12rpx;
          font-size: 32rpx;
          color: #666;
          font-weight: normal;
        }
      }
    }
  }

  .basic-info {
    overflow: hidden;
    margin: 0rpx 30rpx 40rpx;
    background: #ffffff;
    box-shadow: 0rpx 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
    border-radius: 30rpx 30rpx 30rpx 30rpx;


    .captcha-image {
      padding-top: 20rpx;

      .captcha-image-btn {
        width: 160rpx;
        height: 60rpx;
        overflow: hidden;
        border-radius: 10rpx;
      }

    }

    .phone-code {
      .phone-code-button {
        color: #ffffff;
        background: #DF3030;
        border: 2rpx solid #DF3030;
        border-radius: 60rpx;
        min-width: 80rpx;
        height: 52rpx;
      }
    }

    .customer-type {
      position: relative;
      padding: 26rpx 30rpx;
      display: flex;
      align-items: center;

      &::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 32rpx;
        bottom: 0;
        left: 32rpx;
        border-bottom: 2rpx solid #ebedf0;
        transform: scaleY(0.5);
      }

      .customer-type-title {
        flex: 1;
        color: #666666;
        font-size: 30rpx;
      }

      .customer-type-value {
        display: flex;
        align-items: center;

        // .value-item {
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   width: 140rpx;
        //   height: 50rpx;
        //   margin-left: 30rpx;
        //   background: #FFFFFF;
        //   border-radius: 36rpx 36rpx 36rpx 36rpx;
        //   border: 2rpx solid #666666;
        //   font-size: 28rpx;
        //   color: #666666;
        // }

        .active {
          color: #ffffff;
          background: #DF3030;
          border: 2rpx solid #DF3030;
        }
      }
    }

    // ::v-deep .van-field__right-icon {
    //   display: flex;
    //   align-items: center;
    // }

    .ico-eye {
      display: inline-block;
      width: 48rpx;
      height: 34rpx;
      background: url('../../static/common/ico-eye.png') no-repeat;
      background-size: contain;
    }



    :deep(.uni-forms-item) {
      margin-bottom: 0rpx;
    }

    :deep(.uni-forms-item__content) {
      display: flex;
      text-align: right;

      .uni-easyinput {
        .uni-easyinput__content {
          text-align: right;
          border: 0;
          margin-right: 4rpx;
        }

        .is-disabled {
          color: #c8c9cc;
          background-color: #ffffff !important;
        }
      }


      .uni-select {
        border: none !important;
      }

      .uni-forms-item__error {
        right: 25rpx;
        top: 50rpx;
      }
    }
  }

  .customer-type {
    position: relative;
    padding: 26rpx 30rpx;
    display: flex;
    align-items: center;

    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 32rpx;
      bottom: 0;
      left: 32rpx;
      border-bottom: 2rpx solid #ebedf0;
      transform: scaleY(0.5);
    }

    .customer-type-title {
      flex: 1;
      color: #666666;
      font-size: 30rpx;
    }

    .customer-type-value {
      display: flex;
      align-items: center;

      .value-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110rpx;
        height: 50rpx;
        margin-left: 30rpx;
        background: #FFFFFF;
        border-radius: 36rpx 36rpx 36rpx 36rpx;
        border: 2rpx solid #666666;
        font-size: 28rpx;
        color: #666666;
      }

      .active {
        color: #ffffff;
        background: #DF3030;
        border: 2rpx solid #DF3030;
      }
    }
  }
}
</style>