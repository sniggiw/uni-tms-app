<template>
  <view class="empty-container">
    <image src="/static/common/notData.png" class="empty-image" />
    <text class="empty-text">NO data</text>
  </view>
</template>

<style>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.empty-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
</style>