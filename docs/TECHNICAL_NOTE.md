# 技术说明

## 1. 技术栈

- React 19
- Vite 7
- Ant Design 5
- ECharts + echarts-for-react
- React Router 7

## 2. 架构概览

- `src/App.jsx`：整体布局与路由
- `src/pages/*.jsx`：页面层
- `src/data/mockData.js`：假数据与业务场景数据
- `src/utils/mockFactory.js`：随机数据与占位图生成
- `src/styles.css`：主题与布局样式

## 3. 关键设计点

## 3.1 数据层

- 通过固定随机种子生成伪随机数据，保证每次启动数据稳定
- 每店生成：
  - 8 个视觉场景
  - 8-10 条异常记录
  - 多维评分与趋势数据

## 3.2 演示模式

- 在 `DemoModePage.jsx` 内通过 `createDemoScript(store)` 生成脚本 JSON
- 使用 React Hooks + `setInterval` 实现倒计时与自动切页
- 支持：
  - 页停留时长可配（30-60 秒）
  - 循环播放 / 播放后停止
  - 字幕多语言切换（zh/en/ja）
  - 手动跳页、暂停、全屏

## 3.3 可视化

- 折线图：门店巡检评分趋势
- 柱状图：门店异常数量分布
- 场景卡片：状态标签 + 指标条 + 占位图

## 4. 可扩展建议

1. 将 `mockData.js` 拆分为 `services/mock/*.js` 按领域管理
2. 将 `createDemoScript` 独立为可配置 JSON 文件
3. 增加 i18n 框架（如 `react-intl`）统一管理多语言
4. 增加权限层和审计日志，支持真实业务接入

## 5. 已知限制

- 当前无真实后端、无登录体系
- 数据仅演示用途，不代表真实门店运营结果
- 大屏自动轮播场景下，部分表格信息会做简化展示
