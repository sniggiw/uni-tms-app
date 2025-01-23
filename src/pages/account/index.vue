<template>
  <view class="my-info">
    <view class="header">
      <view class="header-content">
        <view class="content-top">
          <view class="content-left">
            <image
              class="img"
              src="../../static/account/ico-default-Avatar.png"
            ></image>
            <!-- <uni-file-picker
              :before-upload="beforeUpload"
              :after-upload="afterUpload"
              :limit="1"
              class="img"
            >
              <image v-if="headUrl" :src="headUrl" class="img"></image>
              <image
                class="img"
                v-else
                src="../../static/account/ico-default-Avatar.png"
              ></image>
            </uni-file-picker> -->
          </view>
          <view class="content-right">
            <text class="name">{{ customerInfo.realname }}</text>
            <view class="right-bottom"> ID:{{ customerInfo.userId }} </view>
          </view>
        </view>
      </view>
      <view class="last-bottom">
        <view>
          <view class="num">0.00</view>
          <view class="title">余额</view>
        </view>
        <view>
          <view class="num">0</view>
          <view class="title">积分</view>
        </view>
        <view>
          <view class="num">0</view>
          <view class="title">余额</view>
        </view>
        <image src="../../static/account/ico-myInfo.png"></image>
      </view>
    </view>
    <view class="manage-box">
      <view @tap="jumpPending">
        <view
          ><image src="../../static/account/ico-orderlist.png"></image
        ></view>
        <view class="title">待我处理</view>
      </view>
      <view @tap="jumpProcess">
        <view
          ><image src="../../static/account/ico-processing.png"></image
        ></view>
        <view class="title">后台处理中</view>
      </view>
      <view @tap="jumpComplete">
        <view><image src="../../static/account/ico-complete.png"></image></view>
        <view class="title">已完成</view>
      </view>
      <view @tap="jumpOrderTrack">
        <view
          ><image src="../../static/account/ico-queryTrack.png"></image
        ></view>
        <view class="title">订单轨迹</view>
      </view>
    </view>

    <view class="bottom">
      <view @tap="jumpState">
        <i class="ico-statistical"></i>
        <view class="title">订单统计</view>
      </view>
      <view @tap="jumpChangePassword">
        <view class="ico-updatePassword"></view>
        <view class="title">修改密码</view>
      </view>
      <view @tap="jumpUpdateInfo">
        <view class="ico-updateData"></view>
        <view class="title">更新资料</view>
      </view>
      <view @tap="jumpShipper">
        <view class="ico-shipAddr"></view>
        <view class="title">发货人管理</view>
      </view>
      <view @tap="jumpConsignee">
        <view class="ico-deliveryAddr"></view>
        <view class="title">收货人管理</view>
      </view>
      <view @tap="logoutNow">
        <view class="ico-logout"></view>
        <view class="title">系统退出</view>
      </view>
      <!--<view @tap="toJumpReferrer">
        <view class="ico-myReferrer"></view>
        <view class="title">{{ $t("myInfo.myReferrer") }}</view>
      </view>
      <view @tap="toJumpPlatform">
        <view class="ico-platform"></view>
        <view class="title">{{ $t("myInfo.platform") }}</view>
      </view>
      <view @tap="jumpPrivacy">
        <view class="ico-privacy"></view>
        <view class="title">{{ $t("router.privacy") }}</view>
      </view>
      <view @tap="cancel">
        <view class="ico-cancel"></view>
        <view class="title">{{ $t("myInfo.cancel") }}</view>
      </view>
     
      <view
        @tap="jumpOfficer"
        v-if="distributorId != null && distributorId != ''"
      >
        <view class="ico-officer"></view>
        <view class="title">{{ $t("myInfo.officer") }}</view>
      </view>
      <view @tap="getOfficerToast" v-else>
        <view class="ico-officer"></view>
        <view class="title">{{ $t("myInfo.officer") }}</view>
      </view>
      <view
        @tap="jumpReportCard"
        v-if="
          distributorId != null && distributorLevel != 0 && distributorId != ''
        "
      >
        <view class="ico-reportCard"></view>
        <view class="title">{{ $t("myInfo.reportCard") }}</view>
      </view>
      <view @tap="jumpApi">
        <view class="ico-api"></view>
        <view class="title">{{ $t("router.apiSetup") }}</view>
      </view>
      <view @tap="jumpMarketHome">
        <view class="ico-market"></view>
        <view class="title">{{ $t("myInfo.market") }}</view>
      </view>
      <view @tap="jumpAddress">
        <view class="ico-warehouse"></view>
        <view class="title">{{ $t("myInfo.collectionAddress") }}</view>
      </view> -->
    </view>
    <uni-popup ref="passwordPopup" type="dialog">
      <view class="confirm-popup-content">
        <view class="tit">{{ $t(`changePassword.thirdTips`) }}</view>
        <view class="last-btn">
          <button class="btn" @tap="jumpChangePassword">
            {{ $t("common.setUp") }}
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomerInfoData } from "@/api/common";
import { useOtherStore, useAuthStore } from "@/stores";
// import { useRouter, useStore } from "vue-router";
// import Api from "@/api/index.js";
// import Compressor from "compressorjs";
// import Cookies from "js-cookie";

