import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  Button,
  DatePicker,
  Form,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Modal,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import getCookie from './route/Cookie';

const { Option } = Select;
const { Title } = Typography;

const url = 'https://08d0-210-245-110-144.ngrok-free.app';

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

interface Room {
  room_id: number;
  room_name: string;
}

interface BookingData {
  room_id: number;
  time_start: Dayjs;
  time_end: Dayjs;
  user_id: number[];
}

const BookingFormPage: React.FC<{ selectedRoom: Room | null }> = ({
  selectedRoom,
}) => {
  const history = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [bookingData, setBookingData] = useState<BookingData>({
    room_id: selectedRoom?.room_id || 0,
    time_start: dayjs(),
    time_end: dayjs(),
    user_id: [],
  });
  const [employees, setEmployees] = useState([] as DataType[]);
  const token = getCookie('token');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    console.log('Đã vào đây ');

    try {
      const res = await axios.get(url + '/v1/users', {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any',
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data.list_users);
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }

    const currentTime = new Date().toLocaleString();
    setCurrentTime(currentTime);
  };

  useEffect(() => {
    fetchData();
  }, [currentTime]);

  useEffect(() => {
    if (selectedRoom) {
      setBookingData(prevData => ({
        ...prevData,
        room_id: selectedRoom.room_id,
      }));
    }
  }, [selectedRoom]);

  const handleBookingDataChange = (
    name: keyof BookingData,
    value: Dayjs | null
  ) => {
    if (value !== null) {
      setBookingData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEmployeeSelection = (employeeId: number[]) => {
    setBookingData(prevData => ({
      ...prevData,
      user_id: employeeId,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedBookingData = {
        ...bookingData,
        time_start: bookingData.time_start.format(),
        time_end: bookingData.time_end.format(),
      };

      await axios.post(url + '/bookings', formattedBookingData, {
        withCredentials: true,
        headers: {          
          Authorization: `Bearer ${token}`,
        },
      });
      history('/');
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }
  };
  const handleFormSubmit = () => {
    
    handleSubmit();
  };
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', maxHeight: '100vh' }}
    >
      <div>
        <Modal
          title={
            <Title
              level={2}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              Đặt phòng
            </Title>
          }
          visible={true}
          footer={null}
        >
          <Space direction='vertical' size='middle'>
            {errorVisible && (
              <Alert message={errorMessage} type='error' closable />
            )}
            <p style={{ fontSize: '18px' }}>
              Phòng đã chọn: {selectedRoom?.room_name}
            </p>
            <p>Ngày hiện tại: {currentTime}</p>

            <Form layout='vertical' onFinish={handleFormSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='Thời gian bắt đầu'
                    name='time_start'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn thời gian bắt đầu',
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      name='time_start'
                      value={bookingData.time_start}
                      onChange={(date, dateString) =>
                        handleBookingDataChange('time_start', date)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Thời gian kết thúc'
                    name='time_end'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn thời gian kết thúc',
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      name='time_end'
                      value={bookingData.time_end}
                      onChange={(date, dateString) =>
                        handleBookingDataChange('time_end', date)
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label='Nhân viên'
                name='employee_id'
                required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn nhân viên',
                  },
                ]}
              >
                <Select
                  placeholder='Chọn nhân viên'
                  onChange={handleEmployeeSelection}
                  value={bookingData.user_id}
                  mode='multiple'
                >
                  {employees.map(employee => (
                    <Option key={employee.user_id} value={employee.user_id}>
                      {employee.user_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Đặt phòng
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default BookingFormPage;
