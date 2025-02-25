<template>
  <view class="empty-container">
    <img src="/static/common/notData.png" class="empty-image" />
    <text class="empty-text">NO data</text>
  </view>
</template>

<style>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>