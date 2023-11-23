import { Outlet } from "react-router-dom"
import UnauthorizedPage from './UnauthorizedPage';
import getCookie from './Cookie'


const UserRoute = () => {
  const roles = getCookie('roles');
  const targetRole = 'user';
  const exists: boolean = roles.includes(targetRole); 
  return (
    (exists === true) ? <Outlet/> : <UnauthorizedPage/>
  )
}

export default UserRoute;