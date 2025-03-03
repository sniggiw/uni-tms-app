<template>
  <view class="bill-confirm">
    <view class="custom-card container1">
      <view class="price-list">
        <view class="price-title">
          <view>{{ $t("billConfirm.serialNumber") }}</view>
          <view>{{ $t("billConfirm.costItem") }}</view>
          <view>{{ $t("billConfirm.amount") }}</view>
        </view>
        <view class="price-item" v-for="(item, index) in billInfo.bills" :key="index">
          <view>{{ index + 1 }}</view>
          <view>{{ item.costItem }}</view>
          <view class="price">
            ({{ item.currency }}){{ item.totalPrice }}({{ item.unit }})
          </view>
        </view>
        <view class="summation">
          <view>{{ $t("common.summation") }}</view>
          <view class="total-all">
            <template v-if="billInfo.total">
              <span class="total-amount" v-for="(item, index) in billInfo.total" :key="index">({{ item.currency }}){{
                item.amount }}</span>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view class="custom-card container2" v-if="billInfo.guide">
      <view class="title">{{ billInfo.guide.title }}</view>
      <view class="content" v-html="billInfo.guide.guideDesc"></view>
    </view>
    <!-- 入库数据查看-专线独有 -->
    <view class="custom-card container2" v-if="flowTemplateId == 1">
      <view class="receipt-title">{{ $t("receiptConfirm.note") }}</view>
      <view class="custom-card img-container" v-if="images && images.length">
        <view class="title">{{ $t("receiptConfirm.warehouseImg") }}</view>
        <view class="img-list">
          <image :src="item" v-for="(item, index) in images" :key="index" @tap="
            receiptShowImage = true;
          startPosition = index;
          " />
        </view>
      </view>
      <view class="custom-card sum-container">
        <myCell :title="$t('receiptConfirm.finalPrice')" :value="finalPrice + ' ' + finalPriceUnt" />
        <myCell :title="$t('receiptConfirm.finalPriceDesc')" :value="finalPriceDesc" />
      </view>
      <view class="custom-card sum-container">
        <myCell :title="$t('goods.totalWeightSum')" :value="totalWeightSum.toFixed(2)" />
        <myCell :title="$t('goods.zxTotalMateWeightSum')" :value="totalMateWeightSum.toFixed(2)" />
      </view>
    </view>
    <view class="custom-card pay-method" v-if="pendingState === 'CONFIRM_BILL'">
      <uni-data-picker :localdata="payKind" :map="{ text: 'name', value: 'value' }" v-model="billInfo.payKind"
        :placeholder="$t('billConfirm.payKindPlaceholder')" />
      <uni-data-picker :label="$t('billConfirm.outMemo')" :localdata="outMemo" :map="{ text: 'name', value: 'value' }"
        v-model="billInfo.outMemo" :placeholder="$t('billConfirm.outMemoPlaceholder')" />
      <uni-data-picker :label="$t('billConfirm.isNeedPaper')" :localdata="sysYesNo" ref="isNeedPaper"
        :map="{ text: 'name', value: 'value' }" v-model="billInfo.isNeedPaper"
        :placeholder="$t('billConfirm.isNeedPaperPlaceholder')" />
    </view>
    <view class="custom-card container4" v-if="pendingState === 'CONFIRM_BILL'">
      <my-cell :title="$t('billConfirm.downloadExecl')">
        <template #right>
          <button class="down-btn" @tap="downloadBillsExcel">{{
            $t("common.download")
            }}</button>
        </template>
      </my-cell>
      <my-cell :title="$t('billConfirm.downloadPdf')">
        <template #right>
          <button class="down-btn" @tap="downloadBillsPdf">{{
            $t("common.download")
            }}</button>
        </template>
      </my-cell>
    </view>
    <view class="footer-btn">
      <template v-if="pendingState === 'CONFIRM_BILL'">
        <uni-button type="default confirm-btn" @tap="billConfirm()">{{
          $t("billConfirm.approvalBill")
          }}</uni-button>
      </template>
      <template v-if="pendingState === 'PAID'">
        <uni-button type="default confirm-btn" @tap="paymentCompleted()">{{
          $t("billConfirm.paymentCompleted")
          }}</uni-button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDictTypes } from "@/api/common";
