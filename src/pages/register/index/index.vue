<template>
  <view class="page personal-info">
    <uni-forms ref="formRef" :model="formData">
      <template v-if="formData.regInfo.areaPhonePrefix === '+86'">
        <!-- 手机号码 -->
        <section class="basic-info">
          <uni-forms-item :label="$t('register.regPhone')" :name="['regInfo', 'regPhone']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <view class="area-phone">
              <view class="phone-prefix" @tap="jumpPhonePreFix('register')">
                <view>{{ formData.regInfo.areaPhonePrefix }}</view>
                <view class="ico-phone"></view>
              </view>
              <uni-easyinput v-model.number="formData.regInfo.regPhone" type="number"
                :placeholder="$t('register.regPhonePlaceholder')">
              </uni-easyinput>
            </view>
          </uni-forms-item>

          <uni-forms-item :label="$t('register.captchaImage')" v-if="formData.baseInfo.facebook != '2331'" required>
            <uni-easyinput v-model="captchaImage.code" :placeholder="$t('register.captchaImagePlaceholder')">
              <template #right>
                <img class="captcha-image-btn" :src="captchaImage.img" @tap="commonCaptchaImageData" />
              </template>
            </uni-easyinput>
          </uni-forms-item>

          <template v-if="formData.baseInfo.facebook != '2331'">
            <uni-forms-item :label="$t('register.phoneCode')" :name="['regInfo', 'code']"
              :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
              <uni-easyinput v-model="formData.regInfo.code" :placeholder="$t('register.phoneCodePlaceholder')">
                <template #right>
                  <button size="mini" class="phone-code-button" :disabled="captchaImage.phoneCodeButton"
                    @tap="commonCaptchaPhoneData">{{ captchaImage.phoneCodeButtonText }}</button>
                </template>
              </uni-easyinput>
            </uni-forms-item>
          </template>

          <uni-forms-item :label="$t('register.regPwd')" :name="['regInfo', 'regPwd']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <uni-easyinput v-model="formData.regInfo.regPwd" type="password"
              :placeholder="$t('register.regPwdPlaceholder')" @blur="checkPassword" />
          </uni-forms-item>

          <uni-forms-item :label="$t('changePassword.confirmPwd')" :name="['regInfo', 'confirmPwd']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <uni-easyinput v-model="formData.regInfo.confirmPwd" type="password"
              :placeholder="$t('changePassword.confirmPwdPlaceholder')" @blur="checkPassword" />
          </uni-forms-item>
        </section>
      </template>
      <!-- 非+86国家的表单内容 -->
      <template v-else>
        <!-- 手机号码 -->
        <section class="basic-info">
          <uni-forms-item :label="$t('register.regPhone')" :name="['regInfo', 'regPhone']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <view class="area-phone">
              <view class="phone-prefix" @tap="jumpPhonePreFix('register')">
                <view>{{ formData.regInfo.areaPhonePrefix }}</view>
                <view class="ico-phone"></view>
              </view>
              <uni-easyinput v-model.number="formData.regInfo.regPhone" type="number"
                :placeholder="$t('register.regPhonePlaceholder')">
              </uni-easyinput>
            </view>
          </uni-forms-item>
          <uni-forms-item :label="$t('register.regPwd')" :name="['regInfo', 'regPwd']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <uni-easyinput v-model="formData.regInfo.regPwd" type="password"
              :placeholder="$t('register.regPwdPlaceholder')" @blur="checkPassword" />
          </uni-forms-item>
          <uni-forms-item :label="$t('changePassword.confirmPwd')" :name="['regInfo', 'confirmPwd']"
            :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
            <uni-easyinput v-model="formData.regInfo.confirmPwd" type="password"
              :placeholder="$t('changePassword.confirmPwdPlaceholder')" @blur="checkPassword" />
          </uni-forms-item>
        </section>
      </template>
      <!-- 用户信息 -->
      <section class="basic-info">
        <uni-forms-item :label="$t('register.kind')">
          <view class="customer-type-value">
            <view class="value-item" :class="{ active: formData.baseInfo.kind == item.value }"
              v-for="(item, index) in kind" :key="index" @tap="formData.baseInfo.kind = item.value">
              {{ item.name }}
            </view>
          </view>
        </uni-forms-item>
        <uni-forms-item :label="$t('register.realname')" :name="['baseInfo', 'realname']"
          :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
          <uni-easyinput v-model="formData.baseInfo.realname" :placeholder="$t('register.realnamePlaceholder')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.vx')">
          <uni-easyinput v-model="formData.baseInfo.vx" :placeholder="$t('register.vxPlaceholder')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.email')">
          <uni-easyinput v-model="formData.baseInfo.email" :placeholder="$t('register.emailPlaceholder')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.qq')">
          <uni-easyinput v-model="formData.baseInfo.qq" :placeholder="$t('register.qqPlaceholder')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.facebook')">
          <uni-easyinput v-model="formData.baseInfo.facebook" :placeholder="$t('register.facebookPlaceholder')" />
        </uni-forms-item>
        <!-- <select-component :label="$t('register.cityCode')" v-model="formData.cityCode" ref="cityCode"
          :needToSearch="true" :searchTip="$t('common.areaTip')" :placeholder="$t('register.cityPlaceholder')"
          rightIcon="arrow" :columns="cityData" nameKey="areaName"
          :requireContent="formData.regInfo.areaPhonePrefix === '+86/中国' || formData.regInfo.areaPhonePrefix === '+86/China'">
        </select-component> -->
      </section>
      <!-- 企业信息 -->
      <section class="basic-info" v-if="formData.baseInfo.kind == '企业'">
        <uni-forms-item :label="$t('register.entKind')" :name="['entInfo', 'entKind']"
          :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
          <uni-data-select v-model="formData.entInfo.entKind" :localdata="entKind"
            :placeholder="$t('register.entKindPlaceholder')" :clear="false" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.entName')" :name="['entInfo', 'entName']"
          :rules="[{ required: true, errorMessage: $t('common.require') }]" required>
          <uni-easyinput v-model="formData.entInfo.entName" :placeholder="$t('register.entNamePlaceholder')" />
        </uni-forms-item>
        <uni-forms-item :label="$t('register.entNum')">
          <uni-easyinput v-model="formData.entInfo.entNum" :placeholder="$t('register.entNumPlaceholder')" />
        </uni-forms-item>
      </section>
      <!-- 推荐人号码 -->
      <section class="basic-info">
        <uni-forms-item :label="$t('register.recommendPhone')">
          <uni-easyinput v-model="formData.recommendPhone" :disabled="!!recommendPhone"
            :placeholder="$t('register.recommendPhonePlaceholder')" />
        </uni-forms-item>
      </section>
      <!-- 阅读协议单选框 -->
      <view class="agress_con">
        <text class="checkbox" :class="{ checked: checked }" @tap="check"></text>
        <p>
          <text @tap="check">{{ $t('register.protocolText') }}</text>
          <text class="agreement-name" v-for="(item, index) in argeementList" :key="index"
            @tap="openBottomPopup(item)">《{{
              item.contentKind }}》</text>
        </p>
      </view>
      <!-- 立即注册 -->
      <view class="footer-btn" id="registerSubmit">
        <button @tap="aplyInfo">{{ $t('register.submit') }}</button>
      </view>
    </uni-forms>
    <!-- 阅读协议弹窗 -->
    <uni-popup ref="popupRef" type="bottom">
      <view class="popup-content">
        <uni-segmented-control :current="activeTabIndex" :values="argeementList.map(item => item.contentKind)"
          @clickItem="tabsClick" styleType="text" activeColor="#df3030" :mask-tap="false"></uni-segmented-control>
        <view class="content">
          <view class="agreement" v-if="activeTabIndex === 0">
            <view v-for="(item, index) in privacyAgreement" :key="index">
              <view v-html="item.content"></view>
            </view>
          </view>
          <view class="agreement" v-if="activeTabIndex === 1">
            <view v-for="(item, index) in registrationAgreement" :key="index">
              <view v-html="item.content"></view>
            </view>
          </view>
          <view class="agreement" v-if="activeTabIndex === 2">
            <view v-for="(item, index) in logisticsAgreement" :key="index">
              <view v-html="item.content"></view>
            </view>
          </view>
        </view>
        <view class="footer-btn">
          <button @tap="agreementClick" class="button1">{{ $t('common.confirmRegister') }}</button>
          <button @tap="notAgreement" class="button2">{{ $t('common.notConfirmRegister') }}</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
