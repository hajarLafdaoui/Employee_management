import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SignIn from './components/Employee/SignIn';
import './styles/main.scss';

// Components
import CreateUser from './components/CreateUser';
import EmployeeList from './components/EmployeeList';
import AdminLeaveRequests from './components/Leave/AdminLeaveRequests';
import AttendanceHeader from './components/Attendance/AttendanceHeader';
import Admin_dashboard from './components/Admin/Admin_dashboard';
import SignOut from './components/Employee/SignOut';
// Additional imports for other components
// import SalaryCalculator from './components/Salary/SalaryCalculator';
// import Payroll from './components/Payroll';
// import Departments from './components/Departments';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || user.role !== 'admin' || !token) {
    return <Navigate to="/SignIn" replace />;
  }
  return children;
};

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

  return (
    <Router>
      <Routes>
        <Route path="/SignIn" element={<SignIn onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Admin_dashboard user={JSON.parse(localStorage.getItem('user'))} />
            </ProtectedRoute>
          }
        >
          <Route path="CreateUser" element={<CreateUser />} />
          <Route path="EmployeeList" element={<EmployeeList />} />
          <Route path="AdminLeaveRequests" element={<AdminLeaveRequests />} />
          <Route path="Attendance" element={<AttendanceHeader />} />
          {/* Additional routes for other components */}
          {/* <Route path="SalaryCalculator" element={<SalaryCalculator />} /> */}
          {/* <Route path="Payroll" element={<Payroll />} /> */}
          {/* <Route path="Departments" element={<Departments />} /> */}
          <Route path="SignOut" element={<SignOut onLogout={handleLogout} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
