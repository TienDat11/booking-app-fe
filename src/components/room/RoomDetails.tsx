import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Result,
  Button,
  Spin,
  Modal,
  Form,
  Input,
  Alert,
} from 'antd';
import axios from 'axios';
import getCookie from '../route/Cookie';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface RoomManager {
  room_id: number;
  room_name: string;
  status: boolean;
  description: string;
  is_blocked: boolean;
}

const RoomDetails = () => {
  const { id } = useParams();
  const roomId: number = parseInt(id as string);
  const [room, setRoom] = useState<RoomManager | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const url: string = 'https://08d0-210-245-110-144.ngrok-free.app';
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const token = getCookie('token');
  const [isLookModalVisible, setIsLookModalVisible] = useState<boolean>(false);
  const [isOpenModalVisible, setIsOpenModalVisible] = useState<boolean>(false);

  const fetchRoomId = async (roomId: number) => {
    try {
      const response = await axios.get(`${url}/v1/rooms/${roomId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoom(response.data.data);
    } catch (error: any) {
      setIsError(true);
      setError(error.response.data.description);
    }
  };

  useEffect(() => {
    fetchRoomId(roomId);
  }, [roomId]);

  const handleOpenModalLook = (roomDescription: string) => {
    form.setFieldValue('description', roomDescription);
    setIsLookModalVisible(true);
  };

  const handleCloseModalLook = () => {
    setIsLookModalVisible(false);
  };

  const handleOpenModalOpenLook = (roomDescription: string) => {
    form1.setFieldValue('description', roomDescription);
    setIsOpenModalVisible(true);
  };

  const handleCloseModalOpenLook = () => {
    setIsOpenModalVisible(false);
  };

  const handleLookRoom = async (values: { description: string }) => {
    try {
      await axios.put(
        `${url}/v1/rooms/${id}/blocked`,
        {
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRoomId(roomId);
      handleCloseModalLook();
      setMessage('Room and associated bookings blocked successfully');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      setIsError(true);
      setError(error.response.data.description);
    }
  };

  const handleOpenLookRoom = async (values: { description: string }) => {
    try {
      await axios.put(
        `${url}/v1/rooms/${id}/opened`,
        {
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRoomId(roomId);
      handleCloseModalOpenLook();
      setMessage('Room and associated bookings opened successfully');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      setIsError(true);
      setError(error.response.data.description);
    }
  };

  if (isError) {
    return (
      <Result
        status='error'
        title='Có 1 lỗi xảy ra từ server'
        subTitle={error}
        extra={
          <Button type='primary' href='/roomManager'>
            Trở về trang Room
          </Button>
        }
      />
    );
  }

  if (!room) {
    return (
      <Spin
        size='large'
        tip='Loading...'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
        }}
      />
    );
  }

  return (
    <>
      {room.is_blocked ? (
        <>
          {isSuccess && (
            <div style={{ width: '70%', height: '20px' }}>
              <Alert message={message} type='warning' />
            </div>
          )}
          <Result
            status='error'
            title='Phòng bị khóa'
            subTitle={
              <div>
                <Text>Description: {room.description}</Text>
              </div>
            }
            extra={
              <div>
                <Text>Bạn có muốn mở lại phòng này không</Text>
                <Button
                  onClick={() => handleOpenModalOpenLook(room.description)}
                  style={{ marginLeft: '10px' }}
                  type='primary'
                >
                  Opened
                </Button>
              </div>
            }
          />
        </>
      ) : (
        <>
          {isSuccess && (
            <div style={{ width: '70%', height: '20px' }}>
              <Alert message={message} type='success' />
            </div>
          )}
          <Card
            style={{ width: '100%' }}
            bodyStyle={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Title level={4}>{room.room_name}</Title>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Room ID:</Text> {room.room_id}
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Status:</Text> {room.status ? 'Active' : 'Inactive'}
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Description:</Text> {room.description}
            </div>
            <Button
              style={{ backgroundColor: '#ff4d4f', color: 'white' }}
              onClick={() => handleOpenModalLook(room.description)}
            >
              Look
            </Button>
          </Card>
        </>
      )}

      <Modal
        title={<Title level={2}>Look Rooms</Title>}
        visible={isLookModalVisible}
        onCancel={handleCloseModalLook}
        footer={[
          <Button key='cancel' onClick={handleCloseModalLook}>
            Cancel
          </Button>,
          <Button key='look' type='default' form='lookForm' htmlType='submit'>
            Look
          </Button>,
        ]}
      >
        <Form form={form} id='lookForm' onFinish={handleLookRoom}>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input type='text' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={2}>Open Rooms</Title>}
        visible={isOpenModalVisible}
        onCancel={handleCloseModalOpenLook}
        footer={[
          <Button key='cancel' onClick={handleCloseModalOpenLook}>
            Cancel
          </Button>,
          <Button key='open' type='primary' form='openForm' htmlType='submit'>
            Open
          </Button>,
        ]}
      >
        <Form form={form1} id='openForm' onFinish={handleOpenLookRoom}>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input type='text' />
          </Form.Item>
        </Form>
      </Modal>
    </>   
  );
};

export default RoomDetails;
