import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Button,
  Modal,
  Alert,
  Form,
  Input,
  Space,
  Popover,
  List,
} from 'antd';
import BookingFormPage from '../Booking';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  SelectOutlined,
} from '@ant-design/icons';
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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const token1 = getCookie('token');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRooms, setTotalRooms] = useState(0);
  const [isModalVisible, setIsModalVisible ] = useState(false);
  const Navigate = useNavigate();

  const url: string = 'https://c1a4-210-245-110-144.ngrok-free.app';

  const fetchData = async () => {
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
          Authorization: `Bearer ${token1}`,
        },
      });
      setRooms(response.data.rooms);
    } catch (error: any | null) {
      setErrorMessage(error);
      setErrorVisible(true);
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false); 
  }
  useEffect(() => {
    fetchData();
  }, [currentPage, perPage]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPerPage(size);
    setCurrentPage(1);
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
      setLoading(true);
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
      setRoomName('');
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }
    setLoading(false);
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
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
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
      }
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
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

  const handleToggleBookingForm = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };
  return (
    <>
      {showBookingForm ? (
        <BookingFormPage selectedRoom={selectedRoom} />
      ) : (
        <div
          style={{
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.5 : 1,
          }}
        >
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
            {isAlertVisible && <div style={{width:'100%', height:'20px'}}><Alert message={alertMessage} type='success' /></div>}
            <div
              className='card-group'
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
              }}
            >
              <List
                dataSource={rooms}
                grid={{ gutter: 10, column: 1 }}
                renderItem={room => (
                  <List.Item>
                    <Card
                      key={room.room_id}
                      className='room-card'
                      style={{
                        width: '100%',
                        height: '100%',
                        margin: '10px',
                        padding: '5px',
                        border: '2px solid #dadada',
                        boxShadow: 'rgba(255 , 255 ,255 , 0.3)',
                        borderRadius: '1rem',
                      }}
                      actions={[
                        <Space
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            columnGap: '25%',
                          }}
                        >
                          <Popover content='Booking Room'>
                            <SelectOutlined
                              onClick={() => handleToggleBookingForm(room)}
                            />
                          </Popover>

                          <Popover content='Edit Room'>
                            <EditOutlined
                              onClick={() =>
                                handleEdit(room.room_id, room.room_name)
                              }
                            />
                          </Popover>
                          <Popover content='Delete Room'>
                            <DeleteOutlined
                              style={{ color: '#ff4d4f' }}
                              onClick={() =>
                                handleModalDelete(room.room_id, room.room_name)
                              }
                            />
                          </Popover>
                        </Space>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div>
                            <h2>{room.room_name}</h2>
                          </div>
                        }
                        description={
                          <div>
                            <p
                              style={{
                                color: room.status ? 'red' : 'black',
                                fontSize: '20px',
                              }}
                            >
                              Trạng thái: {room.status ? 'Bận' : 'Rảnh'}
                            </p>
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
                pagination={pagination}
              />
            </div>
          </div>

          <Modal
            title='Edit Room'
            open={showEditModal}
            onCancel={handleCloseEditModal}
            footer={null}
          >
            <Form>
              {errorVisible && <Alert message={errorMessage} type='error' />}
              <Form.Item>
                <Input
                  type='text'
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
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
            open={showDeleteModal}
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
        </div>
      )}
    </>
  );
};

export default Rooms;
