# 数据字典与脚本配置

## 1. 假数据文件

主文件：`src/data/mockData.js`

主要导出对象：
- `stores`：16 家门店数据
- `dashboardMetrics`：首页核心指标
- `scoreTrend`：评分趋势
- `anomalyDistribution`：异常分布
- `inspectionFormTemplate`：巡检表单模板
- `bossEvaluationMetrics`：老板评估指标

## 2. 门店对象结构（stores[]）

```js
{
  id,
  name,
  address,
  score,
  coverage,
  dimensions: { product, environment, staff, equipment },
  visualScenarios: [...8个场景],
  anomalies: [...8-10条异常],
  anomalyCount,
  rectificationRate,
  productPassRate,
  environmentPassRate,
  historicalScores
}
```

## 3. 视觉场景结构（visualScenarios[]）

```js
{
  id,
  key,               // stockout / misplacement / alignment / ...
  title,
  result,            // 达标 / 异常
  severity,          // 高 / 中 / 低
  location,
  summary,
  recommendation,
  image,             // 占位图 data URL
  data: {}           // 场景细分字段
}
```

## 4. 8 个场景 key 对照

- `stockout`：缺货 / 空位检测
- `misplacement`：商品错位 / 串货
- `alignment`：排面整齐度 / 对齐度检测
- `priceTag`：价签合规检测
- `orientation`：商品朝向 / 正反检测
- `promo`：堆头 / 促销区合规检测
- `cleanliness`：货架清洁 & 异物检测
- `newProduct`：重点 / 新品陈列合规检测

## 5. 演示脚本结构（DemoMode）

演示脚本在 `src/pages/DemoModePage.jsx` 中由 `createDemoScript(store)` 生成。

单页脚本对象示例：

```js
{
  pageId: 'scene-stockout',
  pageTitle: '缺货 / 空位检测',
  sceneType: 'stockout',
  metrics: [
    { label: '检测结果', value: '异常', suffix: '' }
  ],
  subtitleText: {
    zh: '...中文...',
    en: '...english...',
    ja: '...日本語...'
  },
  scenario: { ... }
}
```

## 6. 如何扩展脚本

1. 在 `createDemoScript` 新增页面对象
2. 为该页面补充 `subtitleText.zh/en/ja`
3. 在 `renderCurrentStep()` 中增加对应 `sceneType` 渲染分支
4. 运行 `npm run build` 验证