// import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getDictTypes, commonListArgeement } from "@/api/common";
import { commonCaptchaImage, commonCaptchaPhone, registerSubmit } from "@/api/register";
import { useI18n } from 'vue-i18n';
import { getStore, removeStore } from "@/utils/index";
// import Cookies from "js-cookie"
const { t } = useI18n()
const route = useRoute()
const lang = ref(uni.getStorageSync('lang') || 'zh_CN')
const confirmButton = ref(true)
const privacyButton = ref(false)
const registeredButton = ref(false)
const logisticsButton = ref(false)
const timer = ref(null)
const btnText = ref('')
const count = ref(10)
const btnStyle = ref(true)
const activeLast = ref(0)
const kind = ref([])
const entKind = ref([])
const argeementList = ref([])
const disabledBtn = ref(false)
const checked = ref(false)
const recommendPhone = ref(route.query.recommendPhone)
const formRef = ref(null)
const popupRef = ref(null)
const activeTabIndex = ref(0)
const captchaImage = reactive({
  uuid: '',
  img: '',
  code: '',
  phoneCodeButton: false,
  phoneCodeButtonText: t('register.sendOut'),
  time: 60
})

const formData = reactive({
  baseInfo: {
    cityCode: '',
    cityName: '',
    facebook: '',
    provinceCode: '',
    provinceName: '',
    kind: '',
    qq: '',
    realname: '',
    vx: '',
    email: ""
  },
  entInfo: {
    entKind: '',
    entName: '',
    entNum: ''
  },
  regInfo: {
    code: '',
    areaCode: '',
    areaName: '',
    areaPhonePrefix: '+86',
    confirmPwd: '',
    regPhone: '',
    regPwd: ''
  },
  recommendPhone: route.query.recommendPhone
})

