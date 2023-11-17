import Cookies from 'js-cookie';

const getCookie = (str: string) => {
  switch (str) {
    case 'roles':
      return JSON.parse(Cookies.get('roles') || '[]');
    case 'token':
      return Cookies.get('token');
    default:
      console.log("Not Found");
      break;
  }
};

export default getCookie;
