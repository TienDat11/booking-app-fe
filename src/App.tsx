import './App.css';
import FormLogin from './components/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/route/ProtectedRoute';
import PrivateRoute from './components/route/PrivateRoute';
// import MeetingCalendar from './components/Home'
import LayoutApp from './components/Layout/Layout';
import BookingCalendar from './components/Home';
// import BasicCalendar from './components/Calendar';
import Rooms from './components/room/Room';


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<FormLogin />} />
        <Route path='/' element={<LayoutApp />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<BookingCalendar />} />
              <Route path='/rooms' element={<Rooms />} />
            </Route>
          </Route>
      </Route>
    </Routes>
    </div >
  );
export default App;
