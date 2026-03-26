import {
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from 'antd';
import {
  AlertOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  ShoppingOutlined,
  SkinOutlined
} from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findStoreById } from '../data/mockData';

const statusColor = {
  已完成: 'green',
  整改中: 'orange',
  待整改: 'red'
};

const sceneResultColor = {
  达标: 'green',
  异常: 'red'
};

const sceneIconMap = {
  stockout: <ShoppingOutlined />,
  misplacement: <AppstoreOutlined />,
  alignment: <ScanOutlined />,
  priceTag: <SafetyCertificateOutlined />,
  orientation: <DeploymentUnitOutlined />,
  promo: <ClusterOutlined />,
  cleanliness: <SkinOutlined />,
  newProduct: <AlertOutlined />
};

function StoreDetailPage() {
  const { id } = useParams();
  const store = useMemo(() => findStoreById(id), [id]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [selectedScene, setSelectedScene] = useState(null);

  if (!store) {
    return <Empty description="未找到门店数据" />;
  }

  const dimensionData = [
    { label: '产品', value: store.dimensions.product },
    { label: '环境', value: store.dimensions.environment },
    { label: '员工', value: store.dimensions.staff },
    { label: '设备', value: store.dimensions.equipment }
  ];

  const anomalyColumns = [
    { title: '异常场景', dataIndex: 'type', key: 'type' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    {
      title: '整改状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <Tag color={statusColor[value]}>{value}</Tag>
    },
    {
      title: '严重等级',
      dataIndex: 'level',
      key: 'level',
      render: (value) => <Tag color={value === '高' ? 'red' : value === '中' ? 'orange' : 'green'}>{value}</Tag>
    }
  ];

  const renderScenarioDetail = (scenario) => {
    if (!scenario) {
      return null;
    }

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
              {
                title: '严重等级',
                dataIndex: 'severity',
                render: (value) => <Tag color={value === '高' ? 'red' : value === '中' ? 'orange' : 'green'}>{value}</Tag>
              },
              { title: '建议补货 SKU', dataIndex: 'recommendSku' },
              { title: '建议数量', dataIndex: 'recommendQty' }
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
              { title: '整改建议', dataIndex: 'suggestion' }
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
              header={<Typography.Text strong>问题位置列表</Typography.Text>}
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
              {
                title: '问题类型',
                dataIndex: 'type',
                render: (value) => <Tag color={value === '缺失' ? 'red' : 'orange'}>{value}</Tag>
              },
              { title: '位置', dataIndex: 'position' },
              { title: '整改建议', render: () => scenario.recommendation }
            ]}
          />
        );
      case 'orientation':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Statistic title="反向商品数量" value={scenario.data.reverseCount} suffix="件" />
            <List
              size="small"
              bordered
              dataSource={scenario.data.positions}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              header={<Typography.Text strong>反向商品位置</Typography.Text>}
            />
          </Space>
        );
      case 'promo':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Progress percent={scenario.data.completeness} strokeColor={scenario.data.completeness >= 88 ? '#1f7a45' : '#c4382d'} />
            <Typography.Text>物料状态：<Tag color={scenario.data.materialStatus === '完整' ? 'green' : 'red'}>{scenario.data.materialStatus}</Tag></Typography.Text>
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
              {
                title: '等级',
                dataIndex: 'level',
                render: (value) => <Tag color={value === '高' ? 'red' : value === '中' ? 'orange' : 'green'}>{value}</Tag>
              },
              { title: '整改建议', render: () => scenario.recommendation }
            ]}
          />
        );
      case 'newProduct':
        return (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="排面状态">
              <Tag color={scenario.data.displayStatus === '达标' ? 'green' : 'red'}>{scenario.data.displayStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="层位位置">{scenario.data.layer}</Descriptions.Item>
            <Descriptions.Item label="整改建议">{scenario.recommendation}</Descriptions.Item>
          </Descriptions>
        );
      default:
        return <Typography.Text>{scenario.summary}</Typography.Text>;
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card className="panel-card">
        <Descriptions title={store.name} column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="门店地址">{store.address}</Descriptions.Item>
          <Descriptions.Item label="本店评分">
            <Tag color={store.score >= 85 ? 'green' : 'red'}>{store.score} 分</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="panel-card">
            <Statistic title="平均巡检评分" value={store.score} suffix="分" valueStyle={{ color: store.score >= 85 ? '#1f7a45' : '#c4382d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="panel-card">
            <Statistic title="异常数量" value={store.anomalyCount} suffix="项" valueStyle={{ color: store.anomalyCount <= 8 ? '#1f7a45' : '#c4382d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="panel-card">
            <Statistic title="整改完成率" value={store.rectificationRate} precision={1} suffix="%" valueStyle={{ color: store.rectificationRate >= 75 ? '#1f7a45' : '#c4382d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="panel-card">
            <Statistic title="产品场景达标率" value={store.productPassRate} precision={1} suffix="%" valueStyle={{ color: store.productPassRate >= 80 ? '#1f7a45' : '#c4382d' }} />
          </Card>
        </Col>
      </Row>

      <Card title="四维度评分" className="panel-card">
        <Row gutter={[16, 16]}>
          {dimensionData.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.label}>
              <Typography.Text>{item.label}</Typography.Text>
              <Progress
                percent={Math.round(item.value * 20)}
                strokeColor={item.value >= 4 ? '#1f7a45' : '#c4382d'}
                format={() => `${item.value.toFixed(1)} / 5`}
              />
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        title="重点业务场景面板（8个场景）"
        className="panel-card"
        extra={<Typography.Text type="secondary">点击场景卡片查看问题详情与整改建议</Typography.Text>}
      >
        <Row gutter={[16, 16]}>
          {store.visualScenarios.map((scene) => (
            <Col xs={24} sm={12} xl={6} key={scene.id}>
              <Card hoverable className="scenario-card" onClick={() => setSelectedScene(scene)}>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <span className="scenario-icon">{sceneIconMap[scene.key]}</span>
                    <Typography.Text strong>{scene.title}</Typography.Text>
                  </Space>
                  <Tag color={sceneResultColor[scene.result]}>{scene.result}</Tag>
                </Space>
                <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8, marginBottom: 8 }}>
                  {scene.summary}
                </Typography.Paragraph>
                {scene.key === 'alignment' && (
                  <Progress percent={scene.data.neatnessScore} size="small" strokeColor={scene.data.neatnessScore >= 85 ? '#1f7a45' : '#c4382d'} />
                )}
                {scene.key === 'promo' && (
                  <Progress percent={scene.data.completeness} size="small" strokeColor={scene.data.completeness >= 88 ? '#1f7a45' : '#c4382d'} />
                )}
                {scene.key === 'orientation' && (
                  <Typography.Text type="secondary">反向商品：{scene.data.reverseCount} 件</Typography.Text>
                )}
                <img src={scene.image} alt={scene.title} className="scenario-thumb" />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="异常列表（点击查看虚拟照片）" className="panel-card">
        <Table
          rowKey="id"
          dataSource={store.anomalies}
          columns={anomalyColumns}
          pagination={{ pageSize: 6 }}
          onRow={(record) => ({
            onClick: () => setSelectedAnomaly(record)
          })}
        />
      </Card>

      <Drawer
        title={selectedScene ? `${selectedScene.title} - 详情` : '场景详情'}
        open={Boolean(selectedScene)}
        width={520}
        onClose={() => setSelectedScene(null)}
      >
        {selectedScene && (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Tag color={sceneResultColor[selectedScene.result]}>{selectedScene.result}</Tag>
            <Typography.Text>{selectedScene.summary}</Typography.Text>
            {renderScenarioDetail(selectedScene)}
            <img src={selectedScene.image} alt={selectedScene.title} className="visual-img" />
            <Typography.Text type="secondary">整改建议：{selectedScene.recommendation}</Typography.Text>
          </Space>
        )}
      </Drawer>

      <Drawer
        title={selectedAnomaly ? `异常详情 - ${selectedAnomaly.id}` : '异常详情'}
        open={Boolean(selectedAnomaly)}
        width={430}
        onClose={() => setSelectedAnomaly(null)}
      >
        {selectedAnomaly && (
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            <Tag color={statusColor[selectedAnomaly.status]}>{selectedAnomaly.status}</Tag>
            <Typography.Text>{selectedAnomaly.detail}</Typography.Text>
            <img src={selectedAnomaly.image} alt={selectedAnomaly.type} className="visual-img" />
            <Typography.Text type="secondary">虚拟照片仅用于演示视觉巡检闭环流程。</Typography.Text>
          </Space>
        )}
      </Drawer>
    </Space>
  );
}

export default StoreDetailPage;
