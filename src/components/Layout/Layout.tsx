import React, { useState } from 'react';
// import '../App.css';

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
import { Layout, Menu, Button, Space, Avatar, Dropdown, MenuProps, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
const { Sider, Content } = Layout;
const LayoutApp = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigator = useNavigate()


    // Logout
    const handleLogout = () => {
        localStorage.clear();
        navigator('/login');
    };
    const items: MenuProps['items'] = [
        {
            label: "Infomaiton account",
            icon: <UserOutlined />,
            key: '0',

        },
        {
            // label: "Logout",
            label: <a target="_blank">Logout</a>,
            icon: <LogoutOutlined />,
            key: '1',
        },


    ];

    return (


        <Layout  >
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'white',
                    justifyContent: 'end'

                }}
            >
                <Typography.Title style={{ marginRight: 320 }}>WEBSITE BOOKING</Typography.Title>
                <Dropdown menu={{ items }} trigger={['click']} arrow >
                    <Button
                        style={{
                            height: "80%",
                            width: 200,
                            borderRadius: 5,
                            columnGap: '100%',
                            alignItems: 'center',
                            display: 'flex',
                            border: 'none'
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space style={{ columnGap: 30 }}>
                                <Avatar style={{ marginLeft: 0 }} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                                <p>name user</p>
                                <DownOutlined style={{}} />
                            </Space>
                        </a>
                    </Button>
                </Dropdown>

            </Header>
            <Layout>
                <Sider
                    style={{ marginTop:13}}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme='light'
                    width={'200px'}
                >
                    <div className="demo-logo-vertical" />
                    <Button
                        type="text"
                        
                        // icon={collapsed ? <MenuFoldOutlined  /> : <MenuUnfoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            // fontSize: '16px',
                            width: 70,
                            height: 64,
                            display: 'flex',
                            justifyContent: 'center'
                            // color: 'white',
                            // marginLeft: 9,
                        }}
                    />
                    <Menu className='menu'
                        onClick={({ key }) => {
                            if (key === 'logout') {
                                handleLogout();
                            } else {
                                //   navigator(key);
                            }
                        }}
                        theme='light'
                        mode="inline"
                        defaultSelectedKeys={['/dashboard']}
                        items={[
                            {
                                key: '/dashboard',
                                icon: <AppstoreOutlined />,
                                label: 'Dashboard',


                            },
                            {
                                key: '/roomanager',
                                icon: <HomeOutlined />,

                                label: 'Room Manager'
                            },
                            {
                                key: '/employeesmanager',
                                icon: <UserOutlined />,
                                label: 'Employees Manager',

                            },
                            {
                                key: '/bookingmanagement',
                                icon: <SelectOutlined />,
                                label: 'Booking Management',
                            },

                        ]}
                    />
                </Sider>
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