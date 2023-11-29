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
  
}