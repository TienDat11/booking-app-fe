import { CheckCircleOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Space, Statistic, Spin } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import './dashboard.css'
import getCookie from '../route/Cookie';
const Dashboard = () => {
  const token = getCookie('token');
  const url = 'https://e920-117-2-6-32.ngrok-free.app'
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
  const [loading, setLoading] = useState<boolean>(true);
  
  const getData = async () => {
    setLoading(true);
    try {
      await axios.get(url + "/v1/users", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListusers(res.data.data.users)
        setTotalUser(res.data.data.total_items)
      })
      await axios.get(url + "/v1/rooms", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListRoom(res.data.data.rooms)
        setTotalRoom(res.data.data.total_items)
      })
      await axios.get(url + "/v1/bookings", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setListBooking(res.data.data.bookings)
        setTotalBooking(res.data.data.total_items)
      })
    } catch (error) {
    } finally{
      setLoading(false);
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
    <div >
      <h2 className='component-name'>Dashboard</h2>
      {loading ? (
        <Spin
        size="large"
        tip="Loading..."
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-75%, -75%)',
          fontSize: '24px',
          color: '#ff0000'
        }}
      />
      ) : (
        <>       
        <Space style={{marginBottom: 20, display:'flex', justifyContent:'space-between'}} >
        <Space direction='horizontal' >
            <Link to={'/bookingmanager'}>
            <Card hoverable style={{ width: 400, background: '#ebe1f6' }}>
              <Space direction='horizontal' className='card-total'>
                <CheckCircleOutlined style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  marginRight: 50
  
                }} />
                <Statistic className='total-detail' title='Booking' value={totalBooking} />
              </Space>
            </Card>
            
            </Link>
          </Space>
          <Space direction='horizontal' >
            <Link to={'/usermanager'} >
            <Card hoverable style={{ width:400, background: 'pink' }}>
              <Space direction='horizontal' className='card-total' >
                <UserOutlined style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  marginRight: 50
                }} />
                <Statistic className='total-detail'  title='User' value={totalUser} />
              </Space>
            </Card>
            </Link>
          </Space>
          <Space direction='horizontal' >
            <Link to={'/roomnanager'}>
            <Card hoverable style={{ width: 400, background: '#f7dce2' }}>
              <Space direction='horizontal' className='card-total'>
                <HomeOutlined style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  marginRight: 50
  
                }} />
                <Statistic className='total-detail' title='Rooms' value={totalRoom} />
              </Space>
            </Card>
            </Link>
          </Space>
        </Space>
  
        <Table style={{ position:'relative' }} dataSource={list_users} columns={columns} pagination={{ pageSize: 5, position: ['bottomCenter'] }} />

        </>
      )}
      </div>
             
  )
}

export default Dashboard
