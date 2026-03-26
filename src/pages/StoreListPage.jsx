import { Button, Card, Space, Table, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { stores } from '../data/mockData';

function StoreListPage() {
  const navigate = useNavigate();

  const columns = [
    {
      title: '门店',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: '巡检评分',
      dataIndex: 'score',
      key: 'score',
      render: (value) => <Tag color={value >= 85 ? 'green' : 'red'}>{value} 分</Tag>
    },
    {
      title: '异常数量',
      dataIndex: 'anomalyCount',
      key: 'anomalyCount'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/stores/${record.id}`)}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <Card className="panel-card">
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Title level={4}>门店列表</Typography.Title>
        <Typography.Text type="secondary">点击任意门店进入详情页，查看维度评分、异常清单与视觉检测结果。</Typography.Text>
        <Table
          rowKey="id"
          dataSource={stores}
          columns={columns}
          pagination={{ pageSize: 8 }}
          onRow={(record) => ({
            onClick: () => navigate(`/stores/${record.id}`)
          })}
        />
      </Space>
    </Card>
  );
}

export default StoreListPage;
