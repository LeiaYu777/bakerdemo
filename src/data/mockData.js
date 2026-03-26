import { createPlaceholder, pickMany, pickOne, randomFloat, randomInt } from '../utils/mockFactory';

const storeNames = [
  '国贸中心店',
  '望京悠乐汇店',
  '三里屯太古里店',
  '大望路万达店',
  '中关村软件园店',
  '金融街旗舰店',
  '回龙观龙域店',
  '亦庄创研店',
  '五道口学院路店',
  '朝阳大悦城店',
  '海淀黄庄店',
  '通州运河店',
  '天通苑北苑店',
  '西二旗智造店',
  '亚运村安慧店',
  '丰台科技园店'
];

const skuPool = [
  '牛角包',
  '原味吐司',
  '蓝莓麦芬',
  '海盐奶盖卷',
  '焦糖可颂',
  '芝士贝果',
  '提拉米苏切片',
  '抹茶红豆卷'
];

const shelfPositions = [
  'A区-1层-01位',
  'A区-2层-03位',
  'B区-1层-02位',
  'B区-3层-06位',
  'C区-2层-04位',
  '新品区-黄金位-01',
  '收银旁促销区',
  '冷柜右侧-2层'
];

const storeRoads = ['建国路', '学院路', '科技园路', '北苑路', '中关村东路'];
const storeDistricts = ['朝阳区', '海淀区', '丰台区', '通州区'];
const rectificationStatusPool = ['待整改', '整改中', '已完成'];

const sceneMeta = {
  stockout: '缺货 / 空位检测',
  misplacement: '商品错位 / 串货',
  alignment: '排面整齐度 / 对齐度检测',
  priceTag: '价签合规检测',
  orientation: '商品朝向 / 正反检测',
  promo: '堆头 / 促销区合规检测',
  cleanliness: '货架清洁 & 异物检测',
  newProduct: '重点 / 新品陈列合规检测'
};

const formatDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};

const average = (values) =>
  Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));

const getSceneResult = (passProbability = 55) => (randomInt(1, 100) <= passProbability ? '达标' : '异常');

const toImageStatus = (result) => (result === '达标' ? '合格' : '异常');

