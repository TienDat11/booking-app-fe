import { CheckCircleOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, List, Space, Statistic } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './dashboard.css'
import getCookie from '../route/Cookie';
const Dashboard = () => {
  const token = getCookie('token');
  const url = 'https://c1a4-210-245-110-144.ngrok-free.app/'
  interface DataUserType {
    user_name: string,
    phone_number: string,
    email: string,
  }
  interface DataBookingType{
    booking_id: number,
    room_id: number,
    room_name: string,

  }
  interface DataRoomType{
    room_id: number,
    room_name: string,

  }
  interface DataChart{
    room_name: string,
    number_of_booking: number
  }
  const [list_users, setListusers] = useState([] as DataUserType[])
  const [totalUser, setTotalUser] = useState<number>()
  const [list_booking, setListBooking] = useState([] as DataBookingType[])
  const [totalBooking, setTotalBooking] = useState<number>()
  const [list_room, setListRoom] = useState([] as DataRoomType[])
  const [totalRoom, setTotalRoom] = useState<number>()
  const [dataChart, setDataChart] = useState<DataChart>()

  const getData = async () => {
    try {
      await axios.get(url + "v1/bookings", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListBooking(res.data.bookings)
        setTotalBooking(res.data.total_items)
      })
      await axios.get(url + "v1/users", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListusers(res.data.list_users)
        setTotalUser(res.data.total_items)
      })
      await axios.get(url + "v1/rooms", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListRoom(res.data.rooms)
        setTotalRoom(res.data.total_items)
      })
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const columns: ColumnsType<DataUserType> = [

    {
      align: 'center',
      title: "User Name",
      dataIndex: "user_name",
      key: 'user_name',

    },
    {
      align: 'center',
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      align: 'center',
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    }
  ];

  return (
    <div>
      <Space style={{marginBottom: 20}} >
      <Space direction='horizontal' >
          <Link to={'/bookingmanager'}>
          <Card hoverable style={{ width: 370, background: '#ebe1f6' }}>
            <Space direction='horizontal' >
              <CheckCircleOutlined style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
                marginRight: 50

              }} />
              <Statistic title='Booking' value={totalBooking} />
            </Space>
          </Card>
          
          </Link>
        </Space>
        <Space direction='horizontal' >
          <Link to={'/usermanager'} >
          <Card hoverable style={{ width: 370, background: 'pink' }}>
            <Space direction='horizontal' >
              <UserOutlined style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
                marginRight: 50
              }} />
              <Statistic title='User' value={totalUser} />
            </Space>
          </Card>
          </Link>
        </Space>
        <Space direction='horizontal' >
          <Link to={'/roomnanager'}>
          <Card hoverable style={{ width: 370, background: '#f7dce2' }}>
            <Space direction='horizontal' >
              <HomeOutlined style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
                marginRight: 50

              }} />
              <Statistic title='Rooms' value={totalRoom} />
            </Space>
          </Card>
          </Link>
        </Space>
      </Space>

      <Table style={{ width: 600 }} dataSource={list_users} columns={columns} pagination={{ pageSize: 5, position: ['bottomCenter'] }} />


             


    </div>
  )
}

export default Dashboard
