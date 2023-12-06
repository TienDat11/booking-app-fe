import moment from "moment";
import getCookie from "../route/Cookie";
import { Tag } from "antd";
import { Dayjs } from "dayjs";

export const TYPE_USER = { ADMIN : 'admin', USER : 'user'}
export interface DataType {
    user_id: number;
    role_id: number[];
    user_name: string;
    role_name: string[];
    phone_number: string;
    email: string;
    is_deleted: boolean;
  }

export interface BookingData {
  booking_id: number;
  creator_name: string;
  room_name: string;
  title: string;
  user_name: string[];
  user_ids: number[];
  time_start: string;
  time_end: string;
  is_eccept: boolean;
  is_deleted: boolean;
  
}


export const statuTag = (item: BookingData) => {
  if (item.is_deleted) {
    return (
      <Tag className="status-tag" color="#ff0000">
        Rejected
      </Tag>
    );
  } else if (item.is_eccept) {
    return (
      <Tag className="status-tag" color="#009900">
        Successed
      </Tag>
    );
  } else {
    return (
      <Tag className="status-tag" color="#ff9933">
        Pending
      </Tag>
    );
  }
};





 export const token = getCookie("token");
