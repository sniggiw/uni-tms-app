### uni-tms-app

-   使用 uniapp 重构 tms-app

### 注意事项

-   node 版本 22.11.0
-   安装依赖使用 pnpm

### 使用 vs code 开发 uniapp 项目的前期准备

1. 需要先安装几个插件
    - uni-create-view：用于快速创建 uniapp 视图与组件，安装后记得先打开起设置，将除了 ts 的选项外全部勾选，将 css 预处理器的类型设置为 scss、将 选择创建的模板 设置为 vue3；
    - uni-helper：增强 uniapp 在 vs code 中的开发体验，包括代码提示、自动补全、代码片段等，ctrl + i 唤起代码提示；
    - uniapp 小程序扩展：用于提示 uniapp 相关的文档提示；
2. 打开 vs code 的设置，搜索 文件关联，将 manifest.json、pages.json 两个文件添加进去，值为 jsonc，目的是让这两个 json 文件可以写注释（注意，uniapp 项目里面只有这两个文件可以写注释，其他的 json 文件不要添加进去）；

### 开发过程记录点

1. 因为项目是需要兼容 H5 和 小程序的，在 H5 中，顶部的导航栏不需要出现，但是在小程序中，顶部的导航栏需要出现，后续顶部导航栏的显隐需要动态根据环境来控制；
    - 在 pages.json 文件中，pages 属性中的每个对象都可以通过 style 属性来设置页面的样式，其中 navigationStyle 属性可以设置导航栏的样式，设置为 custom 可以隐藏导航栏，设置为 default 可以显示导航栏；
2. 持久化的设置
    - 需要安装 pinia 和 pinia-plugin-persistedstate 两个插件，前者是状态管理器，后者是持久化插件；
    - 在 H5 页面 和 小程序页面 中，持久化的配置是不一样的，现在暂时是使用 H5 的写法配置，后续需要根据动态环境来配置；
3. 安装 sass-embedded / sass，控制台会报一个警告，但是不影响使用，如果想去掉这个警告，在 vite.config.js 中配置：

    ```js
    export default defineConfig({
        ...
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                    silenceDeprecations: ["legacy-js-api"],
                },
            },
        },
    });
    ```

4. uniapp 的移动端适配，在样式中直接使用 rpx 单位即可，设计稿按照 750 宽度来设计；
5. 安装 uni-ui，并且在 pages.json 中设置自动引入：
    ```js
    "easycom": {
        "autoscan": true,
        "custom": {
            "^u-(.*)": "@/uni_modules/uni-ui/components/u-$1/u-$1.vue"
        }
    }
    ```
6. 封装 http
    - 使用 uni.request 来封装 http，需要处理请求和响应的拦截，以及错误处理；
7. 使用 axios 来封装请求