const regInfo = ref({
  areaPhonePrefix: '+86',
  code: '',
  newPwd: '',
  confirmPwd: '',
  regPhone: '',
})

const cityData = ref([])
const cityAreaCode = ref('')
const privacyAgreement = ref([])
const registrationAgreement = ref([])
const logisticsAgreement = ref([])
// 计算属性
// const emailRules = computed(() => {
//   return formData.baseInfo.email
//     ? [{
//       required: true,
//       pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
//       message: t("register.emailTips"),
//       trigger: "onChange",
//     }]
//     : [{ required: false }]
// })

// const emailRules = computed(() => {
//   return formData.baseInfo.email
//     ? [
//       {
//         required: true,
//         pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
//         errorMessage: t('register.emailTips'),
//         trigger: 'blur'  // 改为 blur 或 change
//       }
//     ]
//     : []
// })

// 监听器
watch(formData, (val) => {
  uni.setStorageSync('data', JSON.stringify(formData))
}, { deep: true })

// 生命周期
onMounted(() => {
  initData()

})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
})

const showToast = (message, duration = 2000) => {
  uni.showToast({ title: message, icon: "none", duration });
};

const jumpPhonePreFix = (pageKind) => {
  uni.navigateTo({
    url: `/pages/inquiry/components/phonePreFix/index?pageKind=${pageKind}&lang=${lang.value}`,
  });
};

