<template>
    <view class="custom-picker">
        <!-- 搜索框 -->
        <view class="search-box">
            <input type="text" v-model="searchKeyword" placeholder="请输入搜索内容" class="search-input" />
        </view>

        <!-- 当有搜索关键词时显示搜索结果 -->
        <scroll-view v-if="searchKeyword" scroll-y class="search-result">
            <view v-for="(item, index) in filteredOptions" :key="index" class="search-item" :class="{ active: isSelected(item) }" @tap="handleSearchItemClick(item)">
                {{ item.label }}
            </view>
        </scroll-view>

        <!-- 无搜索关键词时显示普通选择器 -->
        <picker v-else mode="multiSelector" :range="displayColumns" :value="selectedIndexes" @change="handleChange" @columnchange="handleColumnChange" range-key="label">
            <view class="picker-content">
                <view class="picker-text">{{ selectedText }}</view>
            </view>
        </picker>
    </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
    // 选项数据，格式：[{label: '显示文本', value: '实际值', children: []}]
    options: {
        type: Array,
        default: () => [],
    },
    // 当前选中的值
    modelValue: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["update:modelValue"]);

// 搜索关键词
const searchKeyword = ref("");

// 选中的索引数组
const selectedIndexes = ref([]);

// 显示的列数据
const displayColumns = ref([]);

// 当前选中的完整选项
const selectedOptions = ref([]);

// 初始化数据
const initPickerData = () => {
    displayColumns.value = [props.options];
    updateColumns(0);
    syncSelectedIndexes();
};

// 更新列数据
const updateColumns = (columnIndex) => {
    let currentOptions = props.options;
    let currentIndexes = selectedIndexes.value;

    // 根据已选择的值更新每一列
    for (let i = 0; i <= columnIndex; i++) {
        if (currentOptions && currentIndexes[i] !== undefined) {
            const selectedOption = currentOptions[currentIndexes[i]];
            if (selectedOption && selectedOption.children) {
                if (i + 1 < displayColumns.value.length) {
                    displayColumns.value[i + 1] = selectedOption.children;
                } else {
                    displayColumns.value.push(selectedOption.children);
                }
                currentOptions = selectedOption.children;
            }
        }
    }

    // 清除后续列
    displayColumns.value = displayColumns.value.slice(0, columnIndex + 2);
};

// 同步选中索引
const syncSelectedIndexes = () => {
    selectedIndexes.value = [];
    selectedOptions.value = [];

    let currentOptions = props.options;
    props.modelValue.forEach((value, index) => {
        const optionIndex = currentOptions.findIndex((item) => item.value === value);
        if (optionIndex !== -1) {
            selectedIndexes.value[index] = optionIndex;
            selectedOptions.value[index] = currentOptions[optionIndex];
            currentOptions = currentOptions[optionIndex].children || [];
        }
    });
};

// 处理列变化
const handleColumnChange = (e) => {
    const { column, value } = e.detail;
    selectedIndexes.value[column] = value;
    updateColumns(column);
};

// 处理选择器变化
const handleChange = (e) => {
    const indexes = e.detail.value;
    const values = [];
    let currentOptions = props.options;

    indexes.forEach((index, column) => {
        if (currentOptions[index]) {
            values.push(currentOptions[index].value);
            currentOptions = currentOptions[index].children || [];
        }
    });

    emit("update:modelValue", values);
};

// 搜索结果
const filteredOptions = computed(() => {
    if (!searchKeyword.value) return [];

    const result = [];
    const search = (options, path = []) => {
        options.forEach((option) => {
            if (option.label.includes(searchKeyword.value)) {
                result.push({
                    ...option,
                    path: [...path, option],
                });
            }
            if (option.children) {
                search(option.children, [...path, option]);
            }
        });
    };

    search(props.options);
    return result;
});

// 判断选项是否被选中
const isSelected = (item) => {
    return props.modelValue.includes(item.value);
};

// 处理搜索结果点击
const handleSearchItemClick = (item) => {
    if (item.path) {
        const values = item.path.map((p) => p.value);
        emit("update:modelValue", values);
        searchKeyword.value = ""; // 清空搜索
    }
};

// 计算选中文本
const selectedText = computed(() => {
    return selectedOptions.value.map((option) => option.label).join(" / ") || "请选择";
});

// 监听选项变化
watch(() => props.options, initPickerData, { immediate: true });

// 监听值变化
watch(() => props.modelValue, syncSelectedIndexes, { immediate: true });
</script>

<style lang="scss" scoped>
.custom-picker {
    .search-box {
        padding: 20rpx;

        .search-input {
            width: 100%;
            height: 70rpx;
            padding: 0 20rpx;
            border: 1rpx solid #ddd;
            border-radius: 8rpx;
            font-size: 28rpx;
        }
    }

    .search-result {
        max-height: 400rpx;

        .search-item {
            padding: 20rpx;
            font-size: 28rpx;
            border-bottom: 1rpx solid #eee;

            &.active {
                color: #007aff;
            }
        }
    }

    .picker-content {
        padding: 20rpx;

        .picker-text {
            font-size: 28rpx;
            color: #333;
        }
    }
}
</style>
