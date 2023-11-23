import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Alert, Form, Input, Space, Popover, List, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import getCookie from '../route/Cookie';
interface Room {
  room_id: number;
  room_name: string;
  status: boolean;
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const token1 = getCookie('token');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const url: string = 'https://6158-210-245-110-144.ngrok-free.app';

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
          Authorization: `Bearer ${token1}`,
        },
      });
      setRooms(response.data.rooms);
      setTotalRooms(response.data.total_items);

    } catch (error: any | null) {
      setErrorMessage(error);
      setErrorVisible(true);
    }
    finally{
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, totalRooms]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage = Math.ceil((currentPage - 1) * perPage / newPerPage) + 1;
    setPerPage(newPerPage);
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

  const handleAddRoom = async () => {
    try {
      await axios.post(
        `${url}/v1/rooms`,
        { room_name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        }
      );
      fetchData();
      setAlertMessage('Thêm phòng họp thành công!');
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      setRoomName('');
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
    setSelectedRoom({ room_id: id, room_name: name, status: false });
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      setLoading(true);
      if (selectedRoom) {
        await axios.delete(`${url}/v1/rooms/${selectedRoom.room_id}`, {
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        });
        fetchData();
        setShowDeleteModal(false);
        setAlertMessage('Xóa thành công!');
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
      if (currentPage > 1 && rooms.length === 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchData();
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

  const handleEdit = (id: number, name: string) => {
    setSelectedRoom({ room_id: id, room_name: name, status: false });
    setRoomName(name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (selectedRoom) {
        await axios.put(
          `${url}/v1/rooms/${selectedRoom.room_id}`,
          { room_name: roomName },
          {
            headers: {
              Authorization: `Bearer ${token1}`,
            },
          }
        );
        fetchData();
        setShowEditModal(false);
        setAlertMessage('Cập nhật thành công!');
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
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

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div>
        {loading ? (
           <Spin
           size="large"
           tip="Loading..."
           style={{
             position: 'fixed',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             fontSize: '24px',
             color: '#ff0000'
           }}
         />
        ) : (
          <>
            <Button
              onClick={handleShowAdd}
              style={{
                marginTop: '10px',
                borderRadius: '10px',
              }}
            >
              Add Room
            </Button>
            <div className='action'>
              {isAlertVisible && (
                <div style={{ width: '100%', height: '20px' }}>
                  <Alert message={alertMessage} type='success' />
                </div>
              )}
              {errorVisible && (<div style={{ width: '100%', height: '20px' }}>
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
                        justifyContent: 'center',
                        minWidth: '100px',
                        minHeight: '80px',
                        maxHeight: '360px',
                        maxWidth: '400px',
                        padding: '20px 0',
                      }}
                    >
                      <div
                        key={room.room_id}
                        className='room-card'
                        style={{
                          width: '100%',
                          height: '100%',
                          margin: '10px',
                          padding: '20px 10px 20px 0',
                          border: '2px solid #dadada',
                          borderRadius: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div className='room-info'>
                          <h2>{room.room_name}</h2>
                          <p
                            style={{
                              color: room.status ? 'red' : 'black',
                              fontSize: '20px',
                            }}
                          >
                            Trạng thái: {room.status ? 'Bận' : 'Rảnh'}
                          </p>
                        </div>
                        <div className='room-actions'>
                          <Space>
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
                <div style={{marginBottom:'10px'}}>
                  <h2 style={{textAlign:'center'}}>Edit Room Meeting</h2>
                </div>
              }
              visible={showEditModal}
              onCancel={handleCloseEditModal}
              footer={null}
            >
              <Form>
                <Form.Item>
                  <Input
                    type='text'
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    style={{padding:'10px 20px', fontSize:'16px'}}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    onClick={handleUpdate}
                    style={{ marginRight: '5px' }}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={handleCloseEditModal}>Cancel</Button>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title='Delete Room'
              visible={showDeleteModal}
              onCancel={handleCloseDeleteModal}
              footer={null}
            >
              {errorVisible && <Alert message={errorMessage} type='error' />}
              <p>
                Bạn có muốn xoá phòng này "{selectedRoom?.room_name}" hay không?
              </p>
              <Button
                danger
                onClick={handleDelete}
                style={{ marginRight: '5px' }}
              >
                Delete
              </Button>
              <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            </Modal>

            <Modal
              title='Add Room'
              visible={isModalVisible}
              onOk={handleAddRoom}
              onCancel={handleCancel}
              okText='Add'
              cancelText='Cancel'
              confirmLoading={loading}
            >
              {errorVisible && <Alert message={errorMessage} type='error' />}
              <Form.Item>
                <Input
                  type='text'
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                />
              </Form.Item>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default Rooms;
