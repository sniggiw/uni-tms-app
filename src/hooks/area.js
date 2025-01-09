import { ref, computed, reactive } from "vue";
import { areaList } from "@/db";

export function useAreaList() {
    // 当前选择的地区信息
    const selectAreaText = reactive({
        countryText: "中国",
        provinceText: "北京市",
        cityText: "",
    });

    // 原始的地区信息（根据接口返回的数据）
    const originAreaList = ref(areaList);

    // 国家列表，格式为中文字符串 ['中国','韩国',...]
    const countryList = computed(() => {
        if (!originAreaList.value.length) return [];
        return originAreaList.value.map((item) => item.areaName);
    });

    // 省份列表，根据 countryList 的值来获取对应的省份信息，格式为中文字符串 ['北京','上海','广东省'...]
    const provinceList = computed(() => {
        if (!originAreaList.value.length || !countryList.value.length) return [];
        return originAreaList.value.find((item) => item.areaName === selectAreaText?.countryText)?.children.map((pItem) => pItem.areaName);
    });

    // 城市列表，根据 provinceList 的值来获取对应的省份信息，格式为中文字符串 ['广州市','深圳市',...]
    const cityList = computed(() => {
        if (!originAreaList.value.length || !countryList.value?.length || !provinceList.value?.length) return [];
        return (
            originAreaList.value
                .find((item) => item.areaName === selectAreaText.countryText)
                .children.find((pItem) => pItem.areaName === selectAreaText.provinceText)
                ?.children?.map((cItem) => cItem.areaName) || []
        );
    });

    // 当前选择的地区的 areaCode 值
    const selectAreaCode = computed(() => {
        if (!originAreaList.value.length) return { countryAreaCode: "", provinceAreaCode: "", cityAreaCode: "" };

        const countryAreaCode = originAreaList.value.find((item) => item.areaName === selectAreaText.countryText).areaCode;
        const provinceAreaCode = originAreaList.value
            .find((item) => item.areaName === selectAreaText.countryText)
            .children.find((pItem) => pItem.areaName === selectAreaText.provinceText).areaCode;
        const cityAreaCode = originAreaList.value
            .find((item) => item.areaName === selectAreaText.countryText)
            .children?.find((pItem) => pItem.areaName === selectAreaText.provinceText)
            ?.children?.find((cItem) => cItem.areaName === selectAreaText.cityText).areaCode;

        return { countryAreaCode, provinceAreaCode, cityAreaCode };
    });

    /**
     * @param {*} column 第几列的数据发生了更改
     * @param {*} index 选中了第几个数据（索引值）
     */
    const changeSelectAreaText = (column, index) => {
        /**
         * 如果修改的是第一列，也就是切换了国家的选项，那么：
         *      - 根据传递过来的 index 索引值，修改成对应的国家信息
         *      - 第二列和第三列的选项应该重置为第一项
         *
         * 如果修改的是第二列，也就是切换了省份的选项，那么：
         *      - 根据传递过来的 index 索引值，修改成对应的省份信息
         *      - 第三列的选项应该重置为第一项
         *
         * 如果修改的是第三列，也就是切换了城市的选项，那么：
         *      - 根据传递过来的 index 索引值，修改成对应的城市信息
         */
        if (column == 0) {
            selectAreaText.countryText = countryList.value[index];
            selectAreaText.provinceText = provinceList.value[0] || "";
            selectAreaText.cityText = cityList.value[0] || "";
        } else if (column == 1) {
            selectAreaText.provinceText = provinceList.value[index];
            selectAreaText.cityText = cityList.value[0] || "";
        } else if (column == 2) {
            selectAreaText.cityText = cityList.value[index];
        }
    };

    return {
        originAreaList,
        countryList,
        provinceList,
        cityList,
        selectAreaCode,
        changeSelectAreaText,
    };
}
