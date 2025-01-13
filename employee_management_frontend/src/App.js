import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignIn from './components/Employee/SignIn';
// import Logout from './components/Employee/Logout';
// import Profile from './components/Profile';
// import Crud from './components/Crud';
import './styles/main.scss'; 


// Attendance
// import Marking from './components/attendance/Marking';
// import Attendance from './components/attendance/Attendance';
// import UpdateAttendance from './components/attendance/UpdateAttendance';
// import DeleteAttendance from './components/attendance/DeleteAttendance';
import AttendanceHeader from './components/Attendance/AttendanceHeader';

// import PrintAttestation from './components/AttestatioRequest/PrintAttestation';

import UpdateUser from './components/UpdateUser';
import CreateUser from './components/CreateUser';
import DetailUser from './components/DetailUser';
// import AdminLeaveRequests from './components/leave-request/AdminLeaveRequests';
// import LeaveRequestForm from './components/leave-request/LeaveRequestForm';
import AttestationRequests from './components/AttestatioRequest/AttestationRequests';

// Admin Dashboard
import AdminMenu from './components/Admin_navbar/AdminMenu';
import Admin_dashboard from './components/Admin/Admin_dashboard';
// import Admin_dashboard from './Admin/Admin_dashboard';
import SalaryCalculator from './components/salary/SalaryCalculator';
import SalaryList from './components/salary/SalaryList';
import AttestationPage from './components/AttestationPage';
import EmployeeList from './components/EmployeeList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    sessionStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (<>
    <Router>
      <Routes>
      <Route path="/SignIn" element={<SignIn />} />

        <Route path="/" element={<AdminMenu user={{ name: "Admin User" }} />}>
          {/* <Route path="/" element={<AdminMenu />} /> */}
          <Route path="create-user" element={<CreateUser />} />
          <Route path="EmployeeList" element={<EmployeeList />} />
          <Route path="Attendance" element={<AttendanceHeader />} />
          {/* <Route path="logout" element={<Logout />} /> */}
          {/* <Route path="/login" element={<SignIn />} /> */}

        </Route>
      </Routes>
    </Router>



  </>
 );
}

export default App;