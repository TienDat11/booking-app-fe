import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, MenuProps, Space } from 'antd';
import { Header } from "antd/es/layout/layout";

import React from 'react'
import getCookie from '../route/Cookie';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const HeaderComponent = () => {
 const role = getCookie("roles");
  const name = getCookie("name");
  const navigator = useNavigate();
  const handleLogout = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
    navigator("/login");
  };
  const handleNavigate = (key: string) => {
    navigator(key);
  };
  const items: MenuProps["items"] = [
    {
      label: "Infomaiton account",
      icon: <UserOutlined />,
      key: "informationaccount",
    },
    {
      label: "Change password",
      icon: <UserOutlined />,
      key: "changpassword",
    },
    {
      label: " Logout",
      icon: <LogoutOutlined />,
      key: "logout",
    },
  ];
  
  return (
    <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "white",
          justifyContent: "space-between",
        }}
      >
        <h1>BookingMeetingRoom</h1>
        {(role.includes("user")) ? (
    <Menu
      className="menu"
      onClick={({ key }) => {
        navigator(key);
      }}
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={["/"]}
      items={[
        {
          key: "/",
          label: "Calendar",
        },
        {
          key: "/bookingroom",
          label: "Booking room",
        },
      ]}
    />
  ): ( []) }
        
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => {
                key === "logout" ? handleLogout() : handleNavigate(key);
              }}
              selectable
              items={items}
            />
          }
          trigger={["click"]}
          arrow
        >
          <Button
            style={{
              height: "80%",
              width: 200,
              borderRadius: 5,
              columnGap: "100%",
              alignItems: "center",
              display: "flex",
              border: "none",
            }}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Space style={{ columnGap: 30 }}>
                <Avatar
                  style={{ marginLeft: 0 }}
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                />
                {name}
                <DownOutlined />
              </Space>
            </a>
          </Button>
        </Dropdown>
      </Header>
  )
}

export default HeaderComponent