const createVisualScenarios = (storeId) => {
  const stockoutSlots = Array.from({ length: randomInt(1, 3) }, () => ({
    position: pickOne(shelfPositions),
    severity: pickOne(['高', '中', '低']),
    recommendSku: pickOne(skuPool),
    recommendQty: randomInt(4, 20)
  }));
  const stockoutQty = stockoutSlots.reduce((sum, item) => sum + item.recommendQty, 0);
  const stockoutResult = getSceneResult(45);

  const misplacementRows = Array.from({ length: randomInt(1, 3) }, () => ({
    wrongProduct: pickOne(skuPool),
    position: pickOne(shelfPositions),
    suggestion: '调整到对应品牌分区并补齐同款排面'
  }));
  const misplacementResult = getSceneResult(50);

  const alignmentScore = randomInt(68, 98);
  const alignmentPositions = pickMany(shelfPositions, randomInt(2, 4));
  const alignmentResult = alignmentScore >= 85 ? '达标' : '异常';

  const priceTagIssues = Array.from({ length: randomInt(1, 3) }, () => ({
    type: pickOne(['缺失', '偏移']),
    position: pickOne(shelfPositions)
  }));
  const priceTagResult = getSceneResult(56);

  const reverseCount = randomInt(0, 8);
  const orientationPositions = pickMany(shelfPositions, Math.max(1, Math.min(4, reverseCount || 1)));
  const orientationResult = reverseCount <= 2 ? '达标' : '异常';

  const promoCompleteness = randomInt(72, 99);
  const materialStatus = promoCompleteness >= 88 ? '完整' : pickOne(['缺失', '破损']);
  const promoResult = promoCompleteness >= 88 ? '达标' : '异常';

  const cleanlinessIssues = Array.from({ length: randomInt(1, 2) }, () => ({
    position: pickOne(['冷柜边缘', '货架下沿', '收银侧台面', '促销堆头底部']),
    level: pickOne(['高', '中', '低'])
  }));
  const cleanlinessResult = getSceneResult(60);

  const displayStatus = pickOne(['达标', '不足', '缺失']);
  const newProductResult = displayStatus === '达标' ? '达标' : '异常';
  const newProductLayer = pickOne(['黄金位-2层', '入口动线第一排', '主通道端架']);

  return [
    {
      key: 'stockout',
      title: sceneMeta.stockout,
      result: stockoutResult,
      severity: stockoutSlots[0].severity,
      location: stockoutSlots[0].position,
      summary: `发现 ${stockoutSlots.length} 处空位，建议补货 ${stockoutQty} 件`,
      recommendation: '优先补齐高动销 SKU，补货后拍照复核。',
      image: createPlaceholder('空位检测', toImageStatus(stockoutResult)),
      data: { emptySlots: stockoutSlots }
    },
    {
      key: 'misplacement',
      title: sceneMeta.misplacement,
      result: misplacementResult,
      severity: pickOne(['中', '低']),
      location: misplacementRows[0].position,
      summary: `识别到 ${misplacementRows.length} 个错位商品`,
      recommendation: '按品类标准图回摆，保持同 SKU 连续陈列。',
      image: createPlaceholder('错位检测', toImageStatus(misplacementResult)),
      data: { misplacedItems: misplacementRows }
    },
    {
      key: 'alignment',
      title: sceneMeta.alignment,
      result: alignmentResult,
      severity: alignmentScore < 78 ? '高' : '中',
      location: alignmentPositions[0],
      summary: `整齐度评分 ${alignmentScore} 分`,
      recommendation: '调整排面前沿对齐，按从左到右递增摆放。',
      image: createPlaceholder('排面对齐检测', toImageStatus(alignmentResult)),
      data: { neatnessScore: alignmentScore, issuePositions: alignmentPositions }
    },
    {
      key: 'priceTag',
      title: sceneMeta.priceTag,
      result: priceTagResult,
      severity: pickOne(['高', '中']),
      location: priceTagIssues[0].position,
      summary: `价签异常 ${priceTagIssues.length} 处（缺失/偏移）`,
      recommendation: '补齐并校准价签，完成后进行二次核验。',
      image: createPlaceholder('价签检测', toImageStatus(priceTagResult)),
      data: { tagIssues: priceTagIssues }
    },
    {
      key: 'orientation',
      title: sceneMeta.orientation,
      result: orientationResult,
      severity: reverseCount > 4 ? '高' : '中',
      location: orientationPositions[0],
      summary: `反向商品 ${reverseCount} 件`,
      recommendation: '统一正面朝向，保证品牌主视觉朝外。',
      image: createPlaceholder('商品朝向检测', toImageStatus(orientationResult)),
      data: { reverseCount, positions: orientationPositions }
    },
    {
      key: 'promo',
      title: sceneMeta.promo,
      result: promoResult,
      severity: promoCompleteness < 80 ? '高' : '中',
      location: '收银旁促销区',
      summary: `堆头完整度 ${promoCompleteness}% ，物料${materialStatus}`,
      recommendation: '补齐堆头物料并核对活动主 KV 与价格标识。',
      image: createPlaceholder('堆头促销检测', toImageStatus(promoResult)),
      data: { completeness: promoCompleteness, materialStatus }
    },
    {
      key: 'cleanliness',
      title: sceneMeta.cleanliness,
      result: cleanlinessResult,
      severity: cleanlinessIssues[0].level,
      location: cleanlinessIssues[0].position,
      summary: `识别到 ${cleanlinessIssues.length} 处清洁异常`,
      recommendation: '立即清洁并记录清洁时间，班次内复检。',
      image: createPlaceholder('清洁异物检测', toImageStatus(cleanlinessResult)),
      data: { issues: cleanlinessIssues }
    },
    {
      key: 'newProduct',
      title: sceneMeta.newProduct,
      result: newProductResult,
      severity: displayStatus === '缺失' ? '高' : '中',
      location: newProductLayer,
      summary: `重点新品陈列状态：${displayStatus}`,
      recommendation: '保障新品黄金位连续排面，优先提升前 3 格曝光。',
      image: createPlaceholder('重点新品检测', toImageStatus(newProductResult)),
      data: { displayStatus, layer: newProductLayer }
    }
  ].map((scenario, idx) => ({
    ...scenario,
    id: `${storeId}-S${idx + 1}`
  }));
};

const createAnomaliesFromScenarios = (storeId, scenarios) => {
  const statusFromScene = (sceneResult) => {
    if (sceneResult === '达标') {
      return '已完成';
    }
    return pickOne(['待整改', '整改中']);
  };

  const base = scenarios.map((scene, idx) => ({
    id: `${storeId}-A${idx + 1}`,
    type: scene.title,
    location: scene.location,
    status: statusFromScene(scene.result),
    level: scene.severity,
    sceneKey: scene.key,
    detail: `${scene.summary}；整改建议：${scene.recommendation}`,
    image: scene.image
  }));

  const targetCount = randomInt(8, 10);
  const extraCount = targetCount - base.length;
  const extras = Array.from({ length: extraCount }, (_, idx) => {
    const source = pickOne(scenarios);
    return {
      id: `${storeId}-AX${idx + 1}`,
      type: `${source.title}（复检）`,
      location: source.location,
      status: pickOne(rectificationStatusPool),
      level: source.severity,
      sceneKey: source.key,
      detail: `复检记录：${source.summary}；建议持续执行：${source.recommendation}`,
      image: source.image
    };
  });

  return [...base, ...extras];
};

