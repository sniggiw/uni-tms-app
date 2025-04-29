<template>
    <view class="loginPage">
        <view class="header">
            <view class="top">
                <view class="switchLanaguageBtn" @click="handleToggleLanguage('bottom')">
                    <text v-if="language === 'zh-Hans'">{{ t("login.zhCN") }}</text>
                    <text v-if="language === 'en'">{{ t("login.enUS") }}</text>
                    <text :class="['triangle', { active: isShowPopupContainer }]"></text>
                </view>
                <view class="onlineServiceBtn"></view>
            </view>

            <view class="mid">
                <view class="logo"></view>
                <view class="desc">
                    <view class="title">{{ t("login.login") }}</view>
                    <view class="subTitle">{{ t("login.h2") }}</view>
                </view>
            </view>
        </view>

        <view class="main">
            <uni-card title="" extra="">
                <view class="form">
                    <view class="inputContainer">
                        <view class="beforeExtra" @tap="jumpPhonePreFix('login')">
                            <!-- <text class="text plusSymbol">+</text> -->
                            <text class="text areaCode">{{ form.areaPhonePrefix }}</text>
                            <text class="text iconArrowDown"></text>
                        </view>
                        <!-- uniapp 中的 input，如果需要对 placeHolder 进行样式设置，需要使用 placeholder-class 添加类名 -->
                        <input
                            type="text"
                            :placeholder="t('register.regPhonePlaceholder')"
                            class="input"
                            placeholder-class="placeholderClass"
                            v-model="form.regPhone"
                        />
                        <view class="afterExtra">
                            <image src="@/static/imgs/login/iconUser.png" alt="" />
                        </view>
                    </view>

                    <view class="inputContainer">
                        <input
                            :placeholder="t('register.regPwdPlaceholder')"
                            class="input"
                            type="password"
                            placeholder-class="placeholderClass"
                            v-model="form.regPwd"
                        />
                        <view class="afterExtra">
                            <image src="@/static/imgs/login/iconUnShowPassword.png" alt="" />
                        </view>
                    </view>

                    <view class="rememberAndForgetPassword">
                        <view class="rememberPassword" @tap="handleToggleIsRememberPassword">
                            <view :class="['rememberPasswordBox', form.isRememberPassword ? 'iconIsRememberPassword' : 'unRememberPassword']"> </view>
                            <view class="defaultText">{{ t("login.rememberRegPwd") }}</view>
                        </view>
                        <view class="forgetPassword">
                            <text class="defaultText" @tap="openForgetPasswordDialog">{{ t("login.forgetRegPwd") }}</text>
                        </view>
                    </view>
                    <view class="registerNow">
                        {{ t("login.registerText") }}<text @tap="jumpRegister">{{ t("login.registerText2") }}</text>
                    </view>
                    <view class="trackAndLoginBtns">
                        <view class="btn track" @tap="jumpQueryTrack">{{ t("router.queryTrack") }}</view>
                        <view class="btn login" @tap="handleLogin">{{ t("login.logNow") }}</view>
                    </view>

                    <!-- <view class="orLine">
                        <view class="line leftLine"></view>
                        <view class="text">OR</view>
                        <view class="line rightLine"></view>
                    </view>

                    <view class="wechatLoginBtn">微信登录</view> -->
                </view>
            </uni-card>

            <!-- <view class="protocol">
                <view :class="['agreeBtn', form.isAgree ? 'iconAgree' : 'unAgree']" @tap="handleToggleAgree"></view>
                <text class="defaultText">我同意该协议</text>
                <text>《隐私协议》</text>
                <text>《注册协议》</text>
                <text>《物流协议》</text>
            </view> -->
        </view>
        <view class="keep-on-record" :class="{ 'position-rel': isScroll }">
            <text class="keep-on-record-text">{{ t("login.copyRight") }}</text>
        </view>

        <view class="popupLanguageContainer">
            <!-- change 事件是当 popup 组件显隐状态发生变化时触发的，而不是选择了内容时触发的 -->
            <uni-popup ref="popupLanguage" @change="handleChangePopupStatus">
                <view class="popup-content">
                    <view class="title">选择语言</view>
                    <view class="uniList-box">
                        <view class="uniList-content" @tap="onClick($event, 1)">
                            <view>
                                <i class="ico-language ico-chinese"></i>
                            </view>
                            <view>
                                {{ t("login.zhCN") }}
                            </view>
                            <view class="icoTick-content">
                                <i class="ico-tick" v-if="language === 'zh-Hans'"></i>
                                <view v-else></view>
                            </view>
                        </view>
                        <view class="uniList-content" @tap="onClick($event, 2)">
                            <view>
                                <i class="ico-language ico-english"></i>
                            </view>
                            <view>
                                {{ t("login.enUS") }}
                            </view>
                            <view class="icoTick-content">
                                <i class="ico-tick" @tap="onClick($event, 2)" v-if="language === 'en'"></i>
                                <view @tap="onClick($event, 2)" v-else></view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="btn-language">
                    <button class="language-primary" @tap="changeLanguage">{{ t("common.confirm") }}</button>
                </view>
            </uni-popup>
        </view>

        <view class="popupForgetPasswordContainer">
            <uni-popup ref="forgetPasswordDialog" type="dialog">
                <view class="icon-del" @tap="closeForgetPopup"></view>
                <uni-forms>
                    <section class="basic-info">
                        <uni-forms-item :label="t('register.regPhone')">
                            <view class="area-phone">
                                <view class="phone-prefix" @tap="jumpForgetPreFix">
                                    <view>{{ regInfo.areaPhonePrefix }}</view>
                                    <view class="ico-phone"></view>
                                </view>
                                <uni-easyinput v-model.number="regInfo.regPhone" type="number" :placeholder="t('register.regPhonePlaceholder')">
                                </uni-easyinput>
                            </view>
                        </uni-forms-item>
                        <uni-forms-item :label="t('register.captchaImage')">
                            <uni-easyinput v-model="captchaImage.code" :placeholder="t('register.captchaImagePlaceholder')">
                                <template #right>
                                    <img class="captcha-image-btn" :src="captchaImage.img" @tap="commonCaptchaImageData" />
                                </template>
                            </uni-easyinput>
                        </uni-forms-item>
                        <uni-forms-item
                            :label="t('register.phoneCode')"
                            :name="['regInfo', 'code']"
                            :rules="[{ required: true, errorMessage: t('common.require') }]"
                            required
                        >
                            <uni-easyinput v-model="regInfo.code" :placeholder="t('register.phoneCodePlaceholder')">
                                <template #right>
                                    <button
                                        size="mini"
                                        class="phone-code-button"
                                        :disabled="captchaImage.phoneCodeButton"
                                        @tap="commonCaptchaPhoneData"
                                    >
                                        {{ captchaImage.phoneCodeButtonText }}
                                    </button>
                                </template>
                            </uni-easyinput>
                        </uni-forms-item>
                        <uni-forms-item
                            :label="t('register.regPwd')"
                            :name="['regInfo', 'regPwd']"
                            :rules="[{ required: true, errorMessage: t('common.require') }]"
                            required
                        >
                            <uni-easyinput
                                v-model="regInfo.regPwd"
                                type="password"
                                :placeholder="t('register.regPwdPlaceholder')"
                                @blur="checkPassword"
                            />
                        </uni-forms-item>

                        <uni-forms-item
                            :label="t('changePassword.confirmPwd')"
                            :name="['regInfo', 'confirmPwd']"
                            :rules="[{ required: true, errorMessage: t('common.require') }]"
                            required
                        >
                            <uni-easyinput
                                v-model="regInfo.confirmPwd"
                                type="password"
                                :placeholder="t('changePassword.confirmPwdPlaceholder')"
                                @blur="checkPassword"
                            />
                        </uni-forms-item>
                    </section>
                </uni-forms>
                <button class="forget-submit">{{ t("register.agreementBtn") }}</button>
            </uni-popup>
        </view>
    </view>
