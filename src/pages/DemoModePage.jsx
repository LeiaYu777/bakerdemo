import {
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Progress,
  Row,
  Select,
  Slider,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography
} from 'antd';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  anomalyDistribution,
  bossEvaluationMetrics,
  dashboardMetrics,
  scoreTrend,
  stores
} from '../data/mockData';

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' }
];

const loopOptions = [
  { label: '循环播放', value: 'loop' },
  { label: '播放一次后停止', value: 'stop' }
];

const statusColor = {
  达标: 'green',
  异常: 'red'
};

const createDemoScript = (store) => {
  const alias = String.fromCharCode(64 + store.id);

  const dashboardStep = {
    pageId: 'dashboard-overview',
    pageTitle: '首页 Dashboard',
    sceneType: 'dashboard',
    metrics: [
      { label: '巡检评分', value: dashboardMetrics.avgInspectionScore, suffix: '分' },
      { label: '整改完成率', value: dashboardMetrics.rectificationRate, suffix: '%' },
      { label: '产品合格率', value: dashboardMetrics.productPassRate, suffix: '%' },
      { label: '环境达标率', value: dashboardMetrics.environmentPassRate, suffix: '%' }
    ],
    subtitleText: {
      zh: `门店 ${alias} 所在片区当前平均巡检评分 ${dashboardMetrics.avgInspectionScore}，整改完成率 ${dashboardMetrics.rectificationRate}%。`,
      en: `Store ${alias} region now shows an average inspection score of ${dashboardMetrics.avgInspectionScore}, with ${dashboardMetrics.rectificationRate}% rectification completion.`,
      ja: `店舗 ${alias} エリアの平均検査スコアは ${dashboardMetrics.avgInspectionScore}、改善完了率は ${dashboardMetrics.rectificationRate}% です。`
    }
  };

  const storeStep = {
    pageId: `store-${store.id}-detail`,
    pageTitle: `门店详情 - ${store.name}`,
    sceneType: 'store',
    metrics: [
      { label: '门店评分', value: store.score, suffix: '分' },
      { label: '异常数量', value: store.anomalyCount, suffix: '项' },
      { label: '整改完成率', value: store.rectificationRate, suffix: '%' },
      { label: '产品场景达标率', value: store.productPassRate, suffix: '%' }
    ],
    subtitleText: {
      zh: `当前展示门店 ${store.name}，巡检评分 ${store.score} 分，异常 ${store.anomalyCount} 项。`,
      en: `Now showing ${store.name}, with an inspection score of ${store.score} and ${store.anomalyCount} anomalies.`,
      ja: `現在は ${store.name} を表示中です。検査スコアは ${store.score}、異常件数は ${store.anomalyCount} 件です。`
    }
  };

  const sceneSteps = store.visualScenarios.map((scene) => ({
    pageId: `scene-${scene.key}`,
    pageTitle: scene.title,
    sceneType: scene.key,
    metrics: [
      { label: '检测结果', value: scene.result, suffix: '' },
      { label: '问题位置', value: scene.location, suffix: '' },
      { label: '严重等级', value: scene.severity, suffix: '' }
    ],
    subtitleText: {
      zh: `${store.name} 在“${scene.title}”场景中，结果为${scene.result}，位置 ${scene.location}。`,
      en: `${store.name} in scene "${scene.title}" is ${scene.result}, located at ${scene.location}.`,
      ja: `${store.name} の「${scene.title}」シーンは ${scene.result}、位置は ${scene.location} です。`
    },
    scenario: scene
  }));

  return [dashboardStep, storeStep, ...sceneSteps];
};

