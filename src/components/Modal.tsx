import { Modal, Form, Input, Button, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface MyModalProps {
  modalStatus: boolean;
  handleClose: () => void;
  handleSave: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmployeeChange: (value: string) => void;
  handleRoomChange: (value: string) => void;
  startDate: Date;
  endDate: Date;
  eventInput: string;
  handleEditEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdited: () => void;
  editStatus: boolean;
  handleDelete: () => void;
  employees: string[];
  selectedEmployee: string;
  rooms: string[];
  selectedRoom: string;
}

function MyModal({
  modalStatus,
  handleClose,
  handleSave,
  handleChange,
  handleEmployeeChange,
  handleRoomChange,
  startDate,
  endDate,
  eventInput,
  handleEditEvent,
  handleEdited,
  editStatus,
  handleDelete,
  employees,
  selectedEmployee,
  rooms,
  selectedRoom,
}: MyModalProps) {
  return (
    <>
      <Modal
        visible={modalStatus}
        onCancel={handleClose}
        centered
        className='my-modal'
        title='Book Meeting Room'
        footer={null}
      >
        <Form>
          <Form.Item label='Start time'>
            <Input
              value={startDate.toLocaleString('en-US')}
              disabled
              style={{ wordSpacing: '3px' }}
            />
          </Form.Item>

          <Form.Item label='End Time'>
            <Input
              value={endDate.toLocaleString('en-US')}
              disabled
              style={{ wordSpacing: '3px' }}
            />
          </Form.Item>

          <Form.Item label='Meeting title'>
            <Input onChange={handleChange} style={{ boxShadow: 'none' }} />
          </Form.Item>

          {/* for editing created event */}
          {editStatus && (
            <Form.Item label='Meeting title'>
              <Input
                value={eventInput}
                onChange={handleEditEvent}
                style={{ boxShadow: 'none' }}
              />
            </Form.Item>
          )}

          <Form.Item label='Employee'>
            <Select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              style={{ width: '100%' }}
            >
              {employees.map(employee => (
                <Select.Option key={employee} value={employee}>
                  {employee}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Rooms'>
            <Select
              value={selectedRoom}
              onChange={handleRoomChange}
              style={{ width: '100%' }}
            >
              {rooms.map(room => (
                <Select.Option key={room} value={room}>
                  {room}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* for deleting created event */}
          {editStatus && (
            <Button
              type='primary'
              danger
              onClick={handleDelete}
              style={{ boxShadow: 'none', marginRight: 8 }}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          )}

          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Close
          </Button>

          {/* for creating new event */}
          {!editStatus && (
            <Button
              type='primary'
              onClick={handleSave}
              style={{ boxShadow: 'none', marginRight: 8 }}
            >
              Book
            </Button>
          )}

          {/* for editing created event */}
          {editStatus && (
            <Button
              type='primary'
              onClick={handleEdited}
              style={{ boxShadow: 'none', marginRight: 8 }}
            >
              Save Changes
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default MyModal;
