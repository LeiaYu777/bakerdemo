# 快速启动与部署

## 1. 环境要求

- Node.js 18+
- npm 9+
- macOS / Windows / Linux 任意

## 2. 本地启动

```bash
npm install
npm run dev
```

浏览器访问：`http://localhost:5173`

## 3. 生产构建

```bash
npm run build
npm run preview
```

构建产物目录：`dist/`

## 4. 常用脚本

- `npm run dev`：开发模式
- `npm run build`：生产打包
- `npm run preview`：本地预览打包结果

## 5. 演示前检查清单

1. 页面路由可正常打开：`/dashboard`、`/stores`、`/stores/1`、`/inspection-form`、`/demo-mode`
2. Dashboard 图表正常渲染（折线图/柱状图）
3. 门店详情 8 个视觉场景可点击展开详情
4. 演示模式自动切页、暂停/继续、字幕开关可用
5. 演示模式语言切换（中文/英文/日语）可用

## 6. 建议演示设备

- 客户会议室大屏：1920x1080
- 普通笔记本：1440x900 以上
