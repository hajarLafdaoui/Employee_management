import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from "./components/Employee/SignIn";
import Admin_dashboard from "./components/Admin/Admin_dashboard";
import Employee_dashboard from "./components/Employee/Employee_dashboard";
import CreateUser from "./components/CreateUser";
import EmployeeList from "./components/EmployeeList";
import UpdateUser from "./components/UpdateUser";

import AdminLeaveRequests from "./components/Leave/AdminLeaveRequests";
import AttendanceHeader from "./components/attendance/AttendanceHeader";
import EmployeeAttendance from "./components/attendance/EmployeeAttendance";

import LeaveRequestForm from "./components/Leave/LeaveRequestForm";


import SignOut from "./components/Employee/SignOut";
import Profile from "./components/Employee/Profile";
import './styles/main.scss';
import './App.css';
// import AddDepartment from "./components/Department/AddDepartment";
import MainDepartments from "./components/Department/MainDepartments";
import AttestationPage from "./components/Employee/AttestationPage";
import AdminHolidayManagement from "./components/Admin/AdminHolidayManagement";
import HolidayList from "./components/Employee/HolidayList";
import AttestationRequests from "./components/AttestatioRequest/AttestationRequests";
import SalaryCalculator from "./components/salary/SalaryCalculator";
import SalaryList from "./components/salary/SalaryList";
import HistoryPage from "./components/AttestatioRequest/HistoryPage";
import ChangePassword from "./components/Employee/ChangePassword";
import DeleteAttendance from "./components/attendance/DeleteAttendance";
import UpdateAttendance from "./components/attendance/UpdateAttendance";
import PrintAttestation from "./components/AttestatioRequest/PrintAttestation";
import PrintSalary from "./components/salary/PrintSalary";

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
  const user = JSON.parse(localStorage.getItem("user"));

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
              <Admin_dashboard
                user={JSON.parse(localStorage.getItem("user"))}
              />
            </ProtectedRoute>
          }
        >
          <Route path="CreateUser" element={<CreateUser />} />
          <Route path="update-user/:id" element={<UpdateUser />} />
          <Route path="EmployeeList" element={<EmployeeList />} />

          <Route path="AdminLeaveRequests" element={<AdminLeaveRequests />} />

          <Route path="Attendance" element={<AttendanceHeader />} />
          <Route path="DeleteAttendance/:id" element={<DeleteAttendance />} />
          <Route path="UpdateAttendance/:id" element={<UpdateAttendance />} />
          <Route path="AttendanceHeader" element={<AttendanceHeader />} />
          <Route path="HolidayCrud" element={<AdminHolidayManagement />} />
          <Route path="Attestation" element={<AttestationRequests />} />
          <Route path="print-attestation" element={<PrintAttestation />} />

          <Route path="/historyattest" element={<HistoryPage />} />
          <Route path="payroll" element={<SalaryCalculator />} />
          <Route path="salarylist" element={<SalaryList />} />
          <Route path="salary/:id" element={<PrintSalary />} />

          <Route path="SignOut" element={<SignOut user={user} />} />
          <Route path="Departments" element={<MainDepartments />} />
          {/* <Route path="addDepartment" element={<AddDepartment />} /> */}
        </Route>

        {/* Employee Routes */}
        <Route
          path="/Employee_dashboard"
          element={
            <ProtectedRoute role="employee">
              <Employee_dashboard
                user={JSON.parse(localStorage.getItem("user"))}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="EmployeeAttendance" element={<EmployeeAttendance userId={user?.id}/>} />
          <Route path="SignOut" element={<SignOut user={user} />} />
          <Route path="leave" element={<LeaveRequestForm />} />
          <Route path="ChangePassword" element={<ChangePassword />} />
          <Route path="attestations" element={<AttestationPage />} />
          <Route path="HolidayList" element={<HolidayList />} />
        </Route>
      </Routes>
    </Router>
  );

}

export default App;
