import { Button, Card, Col, Progress, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import {
  anomalyDistribution,
  bossEvaluationMetrics,
  dashboardMetrics,
  scoreTrend,
  stores
} from '../data/mockData';

const getMetricTone = (value, threshold) => (value >= threshold ? '#1f7a45' : '#c4382d');

function DashboardPage() {
  const navigate = useNavigate();
  const statusColor = {
    达标: 'green',
    关注: 'orange',
    预警: 'red'
  };

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: scoreTrend.map((item) => item.date) },
    yAxis: { type: 'value', min: 60, max: 100 },
    series: [
      {
        data: scoreTrend.map((item) => item.score),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#d97706', width: 3 },
        areaStyle: { color: 'rgba(217,119,6,0.18)' },
        symbolSize: 8
      }
    ],
    grid: { left: 30, right: 20, top: 40, bottom: 30 }
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: anomalyDistribution.map((item) => item.store), axisLabel: { interval: 0, rotate: 30 } },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'bar',
        data: anomalyDistribution.map((item) => item.count),
        itemStyle: {
          color: (params) => (params.value > 7 ? '#c4382d' : '#d97706')
        },
        barWidth: '56%'
      }
    ],
    grid: { left: 40, right: 16, top: 32, bottom: 70 }
  };

  const bossColumns = [
    { title: '指标类别', dataIndex: 'category', key: 'category', width: 120 },
    { title: '指标', dataIndex: 'indicator', key: 'indicator', width: 240 },
    { title: '预期效益', dataIndex: 'benefit', key: 'benefit' },
    {
      title: '表现',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value) => <Tag color={statusColor[value]}>{value}</Tag>
    }
  ];

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <Card className="panel-card">
        <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
          <div>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              总部数据驾驶舱
            </Typography.Title>
            <Typography.Text type="secondary">
              从全局指标到单店异常，完整演示巡检与整改闭环流程。
            </Typography.Text>
          </div>
          <Button type="primary" onClick={() => navigate('/demo-mode')}>
            进入客户演示模式
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="平均巡检评分" value={dashboardMetrics.avgInspectionScore} suffix="分" valueStyle={{ color: getMetricTone(dashboardMetrics.avgInspectionScore, 85) }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="整改完成率" value={dashboardMetrics.rectificationRate} precision={1} suffix="%" valueStyle={{ color: getMetricTone(dashboardMetrics.rectificationRate, 75) }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="产品合格率" value={dashboardMetrics.productPassRate} precision={1} suffix="%" valueStyle={{ color: getMetricTone(dashboardMetrics.productPassRate, 85) }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="环境达标率" value={dashboardMetrics.environmentPassRate} suffix="%" valueStyle={{ color: getMetricTone(dashboardMetrics.environmentPassRate, 80) }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="巡检评分趋势（近 10 天）" className="panel-card">
            <ReactECharts option={lineOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="各门店异常数量分布" className="panel-card">
            <ReactECharts option={barOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Card title="16 家门店巡检概览" className="panel-card">
        <Row gutter={[16, 16]}>
          {stores.map((store) => {
            const isGood = store.score >= 85;
            return (
              <Col xs={24} sm={12} xl={6} key={store.id}>
                <Card
                  hoverable
                  className="store-card"
                  onClick={() => navigate(`/stores/${store.id}`)}
                  title={store.name}
                  extra={<Tag color={isGood ? 'green' : 'red'}>{isGood ? '健康' : '待提升'}</Tag>}
                >
                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                    <Typography.Text type="secondary">总分：{store.score}</Typography.Text>
                    <Progress percent={store.coverage} strokeColor={isGood ? '#1f7a45' : '#c4382d'} size="small" format={(value) => `${value}% 覆盖`} />
                    <Typography.Text>异常项：{store.anomalyCount}</Typography.Text>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      <Card
        title="老板评估指标面板（定量 + 定性）"
        className="panel-card"
        extra={<Typography.Text type="secondary">点击行可展开详细说明</Typography.Text>}
      >
        <Table
          rowKey="key"
          columns={bossColumns}
          dataSource={bossEvaluationMetrics}
          pagination={false}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (record) => (
              <Typography.Text>{record.detail}</Typography.Text>
            )
          }}
        />
      </Card>
    </Space>
  );
}

export default DashboardPage;