const openBottomPopup = (item) => {
  popupRef.value.open()
  if (item.contentKind === '隐私协议' || item.contentKind === 'Privacy Agreement') {
    activeTabIndex.value = 0
  } else if (item.contentKind === '注册协议' || item.contentKind === 'User Registration Agreement') {
    activeTabIndex.value = 1
  } else if (item.contentKind === '物流协议' || item.contentKind === 'Logistics Agreement') {
    activeTabIndex.value = 2
  }
}

// 方法
const initData = () => {
  uni.showLoading();
  getDictTypes({ dicTitles: '用户类型,用户企业类型' }, (data) => {
    uni.hideLoading();
    kind.value = data['用户类型'].map((item) => ({
      ...item,
      text: item.name,
    }));
    formData.baseInfo.kind = kind.value[0].value
    entKind.value = data['用户企业类型'].map((item) => ({
      ...item,
      text: item.name,
    }));
  })

  commonCaptchaImageData()
  argeementListData()
  commonListArgeementData()
  registrationAgreementData()
  logisticsAgreementData()
  confirmButton.value = true
  btnStyle.value = true
  btnText.value = t('common.confirmRegister') + `(${count.value}s)`

  // 初始化本地存储数据
  // getData.value = JSON.parse(uni.getStorageSync('data'))
  // phone.value = JSON.parse(uni.getStorageSync('phone'))

  // if (phone.value != route.query.recommendPhone) {
  //   localStorage.removeItem("data")
  // } else if (getData.value != null) {
  //   Object.assign(formData, getData.value)
  // }
}

// const countDown = () => {
//   confirmButton.value = true
//   timer.value = setInterval(() => {
//     count.value = count.value - 1
//     btnText.value = t('common.confirmRegister') + `(${count.value}s)`

//     if (count.value <= 0) {
//       count.value = 0
//       clearInterval(timer.value)
//       timer.value = null
//       disabledBtn.value = false
//       btnStyle.value = false
//       confirmButton.value = false
//       btnText.value = t('common.confirmRegister')
//     }
//   }, 1000)
// }

// const showAgreementButton = () => {
//   if (activeTabIndex.value === '隐私协议' || activeTabIndex.value === 'Privacy Agreement') {
//     activeLast.value = 0
//   } else if (activeTabIndex.value === '注册协议' || activeTabIndex.value === 'User Registration Agreement') {
//     activeLast.value = 1

//   } else if (activeTabIndex.value === '物流协议' || activeTabIndex.value === 'Logistics Agreement') {
//     activeLast.value = 2

//   }
//   showToast(t('register.read'))
// }

const tabsClick = (name) => {
  activeTabIndex.value = name.currentIndex
}

// 我已阅读协议
const agreementClick = () => {
  checked.value = true
  popupRef.value.close()
}

// 我不同意协议
const notAgreement = () => {
  checked.value = false
  popupRef.value.close()
}

const check = () => {
  popupRef.value.open()
}

