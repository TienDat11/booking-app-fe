import { Outlet } from "react-router-dom"
import UnauthorizedPage from './UnauthorizedPage';
import getCookie from './Cookie'


const PrivateRoute = () => {
  const roles = getCookie('roles');
  const targetRole = 'admin';
  const exists: boolean = roles.includes(targetRole); 
  return (
    (exists === true) ? <Outlet/> : <UnauthorizedPage/>
  )
}

export default PrivateRoute