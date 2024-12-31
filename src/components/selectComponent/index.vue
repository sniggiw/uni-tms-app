<template>
  <view class="select-component">
    <uni-easyinput
      readonly
      clickable
      v-model="inputValue"
      :label="label"
      class="select-cell"
      :placeholder="placeholder"
      @click="showPicker = true"
      :required="requireContent"
      :right-icon="rightIcon"
      :rules="rules"
    >
      <template #button>
        <slot name="button"></slot>
      </template>
    </uni-easyinput>

    <uni-popup ref="popup" :show="showPicker" position="bottom" @maskClick="showPicker = false">
      <uni-picker
        ref="selectPicker"
        show-toolbar
        :columns="columnsData"
        :value-key="nameKey"
        :default-index="defaultIndex"
        :loading="loading"
        @confirm="onConfirm"
        @cancel="onCancel"
      >
        <template #columns-top>
          <uni-search-bar
            v-model="keyword"
            v-if="needToSearch"
            :placeholder="searchTip"
            @confirm="toSearch"
          />
        </template>
      </uni-picker>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { UniEasyinput, UniPopup, UniPicker, UniSearchBar } from '@dcloudio/uni-ui';

// Props
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  requireContent: {
    type: Boolean,
    default: false
  },
  needToSearch: {
    type: Boolean,
    default: false
  },
  searchTip: {
    type: String,
    default: ''
  },
  nameKey: {
    type: String,
    default: 'name'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  value: {
    default: ''
  },
  columns: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['input', 'confirmMethod']);

// Refs
const loading = ref(false);
const showPicker = ref(false);
const defaultIndex = ref(0);
const inputValue = ref('');
const columnsBf = ref([]);
const columnsData = ref([]);
const keyword = ref('');
const selectPicker = ref(null);

// 监听 value 变化
watch(
  () => props.value,
  (newValue) => {
    echoSelect(newValue);
  },
  { immediate: true }
);

// 监听 columns 变化
watch(
  () => props.columns,
  (newColumns) => {
    columnsBf.value = newColumns;
    columnsData.value = newColumns;
    echoSelect(props.value);
  },
  { immediate: true }
);

// 确认选择
const onConfirm = (data) => {
  showPicker.value = false;
  if (Array.isArray(data)) {
    inputValue.value = data.toString();
    emit('input', data.toString());
  } else if (typeof data === 'object') {
    if (data.hasOwnProperty('value')) {
      emit('input', data[props.valueKey]);
    } else if (data.hasOwnProperty('areaName')) {
      emit('input', data.areaName);
    } else {
      emit('input', data[props.valueKey]);
    }
  }
  emit('confirmMethod', selectPicker.value.getValues());
};

// 取消选择
const onCancel = () => {
  showPicker.value = false;
};

// 数据回显
const echoSelect = (value) => {
  let newValue = '';
  if (typeof value === 'object') {
    newValue = value[props.valueKey];
  } else {
    newValue = value;
  }
  let hasData = false;
  columnsData.value.forEach((element, index) => {
    if (element[props.valueKey] + '' === newValue + '') {
      defaultIndex.value = index;
      inputValue.value = element[props.nameKey];
      hasData = true;
    }
  });
  if (!hasData) {
    inputValue.value = value;
  }
};

// 查询
const toSearch = () => {
  if (keyword.value) {
    searchData(JSON.parse(JSON.stringify(props.columns)));
  } else {
    columnsBf.value.forEach((element) => {
      element.tempTime = Math.random();
    });
    columnsData.value = columnsBf.value;
  }
};

// 筛选数据
const searchData = (sourceList) => {
  const filterData = (data) => {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element.tempTime = Math.random();
      if (element[props.nameKey].toUpperCase().includes(keyword.value.toUpperCase())) continue;
      if (element.children && element.children.length > 0) {
        element.children = filterData(element.children);
        if (element.children.length === 0) {
          data.splice(index, 1);
          index--;
        }
      } else {
        data.splice(index, 1);
        index--;
      }
    }
    return data;
  };
  columnsData.value = filterData(sourceList);
};
</script>

<style lang="scss" scoped>
.select-component {
  position: relative;

  :deep(.uni-easyinput__content) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 30rpx;
    bottom: 0;
    left: 30rpx;
    border-bottom: 2rpx solid #ebedf0;
    transform: scaleY(0.5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .uni-search-bar {
    margin: 20rpx 20rpx 20rpx;
    padding: 0;
    .uni-search-bar__content {
      background: #f5f5f5;
      border-radius: 40rpx;
      :deep(.uni-search-bar__input) {
        text-align: left;
        font-size: 28rpx;
      }
      .uni-icons-search {
        margin-right: 20rpx;
        font-size: 36rpx;
      }
    }
  }
}
</style>