const commonCaptchaImageData = async () => {
  try {
    const res = await commonCaptchaImage()
    if (res.code === 200) {
      captchaImage.uuid = res.data.uuid
      captchaImage.img = 'data:image/gif;base64,' + res.data.img
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const commonCaptchaPhoneData = async () => {
  if (!formData.regInfo.regPhone) {
    showToast(t('register.regPhonePlaceholder'))
    return
  }
  if (!captchaImage.code) {
    showToast(t('register.captchaImagePlaceholder'))
    return
  }

  const captcha = formData.regInfo.areaPhonePrefix
  const params = {
    areaPhonePrefix: captcha,
    code: captchaImage.code,
    regPhone: formData.regInfo.regPhone,
    uuid: captchaImage.uuid,
    captchaKind: '1'
  }

  uni.showLoading();
  try {
    const res = await commonCaptchaPhone(params)
    uni.hideLoading();
    if (res.code === 200) {
      captchaImage.phoneCodeButtonText = captchaImage.time + 's'
      captchaImage.phoneCodeButton = true
      const setInt = setInterval(() => {
        captchaImage.time = captchaImage.time - 1
        captchaImage.phoneCodeButtonText = captchaImage.time + 's'
        if (captchaImage.time <= 0) {
          captchaImage.phoneCodeButton = false
          captchaImage.phoneCodeButtonText = t('register.resend')
          captchaImage.time = 60
          clearInterval(setInt)
        }
      }, 1000)
    } else {
      commonCaptchaImageData()
    }
    showToast(res.msg)
  } catch (error) {
    uni.hideLoading();
    console.error(error)
  }
}

const aplyInfo = async () => {
  if (formData.regInfo.regPwd !== formData.regInfo.confirmPwd) {
    showToast(t('register.confirmPwdTip'))
    return
  }
  if (!checked.value) {
    showToast(t('register.protocolTips'))
    return
  }
  formRef.value
    .validate()
    .then((res) => {
      uni.showLoading();
      registerSubmit(formData).then((res) => {
        uni.hideLoading();
        if (res.code === 200) {
          // Cookies.set("userLoginInfo", JSON.stringify({ authToken: res.data.token }), { expires: 7 })
          // Cookies.set("loginToken", res.data.token, { expires: 7 })
          // uni.removeStorage("data")
          showToast(t('register.submitSuccess'))
          uni.showToast({
            title: "注册成功",
            duration: 1500,
            icon: "none",
            success: () => {
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/index/index",
                });
              }, 1500);
            },
          });
        } else {
          showToast(res.msg)
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



const changeAreaPhonePrefix = (data) => {
  formData.cityCode = null
  data.forEach(element => {
    cityAreaCode.value = element.areaCode
    formData.regInfo.areaPhonePrefix = element.phonePrefix
  })

  addressInfo.value.cityList.forEach(element => {
    if (cityAreaCode.value === element.areaCode) {
      cityData.value = element.children
    }
  })
}

const argeementListData = async () => {
  try {
    uni.showLoading();
    const res = await commonListArgeement({ contentKind: '注册协议,隐私协议,物流协议' })
    uni.hideLoading();
    if (res.code === 200) {
      argeementList.value = res.data
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const commonListArgeementData = async () => {
  try {
    uni.showLoading();
    const res = await commonListArgeement({ contentKind: '隐私协议' })
    uni.hideLoading();
    if (res.code === 200) {
      privacyAgreement.value = res.data
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const registrationAgreementData = async () => {
  try {
    uni.showLoading();
    const res = await commonListArgeement({ contentKind: '注册协议' })
    uni.hideLoading();
    if (res.code === 200) {
      registrationAgreement.value = res.data
      // argeementList.value.forEach(item=>{
      //   if(item.contentKind == '隐私协议'){
      //     privacyAgreement.value = item.content
      //   }else if(item.contentKind == '隐私协议'){
      //     privacyAgreement.value = item.content
      //   }else if(item.contentKind == '物流协议'){
      //     privacyAgreement.value = item.content
      //   }
      // })
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const logisticsAgreementData = async () => {
  try {
    uni.showLoading();
    const res = await commonListArgeement({ contentKind: '物流协议' })
    uni.hideLoading();
    if (res.code === 200) {
      logisticsAgreement.value = res.data
    } else {
      showToast(res.msg)
    }
  } catch (error) {
    console.error(error)
  }
}

const checkPassword = () => {
  if (formData.regInfo.regPwd && formData.regInfo.confirmPwd && formData.regInfo.regPwd !== formData.regInfo.confirmPwd) {
    showToast(t('register.confirmPwdTip'))
  }
}

// 手机号码区号
watch(
  () => route.path,
  (to, from) => {
    if (to !== from) {
      const phonePrefix = getStore("registerPhonePrefix");
      if (phonePrefix) {
        formData.regInfo.areaPhonePrefix = phonePrefix;
        setTimeout(() => {
          removeStore("registerPhonePrefix");
        }, 150);
      }
    }
  }
);
</script>

<style lang="scss" scoped>
.personal-info {
  padding-bottom: 192rpx;
  position: relative;
  top: -40rpx;
  left: 0;
  border-radius: 40rpx 40rpx 0 0;
  background: #F9F9FA;

  :deep(.uni-forms) {
    padding-top: 70rpx;
  }

  .basic-info {
    overflow: hidden;
    margin: 0 30rpx 40rpx;
    background: #ffffff;
    box-shadow: 0 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
    border-radius: 30rpx;

    // .reg-phone {
    //   ::v-deep>.van-field__label {
    //     width: 380rpx;
    //   }

    //   ::v-deep .select-component {
    //     &::after {
    //       border: 0;
    //     }

    //     .select-cell {
    //       padding: 0;

    //       &::after {
    //         border: 0;
    //       }
    //     }
    //   }
    // }
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
          margin-right: 10rpx;
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
            background: url("../../../../static/common/icon-phonePreFix.png") no-repeat;
            background-size: contain;
            margin-left: 16rpx;
          }
        }
      }

      .captcha-image-btn {
        width: 160rpx;
        height: 60rpx;
        overflow: hidden;
        border-radius: 10rpx;
      }

      .phone-code-button {
        color: #ffffff;
        background: #DF3030;
        border: 2rpx solid #DF3030;
        border-radius: 60rpx;
        min-width: 80rpx;
        height: 52rpx;
        line-height: 52rpx;
      }

      .customer-type-value {
        display: flex;
        align-items: center;
        position: absolute;
        right: 8rpx;
        top: 10rpx;

        .value-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150rpx;
          height: 50rpx;
          margin-left: 30rpx;
          background: #FFFFFF;
          border-radius: 36rpx;
          border: 1px solid #666666;
          font-size: 28rpx;
          color: #666666;
        }

        .active {
          color: #ffffff;
          background: #DF3030;
          border: 1px solid #DF3030;
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
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
      }

      .customer-type-title {
        flex: 1;
        color: #666666;
        font-size: 30rpx;
      }


    }
  }

  .recommendPhone {
    // /deep/.van-field__label {
    //   width: 310rpx;
    // }
  }

  .agress_con {
    position: relative;
    padding-left: 76rpx;
    padding-bottom: 30rpx;
    color: #666666;
    font-size: 26rpx;
    text-align: left;

    a {
      color: #ff722c;
    }

    .checkbox {
      position: absolute;
      left: 36rpx;
      top: 0;
      display: block;
      width: 32rpx;
      height: 32rpx;
      background: url('../../../static/common/unchecked.png') no-repeat;
      background-size: contain;

      &.checked {
        background: url('../../../static/common/checked.png') no-repeat;
        background-size: contain;
      }
    }

    .agreement-name {
      margin-left: 10rpx;
      color: #2B7BFA;
    }

    .agree {
      width: 500rpx;
      margin: -34rpx 150rpx;
    }
  }

  .footer-btn {
    bottom: 0;
  }
}

.uni-popup {
  overflow: hidden;

  .bg {
    height: 40rpx;
    background: #DF3030;
  }

  :deep(.popup-content) {
    height: 87vh;
    background: #ffffff;
    border-radius: 40rpx 40rpx 0px 0px;

    .content {
      position: relative;
      top: 0rpx;
      left: 0;
      // background: red;
      overflow-y: auto;
      height: 100%;
      border-radius: 40rpx 40rpx 0px 0px;
      padding: 30rpx 20rpx 320rpx;
      font-size: 28rpx;
      color: #666;

      .agreement {
        background: #FFFFFF;
        padding: 30rpx;
        box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
        border-radius: 30rpx;
        text-indent: 2em;
        white-space: pre-wrap;
        margin-bottom: 20rpx;
      }
    }

    .footer-btn {
      bottom: 0;
      // height: 360rpx;
      display: flex;
      align-items: center;

      >view {
        font-size: 28rpx;
      }

      .button1 {
        width: 300rpx;
        margin-left: 20rpx;
      }

      .button2 {
        width: 300rpx;
        margin-left: 60rpx;
      }
    }
  }
}
</style>