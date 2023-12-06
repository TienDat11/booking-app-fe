import { AxiosResponse } from 'axios';

type axiosApi = {
  status: number;
  message: string;
  users: any[];
  rooms: any[];
  bookings: any[];
};

export const handleSuccess = (response: AxiosResponse<axiosApi>) => {
  const { data } = response;
  const status = data.status;
  const message = data.message;
  


  return { status, message };
};

export const handleError = (error : any) => {
  const { response } = error;

  if(response && response.data){
    const { data } = response;
    if(Array.isArray(data)){
      if(data.length > 0){
        const {status , message, errors} = data[0];
        return {status , message, errors};
      }
    }else if (typeof data === "object" && data !== null){
      const {status, message, errors} = data;
      return {status, message, errors};
    }
  }else return {status: '',message: ''};
}