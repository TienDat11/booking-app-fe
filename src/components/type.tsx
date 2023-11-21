import { Dayjs } from "dayjs";

interface BookingData {
  booking_id: number | undefined;
  time_start: Dayjs | null;
  time_end: Dayjs | null;
  employee_id: number[];
  room_id: number | undefined;
  room_name: string | undefined;
  employee_name: string[]

}

export default BookingData;