import { getBillInfo, getBillsVoucher, zxIncomeInfo, billConfirmZx, billsPay, downloadBillsExcelZx, downloadBillsPdfZx } from "@/api/order";
import { onLoad } from "@dcloudio/uni-app";
import myCell from "../../../../components/myCell/index.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const showConfirm = ref(false);
const confirmMessage = ref('');
const confirmBtnType = ref(undefined);
const flowTemplateId = ref('');
const showImage = ref(false);
const imagePreview = ref([]);
const orderId = ref('');
const pendingState = ref('');
const orderCode = ref('');
const payKind = ref([]);
const outMemo = ref([]);
const sysYesNo = ref([]);
const billInfo = ref({
  bills: [],
  guide: {},
  total: [],
});
const fileList = ref([]);
const receiptShowImage = ref(false);
const startPosition = ref(0);
const images = ref([]);
const finalPrice = ref('');
const finalPriceDesc = ref('');
const finalPriceUnt = ref('');
const totalWeightSum = ref(0);
const totalMateWeightSum = ref(0);
const couponArray = ref([]);
const couponTotal = ref('');

onMounted(() => {
  getBillInfoData();
  if (pendingState.value === 'PAID') {
    getBillsVoucherData();
  }
  if (flowTemplateId.value == 1) {
    getZxIncomeInfoData();
  }
  // couponData();
  let dicTitles = "付款方式,专线设置.出货要求,系统是否";
  getDictTypes({ dicTitles }).then((response) => {
    payKind.value = response.data["付款方式"];
    outMemo.value = response.data["专线设置.出货要求"];
    sysYesNo.value = response.data["系统是否"];
  });
});

onLoad((options) => {
  flowTemplateId.value = options.flowTemplateId;
  orderId.value = options.id;
  pendingState.value = options.pendingState;
  orderCode.value = options.orderCode;
});

const getBillInfoData = async () => {
  const res = await getBillInfo({ orderId: orderId.value });
  if (res.code === 200) {
    billInfo.value = res.data;
  } else {
    uni.showToast({ title: res.msg, duration: 2000 });
  }
};

const getZxIncomeInfoData = async () => {
  const res = await zxIncomeInfo({ orderId: orderId.value });
  if (res.code === 200) {
    finalPrice.value = res.data.finalPrice;
    finalPriceDesc.value = res.data.finalPriceDesc;
    finalPriceUnt.value = res.data.finalPriceUnt;
    images.value = res.data.attachfiles?.map(file => file.url) || [];
  } else {
    uni.showToast({ title: res.msg, duration: 2000 });
  }
};

// const couponData = async () => {
//   const res = await Api.getCouponList({ usageStatus: '未使用' });
//   if (res.code === 200) {
//     couponArray.value = res.rows;
//     couponTotal.value = res.total;
//   } else {
//     uni.showToast({ title: res.msg, duration: 2000 });
//   }
// };

const paymentCompleted = () => {
  if (fileList.value.length <= 0) {
    uni.showToast({ title: $t('billConfirm.fileListPlaceholder'), duration: 2000 });
    return;
  }
  showConfirm.value = true;
  confirmMessage.value = $t('confirmTips.confirmCompletePayment');
  confirmBtnType.value = 2;
};

const billConfirm = async () => {
  // 校验逻辑
  if (!billInfo.value.payKind) {
    uni.showToast({ title: t('billConfirm.payKindPlaceholder'), duration: 2000, icon: 'none' });
    return;
  }
  if (!billInfo.value.outMemo) {
    uni.showToast({ title: t('billConfirm.outMemoPlaceholder'), duration: 2000, icon: 'none' });
    return;
  }
  if (!billInfo.value.isNeedPaper) {
    uni.showToast({ title: t('billConfirm.isNeedPaperPlaceholder'), duration: 2000, icon: 'none' });
    return;
  }
  uni.showModal({
    content: t('confirmTips.confirmCompletePayment'), // 弹窗内容
    confirmText: t('common.confirm'), // 确认按钮文字
    cancelText: t('common.cancel'), // 取消按钮文字
    success: async (modalRes) => {
      if (modalRes.confirm) {
        // 用户点击了确认按钮
        const params = {
          isNeedPaper: billInfo.value.isNeedPaper,
          orderId: orderId.value,
          outMemo: billInfo.value.outMemo,
          payKind: billInfo.value.payKind,
        };
        const res = await billConfirmZx(params);
        if (res.code === 200) {
          uni.showToast({ title: t('billConfirm.confirm'), duration: 2000, icon: 'none' });
          uni.navigateBack(); // 返回上一页
        } else {
          uni.showToast({ title: res.msg, duration: 2000, icon: 'none' });
        }
      } else if (modalRes.cancel) {
        // 用户点击了取消按钮

      }
    },
  });
};

