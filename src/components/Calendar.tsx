// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import MyModal from './MyModal';

// const localizer = momentLocalizer(moment);

// interface Event {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
//   index: number;
// }

// const events: Event[] = [
//   // Các sự kiện ở đây
// ];

// const DnDCalendar: React.FC = () => {
//   const [modalStatus, setModalStatus] = React.useState(false);
//   const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

//   const handleSelectEvent = (event: Event) => {
//     setSelectedEvent(event);
//     setModalStatus(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedEvent(null);
//     setModalStatus(false);
//   };

//   const handleSaveEvent = (event: Event) => {
//     // Lưu sự kiện
//     console.log('Lưu sự kiện:', event);
//     handleCloseModal();
//   };

//   const handleEditEvent = (event: Event) => {
//     // Xử lý chỉnh sửa sự kiện
//     console.log('Chỉnh sửa sự kiện:', event);
//   };

//   const handleDeleteEvent = () => {
//     // Xử lý xóa sự kiện
//     console.log('Xóa sự kiện:', selectedEvent);
//     handleCloseModal();
//   };

//   const handleDragEnd = (result: any) => {
//     // Xử lý khi kéo và thả sự kiện
//     if (!result.destination) return;

//     const { source, destination } = result;
//     const updatedEvents = [...events];
//     const movedEvent = updatedEvents.splice(source.index, 1)[0];
//     updatedEvents.splice(destination.index, 0, movedEvent);

//     // Cập nhật sự kiện sau khi kéo và thả
//     console.log('Cập nhật sự kiện:', updatedEvents);
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Droppable droppableId='calendar'>
//         {(provided) => (
//           <div ref={provided.innerRef} {...provided.droppableProps}>
//             <Calendar
//               localizer={localizer}
//               defaultDate={moment().toDate()}
//               defaultView="week"
//               events={events}
//               selectable
//               onSelectEvent={handleSelectEvent}
//               components={{
//                 eventWrapper: DraggableEventWrapper,
//               }}
//             />
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//       {selectedEvent && (
//         <MyModal
//           modalStatus={modalStatus}
//           handleClose={handleCloseModal}
//           handleSave={handleSaveEvent}
//           startDate={moment(selectedEvent.start)}
//           endDate={moment(selectedEvent.end)}
//           eventInput={selectedEvent.title}
//           handleEditEvent={handleEditEvent}
//           handleEdited={handleSaveEvent}
//           editStatus={true}
//           handleDelete={handleDeleteEvent}
//           allEmployees={[]}
//           allRooms={[]}
//         />
//       )}
//     </DragDropContext>
//   );
// };

// export default DnDCalendar;