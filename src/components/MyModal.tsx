import { Modal, Button, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Dayjs } from 'dayjs';
import BookingData from './type';
import moment from 'moment';

interface MyModalProps {
  modalStatus: boolean;
  handleClose: () => void;
  handleSave: (values: BookingData) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  eventInput: string;
  handleEditEvent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEdited: (values: BookingData) => void;
  editStatus: boolean;
  handleDelete: () => void;
  allEmployees: { id: number; name: string }[];
  allRooms: { id: number; name: string }[];
}

const MyModal: React.FC<MyModalProps> = ({
  modalStatus,
  handleClose,
  handleSave,
  startDate,
  endDate,
  eventInput,
  handleEditEvent,
  handleEdited,
  editStatus,
  handleDelete,
  allEmployees,
  allRooms,
}) => {
  const [form] = useForm<BookingData>();

  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      if (!editStatus) {
        handleSave(values);
      } else {
        handleEdited(values);
      }
    });
  };

  return (
    <>
      <Modal
        visible={modalStatus}
        onCancel={handleClose}
        centered
        className='my-modal'
        title='Create New Event'
        footer={[
          editStatus && (
            <Button key='delete' className='btn-delete' onClick={handleDelete}>
              <i className='fi fi-rr-trash'></i> Delete
            </Button>
          ),
          <Button key='cancel' className='btn-cancel' onClick={handleClose}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            className='btn-submit'
            onClick={handleFormSubmit}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} initialValues={{ room_id: null, employee_id: [] }}>
          <Form.Item label='Start time'>
            <Input
              type='email'
              placeholder={
                startDate
                  ? moment(startDate.toDate()).format('YYYY-MM-DD HH:mm')
                  : undefined
              }
              disabled
              style={{ wordSpacing: '3px' }}
            />
          </Form.Item>

          <Form.Item label='End Time'>
            <Input
              type='email'
              placeholder={
                endDate
                  ? moment(endDate.toDate()).format('YYYY-MM-DD HH:mm')
                  : undefined
              }
              style={{ wordSpacing: '3px' }}
              disabled
            />
          </Form.Item>

          {!editStatus && (
            <Form.Item
              label='Event title'
              name='eventInput'
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} style={{ boxShadow: 'none' }} />
            </Form.Item>
          )}

          {editStatus && (
            <Form.Item label='Event title' name='eventInput'>
              <Input.TextArea
                rows={3}
                value={eventInput}
                onChange={handleEditEvent}
                style={{ boxShadow: 'none' }}
              />
            </Form.Item>
          )}

          <Form.Item label='Room' name='room_id'>
            <Select placeholder='Select a room'>
              {allRooms.map(room => (
                <Select.Option key={room.id} value={room.id}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Employees' name='employee_id'>
            <Select mode='multiple' placeholder='Select employees'>
              {allEmployees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MyModal;