// const router = useRouter();
// const store = useStore();

const customerInfo = ref({}); // 用户信息
const myInfoImage = ref([]); // 头像
const userPhone = ref(""); // 获取用户电话
const userName = ref(""); // 获取用户名
const lang = ref("");
const distributorId = ref(""); // 分销官id
const distributorLevel = ref("");
const passwordPopup = ref(false);
const headUrl = ref("");
const avatarInfo = reactive({
  bizId: "",
  bizKind: "",
  bizName: "",
  url: "",
  ossId: "",
  isPic: "",
  path: "",
});
const fileList = ref([]);
const areaPhonePrefix = ref(""); // 电话号码前缀
const member = ref("");
const otherStore = useOtherStore();
const authStore = useAuthStore();

onMounted(() => {
  getCustomerInfo();
  // store.commit("updateWarning", true);
  // if (!document.cookie.includes("passwordTips=")) {
  //   getPasswordPopup(); // 第三方注册设置密码提示弹窗
  // }
});

// 获取是否需要弹窗数据
const getPasswordPopup = async () => {
  const tipParams = {
    type: "1",
  };
  try {
    const res = await Api.getCustomerTips(tipParams);
    if (res.code === 200) {
      passwordPopup.value = res.data;
      setcookie(); // 保存cookies,弹窗只需首次点击弹一次。cookies不存在再去请求接口。
    } else {
      uni.showToast({
        title: res.msg,
        duration: 2000,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const setcookie = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000000000);
  document.cookie = "passwordTips=passwordTips;expires= " + d.toGMTString();
  return document.cookie;
};

// 获取用户信息
const getCustomerInfo = () => {
  uni.showLoading({ title: "加载中..." });

  getCustomerInfoData().then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      customerInfo.value = res.data;
      userPhone.value = res.data.regPhone; // 获取用户电话，传参过去查看推荐人界面
      userName.value = res.data.realname; // 获取用户名，传参过去查看推荐人界面
      fileList.value.push(res.data.avatarInfo);
      headUrl.value = res.data.avatarInfo.url;
      if (res.data.distributorId != null) {
        distributorId.value = res.data.distributorId.toString();
      }
      if (res.data.distributorLevel != null) {
        distributorLevel.value = res.data.distributorLevel.toString();
      }
      areaPhonePrefix.value = res.data.areaPhonePrefix;
      member.value = res.data.memberStatus;
    } else {
      uni.showToast({
        title: res.msg,
        duration: 2000,
      });
    }
  });
};

// 跳转修改密码
const jumpChangePassword = () => {
  uni.navigateTo({
    url: "/pages/account/changePassword",
  });
};

// 跳转修改资料
const jumpUpdateInfo = () => {
  uni.navigateTo({
    url: "/pages/account/updateInfo",
  });
};

// 跳转发货人
const jumpShipper = () => {
  uni.navigateTo({
    url: "/pages/account/address/index/index?kind=发货人",
  });
};

// 跳转收货人
const jumpConsignee = () => {
  uni.navigateTo({
    url: "/pages/account/address/index/index?kind=收货人",
  });
};

// 跳转供应商入驻
const jumpSettle = () => {
  router.push({
    path: "/settle",
  });
};

// 跳转查看推荐人界面
const toJumpReferrer = () => {
  const userPhone = userPhone.value;
  const userName = userName.value;
  const distributorId = distributorId.value;
  const distributorLevel = distributorLevel.value;
  uni.navigateTo({
    url: `/pages/account/referrer?userPhone=${userPhone}&userName=${userName}&distributorId=${distributorId}&distributorLevel=${distributorLevel}`,
  });
};

// 跳转订单统计
const jumpState = () => {
  // uni.navigateTo({
  //   url: "/pages/login/index",
  // });
};

