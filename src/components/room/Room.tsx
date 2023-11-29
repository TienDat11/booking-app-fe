import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Alert,
  Form,
  Input,
  Space,
  Popover,
  List,
  Spin,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import getCookie from '../route/Cookie';
interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

const { Search } = Input;

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const token = getCookie('token');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const url: string = 'https://e920-117-2-6-32.ngrok-free.app';

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/v1/rooms`, {
        params: {
          page: currentPage,
          per_page: perPage,
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
      setRooms(response.data.data.rooms);
      setTotalRooms(response.data.data.total_items);
    } catch (error: any | null) {
      setErrorMessage(error);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, totalRooms]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalRooms,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };

  const handleShowAdd = () => {
    setIsModalVisible(true);
  };

  const handleAddRoom = async (values: any) => {
    try {
      const { room_name, description } = values; 
      await axios.post(
        `${url}/v1/rooms`,
        {
          room_name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      setAlertMessage('Thêm phòng họp thành công!');
      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.response.data.description);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }
    handleCancel();
  };
  const handleModalDelete = (id: number, name: string) => {
    setSelectedRoom({
      room_id: id,
      room_name: name,
      description: null,
      is_blocked: false,
    });
    setShowDeleteModal(true);
  };
  // const handleDelete = async () => {
  //   try {
  //     setLoading(true);
  //     if (selectedRoom) {
  //       await axios.delete(`${url}/v1/rooms/${selectedRoom.room_id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       fetchData();
  //       setShowDeleteModal(false);
  //       setAlertMessage('Xóa thành công!');
  //       setIsAlertVisible(true);
  //       setTimeout(() => {
  //         setIsAlertVisible(false);
  //       }, 3000);
  //     }
  //     if (currentPage > 1 && rooms.length === 1) {
  //       setCurrentPage(currentPage - 1);
  //     } else {
  //       fetchData();
  //     }
  //   } catch (error: any) {
  //     setErrorMessage(error.response.data.description);
  //     setErrorVisible(true);
  //     setTimeout(() => {
  //       setErrorVisible(false);
  //     }, 3000);
  //   }
  //   setLoading(false);
  // };

  const handleEdit = (id: number, name: string) => {
    setSelectedRoom({
      room_id: id,
      room_name: name,
      description: '',
      is_blocked: false,
    });
    form.setFieldsValue({ room_name: name });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (selectedRoom) {
        await axios.put(
          `${url}/v1/rooms/${selectedRoom.room_id}`,
          { room_name: values.room_name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchData();
        setShowEditModal(false);
        setAlertMessage('Cập nhật thành công!');
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
          form.resetFields();
        }, 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.description);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }
    setLoading(false);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // const handleCloseDeleteModal = () => {
  //   setShowDeleteModal(false);
  // };

  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      fetchData();
    } else {
     await axios
      .get(`${url}/v1/rooms/search`, {
        params: {
          name: value,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setRooms(response.data.rooms);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <Spin
            size='large'
            tip='Loading...'
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              color: '#ff0000',
            }}
          />
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}
            >
              <Button
                onClick={handleShowAdd}
                type='primary'
                style={{
                  marginTop: '10px',
                  borderRadius: '10px',
                }}
              >
                Add Room
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Search
                placeholder='Search...'
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
                onSearch={handleSearch}
              />
            </div>
            <div className='action'>
              {isAlertVisible && (
                <div style={{ width: '100%', height: '20px' }}>
                  <Alert message={alertMessage} type='success' />
                </div>
              )}
              {errorVisible && (
                <div style={{ width: '100%', height: '20px' }}>
                  <Alert message={errorMessage} type='error' />
                </div>
              )}
              <div className='card-group'>
                <List
                  style={{ width: '100%' }}
                  dataSource={rooms}
                  grid={{ gutter: 20, column: 3 }}
                  pagination={pagination}
                  renderItem={room => (
                    <List.Item
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        minWidth: '100px',
                        minHeight: '80px',
                        maxHeight: '370px',
                        maxWidth: '280px',
                        padding: '20px 0',
                      }}
                    >
                      <div
                        key={room.room_id}
                        className='room-card'
                        style={{
                          width: '100%',
                          height: '100%',
                          border: '2px solid #dadada',
                          borderRadius: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div className='room-info'>
                          <h2>
                            <Link to={`/roomManager/${room.room_id}`}>
                              {room.room_name}
                            </Link>
                          </h2>
                          <p
                            style={{
                              color: room.is_blocked ? 'red' : 'black',
                              fontSize: '20px',
                            }}
                          >
                            Trạng thái: {room.is_blocked ? 'Bận' : 'Rảnh'}
                          </p>
                        </div>
                        <div className='room-actions'>
                          <Space style={{ marginBottom: '10px' }}>
                            <Popover content='Edit Room'>
                              <EditOutlined
                                style={{ justifyContent: 'flex-end' }}
                                onClick={() =>
                                  handleEdit(room.room_id, room.room_name)
                                }
                              />
                            </Popover>
                            <Popover content='Delete Room'>
                              <DeleteOutlined
                                style={{
                                  color: '#ff4d4f',
                                  justifyContent: 'flex-end',
                                }}
                                onClick={() =>
                                  handleModalDelete(
                                    room.room_id,
                                    room.room_name
                                  )
                                }
                              />
                            </Popover>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>

            <Modal
              title={
                <div style={{ marginBottom: '10px' }}>
                  <Typography.Title level={2} style={{ textAlign: 'center' }}>
                    Edit Room Meeting
                  </Typography.Title>
                </div>
              }
              visible={showEditModal}
              onCancel={handleCloseEditModal}
              footer={null}
            >
              <Form form={form} onFinish={handleUpdate}>
                <Form.Item name='room_name'>
                  <Input
                    type='text'
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ marginRight: '5px' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    htmlType='button'
                    onClick={event => {
                      event.preventDefault();
                      setShowEditModal(false);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title='Add Room'
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              {errorVisible && <Alert message={errorMessage} type='error' />}
              <Form form={form} onFinish={handleAddRoom} preserve={false}>
                <Form.Item
                  name='room_name'
                  label='Room Name:'
                  rules={[
                    {
                      required: true,
                      message: 'Room not empty',
                    },
                  ]}
                >
                  <Input type='text' />
                </Form.Item>
                <Form.Item
                  name='description'
                  label='Description:'
                  rules={[
                    {
                      required: true,
                      message: 'Room not empty',
                    },
                  ]}
                >
                  <Input type='text' />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ marginRight: '5px' }}
                  >
                    Add
                  </Button>
                  <Button
                    htmlType='button'
                    onClick={event => {
                      event.preventDefault();
                      handleCancel();
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default Rooms;
