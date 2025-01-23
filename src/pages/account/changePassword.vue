<template>
  <view class="changePassword-page">
    <view class="container">
      <uni-forms :model="form" ref="formRef">
        <uni-forms-item required label="旧密码">
          <uni-easyinput
            v-model="form.regPwd"
            :inputBorder="false"
            placeholder="请输入旧密码"
            type="password"
          />
        </uni-forms-item>
        <uni-forms-item required label="新密码">
          <uni-easyinput
            v-model="form.newPwd"
            :inputBorder="false"
            placeholder="请输入新密码"
            type="password"
          />
        </uni-forms-item>
        <uni-forms-item required label="确认密码">
          <uni-easyinput
            v-model="form.confirmPwd"
            :inputBorder="false"
            placeholder="请输入确认密码"
            type="password"
          />
        </uni-forms-item>
      </uni-forms>
    </view>
    <view class="footer-btn">
      <button :disabled="disabledBtn" @tap="onSubmit">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { changePwd,getCustomerInfoData } from "@/api/common";
import { useOtherStore, useAuthStore } from "@/stores";
const authStore = useAuthStore();
const formRef = ref(null);
const form = reactive({
  regPwd: "",
  newPwd: "",
  confirmPwd: "",
});
const disabledBtn = ref(true);
onMounted(() => {});

// 提交修改密码
const onSubmit = () => {
  if (form.newPwd !== form.confirmPwd) {
    uni.showToast({
      title: "密码输入不一样",
      duration: 2000,
      icon: "none",
    });
    return;
  }
  changePwd(form).then((res) => {
    if (res.code === 200) {
      uni.showToast({
        title: "密码修改成功",
        duration: 2000,
        icon: "none",
      });
      authStore.clearAuthInfo();
      getCustomerInfoData();
    } else {
      uni.showToast({
        title: res.msg,
        duration: 2000,
        icon: "none",
      });
    }
  });
};

watch(
  form,
  (val, oldVal) => {
    let isDisabled = false;
    for (let key in val) {
      if (!val[key]) {
        isDisabled = true;
      }
    }
    disabledBtn.value = isDisabled;
  },
  { deep: true } // 深度监听
);
</script>

<style lang="scss" scoped>
.changePassword-page {
  .container {
    padding: 40rpx 30rpx;
    position: relative;
    height: 400px;
    :deep(.uni-forms) {
      background: #ffffff;
      box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
      border-radius: 30rpx;
      .uni-easyinput__content {
        text-align: right;
        border: 0;
        padding-right: 20rpx;
      }
    }
  }
}
</style>