// 跳转待我处理
const jumpPending = () => {
  uni.navigateTo({
    url: "/pages/order/list?active=1",
  });
};

// 跳转后台处理中
const jumpProcess = () => {
  uni.navigateTo({
    url: "/pages/order/list?active=2",
  });
};

// 跳转已完成
const jumpComplete = () => {
  uni.navigateTo({
    url: "/pages/order/list?active=3",
  });
};

// 跳转订单轨迹
const jumpOrderTrack = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 初始化客服
const initService = () => {
  uni.openService();
};

// 登陆后跳转
const jumpAuthorized = (url) => {
  location.href = url;
};

// 运力平台跳转
const toJumpAPP = () => {
  window.location.href =
    "https://docs.qq.com/doc/p/a58d47e86fc6d252673e76f173a27ee08a200d65?dver=3.0.0";
};

// 跳转运力平台
const toJumpPlatform = () => {
  router.push({
    path: "/inquiry/banner",
    query: {
      url: "https://www.gosun2.com/",
    },
  });
};

// 退出登录
const logoutNow = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        authStore.clearAuthInfo();
        getCustomerInfoData();
      } else if (res.cancel) {
      }
    },
  });
};

// 跳转隐私协议
const jumpPrivacy = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// toast提示
const getToast = () => {
  uni.showToast({
    title: "middle.toast",
    duration: 2000,
  });
};

// 分销官id为空时给出的信息
const getOfficerToast = () => {
  uni.showToast({
    title: "officer.officerToast",
    duration: 2000,
  });
};

// 成为分销官
const jumpOfficer = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 分销成绩单
const jumpReportCard = () => {
  router.push({
    path: "/account/reportCard",
    query: {
      distributorLevel: distributorLevel.value,
      areaPhonePrefix: areaPhonePrefix.value,
    },
  });
};

// 跳转API设置
const jumpApi = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 跳转会员中心
const jumpMarketHome = () => {
  if (member.value == 0) {
    router.push({
      path: "/market/marketPromotion",
    });
  } else if (member.value == 1) {
    router.push({
      path: "/market/marketHome",
    });
  } else if (member.value == 2) {
    uni.showToast({
      title: "marketing.stop",
      duration: 2000,
    });
  }
};

// 跳转仓库代收地址
const jumpAddress = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 注销账号
const cancel = () => {
  uni.showModal({
    title: "提示",
    content: "确定要注销账号吗？",
    success: (res) => {
      if (res.confirm) {
        Api.cancel().then((res) => {
          if (res.code === 200) {
            router.replace({
              path: "/login",
            });
            store.commit("updateDestroyKeepAlive", Math.random());
            Cookies.remove("loginToken");
            Cookies.remove("userLoginInfo");
            Cookies.remove("regPhone");
            Cookies.remove("regPwd");
            uni.showToast({
              title: "myInfo.cancelSucceed",
              duration: 2000,
            });
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
        });
      }
    },
  });
};

const beforeRead = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    uni.showToast({
      title: "common.imgUploadTip",
      duration: 2000,
    });
    return false;
  }
  return true;
};

const afterRead = (file) => {
  if (file.file.size < 2 * 1024 * 1024) {
    commonUpload(file);
    return;
  }
  new Compressor(file.file, {
    quality: 0.6,
    success(result) {
      file.file = result;
      commonUpload(file);
    },
    error(err) {
      console.error(err);
    },
  });
};

