import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignIn from './components/Authentication/SignIn';
import Profile from './components/Profile';
import Crud from './components/Crud';
import './styles/main.scss'; // Import your main SASS file


// Attendance
import Marking from './components/attendance/Marking';
import Attendance from './components/attendance/Attendance';
import UpdateAttendance from './components/attendance/UpdateAttendance';
import DeleteAttendance from './components/attendance/DeleteAttendance';
import AttendanceHeader from './components/attendance/AttendanceHeader';

import PrintAttestation from './components/PrintAttestation';

import UpdateUser from './components/UpdateUser';
import CreateUser from './components/CreateUser';
import DetailUser from './components/DetailUser';
import AdminLeaveRequests from './components/leave-request/AdminLeaveRequests';
import LeaveRequestForm from './components/leave-request/LeaveRequestForm';

// Admin Dashboard
import AdminMenu from './components/Admin_navbar/AdminMenu';
import Admin_dashboard from './components/Admin/Admin_dashboard';

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

        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/crud" element={<Crud />} />

        <Route path="/Marking" element={<Marking />} />

        <Route path="/leaverequest" element={<LeaveRequestForm />} />
        <Route path="/leaverequests" element={<AdminLeaveRequests />} />

        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/update-attendance/:entryId" element={<UpdateAttendance />} />
        <Route path="/delete-attendance/:entryId" element={<DeleteAttendance />} />
        <Route path="/AttendanceHeader" element={<AttendanceHeader />} />

        {/* Admin Dashboard */}
        <Route path="/AdminMenu" element={<AdminMenu />} />
        <Route path="/Admin_dashboard" element={<Admin_dashboard />} />



        <Route path="/update-user/:userId" element={<UpdateUser />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/user-details/:userId" element={<DetailUser />} />

        <Route path="/print-attestation" element={<PrintAttestation />} />


      </Routes>
      {/* <AdminMenu user={user} /> */}

    </Router>
    
    {/* <Employees/> */}
    {/* <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard"  />
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
         <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login"  />
            )
          }
        />
        <Route
          path="/update-user/:userId"
          element={
            isAuthenticated ? <UpdateUser /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/create-user/"
          element={
            isAuthenticated ? <CreateUser /> : <Navigate to="/login"  />
          }
        />
<Route
  path="/user-details/:userId"
  element={isAuthenticated ? <DetailUser /> : <Navigate to="/login"  />}
/>
        <Route path="*" element={<Navigate to="/login"  />} />
      </Routes>
    </Router> */}
  </>


  );
}

export default App;