</template>

<script setup>
import { loginByPhone } from "@/api/auth";
import { commonCaptchaImage, commonCaptchaPhone } from "@/api/register";
import { useAuthStore } from "@/stores";
import { getStore, removeStore } from "@/utils/index";
import moment from "moment";
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const { t, locale } = useI18n();
const authStore = useAuthStore();

const ERROR_TOSAT_TEXT = {
    regPhone: "请输入手机号",
    regPwd: "请输入密码",
    isAgree: "请先同意协议",
};

const popupLanguage = ref(null);
const selectLanguage = ref("zh-Hans");
const isShowPopupContainer = ref(false);
const language = ref("zh-Hans");
const storedLanguage = uni.getStorageSync("lang");
const isScroll = ref(false);
const forgetPasswordDialog = ref(null);

const captchaImage = ref({
    uuid: "",
    img: "",
    code: "",
    phoneCodeButton: false,
    phoneCodeButtonText: t("register.sendOut"),
    time: 60,
}); // 图形验证码

const regInfo = ref({
    areaPhonePrefix: "+86",
    code: "",
    newPwd: "",
    confirmPwd: "",
    regPhone: "",
});

onMounted(() => {
    if (storedLanguage === "zh-Hans") {
        language.value = "zh-Hans";
    } else if (storedLanguage === "en") {
        language.value = "en";
    } else {
        language.value = "zh-Hans";
    }
    hasScrollbar();
    commonCaptchaImageData();
});

