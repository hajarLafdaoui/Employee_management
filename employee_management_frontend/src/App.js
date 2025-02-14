import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/Employee/SignIn";
import Admin_dashboard from "./components/Admin/Admin_dashboard";
import Employee_dashboard from "./components/Employee/Employee_dashboard";
import CreateUser from "./components/CreateUser";
import EmployeeList from "./components/EmployeeList";
import AdminLeaveRequests from "./components/Leave/AdminLeaveRequests";
import AttendanceHeader from "./components/attendance/AttendanceHeader";
import SignOut from "./components/Employee/SignOut";
import Profile from "./components/Employee/Profile";
import EmployeeAttendance from "./components/attendance/EmployeeAttendance";
import './styles/main.scss';
import './App.css';
<<<<<<< HEAD
import AddDepartment from "./components/Department/AddDepartment";
import MainDepartments from "./components/Department/MainDepartments";
=======
import AttestationPage from "./components/Employee/AttestationPage";
import AdminHolidayManagement from "./components/Admin/AdminHolidayManagement";
import HolidayList from "./components/Employee/HolidayList";
import AttestationRequests from "./components/AttestatioRequest/AttestationRequests";
import SalaryCalculator from "./components/salary/SalaryCalculator";
import SalaryList from "./components/salary/SalaryList";
>>>>>>> 4d5f13e026287ea1c104041978eb07bdd4531a79

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (!user || user.role !== role || !token) {
    return <Navigate to="/SignIn" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
 <Router>
      <Routes>
     <Route path="/SignIn" element={<SignIn />} />


        <Route
          path="/"
          element={
            <ProtectedRoute role="admin">
              <Admin_dashboard user={JSON.parse(localStorage.getItem("user"))} />
            </ProtectedRoute>
          }
        >
          <Route path="CreateUser" element={<CreateUser />} />
          <Route path="EmployeeList" element={<EmployeeList />} />
          <Route path="AdminLeaveRequests" element={<AdminLeaveRequests />} />
         
          <Route path="Attendance" element={<AttendanceHeader />} />
          <Route path="HolidayCrud" element={<AdminHolidayManagement />} />
          <Route path="Attestation" element={<AttestationRequests />} />
          <Route path="payroll" element={<SalaryCalculator />} />
          <Route path="salarylist" element={<SalaryList />} />

          <Route path="SignOut" element={<SignOut />} />
          <Route path="Departments" element={<MainDepartments />} />
          <Route path="addDepartment" element={<AddDepartment />} />


        </Route>

        {/* Employee Routes */}
        <Route
          path="/Employee_dashboard"
          element={
            <ProtectedRoute role="employee">
              <Employee_dashboard user={JSON.parse(localStorage.getItem("user"))} />
            </ProtectedRoute>
          }
        >
  <Route index element={<Profile />} />
  <Route path="EmployeeAttendance" element={<EmployeeAttendance />} />
  
  <Route path="attestations" element={<AttestationPage />} />
  <Route path="HolidayList" element={<HolidayList />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
