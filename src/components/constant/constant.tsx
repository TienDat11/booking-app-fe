import { Dayjs } from "dayjs";
import getCookie from "../route/Cookie";
import { useState } from "react";

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
  room_name: string;
  title: string;
  user_name: string[];
  time_start: string;
  time_end: string;
  status: boolean;
  is_deleted: boolean;

  
}
 export const token = getCookie("token");