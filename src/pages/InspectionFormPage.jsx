import { Button, Card, Rate, Space, Table, Tag, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { inspectionFormTemplate } from '../data/mockData';
import { createPlaceholder, randomInt } from '../utils/mockFactory';

function InspectionFormPage() {
  const [scores, setScores] = useState(() =>
    inspectionFormTemplate.reduce((acc, item) => ({ ...acc, [item.key]: item.score }), {})
  );
  const [photos, setPhotos] = useState({});
  const [analysis, setAnalysis] = useState({});

  const rows = useMemo(
    () =>
      inspectionFormTemplate.map((item) => ({
        ...item,
        score: scores[item.key]
      })),
    [scores]
  );

  const mockUpload = (key, dimension) => {
    const passed = randomInt(1, 100) > 35;
    const result = passed ? '合格' : '异常';
    const suggestion = passed
      ? '视觉巡检通过，建议保持当前标准。'
      : '检测到异常，请补充整改照片并复核。';

    setPhotos((prev) => ({
      ...prev,
      [key]: createPlaceholder(`${dimension}巡检照片`, result === '合格' ? '合格' : '异常')
    }));

    setAnalysis((prev) => ({
      ...prev,
      [key]: {
        result,
        suggestion
      }
    }));
  };

  const columns = [
    {
      title: '巡检维度',
      dataIndex: 'dimension',
      key: 'dimension'
    },
    {
      title: '检查说明',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: '评分（1-5）',
      key: 'score',
      render: (_, record) => (
        <Rate
          count={5}
          value={scores[record.key]}
          onChange={(value) => setScores((prev) => ({ ...prev, [record.key]: value }))}
        />
      )
    },
    {
      title: '上传照片',
      key: 'upload',
      render: (_, record) => (
        <Button icon={<UploadOutlined />} onClick={() => mockUpload(record.key, record.dimension)}>
          上传照片（模拟）
        </Button>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) =>
        photos[record.key] ? <Tag color="green">已上传占位图</Tag> : <Tag color="orange">待上传</Tag>
    },
    {
      title: '视觉分析结果',
      key: 'analysis',
      render: (_, record) => {
        const output = analysis[record.key];
        if (!output) {
          return <Typography.Text type="secondary">未分析</Typography.Text>;
        }
        return <Tag color={output.result === '合格' ? 'green' : 'red'}>{output.result}</Tag>;
      }
    }
  ];

  return (
    <Card className="panel-card">
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Title level={4}>巡检表单模拟</Typography.Title>
        <Typography.Text type="secondary">评分与上传均为演示行为，无需真实后端和真实图片。</Typography.Text>
        <Table rowKey="key" columns={columns} dataSource={rows} pagination={false} />

        <Space wrap>
          {Object.entries(photos).map(([key, src]) => (
            <Card key={key} size="small" title={inspectionFormTemplate.find((item) => item.key === key)?.dimension}>
              <img src={src} alt={key} className="form-preview" />
              {analysis[key] && (
                <Space direction="vertical" size={2} style={{ marginTop: 8 }}>
                  <Tag color={analysis[key].result === '合格' ? 'green' : 'red'}>{analysis[key].result}</Tag>
                  <Typography.Text type="secondary">{analysis[key].suggestion}</Typography.Text>
                </Space>
              )}
            </Card>
          ))}
        </Space>
      </Space>
    </Card>
  );
}

export default InspectionFormPage;
