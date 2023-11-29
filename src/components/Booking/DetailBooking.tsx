import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import getCookie from '../route/Cookie';
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Table } from 'antd/lib';
import axios from 'axios';
import { url } from '../ultils/urlApi';
import { DataType } from '../constant/constant';

const DetailBooking = () => {
    const token = getCookie("token");
  const [listParticipants, setListParticipants] = useState<DataType[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/booking/", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBookingData(res.data.data.bookings)
            setListParticipants(res.data.data.users);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
    const columns: ColumnsType<DataType> = [
        {
          align: "center",
          title: "User ID",
          key: "user_id",
          dataIndex: "user_id",
        },
        {
          align: "center",
          title: "User Name",
          dataIndex: "user_name",
          key: "user_name",
        },
        {
          align: "center",
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          align: "center",
          title: "Phone Number",
          dataIndex: "phone_number",
          key: "phone_number",
        },    
        {
          align: "center",
          title: "Action",
          key: "action",
          render: (_text, user) => (
            <Space size="middle">
              <DeleteFilled/>
            </Space>
          ),
        },
      ];
    


  return (
    <Table columns={columns} dataSource={listparticipants} />
  )
}

export default DetailBooking