const commonUpload = (file) => {
  file.status = "uploading";
  file.message = "common.uploading";
  const formData = new FormData();
  formData.append("file", file.file);
  uni.showLoading({ title: "上传中..." });
  Api.commonUpload(formData)
    .then((res) => {
      uni.hideLoading();
      if (res.code === 200) {
        file.status = "done";
        const params = {
          avatarInfo: {
            path: res.data.path,
            url: res.data.url,
            bizId: res.data.bizId,
            bizKind: res.data.bizKind,
            bizName: res.data.bizName,
            isPic: res.data.isPic,
            ossId: res.data.ossId,
            title: res.data.title,
            size: res.data.size,
          },
        };
        uni.showLoading({ title: "更新中..." });
        Api.updateCustomer(params).then((res) => {
          uni.hideLoading();
          if (res.code === 200) {
            const lookPicture = Object.assign(
              res.data,
              fileList.value[fileList.value.length - 1]
            );
            fileList.value[fileList.value.length - 1] = lookPicture;
            uni.showToast({
              title: "common.editSuccess",
              duration: 2000,
            });
            getCustomerInfo();
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
        });
      } else {
        file.status = "failed";
        file.message = "common.uploadFailed";
        uni.showToast({
          title: res.msg,
          duration: 2000,
        });
      }
    })
    .catch(() => {
      file.status = "failed";
      file.message = "common.uploadFailed";
    });
};
</script>

<style lang="scss" scoped>
@mixin ico($name, $w: 84rpx, $h: 84rpx) {
  position: relative;
  display: inline-block;
  width: $w;
  height: $h;
  background: url($name) no-repeat center;
  background-size: contain;
}

.my-info {
  margin-bottom: 100rpx;
  -webkit-overflow-scrolling: touch;

  // .confirm-popup {
  //   width: 630rpx;
  //   height: 388rpx;
  //   background: url(../../static/images/confirm-popupTip.png) no-repeat;
  //   background-size: 630rpx 388rpx;

  //   /deep/ .van-popup__close-icon--top-right {
  //     margin-top: 44rpx;
  //   }

  //   .confirm-popup-content {
  //     margin-top: 160rpx;

  //     .tit {
  //       text-align: center;
  //       color: #333333;
  //       font-size: 32rpx;
  //       width: 85%;
  //       margin: 0 auto;
  //     }

  //     .last-btn {
  //       width: 330rpx;
  //       margin: 10rpx auto;

  //       .btn {
  //         width: 330rpx;
  //         height: 76rpx;
  //         background: #DD312F;
  //         border-radius: 200rpx;
  //         color: #FFFFFF;
  //       }
  //     }
  //   }
  // }

  .my-swipe {
    width: 98%;
    margin: 40rpx auto;
    color: #fff;
    font-size: 40rpx;
    height: 420rpx;
    line-height: 420rpx;
    text-align: center;
    margin-top: -40rpx;
  }

  .header {
    // display: flex;
    // align-items: center;
    background: #df3030;
    padding: 0rpx 30rpx 0rpx 36rpx;
    border-radius: 0 0 44rpx 44rpx;

    .header-content {
      width: 690rpx;
      margin: 0 auto;
      background: #dd312f;
      border-radius: 12rpx 12rpx 0rpx 0rpx;
      color: #ffffff;

      .content-top {
        display: flex;
        align-items: center;

        .content-left {
          margin: 32rpx 40rpx 20rpx 40rpx;

          .img {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            // margin: 32rpx 40rpx 0rpx 40rpx;
          }
        }

        .content-right {
          > view {
            font-size: 36rpx;
            font-weight: 500;
            color: #ffffff;
            margin-right: 20rpx;
          }

          .name {
            width: 200rpx;
            word-wrap: break-word;
            word-break: break-all;
          }

          .vip {
            background: url(../../static/account/ico-vip.png);
            width: 60rpx;
            height: 24rpx;
            text-align: center;
            color: #df3030;
            font-size: 24rpx;
            line-height: 24rpx;
            margin: 8rpx 0rpx 0rpx 16rpx;
          }

          .right-bottom {
            margin: 10rpx 0rpx 0rpx 0rpx;
            font-size: 34rpx;
            display: flex;

            .title {
              color: #ffffff;
            }

            .num {
              color: #ffffff;
              margin-top: 3rpx;
              margin-right: 10rpx;
            }
          }

          .user-id {
            font-size: 30rpx;
            margin-top: 12rpx;
          }
        }
      }
    }

    .last-bottom {
      display: flex;
      margin: 16rpx 0rpx 0rpx 0rpx;
      background: #fff4de;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      height: 140rpx;
      position: relative;

      > view {
        flex: 1;
        margin-left: 46rpx;
        margin-top: 42rpx;
        margin-bottom: 30rpx;

        .num {
          color: #e6a971;
          font-size: 28rpx;
          margin-left: 18rpx;
          width: 80rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .title {
          font-size: 28rpx;
          font-weight: 500;
          width: 120rpx;
          text-align: center;
          color: #bd8959;
        }
      }

      > uni-image {
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        right: 0rpx;
        bottom: 0rpx;
      }
    }
  }

  .manage-box {
    width: 690rpx;
    background: #ffffff;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    margin: 30rpx auto;
    display: flex;

    > view {
      flex: 1;
      margin: 20rpx 0rpx 12rpx 44rpx;

      > view {
        > uni-image {
          width: 80rpx;
          height: 80rpx;
          pointer-events: none;
        }
      }

      .title {
        color: #333333;
        font-size: 24rpx;
        width: 120rpx;
        margin-left: -16rpx;
        text-align: center;
        word-wrap: break-word;
      }
    }
  }

  .settle {
    width: 690rpx;
    margin: 0 auto;

    > img {
      width: 690rpx;
      height: 270rpx;
      margin: 0 auto;
      pointer-events: none;
    }
  }

  .bottom {
    width: 690rpx;
    background: #ffffff;
    margin: 10rpx auto;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;

    > view {
      margin: 24rpx -10rpx 24rpx 26rpx;
      text-align: center;

      [class^="ico-"],
      [class*=" ico-"] {
        display: block;
        width: 40rpx;
        height: 40rpx;
        margin: 12rpx auto;
      }

      .ico-statistical {
        background: url(../../static/account/ico-stat.png) no-repeat;
      }

      .ico-updatePassword {
        background: url(../../static/account/ico-changePassword.png) no-repeat;
      }

      .ico-updateData {
        background: url(../../static/account/ico-updateInfo.png) no-repeat;
      }

      .ico-shipAddr {
        background: url(../../static/account/ico-shipAddr.png) no-repeat;
      }

      .ico-deliveryAddr {
        background: url(../../static/account/ico-deliveryAddr.png) no-repeat;
      }

      .ico-myReferrer {
        background: url(../../static/account/ico-myReferrer.png) no-repeat;
      }

      .ico-platform {
        background: url(../../static/account/ico-platform.png) no-repeat;
      }

      .ico-privacy {
        background: url(../../static/account/ico-privacy.png) no-repeat;
      }

      .ico-cancel {
        background: url(../../static/account/ico-cancel.png) no-repeat;
      }

      .ico-logout {
        background: url(../../static/account/ico-logout.png) no-repeat;
      }

      .ico-officer {
        background: url(../../static/account/ico-officer.png) no-repeat;
      }

      .ico-reportCard {
        background: url(../../static/account/ico-reportCard.png) no-repeat;
      }

      .ico-api {
        background: url(../../static/account/ico-api.png) no-repeat;
      }

      .ico-market {
        background: url(../../static/account/ico-Member.png) no-repeat;
      }

      .ico-warehouse {
        background: url(../../static/account/ico-warehouse.png) no-repeat;
      }
    }

    .title {
      width: 146rpx;
      font-size: 24rpx;
      color: #333333;
      font-weight: 500;
      margin-left: 0rpx;
      margin-bottom: 0rpx;
      margin-top: -2rpx;
      word-wrap: break-word;
    }

    .bottom-item {
      .ico-statistical {
        width: 40rpx;
        height: 40rpx;
        background: url(../../static/account/ico-stat.png) no-repeat;
        background-size: contain;
      }
    }
  }

  .container {
    background: #ffffff;
    box-shadow: 0px 6rpx 8rpx 2rpx rgba(232, 225, 225, 0.3);
    border-radius: 30rpx 30rpx 30rpx 30rpx;
    margin: -76rpx 30rpx 0 30rpx;
    padding: 30rpx;

    .van-col {
      text-align: center;
      font-size: 28rpx;
      padding: 35rpx 18rpx;

      .desc {
        margin-top: 20rpx;
        color: #666666;
      }
    }
  }

  .button {
    display: flex;
    height: 130rpx;
    margin: 30rpx 50rpx;

    .btn {
      background: #ffffff;
      font-size: 28rpx;
      width: 400rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      color: #df3030;
      border-radius: 50rpx;
      border: 2rpx solid #df3030;
    }

    .btn2 {
      background: #ffffff;
      font-size: 28rpx;
      width: 240rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      color: #df3030;
      border-radius: 50rpx;
      border: 2rpx solid #df3030;
      margin-left: 40rpx;
    }
  }

  .ico-deliver {
    @include ico("./../../static/account/ico-deliver.png", 94rpx, 100rpx);
  }

  .ico-receiving {
    @include ico("./../../static/account/ico-receiving.png", 94rpx, 100rpx);
  }

  .ico-password {
    @include ico("./../../static/account/ico-password.png", 80rpx, 100rpx);
  }

  .ico-update {
    @include ico("./../../static/account/ico-update.png", 100rpx, 100rpx);
  }

  .ico-recommend {
    @include ico("./../../static/account/ico-my-promotion.png", 100rpx, 100rpx);
  }

  .ico-qar {
    @include ico("./../../static/account/ico-promote.png", 100rpx, 100rpx);
  }
}

:deep(.page) {
  border-radius: 0;
}
</style>