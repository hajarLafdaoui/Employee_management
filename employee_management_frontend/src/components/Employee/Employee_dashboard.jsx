import React, { useEffect, useState } from "react";
import { FaSignOutAlt, FaSearch, FaSun, FaMoon, FaBell, FaBars, FaChevronLeft, FaChevronDown, FaChevronUp, FaTachometerAlt, FaUserPlus, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";


const Employee_dashboard = ({ user }) => {
  const [dropdowns, setDropdowns] = useState({ employees: true });
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const container = document.querySelector(".Container");
    container.classList.toggle("sidebar-open");
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderDropdown = (title, icon, key, items) => (
    <li className={`dropdown-item dropdown-${key} ${dropdowns[key] ? "expanded" : ""}`}>
      <div className="dropdown-title" onClick={() => toggleDropdown(key)}>
        {icon}
        <span>{title}</span>
        {dropdowns[key] ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      <ul className="dropdownMenu">
        {items.map(({ icon, label, link }) => (
          <li key={label} className="dropdownMenuItem">
            {icon}
            <Link className="dropdownLink" to={link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );

  return (
    <div className="Container">
      <div className="AdminMenu">
        <div className="hamburger" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaChevronLeft className="close" /> : <FaBars />}
        </div>

        <nav className="Navbar">
          <div className="logoContainer">
            <Link className="navLink" to="/Employee_dashboard">
              <img src="/logo/logo.png" alt="Logo" />
            </Link>
          </div>
          <ul className="NavbarMenu">
            <li className="NavbarItem">
              <FaTachometerAlt className="darkIcon" />
              <Link className="navLink" to="/Employee_dashboard">Dashboard</Link>
            </li>
            {renderDropdown("Employees", <FaUsers />, "employees", [
              { icon: <FaUserPlus />, label: "Add Employee", link: "/CreateUser" },
              { icon: <FaUsers />, label: "Employee List", link: "/EmployeeList" },
              { icon: <FaCalendarCheck />, label: "Employee Leave", link: "/AdminLeaveRequests" },
              { icon: <FaMoneyBillWave />, label: "Employee Payroll", link: "/Payroll" },
            ])}
            <li className="NavbarItem">
              <FaBuilding />
              <Link className="navLink" to="/Departments">Departments</Link>
            </li>
            <li className="NavbarItem">
              <FaCalendarAlt />
              <Link className="navLink" to="EmployeeAttendance">Attendance</Link>
            </li>
            {renderDropdown("Payroll", <FaMoneyBillWave />, "payroll", [
              { icon: <FaMoneyBillWave />, label: "View Payroll", link: "/payroll/view" },
              { icon: <FaMoneyBillWave />, label: "Generate Payroll", link: "/payroll/generate" },
            ])}
          </ul>
          <li className="NavbarItem logout">
            <FaSignOutAlt className="logout-icon" />
            <Link className="navLink" to="/SignOut">Logout</Link>
          </li>
        </nav>
      </div>

      <div className="secondPart">
        <div className="head">
          <div className="input-container input-container-desktop">
            <FaSearch className="searchIcon" />
            <input className="input" type="text" placeholder="Search" />
          </div>

          <div className="right">
            <div className="icon-container dark-mode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun className="dark-icon" /> : <FaMoon className="dark-icon" />}
            </div>
            <div className="icon-container">
              <FaBell className="notification-icon" aria-label="Notification" />
            </div>
            <div className="admin-image-container">
              <img className="admin-image" src="/admin/admin.png" alt="Admin" />
            </div>
          </div>
        </div>

        <div className="greeting-container">
          <p className="greeting">
            {date.getHours() < 12 ? "Good Morning," : date.getHours() < 16 ? "Good Afternoon," : "Good Evening,"}
          </p>
          <p className="admin-name">{user.name}  sss</p>
        </div>

        {/* Render the corresponding component based on the current route */}
        <Outlet />

      </div>
    </div>
  );
};

export default Employee_dashboard;
