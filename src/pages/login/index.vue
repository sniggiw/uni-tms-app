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

            <view class="main">
                <view class="logo"></view>
                <view class="desc">
                    <view class="title">欢迎使用运力引擎平台</view>
                    <view class="subTitle">进出口供应链的运力超市，贸易人、货代人的好帮手</view>
                </view>
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
import { ref } from "vue";

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

                    &.active{
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

        .main {
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
