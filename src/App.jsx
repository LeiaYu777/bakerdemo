import { Layout, Menu, Typography } from 'antd';
import {
  BarChartOutlined,
  FileSearchOutlined,
  FormOutlined,
  PlayCircleOutlined,
  ShopOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import StoreListPage from './pages/StoreListPage';
import StoreDetailPage from './pages/StoreDetailPage';
import InspectionFormPage from './pages/InspectionFormPage';
import DemoModePage from './pages/DemoModePage';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <PieChartOutlined />, label: '首页 Dashboard' },
  { key: '/stores', icon: <ShopOutlined />, label: '门店列表' },
  { key: '/stores/1', icon: <FileSearchOutlined />, label: '门店详情' },
  { key: '/inspection-form', icon: <FormOutlined />, label: '巡检表单' },
  { key: '/demo-mode', icon: <PlayCircleOutlined />, label: '客户演示模式' }
];

const getSelectedKey = (pathname) => {
  if (pathname.startsWith('/stores/') && pathname !== '/stores') {
    return '/stores/1';
  }
  if (pathname.startsWith('/stores')) {
    return '/stores';
  }
  if (pathname.startsWith('/demo-mode')) {
    return '/demo-mode';
  }
  return pathname;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="app-shell">
      <Sider breakpoint="lg" collapsedWidth="0" className="sider-panel">
        <div className="brand-zone">
          <BarChartOutlined />
          <Typography.Title level={4}>烘焙巡检驾驶舱</Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header className="top-header">
          <Typography.Title level={3}>烘焙店智能巡检系统 Demo</Typography.Title>
          <Typography.Text type="secondary">流程演示 | 视觉识别 | 数据驾驶舱</Typography.Text>
        </Header>
        <Content className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stores" element={<StoreListPage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />
            <Route path="/inspection-form" element={<InspectionFormPage />} />
            <Route path="/demo-mode" element={<DemoModePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
