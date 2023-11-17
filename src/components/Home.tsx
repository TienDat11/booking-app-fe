import React, { useState } from 'react';
import { Calendar, Modal, Form, Select, Button, DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface BookingData {
  booking_id: number | null;
  time_start: Dayjs | null;
  time_end: Dayjs | null;
  employee_id: number[];
  room_id: number | null;
  room_name: string;
  employee_name: string[];
}

const bookingData: BookingData[] = [
  {
    booking_id: 1,
    time_start: dayjs('2023-11-14T10:00:00'),
    time_end: dayjs('2023-11-14T12:00:00'),
    employee_id: [1, 2],
    room_id: 1,
    room_name: 'Tan Tam',
    employee_name: ['John', 'Jane'],
  },
  {
    booking_id: 2,
    time_start: dayjs('2023-11-14T10:00:00'),
    time_end: dayjs('2023-11-14T12:00:00'),
    employee_id: [1, 8],
    room_id: 2,
    room_name: 'Tan Tam',
    employee_name: ['John', 'Jack'],
  },
  {
    booking_id: 3,
    time_start: dayjs('2023-11-14T10:00:00'),
    time_end: dayjs('2023-11-14T12:00:00'),
    employee_id: [1, 5],
    room_id: 3,
    room_name: 'Tan Tam',
    employee_name: ['John', 'Ben'],
  },
];

const roomColors: string[] | null = ['#5082FF', '#FF6B6B', '#FFC154']; // Mảng các màu sắc cho từng phòng

const MeetingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<BookingData[]>([]);
  const [form] = Form.useForm();

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (roomId: number | null) => {
    if (roomId) {
      setSelectedRoom(roomId);
      const events = bookingData.filter(
        (booking) =>
          dayjs(booking.time_start).isSame(selectedDate, 'day') &&
          booking.room_id === roomId
      );
      setModalContent(events);
      setVisible(true);
    }
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleBookingSubmit = (values: any) => {
    const { employee_id, time_start, time_end } = values;
    const newBooking: BookingData = {
      booking_id: bookingData.length + 1,
      time_start: dayjs(time_start),
      time_end: dayjs(time_end),
      employee_id,
      room_id: selectedRoom,
      room_name: bookingData.find((booking) => booking.room_id === selectedRoom)?.room_name || '',
      employee_name: ['Hello', 'World'],
    };

    bookingData.push(newBooking);
    form.resetFields();
    setVisible(false);
  };

  return (
    <div>
      <Calendar
        onSelect={handleDateSelect}
        dateCellRender={(date) => {
          const bookings = bookingData.filter((booking) =>
            dayjs(booking.time_start).isSame(date, 'day')
          );
          return (
            <div>
              {bookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRoomSelect(booking.room_id)}
                >
                  <div
                    style={{
                      borderRadius: '3px',
                      backgroundColor:
                        booking.room_id !== null ? roomColors[booking.room_id - 1] : '',
                      color: 'white',
                      padding: '0px 10px',
                      marginBottom: '5px',
                    }}
                  >
                    <p>{booking.room_name}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
      <Modal
        title={`Bookings for Room ${selectedRoom}`}
        visible={visible}
        onCancel={handleCloseModal}
      footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            Book
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="booking_form"
          onFinish={handleBookingSubmit}
        >
          <Form.Item
            name="time_start"
            label="Start Time"
            rules={[
              {
                required: true,
                message: 'Please select a start time',
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().endOf('day')
              }
            />
          </Form.Item>
          <Form.Item
            name="time_end"
            label="End Time"
            rules={[
              {
                required: true,
                message: 'Please select an end time',
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current &&
                (current < dayjs().endOf('day') ||
                  current < form.getFieldValue('time_start'))
              }
            />
          </Form.Item>
          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[
              {
                required: true,
                message: 'Please select at least one employee',
              },
            ]}
          >
            <Select mode="multiple">
              <Select.Option value={1}>John</Select.Option>
              <Select.Option value={2}>Jane</Select.Option>
              <Select.Option value={3}>Jack</Select.Option>
              <Select.Option value={4}>Ben</Select.Option>
              <Select.Option value={5}>Tom</Select.Option>
              <Select.Option value={6}>Jerry</Select.Option>
              <Select.Option value={7}>Alice</Select.Option>
              <Select.Option value={8}>Bob</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MeetingCalendar;






// import React, { useState, useEffect } from 'react';
// import { Calendar, Modal, Form, Select, Button, DatePicker, Spin } from 'antd';
// import dayjs, { Dayjs } from 'dayjs';
// import axios from 'axios';

// interface BookingData {
//   booking_id: number | null;
//   time_start: Dayjs | null;
//   time_end: Dayjs | null;
//   employee_id: number[];
//   room_id: number | null;
//   room_name: string;
//   employee_name: string[];
// }

// const roomColors: string[] = [
//   '#5082FF',   // Short duration
//   '#80C1FF',
//   '#B3E0FF',
//   '#FF6B6B',   // Medium duration
//   '#FF9E9E',
//   '#FFCCCC',
//   '#FFC154',   // Long duration
//   '#FFD390',
//   '#FFEAC7',
// ];

// const MeetingCalendar: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
//   const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
//   const [visible, setVisible] = useState(false);
//   const [modalContent, setModalContent] = useState<BookingData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (selectedDate && selectedRoom) {
//       fetchBookings(selectedDate, selectedRoom);
//     }
//   }, [selectedDate, selectedRoom]);

//   const fetchBookings = async (date: Dayjs, roomId: number) => {
//     try {
//       setLoading(true);
//       const response = await axios.get<BookingData[]>(`your_backend_api_url?date=${date.format('YYYY-MM-DD')}&roomId=${roomId}`);
//       setModalContent(response.data);
//       setVisible(true);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateSelect = (date: Dayjs | null) => {
//     setSelectedDate(date);
//     setSelectedRoom(null);
//   };

//   const handleRoomSelect = (roomId: number | null) => {
//     setSelectedRoom(roomId);
//   };

//   const handleCloseModal = () => {
//     setVisible(false);
//   };

//   const handleBookingSubmit = async (values: any) => {
//     const { employee_id, time_start, time_end } = values;
//     const newBooking: BookingData = {
//       booking_id: null,
//       time_start: dayjs(time_start),
//       time_end: dayjs(time_end),
//       employee_id,
//       room_id: selectedRoom,
//       room_name: '',
//       employee_name: [],
//     };

//     try {
//       const response = await axios.post<BookingData>('your_backend_api_url', newBooking);
//       const createdBooking = response.data;
//       setModalContent((prevContent) => [...prevContent, createdBooking]);
//       form.resetFields();
//       setVisible(false);
//     } catch (error) {
//       console.error('Error creating booking:', error);
//     }
//   };

//   return (
//     <div>
//       {loading ? (
//         <Spin size='large' />
//       ) : (
//         <Calendar
//           onSelect={handleDateSelect}
//           dateCellRender={(date) => {
//             const bookings = modalContent.filter((booking) =>
//               dayjs(booking.time_start).isSame(date, 'day')
//             );
//             return (
//               <div>
//                 {bookings.map((booking) => {
//                   const durationHours = dayjs(booking.time_end).diff(booking.time_start, 'hour');
//                   let color = roomColors[0]; // Default color for short duration
//                   if (durationHours >= 4 && durationHours < 8) {
//                     color = roomColors[3]; 
//                   } else if (durationHours >= 8) {
//                     color = roomColors[6]; 
//                   }
//                   return (
//                     <div
//                       key={booking.booking_id}
//                       style={{ cursor: 'pointer' }}
//                       onClick={() => handleRoomSelect(booking.room_id)}
//                     >
//                       <div
//                         style={{
//                           borderRadius: '3px',
//                           backgroundColor: color,
//                           color: 'white',
//                           padding: '0px 10px',
//                           marginBottom: '5px',
//                         }}
//                       >
//                         <p>{booking.room_name}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           }}
//         />
//       )}
//       <Modal
//         title={`Bookings for Room ${selectedRoom}`}
//         visible={visible}
//         onCancel={handleCloseModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={() => {
//               form.submit();
//             }}
//             disabled={loading}
//           >
//             Book
//           </Button>,
//         ]}
//       >
//         <Form form={form} name="booking_form" onFinish={handleBookingSubmit}>
//           <Form.Item
//             name="time_start"
//             label="Start Time"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please select a start time',
//               },
//             ]}
//           >
//             <DatePicker showTime format="YYYY-MM-DD HH:mm" />
//           </Form.Item>
//           <Form.Item
//             name="time_end"
//             label="End Time"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please select an end time',
//               },
//             ]}
//           >
//             <DatePicker showTime format="YYYY-MM-DD HH:mm" />
//           </Form.Item>
//           <Form.Item
//             name="employee_id"
//             label="Employee"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please select an employee',
//               },
//             ]}
//           >
//             <Select mode="multiple">
//               {/* Render employee options */}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default MeetingCalendar;