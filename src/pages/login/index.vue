<template>
    <view class="loginPage">
        <view class="header">
            <view class="top">
                <view class="switchLanaguageBtn" @click="handleToggleLanguage('bottom')">
                    <text>{{ languageList.find((item) => item.value === selectLanguage).text }}</text>
                    <text :class="['triangle', { active: isShowPopupContainer }]"></text>
                </view>
                <view class="onlineServiceBtn"></view>
            </view>

            <view class="mid">
                <view class="logo"></view>
                <view class="desc">
                    <view class="title">欢迎使用运力引擎平台</view>
                    <view class="subTitle">进出口供应链的运力超市，贸易人、货代人的好帮手</view>
                </view>
            </view>
        </view>

        <view class="main">
            <uni-card title="" extra="">
                <view class="form">
                    <view class="inputContainer">
                        <view class="beforeExtra">
                            <text class="text plusSymbol">+</text>
                            <text class="text areaCode">86</text>
                            <text class="text iconArrowDown"></text>
                        </view>
                        <!-- uniapp 中的 input，如果需要对 placeHolder 进行样式设置，需要使用 placeholder-class 添加类名 -->
                        <input type="text" placeholder="请输入手机号" class="input" placeholder-class="placeholderClass" :value="form.phone" />
                        <view class="afterExtra">
                            <image src="@/assets/imgs/login/iconUser.png" alt="" />
                        </view>
                    </view>

                    <view class="inputContainer">
                        <input type="text" placeholder="请输入登录密码" class="input" placeholder-class="placeholderClass" :value="form.password" />
                        <view class="afterExtra">
                            <image src="@/assets/imgs/login/iconUnShowPassword.png" alt="" />
                        </view>
                    </view>

                    <view class="rememberAndForgetPassword">
                        <view class="rememberPassword" @tap="handleToggleIsRememberPassword">
                            <view :class="['rememberPasswordBox', form.isRememberPassword ? 'iconIsRememberPassword' : 'unRememberPassword']"></view>
                            <view class="defaultText">记住账号密码</view>
                        </view>
                        <view class="forgetPassword">
                            <text class="defaultText">忘记密码?</text>
                        </view>
                    </view>

                    <view class="trackAndLoginBtns">
                        <view class="btn track">轨迹查询</view>
                        <view class="btn login">登录</view>
                    </view>

                    <view class="orLine">
                        <view class="line leftLine"></view>
                        <view class="text">OR</view>
                        <view class="line rightLine"></view>
                    </view>

                    <view class="wechatLoginBtn">微信登录</view>
                </view>
            </uni-card>

            <view class="protocol">
                <view :class="['agreeBtn', form.isAgree ? 'iconAgree' : 'unAgree']" @tap="handleToggleAgree"></view>

                <text class="defaultText">我同意该协议</text>
                <text>《隐私协议》</text>
                <text>《注册协议》</text>
                <text>《物流协议》</text>
            </view>
        </view>

        <view class="popupLanguageContainer">
            <!-- change 事件是当 popup 组件显隐状态发生变化时触发的，而不是选择了内容时触发的 -->
            <uni-popup ref="popupLanguage" @change="handleChangePopupStatus">
                <view class="popup-content">
                    <view class="title">选择语言</view>
                    <view
                        :class="['languageItem', { active: selectLanguage === item.value }]"
                        v-for="item in languageList"
                        :key="item.value"
                        @click="handleChangeLanguage(item.value)"
                        >{{ item.text }}</view
                    >
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script setup>
import { reactive, ref } from "vue";

const popupLanguage = ref(null);
const languageList = ref([
    { text: "中文", value: "zh" },
    { text: "English", value: "en" },
]);
const selectLanguage = ref("zh");
const isShowPopupContainer = ref(false);

const handleToggleLanguage = (type) => {
    popupLanguage.value.open(type);
};

const handleChangePopupStatus = (e) => {
    isShowPopupContainer.value = e.show;
};

const handleChangeLanguage = (value) => {
    selectLanguage.value = value;
    popupLanguage.value.close();
};

const form = reactive({
    phone: "",
    password: "",
    isRememberPassword: false,
    isAgree: false,
});

const handleToggleIsRememberPassword = () => {
    form.isRememberPassword = !form.isRememberPassword;
};

const handleToggleAgree = () => {
    form.isAgree = !form.isAgree;
}
</script>

