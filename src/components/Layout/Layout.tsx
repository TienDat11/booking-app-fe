import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
  DownOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import {
  Layout,
  Menu,
  Button,
  Space,
  Avatar,
  Dropdown,
  MenuProps,
  Typography,
} from 'antd';
import { Header } from 'antd/es/layout/layout';
import getCookie from '../route/Cookie';
const { Sider, Content } = Layout;
const LayoutApp = () => {
  const role = getCookie('roles');
  const name = getCookie('name');
  const [collapsed, setCollapsed] = useState(false);
  const navigator = useNavigate();
  const handleLogout = () => {
      const cookies = Cookies.get()
      for(const cookie in cookies){
          Cookies.remove(cookie);
      }
      navigator('/login');
  };

//   const handleLogout = () => {
//     const cookies = Cookies.get();
//     for (const cookie in cookies) {
//       Cookies.remove(cookie, { path: '' });
//     }
//     window.location.reload();
//     navigator('/login');
//   };
  const items: MenuProps['items'] = [
    {
      label: 'Infomaiton account',
      icon: <UserOutlined />,
      key: '0',
    },
    {
      // label: "Logout",
      label: (
        <a target='_blank' onClick={handleLogout}>
          Logout
        </a>
      ),
      icon: <LogoutOutlined />,
      key: '1',
    },
  ];

  const nameWeb = role.includes('admin') ? (
    <h1>WEBSITE BOOKING</h1>
  ) : (
    <h1>Calendar Meeting</h1>
  );
  const siderbar = role.includes('admin') ? (
    <Sider
      style={{ marginTop: 13 }}
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme='light'
      width={'200px'}
    >
      <div className='demo-logo-vertical' />
      <Button
        type='text'
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: 70,
          height: 64,
          display: 'flex',
          justifyContent: 'center',
        }}
      />
      <Menu
        className='menu'
        onClick={({ key }) => {
          if (key === 'logout') {
            handleLogout();
          } else {
            navigator(key);
          }
        }}
        theme='light'
        mode='inline'
        defaultSelectedKeys={['/']}
        items={[
          {
            key: '/',
            icon: <AppstoreOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/roomManager',
            icon: <HomeOutlined />,
            label: 'Room Manager',
          },
          {
            key: '/usermanager',
            icon: <UserOutlined />,
            label: 'User Manager',
          },
          {
            key: '/bookingmanagement',
            icon: <SelectOutlined />,
            label: 'Booking Management',
          },
        ]}
      />
    </Sider>
  ) : null;

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          justifyContent: 'space-between',
        }}
      >
        {nameWeb}
        <Dropdown menu={{ items }} trigger={['click']} arrow>
          <Button
            style={{
              height: '80%',
              width: 200,
              borderRadius: 5,
              columnGap: '100%',
              alignItems: 'center',
              display: 'flex',
              border: 'none',
            }}
          >
            <a onClick={e => e.preventDefault()}>
              <Space style={{ columnGap: 30 }}>
                <Avatar
                  style={{ marginLeft: 0 }}
                  src='https://xsgames.co/randomusers/avatar.php?g=pixel&key=1'
                />
                {name}
                <DownOutlined style={{}} />
              </Space>
            </a>
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        {siderbar}
        <Content
          style={{
            margin: 13,
            padding: 24,
            minHeight: 670,
            background: 'white',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
