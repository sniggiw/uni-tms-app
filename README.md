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