<style lang="scss" scoped>
.loginPage {
    width: 100vw;
    height: 100vh;

    .header {
        width: 100%;
        height: 490rpx;
        background: url("@/assets/imgs/login/headerBg.png") left top / 100% 100% no-repeat;
        overflow: hidden;

        .top {
            margin-top: 20rpx;

            display: flex;
            align-items: center;

            .switchLanaguageBtn {
                margin-left: auto;
                padding: 10rpx 20rpx;
                font-weight: 500;
                font-size: 24rpx;
                border-radius: 12rpx;
                border: 2rpx solid #ffffff;
                color: #fff;

                display: flex;
                justify-content: center;
                align-items: center;

                text {
                    line-height: 1;
                }

                .triangle {
                    margin-left: 8rpx;
                    width: 0;
                    height: 0;
                    border-left: 8rpx solid transparent;
                    border-right: 8rpx solid transparent;
                    border-top: 10rpx solid #fff;
                    border-radius: 3rpx;

                    transition: all 0.3s;

                    &.active {
                        transform: rotate(180deg);
                    }
                }
            }

            .onlineServiceBtn {
                margin-left: 40rpx;
                margin-right: 52rpx;
                width: 36rpx;
                height: 36rpx;
                background: url("@/assets/imgs/login/iconOnlineService.png") left top / 100% 100% no-repeat;
            }
        }

        .mid {
            margin: 40rpx 56rpx 0 60rpx;
            display: flex;
            align-items: center;

            .logo {
                flex-shrink: 0;
                margin-right: 30rpx;
                width: 160rpx;
                height: 160rpx;
                background: url("@/assets/imgs/login/logo.png") left top / 100% 100% no-repeat;
            }

            .desc {
                color: #ffffff;
                .title {
                    margin-bottom: 28rpx;
                    font-weight: 600;
                    font-size: 40rpx;
                }

                .subTitle {
                    width: 16em;
                    font-weight: 500;
                    font-size: 26rpx;
                }
            }
        }
    }

    .main {
        padding: 0 60rpx;
        margin-top: 40rpx;

        .uni-card {
            margin: 0 0 40rpx 0 !important;
            padding: 0 !important;
        }

        .form {
            width: 100%;

            display: flex;
            flex-direction: column;

            .inputContainer {
                padding: 30rpx 20rpx;
                border-bottom: 2rpx solid rgba(153, 153, 153, 0.3);
                border-radius: 2rpx;

                display: flex;
                align-items: center;

                .beforeExtra {
                    margin-right: 40rpx;
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #333333;

                    display: flex;
                    align-items: center;

                    .text {
                        line-height: 1;
                    }

                    .areaCode {
                        margin: 0 10rpx;
                    }

                    .iconArrowDown {
                        width: 20rpx;
                        height: 10rpx;
                        background: url("@/assets/imgs/login/iconArrowDown.png") left top / 100% 100% no-repeat;
                    }
                }

                .input {
                    flex: 1;
                    font-size: 30rpx;
                    font-weight: bold;
                    color: #333333;
                }

                .placeholderClass {
                    color: #666666;
                    font-size: 30rpx;
                    font-weight: normal !important;
                }

                .afterExtra {
                    display: flex;
                    image {
                        width: 32rpx;
                        height: 32rpx;
                    }
                }
            }

            .rememberAndForgetPassword {
                display: flex;
                justify-content: space-between;
                align-items: center;

                margin-top: 30rpx;
                padding: 0 10rpx;
                // font-size: 24rpx;

                .rememberPassword {
                    display: flex;
                    align-items: center;
                    color: #999999;

                    .rememberPasswordBox {
                        margin-right: 10rpx;
                        width: 32rpx;
                        height: 32rpx;
                    }

                    .iconIsRememberPassword {
                        background: url("@/assets/imgs/login/iconRememberPassword.png") left top / 100% 100% no-repeat;
                    }

                    .unRememberPassword {
                        border: 1rpx solid #999999;
                    }
                }

                .defaultText {
                    margin-top: 1rpx;
                    line-height: 1;
                }

                .forgetPassword {
                    color: #1266fb;
                    line-height: 1;
                }
            }

            .trackAndLoginBtns {
                margin-top: 40rpx;
                display: flex;
                justify-content: space-between;

                .btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    width: 268rpx;
                    height: 80rpx;
                    font-size: 30rpx;
                    border-radius: 100rpx;
                    border: 2rpx solid #d73336;
                    color: #d73336;
                }

                .login {
                    color: #fff;
                    background-color: #d73336;
                }
            }

            .orLine {
                margin: 20rpx 0;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .text {
                    font-weight: 500;
                    font-size: 24rpx;
                    color: #d73336;
                }

                .line {
                    width: 240rpx;
                    height: 2rpx;
                }

                .leftLine {
                    background: url("@/assets/imgs/login/leftLine.png") left top / 100% 100% no-repeat;
                }

                .rightLine {
                    background: url("@/assets/imgs/login/rightLine.png") left top / 100% 100% no-repeat;
                }
            }

            .wechatLoginBtn {
                margin: 0 auto 30rpx;
                width: 570rpx;
                height: 80rpx;
                font-size: 30rpx;
                color: #d73336;
                background: #ffdede;
                border-radius: 100rpx;

                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .protocol {
            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 24rpx;
            color: #1266fb;

            .agreeBtn {
                margin-right: 10rpx;
                display: flex;
                align-items: center;

                width: 28rpx;
                height: 28rpx;

                &.iconAgree {
                    background: url("@/assets/imgs/login/iconAgree.png") left top / 100% 100% no-repeat;
                }

                &.unAgree {
                    opacity: 0.3;
                    background: url("@/assets/imgs/login/iconAgree.png") left top / 100% 100% no-repeat;
                }
            }

            .defaultText {
                color: #333333;
            }

            text {
                line-height: 1;
            }
        }
    }

    .popupLanguageContainer {
        .popup-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            padding: 50rpx 40rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx;
            background-color: #fff;

            position: relative;

            &::before {
                content: "";
                position: absolute;
                top: 25rpx;
                left: 50%;
                transform: translateX(-50%);
                width: 60rpx;
                height: 8rpx;
                border-radius: 20rpx;
                background-color: #df3030;
            }

            .title {
                font-size: 36rpx;
                color: #000;
            }

            .languageItem {
                padding-top: 20rpx;
                font-size: 30rpx;

                &.active {
                    color: #df3030;
                }
            }
        }
    }
}
</style>
