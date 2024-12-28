import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/Authentication/SignIn';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/attendance/Markattendance';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/MarkAttendance" element={<MarkAttendance />} />
    </Routes>
  </Router>


  );
}

export default App;