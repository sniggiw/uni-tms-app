<template>
  <view class="address-list">
    <view class="top" v-if="kind === '发货人'"
      >发货地址总数 {{ addressListLength }}</view
    >
    <view class="top" v-if="kind === '收货人'"
      >收货地址总数 {{ addressListLength }}</view
    >

    <uni-list :border="true">
      <!-- 显示圆形头像 -->
      <view
        v-for="item in addressList"
        :key="item.id"
        @tap="checkAddress(item)"
        class="list-item"
      >
        <view class="phone">
          <view class="left">{{ item.realname }}</view>
          <view class="right">{{ item.phonePrefix }} {{ item.phone1 }}</view>
        </view>
        <view class="address"
          >{{ item.countryName }}{{ item.provinceName }}{{ item.cityName
          }}{{ item.addr }}</view
        >
        <view class="list-item-btn">
          <view class="left-btn" v-if="kind == '发货人'">
            <CheckboxGroup v-model="item.isDefault">
              <Checkbox
                :value="radio"
                :isDefault="item.isDefault"
                @tap="clickRadio(item)"
                >设置为默认发货地址</Checkbox
              >
            </CheckboxGroup>
          </view>
          <view class="right-btn">
            <view class="edit-btn" @tap.stop="toEdit(item.id)"
              ><i class="ico-update"></i>编辑</view
            >
            <view class="delete-btn" @tap.stop="toDetele(item.id)"
              ><i class="ico-delete"></i>删除</view
            >
          </view>
        </view>
      </view>
    </uni-list>

    <view class="footer-btn">
      <uni-button @tap="add">新增地址</uni-button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getContractListData, settingContract } from "@/api/common";
import CheckboxGroup from "../../../../components/checkboxGroup/index.vue";
import Checkbox from "../../../../components/checkbox/index.vue";
// import { useRouter, useRoute } from 'vue-router';
// import Api from '@/api/index.js';
// import { useI18n } from 'vue-i18n';

// 路由和国际化
// const router = useRouter();
// const route = useRoute();
// const { t } = useI18n();

// 响应式数据
const kind = ref("");
const sourceUrl = ref("");
const loading = ref(false);
const finished = ref(true);
const addressList = ref([]);
const addressListLength = ref(0);
const radio = ref(1);

onLoad((options) => {
  kind.value = options.kind;
  sourceUrl.value = options.sourceUrl;
});

// 获取联系人信息
const getContractList = () => {
  const params = { kind: kind.value };

  getContractListData(params).then((res) => {
    if (res.code === 200) {
      addressList.value = res.rows;
      addressListLength.value = res.rows.length;
    } else {
      uni.showToast({ title: res.msg, duration: 2000 });
    }
  });
};

// 获取发货地址
const getDeliveryAddr = async () => {
  try {
    const res = await Api.getDeliveryAddr();
    if (res.code === 200) {
      addressList.value = res.data;
    } else {
      uni.showToast({ title: res.msg, duration: 2000 });
    }
  } catch (error) {
    console.error(error);
  }
};

// 新增地址
const add = () => {
  router.push({ path: "/account/address/add", query: { kind: kind.value } });
};

// 编辑地址
const toEdit = (id) => {
  router.push({
    path: "/account/address/edit",
    query: { kind: kind.value, id: id },
  });
};

// 删除地址
const toDetele = async (id) => {
  try {
    const res = await Api.deleteContract({ id: id });
    if (res.code === 200) {
      getContractList();
      uni.showToast({ title: t("address.deleteSuccess"), duration: 2000 });
    } else {
      uni.showToast({ title: res.msg, duration: 2000 });
    }
  } catch (error) {
    console.error(error);
  }
};

// 选择地址
const checkAddress = (item) => {
  if (sourceUrl.value) {
    if (kind.value === "发货人") {
      uni.setStorageSync("sendInfo", item);
    } else if (kind.value === "收货人") {
      uni.setStorageSync("receiveInfo", item);
    }
    // router.go(-1);
    uni.navigateBack({
      delta: 1,
    });
  }
};

// 设置默认地址
const clickRadio = async (item) => {
  item.isDefault = 1;
  const params = item;
  uni.showLoading({ title: "加载中..." });
  settingContract(params).then((res) => {
    uni.hideLoading();
    if (res.code === 200) {
      getContractList();
      radio.value = 1;
      console.log("@@", radio.value);
      uni.showToast({ title: res.msg, duration: 2000 });
    } else {
      getContractList();
      uni.showToast({ title: res.msg, duration: 2000 });
    }
  });
};

// 生命周期钩子
onMounted(() => {
  getContractList();
});
</script>

<style lang="scss" scoped>
.address-list {
  background: #f9f9fa;
  .top {
    width: 100%;
    padding: 0px 0px 50rpx 30rpx;
    background: #df3030;
    height: 80rpx;
    margin-top: 0px;
    font-size: 26rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 80rpx;
  }
  .uni-list {
    background: #f9f9fa;
    padding-bottom: 250rpx;
    :deep(.uni-list--border-bottom) {
      display: none;
    }
  }

  .list-item {
    margin: 30rpx 20rpx 0rpx 20rpx;
    overflow: hidden;
    padding: 20rpx;
    background: #ffffff;
    box-shadow: 0px 2rpx 8rpx 2rpx rgba(0, 0, 0, 0.05);
    border-radius: 20rpx;

    .phone {
      position: relative;
      margin-bottom: 60rpx;

      .left {
        position: absolute;
        left: 10rpx;
        color: #333333;
        font-size: 30rpx;
      }

      .right {
        position: absolute;
        right: 10rpx;
        color: #333333;
        font-size: 30rpx;
        top: 4rpx;
      }
    }

    .address {
      margin-bottom: 30rpx;
      color: #999999;
      font-size: 26rpx;
      margin-left: 10rpx;
    }

    .list-item-btn {
      display: flex;
      align-items: center;
      border-top: 2rpx solid #ebedf0;
      padding: 40rpx;
      font-size: 28rpx;
      color: #666666;

      .left-btn {
        margin-left: -20rpx;
        :deep(.checkbox-label) {
          font-size: 24rpx;
        }
        :deep(.checkbox) {
          margin: 0;
          padding: 0;
        }
      }
      .right-btn {
        display: flex;
        position: absolute;
        right: 0rpx;
        .delete-btn,
        .edit-btn {
          display: flex;
          align-items: center;
          width: 160rpx;
          height: 60rpx;
        }

        .ico-update,
        .ico-delete {
          display: inline-block;
          margin-right: 12rpx;
          width: 30rpx;
          height: 30rpx;
        }

        .ico-update {
          background: url("../../../static/common/ico-update.png") no-repeat;
          background-size: contain;
        }

        .ico-delete {
          background: url("../../../static/common/ico-delete.png") no-repeat;
          background-size: contain;
        }
      }
    }
  }

  .footer-btn {
    margin-top: 40rpx;
  }
}
</style>