const onConfirm = () => {
  if (confirmBtnType.value === 1) {
    billConfirmSubmit();
  } else if (confirmBtnType.value === 2) {
    paymentCompletedSubmit();
  }
};

const paymentCompletedSubmit = async () => {
  const res = await billsPay({ orderId: orderId.value });
  if (res.code === 200) {
    uni.showToast({ title: $t('billConfirm.completed'), duration: 2000, icon: 'none' });
    uni.navigateBack();
  } else {
    uni.showToast({ title: res.msg, duration: 2000, icon: 'none' });
  }
};

const getBillsVoucherData = async () => {
  const res = await getBillsVoucher({ orderId: orderId.value });
  if (res.code === 200) {
    fileList.value = res.data;
  } else {
    uni.showToast({ title: res.msg, duration: 2000, icon: 'none' });
  }
};

const beforeRead = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    uni.showToast({ title: $t('common.imgUploadTip'), duration: 2000, icon: 'none' });
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
      console.error(err.message);
    },
  });
};

const commonUpload = async (file) => {
  file.status = 'uploading';
  file.message = $t('common.uploading');
  const formData = new FormData();
  formData.append('file', file.file);
  const res = await Api.commonUpload(formData);
  if (res.code === 200) {
    file.status = 'done';
    const fileData = res.data;
    fileData.orderId = orderId.value;
    const saveRes = await Api.saveBillsVoucher(fileData);
    if (saveRes.code === 200) {
      getBillsVoucher();
      uni.showToast({ title: $t('common.uploadSuccess'), duration: 2000 });
    } else {
      file.status = 'failed';
      file.message = $t('common.uploadFailed');
      uni.showToast({ title: saveRes.msg, duration: 2000 });
    }
  } else {
    file.status = 'failed';
    file.message = $t('common.uploadFailed');
    uni.showToast({ title: res.msg, duration: 2000 });
  }
};

const beforeDelete = async (data, data2) => {
  const res = await Api.commonDelAttachfiles({ ids: data.id });
  if (res.code === 200) {
    fileList.value.splice(data2.index, 1);
    uni.showToast({ title: $t('common.deleteSuccess'), duration: 2000 });
  } else {
    uni.showToast({ title: res.msg, duration: 2000 });
  }
};