function DemoModePage() {
  const navigate = useNavigate();
  const cockpitRef = useRef(null);

  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [durationSec, setDurationSec] = useState(30);
  const [remainingSec, setRemainingSec] = useState(30);
  const [loopMode, setLoopMode] = useState('loop');
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [subtitleLang, setSubtitleLang] = useState('zh');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const activeStore = stores[activeStoreIndex];
  const demoScript = useMemo(() => createDemoScript(activeStore), [activeStore]);
  const currentStep = demoScript[activeStepIndex];

  const lineOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: scoreTrend.map((item) => item.date) },
      yAxis: { type: 'value', min: 60, max: 100 },
      series: [
        {
          type: 'line',
          smooth: true,
          data: scoreTrend.map((item) => item.score),
          lineStyle: { color: '#d97706', width: 3 },
          areaStyle: { color: 'rgba(217,119,6,0.15)' },
          symbolSize: 8
        }
      ],
      grid: { left: 30, right: 20, top: 35, bottom: 30 }
    }),
    []
  );

  const barOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: anomalyDistribution.map((item) => item.store),
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          type: 'bar',
          data: anomalyDistribution.map((item, idx) => ({
            value: item.count,
            itemStyle: {
              color: idx === activeStoreIndex ? '#c4382d' : '#d97706'
            }
          })),
          barWidth: '56%'
        }
      ],
      grid: { left: 36, right: 16, top: 26, bottom: 70 }
    }),
    [activeStoreIndex]
  );

  const goNext = useCallback(() => {
    setActiveStepIndex((prev) => {
      if (prev < demoScript.length - 1) {
        return prev + 1;
      }
      if (loopMode === 'loop') {
        setActiveStoreIndex((old) => (old + 1) % stores.length);
        return 0;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [demoScript.length, loopMode]);

  const goPrev = useCallback(() => {
    setActiveStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      setActiveStoreIndex((old) => (old - 1 + stores.length) % stores.length);
      return demoScript.length - 1;
    });
  }, [demoScript.length]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  useEffect(() => {
    setRemainingSec(durationSec);
  }, [activeStepIndex, activeStoreIndex, durationSec]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          goNext();
          return durationSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [durationSec, goNext, isPlaying]);

  const enterOrExitFullscreen = async () => {
    if (!cockpitRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await cockpitRef.current.requestFullscreen();
    }
  };

  const renderMetricCards = (metrics) => (
    <Row gutter={[12, 12]}>
      {metrics.map((metric) => (
        <Col xs={24} sm={12} xl={8} key={`${metric.label}-${metric.value}`}>
          <Card>
            <Statistic title={metric.label} value={metric.value} suffix={metric.suffix} />
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderScenarioDetail = (scenario) => {
    switch (scenario.key) {
      case 'stockout':
        return (
          <Table
            size="small"
            pagination={false}
            rowKey={(row) => `${row.position}-${row.recommendSku}`}
            dataSource={scenario.data.emptySlots}
            columns={[
              { title: '空位位置', dataIndex: 'position' },
              { title: '等级', dataIndex: 'severity' },
              { title: '补货 SKU', dataIndex: 'recommendSku' },
              { title: '补货数', dataIndex: 'recommendQty' }
            ]}
          />
        );
      case 'misplacement':
        return (
          <Table
            size="small"
            pagination={false}
            rowKey={(row) => `${row.wrongProduct}-${row.position}`}
            dataSource={scenario.data.misplacedItems}
            columns={[
              { title: '错位商品', dataIndex: 'wrongProduct' },
              { title: '层位位置', dataIndex: 'position' },
              { title: '建议', dataIndex: 'suggestion' }
            ]}
          />
        );
      case 'alignment':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Progress type="dashboard" percent={scenario.data.neatnessScore} strokeColor={scenario.data.neatnessScore >= 85 ? '#1f7a45' : '#c4382d'} />
            <List
              size="small"
              bordered
              dataSource={scenario.data.issuePositions}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Space>
        );
      case 'priceTag':
        return (
          <Table
            size="small"
            pagination={false}
            rowKey={(row) => `${row.type}-${row.position}`}
            dataSource={scenario.data.tagIssues}
            columns={[
              { title: '问题类型', dataIndex: 'type' },
              { title: '位置', dataIndex: 'position' }
            ]}
          />
        );
      case 'orientation':
        return (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="反向数量">{scenario.data.reverseCount} 件</Descriptions.Item>
            <Descriptions.Item label="位置">{scenario.data.positions.join('、')}</Descriptions.Item>
          </Descriptions>
        );
      case 'promo':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Progress percent={scenario.data.completeness} strokeColor={scenario.data.completeness >= 88 ? '#1f7a45' : '#c4382d'} />
            <Typography.Text>物料状态：{scenario.data.materialStatus}</Typography.Text>
          </Space>
        );
      case 'cleanliness':
        return (
          <Table
            size="small"
            pagination={false}
            rowKey={(row) => `${row.position}-${row.level}`}
            dataSource={scenario.data.issues}
            columns={[
              { title: '问题位置', dataIndex: 'position' },
              { title: '等级', dataIndex: 'level' }
            ]}
          />
        );
      case 'newProduct':
        return (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="排面状态">{scenario.data.displayStatus}</Descriptions.Item>
            <Descriptions.Item label="层位">{scenario.data.layer}</Descriptions.Item>
          </Descriptions>
        );
      default:
        return null;
    }
  };

  const renderCurrentStep = () => {
    if (currentStep.sceneType === 'dashboard') {
      return (
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          {renderMetricCards(currentStep.metrics)}
          <Row gutter={[14, 14]}>
            <Col xs={24} xl={14}>
              <Card title="评分趋势图" className="panel-card">
                <ReactECharts option={lineOption} style={{ height: 260 }} />
              </Card>
            </Col>
            <Col xs={24} xl={10}>
              <Card title="异常分布图" className="panel-card">
                <ReactECharts option={barOption} style={{ height: 260 }} />
              </Card>
            </Col>
          </Row>
          <Card title="老板评估指标" className="panel-card">
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={bossEvaluationMetrics}
              columns={[
                { title: '类别', dataIndex: 'category', width: 100 },
                { title: '指标', dataIndex: 'indicator', width: 220 },
                { title: '预期效益', dataIndex: 'benefit' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: 90,
                  render: (value) => <Tag color={value === '达标' ? 'green' : value === '预警' ? 'red' : 'orange'}>{value}</Tag>
                }
              ]}
            />
          </Card>
        </Space>
      );
    }

    if (currentStep.sceneType === 'store') {
      return (
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          {renderMetricCards(currentStep.metrics)}
          <Row gutter={[14, 14]}>
            <Col xs={24} xl={12}>
              <Card title="门店基础信息" className="panel-card">
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="门店名称">{activeStore.name}</Descriptions.Item>
                  <Descriptions.Item label="门店地址">{activeStore.address}</Descriptions.Item>
                  <Descriptions.Item label="环境达标率">{activeStore.environmentPassRate}%</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} xl={12}>
              <Card title="异常列表（Top 5）" className="panel-card">
                <Table
                  size="small"
                  pagination={false}
                  rowKey="id"
                  dataSource={activeStore.anomalies.slice(0, 5)}
                  columns={[
                    { title: '场景', dataIndex: 'type' },
                    { title: '位置', dataIndex: 'location' },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      render: (value) => <Tag color={value === '已完成' ? 'green' : value === '整改中' ? 'orange' : 'red'}>{value}</Tag>
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Space>
      );
    }

    const scenario = currentStep.scenario;
    return (
      <Space direction="vertical" size={14} style={{ width: '100%' }}>
        {renderMetricCards(currentStep.metrics)}
        <Row gutter={[14, 14]}>
          <Col xs={24} xl={12}>
            <Card title="场景检测画面（占位）" className="panel-card">
              <img src={scenario.image} alt={scenario.title} className="visual-img anomaly-glow" />
              <Space style={{ marginTop: 10 }}>
                <Tag color={statusColor[scenario.result]}>{scenario.result}</Tag>
                <Typography.Text>{scenario.summary}</Typography.Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card title="问题详情与整改建议" className="panel-card">
              {renderScenarioDetail(scenario)}
              <Typography.Paragraph style={{ marginTop: 10, marginBottom: 0 }}>
                整改建议：{scenario.recommendation}
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
      </Space>
    );
  };

  return (
    <div className="demo-mode" ref={cockpitRef}>
      <Space direction="vertical" size={14} style={{ width: '100%' }}>
        <Card className="panel-card demo-header-card">
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
              <div>
                <Typography.Title level={3} style={{ marginBottom: 0 }}>客户演示模式（脚本驱动）</Typography.Title>
                <Typography.Text type="secondary">自动切页 + 多语言字幕 + 手动跳页 + 循环控制</Typography.Text>
              </div>
              <Space>
                <Button icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={() => setIsPlaying((prev) => !prev)}>
                  {isPlaying ? '暂停' : '播放'}
                </Button>
                <Button icon={<LeftOutlined />} onClick={() => { goPrev(); setRemainingSec(durationSec); }}>
                  上一页
                </Button>
                <Button icon={<RightOutlined />} onClick={() => { goNext(); setRemainingSec(durationSec); }}>
                  下一页
                </Button>
                <Button icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} type="primary" onClick={enterOrExitFullscreen}>
                  {isFullscreen ? '退出全屏' : '全屏'}
                </Button>
                <Button onClick={() => navigate(`/stores/${activeStore.id}`)}>查看当前门店详情</Button>
              </Space>
            </Space>

            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} lg={6}>
                <Typography.Text>自动切页时长（30-60秒）</Typography.Text>
                <Slider min={30} max={60} value={durationSec} onChange={(value) => setDurationSec(value)} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Typography.Text>字幕语言</Typography.Text>
                <Select style={{ width: '100%' }} value={subtitleLang} onChange={setSubtitleLang} options={languageOptions} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Typography.Text>播放结束行为</Typography.Text>
                <Select style={{ width: '100%' }} value={loopMode} onChange={setLoopMode} options={loopOptions} />
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Typography.Text>字幕开关</Typography.Text>
                <div><Switch checked={subtitleEnabled} onChange={setSubtitleEnabled} checkedChildren="开启" unCheckedChildren="关闭" /></div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Typography.Text>跳转脚本页</Typography.Text>
                <Select
                  style={{ width: '100%' }}
                  value={activeStepIndex}
                  onChange={(value) => {
                    setActiveStepIndex(value);
                    setRemainingSec(durationSec);
                  }}
                  options={demoScript.map((step, idx) => ({
                    value: idx,
                    label: `${idx + 1}. ${step.pageTitle}`
                  }))}
                />
              </Col>
            </Row>
          </Space>
        </Card>

        <Card className="panel-card">
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Space>
              <Tag color="blue">pageId: {currentStep.pageId}</Tag>
              <Tag color="purple">sceneType: {currentStep.sceneType}</Tag>
              <Tag color="gold">倒计时: {remainingSec}s</Tag>
            </Space>
            <Typography.Title level={4} style={{ margin: 0 }}>{currentStep.pageTitle}</Typography.Title>
          </Space>
        </Card>

        {renderCurrentStep()}

        {subtitleEnabled && (
          <Card className="subtitle-bar">
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Tag color="cyan">字幕 / Subtitle / 字幕</Tag>
              <Typography.Text strong>{currentStep.subtitleText[subtitleLang]}</Typography.Text>
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
}

export default DemoModePage;
