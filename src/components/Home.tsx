import { useEffect, useState } from 'react';
import {
  Calendar,
  Modal,
  Button,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Select,
  List,
  Typography,
  Space,
  Popover,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import getCookie from './route/Cookie';

const { Title } = Typography;

interface BookingData {
  title: string,
  booking_id: number | null;
  time_start: Dayjs | null;
  time_end: Dayjs | null;
  user_id: number[];
  room_id: number | null;
  room_name: string;
  user_name: string[];
}

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
  status: boolean;
}
const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [employees, setEmployees] = useState([] as DataType[]);
  const [form] = Form.useForm();
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const url = 'https://c1a4-210-245-110-144.ngrok-free.app';
  const token = getCookie('token');

  const fetchEmployees = async () => {
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
      console.log(error.response.data.error);
    }
  };
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${url}/v1/rooms`, {
        params: {
          page: currentPage,
        },
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'any',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Ngrok-Trace-Id': 'bc47d5235e969cbcdd63082f9efdeb9c',
          Server: 'Werkzeug/3.0.0 Python/3.12.0',
          'cache-control': 'no-cache,private',
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data.rooms);
    } catch (error: any | null) {
      console.log(error);
    }
  };
  const fetchBooking = async () => {
    try {
      const res = await axios.get(url + '/v1/bookings', {
        withCredentials: true,
        headers: {
          'ngrok-skip-browser-warning': 'any',
          Authorization: `Bearer ${token}`,
        },
      });
      setBookingData(res.data.bookings);
      console.log(res.data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooking();
    fetchEmployees();
    fetchRooms();
  }, []);

  const handleDateSelect = (value: Dayjs) => {
    const selectedDate = value.format('YYYY-MM-DD');
    const selectedBooking = bookingData.find(booking =>
      dayjs(booking.time_start)?.isSame(selectedDate, 'day')
    );
    setSelectedBooking(selectedBooking || null);
  };
  const handleUpdateModalClose = () => {
    setUpdateModalVisible(false);
    Modal.destroyAll();
    form.resetFields();
  };
  const handleEditModalOpen = () => {
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    Modal.destroyAll();
    form.resetFields();
  };

  const handleDeleteModalOpen = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
    Modal.destroyAll();
  };

  const handleEditBooking = async (values: BookingData) => {
    const formattedBookingData = {
      ...values,
      user_id: values.user_id,
      room_id: selectedBooking?.room_id,
      time_start: values.time_start!.format(),
      time_end: values.time_end!.format(),
    };

    try {
      const res = await axios.put(
        `${url}/v1/bookings/${selectedBooking?.booking_id}`,
        formattedBookingData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookingData(res.data.booking);
      handleEditModalClose();
      setTimeout(() => {
        Modal.success({
          title: `Booking Updated Success`,
        });
        Modal.destroyAll();
      }, 3000);
      fetchBooking();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBooking = (id: number) => {
    axios
      .delete(url + '/v1/bookings/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setBookingData(res.data.bookings);
        Modal.success({
          title: 'Booking deleted successfully',
        });
        fetchBooking();
      })
      .catch(er => console.log(er));
    handleDeleteModalClose();
    handleUpdateModalClose();
  };

  const handleAddBooking = () => {
    setUpdateModalVisible(true);
  };

  const handleCreateBooking = async (values: BookingData) => {
    const formattedBookingData = {
      ...values,
      time_start: values.time_start!.format(),
      time_end: values.time_end!.format(),
    };

    try {
      const res = await axios.post(`${url}/v1/bookings`, formattedBookingData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookingData(res.data.booking);
      setTimeout(() => {
        Modal.success({
          title: 'Booking created successfully',
        });
        Modal.destroyAll();
      }, 3000);
      fetchBooking();
      handleEditModalClose();
    } catch (error: any) {
      setTimeout(() => {
        Modal.error({
          title: `${error.response.data.description}`,
        });
        Modal.destroyAll();
      }, 3000);
    }
  };

  const handleBookingClick = (
    event: React.MouseEvent<HTMLDivElement>,
    booking: BookingData
  ) => {
    event.stopPropagation();
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const dateCellRender = (value: Dayjs) => {
    if (bookingData && bookingData.length > 0) {
      const bookings = bookingData.filter(booking => {
        const bookingDate = dayjs(booking.time_start)?.format('YYYY-MM-DD');
        return bookingDate === value.format('YYYY-MM-DD');
      });
      return (
        <>
          {bookings.map(booking => (
            <div
              key={booking.booking_id}
              style={{
                width: '100%',
                background: '#D6E4EC',
                padding: '3px 3px 0 12px',
                marginBottom: '3px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
              onClick={e => handleBookingClick(e, booking)}
            >
              {booking.title}
            </div>
          ))}
        </>
      );
    }
  };
  const handleCloseShow = () => {
    setModalVisible(false);
    setSelectedBooking(null);
    Modal.destroyAll();
  };
  return (
    <div>
      <div>
        <Button type='primary' onClick={handleAddBooking}>
          Add Booking
        </Button>
      </div>
      <div>
        <Calendar
          value={selectedDate}
          onSelect={handleDateSelect}
          dateCellRender={dateCellRender}
        />
      </div>
      <Modal
        title={
          <Title
            level={2}
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              borderBottom: '4px solid #D6E4EC',
              marginBottom: '15px',
              paddingBottom: '10px',
            }}
          >
            Đặt phòng
          </Title>
        }
        visible={updateModalVisible}
        onCancel={handleUpdateModalClose}
        footer={null}
        bodyStyle={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '20px',
        }}
        destroyOnClose={true}
        maskClosable={false}
        afterClose={handleUpdateModalClose}
      >
        <Form form={form} onFinish={handleCreateBooking} preserve={false}>
          <Form.Item name='room_id' label='Room'>
            <Select placeholder='Select a room'>
              {rooms?.map(room => (
                <Select.Option key={room.room_id} value={room.room_id}>
                  {room.room_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='user_id' label='Employees'>
            <Select
              mode='multiple'
              placeholder='Select employees'
              optionLabelProp='label'
            >
              {employees.map(employee => (
                <Select.Option
                  key={employee.user_id}
                  value={employee.user_id}
                  label={employee.user_name}
                >
                  {employee.user_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='time_start' label='Start Time'>
            <DatePicker
              showTime
              format='YYYY-MM-DD HH:mm'
              placeholder='Select start time'
            />
          </Form.Item>
          <Form.Item name='time_end' label='End Time'>
            <DatePicker
              showTime
              format='YYYY-MM-DD HH:mm'
              placeholder='Select end time'
            />
          </Form.Item>
          <Form.Item name="title" label="Title">
              <Input type='text'/>
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' htmlType='submit'>
              Create add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '4px solid #D6E4EC',
              marginBottom: '10px',
              paddingBottom: '15px',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <Typography.Title level={2} style={{ margin: 0 }}>
              {selectedBooking?.title}  
            </Typography.Title>
          </div>
        }
        visible={modalVisible}
        onCancel={handleCloseShow}
        footer={
          <div>
            <Space
              style={{
                width: '100%',
                justifyContent: 'flex-end',
                columnGap: '5%',
              }}
            >
              <Popover content='Edit Room'>
                <Button onClick={handleEditModalOpen}>Edit</Button>
              </Popover>
              <Popover content='Delete Room'>
                <Button danger onClick={handleDeleteModalOpen}>
                  Delete
                </Button>
              </Popover>
            </Space>
          </div>
        }
        destroyOnClose={true}
        maskClosable={false}
        afterClose={handleCloseShow}
        bodyStyle={{
          border: '3px solid #ccc',
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.3)',
        }}
      >
        {selectedBooking && (
          <>
            <Typography.Title level={4}>
              Room: {selectedBooking.room_name}
            </Typography.Title>
            <Typography.Title level={4}>
              <List
                header={<div style={{marginBottom:'0px'}}>Người tham dự:</div>}
                footer={null}
                dataSource={selectedBooking.user_name}
                renderItem={user => (
                  <List.Item style={{ paddingBottom: '0' }}>
                    <span style={{ marginRight: '8px' }}>•</span> {user}
                  </List.Item>
                )}
                style={{
                  padding:'1px'
                }}
              />
            </Typography.Title>
            <div style={{paddingBottom:'10px'}}>
            <div style={{ marginTop: '20px', marginBottom:'10px' }}>
              <Typography.Text strong>Ngày họp:</Typography.Text>{' '}
              <Typography.Text>
                {selectedBooking.time_start
                  ? dayjs(selectedBooking.time_start).format('DD/MM/YYYY')
                  : ''}
              </Typography.Text>
            </div>
            <div style={{ marginTop: '10px' , marginBottom:'10px'}}>
              <Typography.Text strong>Giờ bắt đầu:</Typography.Text>{' '}
              <Typography.Text>
                {selectedBooking.time_start
                  ? dayjs(selectedBooking.time_start).format('HH:mm')
                  : ''}
              </Typography.Text>
            </div>
            <div style={{ marginTop: '10px', marginBottom:'10px' }}>
              <Typography.Text strong>Giờ kết thúc:</Typography.Text>{' '}
              <Typography.Text>
                {selectedBooking.time_end
                  ? dayjs(selectedBooking.time_end).format('HH:mm')
                  : ''}
              </Typography.Text>
            </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        title='Edit Room'
        visible={editModalVisible}
        onCancel={handleEditModalClose}
        footer={[
          <Button key='cancel' onClick={handleEditModalClose}>
            Cancel
          </Button>,
        ]}
        destroyOnClose={true}
        maskClosable={false}
        afterClose={handleEditModalClose}
      >
        <Form
          form={form}
          onFinish={handleEditBooking}
          initialValues={{
            user_id: selectedBooking?.user_id,
            time_start: dayjs(selectedBooking?.time_start),
            time_end: dayjs(selectedBooking?.time_end),
            title: selectedBooking?.title
          }}
          preserve={false}
        >
          <Form.Item name='user_id' label='Employees'>
            <Select
              mode='multiple'
              placeholder='Select employees'
              optionLabelProp='label'
            >
              {employees.map(employee => (
                <Select.Option
                  key={employee.user_id}
                  value={employee.user_id}
                  label={employee.user_name}
                >
                  {employee.user_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='time_start' label='Start Time'>
            <DatePicker
              showTime
              format='YYYY-MM-DD HH:mm'
              placeholder='Select start time'
            />
          </Form.Item>
          <Form.Item name='time_end' label='End Time'>
            <DatePicker
              showTime
              format='YYYY-MM-DD HH:mm'
              placeholder='Select end time'
            />
          </Form.Item>
          <Form.Item name='title' label='Title'>
                <Input type='text' />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' htmlType='submit'>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Delete Booking'
        visible={deleteModalVisible}
        onCancel={handleDeleteModalClose}
        footer={[
          <Button key='cancel' onClick={handleDeleteModalClose}>
            Cancel
          </Button>,
          <Button
            key='delete'
            type='primary'
            danger
            onClick={() => handleDeleteBooking(selectedBooking?.booking_id!)}
          >
            Delete
          </Button>,
        ]}
        destroyOnClose={true}
        maskClosable={false}
        afterClose={handleDeleteModalClose}
      >
        <p>Are you sure you want to delete this booking?</p>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
