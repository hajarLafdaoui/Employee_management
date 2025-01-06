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


import UpdateUser from './components/UpdateUser';
import CreateUser from './components/CreateUser';
import DetailUser from './components/DetailUser';

// Admin Dashboard
import AdminMenu from './components/Admin_navbar/AdminMenu';

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

  return (    <>
     <Router>
    <Routes>

      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/crud" element={<Crud />} />

      {/* attendance  */}
      <Route path="/update-attendance/:entryId" element={<UpdateAttendance />} />
      <Route path="/delete-attendance/:entryId" element={<DeleteAttendance />} />
      <Route path="/AttendanceHeader" element={<AttendanceHeader />} />

      {/* Admin Dashboard */}
      <Route path="/AdminMenu" element={<AdminMenu />} />
    


      <Route path="/update-user/:userId" element={<UpdateUser />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route   path="/user-details/:userId" element={<DetailUser />} />


    </Routes>
  </Router>
  {/* <Employees/> */}
  {/* <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
         <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/update-user/:userId"
          element={
            isAuthenticated ? <UpdateUser /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create-user/"
          element={
            isAuthenticated ? <CreateUser /> : <Navigate to="/login" replace />
          }
        />
<Route
  path="/user-details/:userId"
  element={isAuthenticated ? <DetailUser /> : <Navigate to="/login" replace />}
/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router> */}
    </>
   

  );
}

export default App;