const downloadBillsExcel = async () => {
  try {
    // 调用接口获取下载信息
    const res = await downloadBillsExcelZx({ orderId: orderId.value });

    if (res.code === 200) {
      const baseUrl = 'https://www.gosun2.com/tms-app'; // 替换为实际的后端地址
      const downloadResource = (params) => {
        const { resource, delete: deleteFlag, downloadName } = params;
        return `${baseUrl}/common/download/resource?resource=${resource}&delete=${deleteFlag}&downloadName=${downloadName}`;
      };

      // 构建下载链接
      const downloadUrl = downloadResource({
        resource: encodeURIComponent(res.data.path),
        delete: true,
        downloadName: res.data.title,
      });

      // 确保 downloadUrl 是一个有效的字符串
      if (typeof downloadUrl !== 'string') {
        throw new Error('下载链接无效');
      }

      // 判断运行环境
      if (uni.getSystemInfoSync().platform === 'h5') {
        // H5 环境：使用浏览器的下载功能
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = res.data.title || 'file.xlsx'; // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        uni.showToast({
          title: '文件下载成功',
          icon: 'success',
        });
      } else {
        // App 或微信小程序环境：使用 uni.downloadFile 和 uni.saveFile
        uni.downloadFile({
          url: downloadUrl,
          success: (downloadRes) => {
            if (downloadRes.statusCode === 200) {
              console.log('文件下载成功，临时路径:', downloadRes.tempFilePath);
              // 下载成功，保存文件到本地
              uni.saveFile({
                tempFilePath: downloadRes.tempFilePath,
                success: (saveRes) => {
                  console.log('文件保存成功，保存路径:', saveRes.savedFilePath);
                  uni.showToast({
                    title: '文件下载成功',
                    icon: 'success',
                  });
                },
                fail: (saveErr) => {
                  console.error('文件保存失败', saveErr);
                  uni.showToast({
                    title: '文件保存失败',
                    icon: 'none',
                  });
                },
              });
            } else {
              console.error('下载失败，状态码:', downloadRes.statusCode);
              uni.showToast({
                title: '下载失败',
                icon: 'none',
              });
            }
          },
          fail: (err) => {
            console.error('下载失败', err);
            uni.showToast({
              title: '下载失败',
              icon: 'none',
            });
          },
        });
      }
    } else {
      console.error('接口返回错误', res.msg);
      uni.showToast({
        title: res.msg || '下载失败',
        icon: 'none',
      });
    }
  } catch (error) {
    console.error('下载失败', error);
    uni.showToast({
      title: error.message || '下载失败',
      icon: 'none',
    });
  }
};
const downloadBillsPdf = async () => {
  const res = await downloadBillsPdfZx({ orderId: orderId.value });
  if (res.code === 200) {
    // window.location.href = Api.downloadResource({
    //   resource: encodeURIComponent(res.data.path),
    //   delete: true,
    //   downloadName: res.data.title,
    // });
  } else {
    uni.showToast({ title: res.msg, duration: 2000, icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.bill-confirm {
  padding-bottom: 260rpx;

  .container1,
  .container2,
  .container3,
  .container4,
  .pay-method,
  .couponContainer {
    margin: 30rpx;
  }

  .container1 {
    .price-list {
      font-size: 30rpx;

      .price-title,
      .price-item {
        display: flex;
        align-items: center;
        justify-content: center;

        >view {
          flex: 1;
          text-align: center;

          &:first-child {
            text-align: center;
            width: 100rpx;
            flex: none;
          }
        }
      }

      .price-title {
        background: rgba(223, 48, 48, 0.1);
        height: 88rpx;
        color: #a55b5b;
      }

      .price-item {
        position: relative;
        height: 100rpx;

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

        .price {
          font-size: 28rpx;
        }
      }

      .summation {
        display: flex;
        align-items: center;
        overflow: auto;
        padding: 30rpx;
        font-size: 32rpx;
        color: #666666;

        >view {
          flex: 1;
          text-align: right;
        }

        .total-all {
          display: flex;
          flex-flow: wrap;
          text-align: left;
          margin-left: 20rpx;
        }

        .total-amount {
          margin-left: 6rpx;
          font-size: 38rpx;
          color: #df3030;
        }
      }
    }
  }

  .container2 {
    padding: 30rpx;

    .title {
      text-align: center;
      padding: 20rpx;
      background: #fffaf2;
      box-shadow: 0rpx 6rpx 8rpx 2rpx rgba(232, 225, 225, 0.3);
      border-radius: 30rpx;
      border: 2rpx solid #f2deb9;
      font-size: 28rpx;
      color: #e68c57;
      margin-bottom: 50rpx;
    }
  }

  .pay-method {
    :deep(.view) {

      .uni-button {
        padding: 0 25rpx;
        border-radius: 36rpx;
        border: 2rpx solid #df3030;
        background: #fff;
        font-size: 28rpx;
        color: #df3030;
        width: auto;
        height: 50rpx;
        line-height: normal;
      }
    }

    :deep(.uni-data-tree) {
      .input-value-border {
        border: none;
      }
    }

  }

  .container3 {
    .title {
      padding: 36rpx 30rpx 30rpx;
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
  }

  .couponContainer {
    padding-bottom: 24rpx;

    .h1 {
      font-size: 30rpx;
      color: #333333;
      display: flex;
      align-items: center;
      margin: 24rpx 0rpx 10rpx 30rpx;

      .line {
        width: 6rpx;
        height: 26rpx;
        background: #de302f;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        margin-right: 10rpx;
      }

      .quantity {
        border-radius: 42rpx;
        background: #de302f;
        padding: 0rpx 20rpx 0rpx 20rpx;
        text-align: center;
        height: 34rpx;
        line-height: 34rpx;
        font-size: 22rpx;
        color: #ffffff;
        margin-left: 10rpx;
      }
    }

    .h2 {
      display: flex;
      align-items: center;
      margin: 20rpx 0rpx 10rpx 24rpx;
      font-size: 28rpx;
      color: #f86e21;

      .icon-tip {
        display: inline-block;
        width: 32rpx;
        height: 32rpx;
        background: url("../../../../static/marketing/billConfirmTip.png") no-repeat;
        background-size: contain;
        margin-right: 10rpx;
      }
    }

    .coupon-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 26rpx;
      color: #666666;
      margin: 32rpx 24rpx 10rpx 24rpx;

      >view {
        display: flex;
        align-items: center;
      }

      .item-left {
        .icon-coupon {
          display: inline-block;
          width: 42rpx;
          height: 32rpx;
          background: url("../../../../static/marketing/billConfirm-couponIcon.png") no-repeat;
          background-size: contain;
          margin-right: 10rpx;
        }
      }

      .item-right {
        color: #de302f;

        .uni-radio-group {
          margin-left: 10rpx;
        }
      }
    }

    .cope-with {
      display: flex;
      align-items: center;
      justify-content: right;

      .with-line {
        position: relative;
        margin: 0rpx 20rpx 0rpx 20rpx;
      }

      .with-line::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 45%;
        width: 70%;
        border-bottom: 2rpx solid black;
        margin-left: 25%;
      }
    }
  }

  .container4 {
    .view {
      align-items: center;
    }

    .down-btn {
      height: 70rpx;
      background: #ffffff;
      border-radius: 36rpx;
      border: 2rpx solid #df3030;
      font-size: 28rpx;
      line-height: 70rpx;
      color: #df3030;
    }
  }

  .footer-btn {
    :deep(.uni-button--default) {
      width: 300rpx;
      padding: 0 30rpx;
      color: #ffffff;
    }

    // button + button {
    //   margin-left: 50rpx;
    // }
  }

  .custom-card {
    margin-top: 20rpx;

    .receipt-title {
      font-size: 36rpx;
    }
  }

  .receipt-confirm {
    padding: 30rpx 30rpx 260rpx;

    .img-container {
      padding: 30rpx;
      margin-bottom: 30rpx;

      .title {
        padding-bottom: 30rpx;
        font-size: 36rpx;
        color: #000;
        font-weight: bold;
        border-bottom: 2rpx solid #dee2e4;
      }

      .img-list {
        display: flex;
        flex-flow: wrap;

        :deep(.uni-image) {
          overflow: hidden;
          width: 190rpx;
          margin-right: 30rpx;
          margin-top: 30rpx;
          border-radius: 20rpx;

          &:nth-child(3n) {
            margin-right: 0rpx;
          }
        }
      }
    }

    .sum-container {
      margin-bottom: 30rpx;
      margin-top: 30rpx;

      .uni-cell__title {
        flex: none;
      }
    }

    .goods-container {
      margin-bottom: 30rpx;

      .goods-desc {
        position: relative;
        background: #ffffff;

        .serial-num {
          position: absolute;
          top: 0;
          left: 0;

          .ico-serial-num {
            width: 70rpx;
            height: 60rpx;
          }

          .num {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70rpx;
            height: 60rpx;
            font-size: 36rpx;
            color: #ffffff;
          }
        }

        .goods-item {
          position: relative;
          padding: 0 30rpx;
          display: flex;

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

          .left,
          .center,
          .right {
            text-align: center;
            flex: 1;
            padding: 30rpx 0 24rpx;

            >view {
              &:first-child {
                font-size: 26rpx;
                color: #999999;
              }

              &:last-child {
                margin-top: 10rpx;
                font-size: 30rpx;
                font-weight: bold;
              }
            }
          }
        }
      }
    }

    .footer-btn {
      position: fixed;
      left: 0;
      width: 100%;
      background: #ffffff;
      padding: 20rpx 0;
      text-align: center;
      box-shadow: 0rpx -6rpx 6rpx #ebedf0;

      :deep(.uni-button--default) {
        font-size: 32rpx;
        height: 90rpx;
        width: auto;
        min-width: 280rpx;
        border-radius: 90rpx;
        line-height: 90rpx;
        padding: 0 30rpx;
        color: #ffffff;
        border: 2rpx solid #bb3f47;
      }

      button+button {
        margin-left: 20rpx;
        margin-top: 10rpx;
      }

      .confirm-btn {
        border: 2rpx solid #bb3f47;
      }

      .cust-btn {
        color: #ffffff;
        border: 2rpx solid #bb3f47;
      }
    }
  }
}
</style>