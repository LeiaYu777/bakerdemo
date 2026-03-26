# Baker Inspection Demo

烘焙店智能巡检系统 Demo（React + Ant Design + ECharts）。

本项目用于客户演示，重点展示：
- 16 家门店巡检驾驶舱
- 8 个视觉巡检业务场景
- 巡检表单与视觉分析模拟
- 客户演示模式（脚本驱动自动切页 + 多语言字幕）

## 快速开始

```bash
npm install
npm run dev
```

默认访问：`http://localhost:5173`

## 目录结构

```text
src/
  pages/
    DashboardPage.jsx
    StoreListPage.jsx
    StoreDetailPage.jsx
    InspectionFormPage.jsx
    DemoModePage.jsx
  data/mockData.js
  utils/mockFactory.js
```

## 文档导航

- [快速启动与部署](./docs/QUICK_START.md)
- [用户手册](./docs/USER_MANUAL.md)
- [客户演示操作手册](./docs/DEMO_PLAYBOOK.md)
- [数据字典与脚本配置](./docs/DATA_DICTIONARY.md)
- [技术说明](./docs/TECHNICAL_NOTE.md)
- [常见问题 FAQ](./docs/FAQ.md)

## 说明

- 本项目无真实后端，无真实大模型调用。
- 所有门店、异常、视觉场景与字幕文本均为假数据或程序生成。
