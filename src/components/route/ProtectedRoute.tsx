import { Outlet } from 'react-router-dom'
import FormLogin from '../Form';
import getCookie from './Cookie';


const ProtectedRoute = () => {
  const token = getCookie('token');
  return (
    (token !== null) ? <Outlet/> : <FormLogin/>
  )
}

export default ProtectedRoute