const createStore = (name, idx) => {
  const dimensions = {
    product: randomFloat(3.1, 5),
    environment: randomFloat(2.9, 5),
    staff: randomFloat(3, 5),
    equipment: randomFloat(2.8, 5)
  };

  const score = Math.round(
    ((dimensions.product + dimensions.environment + dimensions.staff + dimensions.equipment) / 4) * 20
  );

  const coverage = randomInt(88, 100);
  const visualScenarios = createVisualScenarios(idx + 1);
  const anomalies = createAnomaliesFromScenarios(idx + 1, visualScenarios);
  const anomalyCount = anomalies.length;
  const completedCount = anomalies.filter((item) => item.status === '已完成').length;

  const historicalScores = Array.from({ length: 10 }, (_, i) => {
    const swing = randomInt(-5, 4);
    return Math.max(68, Math.min(100, score + swing + i - 5));
  });

  const productScenes = visualScenarios.filter((item) =>
    ['stockout', 'misplacement', 'alignment', 'orientation', 'newProduct'].includes(item.key)
  );
  const environmentScenes = visualScenarios.filter((item) =>
    ['priceTag', 'promo', 'cleanliness'].includes(item.key)
  );

  return {
    id: idx + 1,
    name,
    address: `北京市${pickOne(storeDistricts)}${pickOne(storeRoads)}${randomInt(8, 188)}号`,
    score,
    coverage,
    dimensions,
    visualScenarios,
    anomalies,
    anomalyCount,
    rectificationRate: Number(((completedCount / anomalies.length) * 100).toFixed(1)),
    productPassRate: Number(
      ((productScenes.filter((item) => item.result === '达标').length / productScenes.length) * 100).toFixed(1)
    ),
    environmentPassRate: Number(
      ((environmentScenes.filter((item) => item.result === '达标').length / environmentScenes.length) * 100).toFixed(1)
    ),
    historicalScores
  };
};

export const stores = storeNames.map((name, idx) => createStore(name, idx));

const allAnomalies = stores.flatMap((store) => store.anomalies);
const completedAnomalies = allAnomalies.filter((item) => item.status === '已完成').length;

export const dashboardMetrics = {
  avgInspectionScore: average(stores.map((store) => store.score)),
  coverageRate: average(stores.map((store) => store.coverage)),
  rectificationRate: Number(((completedAnomalies / allAnomalies.length) * 100).toFixed(1)),
  productPassRate: average(stores.map((store) => store.productPassRate)),
  environmentPassRate: average(stores.map((store) => store.environmentPassRate))
};

export const scoreTrend = Array.from({ length: 10 }, (_, idx) => ({
  date: formatDate(9 - idx),
  score: Math.round(average(stores.map((store) => store.historicalScores[idx])))
}));

export const anomalyDistribution = stores.map((store) => ({
  store: store.name.replace('店', ''),
  count: store.anomalyCount
}));

export const inspectionFormTemplate = [
  { key: 'environment', dimension: '环境', score: randomInt(3, 5), note: '地面清洁、通风、温湿度' },
  { key: 'material', dimension: '原料', score: randomInt(3, 5), note: '保质期、储存规范、标签' },
  { key: 'equipment', dimension: '设备', score: randomInt(2, 5), note: '烤箱、冷柜、工具状态' },
  { key: 'product', dimension: '产品', score: randomInt(3, 5), note: '外观、口感、合规标识' },
  { key: 'service', dimension: '服务', score: randomInt(3, 5), note: '员工着装、接待、动线' }
];

export const bossEvaluationMetrics = [
  {
    key: 'finance',
    category: '财务',
    indicator: '人工节约成本',
    benefit: '每月节约巡检人工成本 5-10 万元',
    status: '达标',
    detail: '通过视觉巡检 + 自动判分，减少重复巡店与复检频次，总部与门店双向节省人效。'
  },
  {
    key: 'operation',
    category: '运营',
    indicator: '巡检覆盖率、整改完成率',
    benefit: '提升至95%以上',
    status: '达标',
    detail: '系统自动形成异常闭环工单与复核节奏，覆盖率和整改完成率可持续拉升。'
  },
  {
    key: 'brand',
    category: '品牌',
    indicator: '产品一致性评分、客户投诉率',
    benefit: '投入后半年投诉率下降20%-30%',
    status: '关注',
    detail: '通过陈列、朝向、价签、清洁等场景连续质检，降低顾客体验波动和投诉概率。'
  },
  {
    key: 'strategy',
    category: '战略',
    indicator: '数据驱动决策能力',
    benefit: '门店运营、采购、培训决策更加科学',
    status: '达标',
    detail: '跨门店趋势看板支持总部识别高频问题门店，精准分配培训、督导与采购资源。'
  },
  {
    key: 'risk',
    category: '风险',
    indicator: '食品安全风险暴露次数',
    benefit: '降低安全隐患，降低法律和赔付风险',
    status: '预警',
    detail: '针对高风险场景建立持续预警机制，并保留整改证据，降低合规与赔付风险。'
  }
];

export const findStoreById = (id) => stores.find((store) => String(store.id) === String(id));
