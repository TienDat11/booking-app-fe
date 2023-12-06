import './App.css';
import FormLogin from './components/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/ProtectedRoute';
import PrivateRoute from './components/route/PrivateRoute';
import LayoutApp from './components/Layout/Layout';
import BookingCalendar from './components/Home';
import Rooms from './components/room/Room';
import UsersManager from './components/UserManager/UserManager';
import Dashboard from './components/dashboard/dashboard';
import RoomDetails from './components/room/RoomDetails';
import InfoUser from './components/InfoAccount/InfoUser';
import ListBookingOfUser from './components/Booking/ListBookingOfUser';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<FormLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<LayoutApp />}>
            <Route path='/bookingmanagement' element={<BookingCalendar />} />
            <Route path='/informationaccount' element = {<InfoUser/>}/>
            <Route path='/bookingroom' element={<ListBookingOfUser/>}/>

            <Route element={<PrivateRoute />}>
              <Route path='/roomManager' element={<Rooms />} />
              <Route path='/roomManager/:id' element={<RoomDetails />} />
              <Route path='/usermanager' element={<UsersManager />} />
              <Route path='/' element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