//切换语言
const changeLanguage = () => {
    popupLanguage.value.close();

    uni.setLocale(language.value);
    locale.value = language.value; // 更新 i18n 的 locale
    uni.setStorageSync("lang", language.value); //存储lang
};

const onClick = (event, index) => {
    if (index === 1) {
        language.value = "zh-Hans";
    } else if (index === 2) {
        language.value = "en";
    }
};

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
    areaPhonePrefix: "+86",
    regPhone: "18520664371",
    regPwd: "123456",
    isRememberPassword: false,
});

const handleToggleIsRememberPassword = () => {
    form.isRememberPassword = !form.isRememberPassword;
};

const jumpPhonePreFix = (pageKind) => {
    uni.navigateTo({
        url: `/pages/inquiry/components/phonePreFix/index?pageKind=${pageKind}&lang=${storedLanguage.value}`,
    });
};

const jumpForgetPreFix = () => {
    uni.showToast({
        title: t("login.forgetTips"),
        duration: 1500,
        icon: "none",
    });
};

const handleToggleAgree = () => {
    form.isAgree = !form.isAgree;
};

const commonCaptchaImageData = async () => {
    try {
        const res = await commonCaptchaImage();
        if (res.code === 200) {
            captchaImage.value.uuid = res.data.uuid;
            captchaImage.value.img = "data:image/gif;base64," + res.data.img;
        } else {
            uni.showToast({
                title: res.msg,
                duration: 1500,
                icon: "none",
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const commonCaptchaPhoneData = async () => {
    if (!regInfo.regPhone) {
        uni.showToast({
            title: t("register.regPhonePlaceholder"),
            duration: 1500,
            icon: "none",
        });
        return;
    }
    if (!captchaImage.code) {
        uni.showToast({
            title: t("register.captchaImagePlaceholder"),
            duration: 1500,
            icon: "none",
        });
        return;
    }

    const captcha = formData.regInfo.areaPhonePrefix;
    const params = {
        areaPhonePrefix: captcha,
        code: captchaImage.code,
        regPhone: formData.regInfo.regPhone,
        uuid: captchaImage.uuid,
        captchaKind: "1",
    };

    uni.showLoading();
    try {
        const res = await commonCaptchaPhone(params);
        uni.hideLoading();
        if (res.code === 200) {
            captchaImage.phoneCodeButtonText = captchaImage.time + "s";
            captchaImage.phoneCodeButton = true;
            const setInt = setInterval(() => {
                captchaImage.time = captchaImage.time - 1;
                captchaImage.phoneCodeButtonText = captchaImage.time + "s";
                if (captchaImage.time <= 0) {
                    captchaImage.phoneCodeButton = false;
                    captchaImage.phoneCodeButtonText = t("register.resend");
                    captchaImage.time = 60;
                    clearInterval(setInt);
                }
            }, 1000);
        } else {
            commonCaptchaImageData();
        }
        showToast(res.msg);
    } catch (error) {
        uni.hideLoading();
        console.error(error);
    }
};

const checkPassword = () => {
    if (regInfo.regPwd && regInfo.confirmPwd && regInfo.regPwd !== regInfo.confirmPwd) {
        uni.showToast({
            title: t("register.confirmPwdTip"),
            duration: 1500,
            icon: "none",
        });
    }
};

const hasScrollbar = () => {
    isScroll.value = document.getElementsByClassName("loginPage")[0].clientHeight > (window.innerHeight || document.documentElement.clientHeight);
};

const openForgetPasswordDialog = () => {
    forgetPasswordDialog.value.open();
};

const closeForgetPopup = () => {
    forgetPasswordDialog.value.close();
};

// 校验表单
const validateForm = () => {
    const phoneRegex = /^1[3-9]\d{9}$/;

    for (const key in form) {
        if (!form[key] && key !== "isRememberPassword") {
            uni.showToast({
                title: ERROR_TOSAT_TEXT[key],
                duration: 2000,
                icon: "none",
            });

            return false;
        }

        if (form.phone && !phoneRegex.test(form.phone)) {
            uni.showToast({
                title: "请输入正确的手机号",
                duration: 2000,
                icon: "none",
            });
            return false;
        }
    }

    return true;
};

const jumpQueryTrack = () => {
    uni.navigateTo({ url: "/pages/order/queryTrack/index/index" });
};

const jumpRegister = () => {
    uni.navigateTo({ url: "/pages/register/index/index" });
};

const handleLogin = async () => {
    if (!validateForm()) return;

    uni.showLoading({
        title: "登录中...",
    });
    const res = await loginByPhone(form);
    uni.hideLoading();

    if (res.code == 200) {
        // 数据持久化
        authStore.setAuthInfo({
            token: res.data.token,
            loginDatePeriod: [moment().format("YYYY-MM-DD HH:mm:ss"), moment().add(7, "days").format("YYYY-MM-DD HH:mm:ss")],
            isRememberPassword: form.isRememberPassword,
        });

        uni.showToast({
            title: "登录成功",
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
        uni.showToast({
            title: res.msg,
            duration: 1500,
            icon: "none",
        });
    }
};

// 手机号码区号
watch(
    () => route.path,
    (to, from) => {
        if (to !== from) {
            const phonePrefix = getStore("loginPhonePrefix");
            if (phonePrefix) {
                form.areaPhonePrefix = phonePrefix;
                setTimeout(() => {
                    removeStore("loginPhonePrefix");
                }, 150);
            }
        }
    }
);
</script>

<style lang="scss" scoped>
.loginPage {
    width: 100vw;
    height: 100vh;

    .header {
        width: 100%;
        height: 450rpx;
        background: url("@/static/imgs/login/headerBg.png") left top / 100% 100% no-repeat;
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
                background: url("@/static/imgs/login/iconOnlineService.png") left top / 100% 100% no-repeat;
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
                background: url("@/static/imgs/login/logo.png") left top / 100% 100% no-repeat;
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
                        margin: 0rpx 5rpx 0rpx -6rpx;
                    }

                    .iconArrowDown {
                        width: 20rpx;
                        height: 10rpx;
                        background: url("@/static/imgs/login/iconArrowDown.png") left top / 100% 100% no-repeat;
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
                        background: url("@/static/imgs/login/iconRememberPassword.png") left top / 100% 100% no-repeat;
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

            .registerNow {
                font-size: 24rpx !important;
                font-weight: 500;
                color: #999999;
                margin-top: 20rpx;
                margin-left: 8rpx;

                > text {
                    color: #1266fb;
                }
            }

            .trackAndLoginBtns {
                margin-top: 30rpx;
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
                    background: url("@/static/imgs/login/leftLine.png") left top / 100% 100% no-repeat;
                }

                .rightLine {
                    background: url("@/static/imgs/login/rightLine.png") left top / 100% 100% no-repeat;
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
                    background: url("@/static/imgs/login/iconAgree.png") left top / 100% 100% no-repeat;
                }

                &.unAgree {
                    opacity: 0.3;
                    background: url("@/static/imgs/login/iconAgree.png") left top / 100% 100% no-repeat;
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

    .keep-on-record {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        width: 750rpx;
        height: 180rpx;
        background: url("../../static/account/bottom-bg.png") no-repeat;
        background-position: bottom;
        background-size: cover;

        .keep-on-record-text {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 30rpx;
            text-align: center;
            font-size: 26rpx;
            color: #d73336;
        }
    }

    .position-rel {
        position: relative;
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

            .uniList-box {
                display: flex;
                background-color: #ffffff;
                position: relative;
                flex-direction: column;
                width: 100%;

                .uniList-content {
                    display: flex;
                    align-items: center;
                    margin-top: 20rpx;

                    .icoTick-content {
                        position: absolute;
                        right: 30rpx;
                    }

                    .ico-tick {
                        display: inline-block;
                        width: 23px;
                        height: 16px;
                        background: url("../../static/account/ico-tick.png") no-repeat;
                        background-size: contain;
                    }

                    .ico-language {
                        display: inline-block;
                        width: 40px;
                        height: 25px;
                        margin-right: 20px;
                        margin-top: 10rpx;
                        margin-left: 30rpx;
                    }

                    .ico-chinese {
                        background: url("../../static/account/ico-chinese.png") no-repeat;
                        background-size: contain;
                    }

                    .ico-english {
                        background: url("../../static/account/ico-english.png") no-repeat;
                        background-size: contain;
                    }
                }
            }

            // .uni-list {
            //     width: 100%;
            //     margin-top: 25rpx;

            //     .uniList-content {
            //         display: flex;
            //         align-items: center;

            //         >view {
            //             flex: 1;
            //         }

            //         .icoTick-content {
            //             position: absolute;
            //             right: 30rpx;
            //         }

            //         .ico-tick {
            //             display: inline-block;
            //             width: 23px;
            //             height: 16px;
            //             background: url("../../static/account/ico-tick.png") no-repeat;
            //             background-size: contain;
            //         }

            //         .ico-language {
            //             display: inline-block;
            //             width: 40px;
            //             height: 25px;
            //             margin-right: 20px;
            //             margin-top: 10rpx;
            //         }

            //         .ico-chinese {
            //             background: url("../../static/account/ico-chinese.png") no-repeat;
            //             background-size: contain;
            //         }

            //         .ico-english {
            //             background: url("../../static/account/ico-english.png") no-repeat;
            //             background-size: contain;
            //         }

            //     }
            // }
        }

        .btn-language {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 148rpx;
            background: #ffffff;
            box-shadow: 0px -4rpx 8rpx 2rpx rgba(230, 220, 220, 0.3);
            // border-radius: 40rpx 40rpx 0px 0px;

            .language-primary {
                width: 600rpx;
                height: 88rpx;
                line-height: 88rpx;
                background: #df3030;
                border-radius: 50rpx;
                font-size: 28rpx;
                color: #ffffff;
            }
        }
    }

    .popupForgetPasswordContainer {
        :deep(.uni-popup__wrapper) {
            width: 80%;
            background: #ffffff !important;
            padding-bottom: 50rpx;
            border-radius: 20rpx;
            position: relative;

            .icon-del {
                position: absolute;
                right: 30rpx;
                top: 25rpx;
                display: inline-block;
                width: 24rpx;
                height: 24rpx;
                background: url("../../static/common/icon-delete.png") no-repeat;
                background-size: contain;
            }

            .basic-info {
                overflow: hidden;
                margin: 70rpx 2rpx 40rpx;
                background: #ffffff;
                box-shadow: 0px 6rpx 10rpx 2rpx rgba(232, 225, 225, 0.34);
                border-radius: 30rpx;

                .uni-forms-item {
                    margin-bottom: 0rpx;
                }

                .area-phone {
                    display: flex;
                    align-items: center;

                    .phone-prefix {
                        color: #333333;
                        font-size: 30rpx;
                        display: flex;
                        align-items: center;
                        margin-left: 34rpx;

                        .ico-phone {
                            width: 20rpx;
                            height: 10rpx;
                            background: url("../../../static/common/icon-phonePreFix.png") no-repeat;
                            background-size: contain;
                            margin-left: 16rpx;
                        }
                    }
                }

                .uni-forms-item__content {
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

                    .captcha-image-btn {
                        width: 160rpx;
                        height: 60rpx;
                        overflow: hidden;
                        border-radius: 10rpx;
                    }

                    .phone-code-button {
                        color: #ffffff;
                        background: #df3030;
                        border: 2rpx solid #df3030;
                        border-radius: 60rpx;
                        min-width: 80rpx;
                        height: 52rpx;
                        line-height: 52rpx;
                    }
                }
            }
        }

        .forget-submit {
            background: #df3030;
            border: 2rpx solid #df3030;
            color: #ffffff;
            border-radius: 40rpx;
            width: 350rpx;
            height: 70rpx;
            line-height: 68rpx;
            margin-top: 24rpx;
            text-align: center;
        }
    }
}
</style>
