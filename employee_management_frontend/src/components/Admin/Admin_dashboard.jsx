import React, { useEffect, useState, useMemo } from "react";
import { 
  FaSignOutAlt, FaSearch, FaSun, FaMoon, FaBell, FaBars, FaChevronLeft, 
  FaChevronDown, FaChevronUp, FaTachometerAlt, FaUserPlus, FaUsers, 
  FaCalendarCheck, FaMoneyBillWave, FaBuilding, FaCalendarAlt 
} from "react-icons/fa";

import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = ({ adminUser }) => {
  const [dropdowns, setDropdowns] = useState({ employees: false, payroll: false });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate()
  adminUser = JSON.parse(localStorage.getItem("adminUser"));
  if (!adminUser) {
    navigate("/SignIn")
  }
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning," : hour < 16 ? "Good Afternoon," : "Good Evening,";
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, link: "/" },
    {
      label: "Employees",
      icon: <FaUsers />,
      key: "employees",
      subItems: [
        { label: "Add Employee", icon: <FaUserPlus />, link: "/CreateUser" },
        { label: "Employee List", icon: <FaUsers />, link: "/EmployeeList" },
        { label: "Employee Leave", icon: <FaCalendarCheck />, link: "/AdminLeaveRequests" },
        { label: "Employee Payroll", icon: <FaMoneyBillWave />, link: "/Payroll" },
        { label: "Salary List", icon: <FaMoneyBillWave />, link: "/salarylist" },
        { label: "Employee Holiday", icon: <FaUsers />, link: "/HolidayCrud" },
        { label: "Attestation Requests", icon: <FaUsers />, link: "/Attestation" },
        { label: "Attestation history", icon: <FaUsers />, link: "/historyattest" },

      ],
    },
    { label: "Departments", icon: <FaBuilding />, link: "/Departments" },
    { label: "Attendance", icon: <FaCalendarAlt />, link: "/Attendance" },
    {
      label: "Payroll",
      icon: <FaMoneyBillWave />,
      key: "payroll",
      subItems: [
        { label: "View Payroll", icon: <FaMoneyBillWave />, link: "/payroll/view" },
        { label: "Generate Payroll", icon: <FaMoneyBillWave />, link: "/payroll/generate" },
      ],
    },
  ];

  return (
    <div className={`Container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar */}
      <div className="AdminMenu">
        <div className="hamburger" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaChevronLeft className="close" /> : <FaBars />}
        </div>

        <nav className="Navbar">
          <div className="logoContainer">
            <Link className="navLink" to="/">
              {/* <img src="/logo/logo.png" alt="Logo" /> */}
            </Link>
          </div>
          <ul className="NavbarMenu">
            {menuItems.map(({ label, icon, link, key, subItems }) =>
              subItems ? (
                <li key={key} className={`dropdown-item dropdown-${key} ${dropdowns[key] ? "expanded" : ""}`}>
                  <div className="dropdown-title" onClick={() => toggleDropdown(key)}>
                    {icon}
                    <span>{label}</span>
                    {dropdowns[key] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <ul className="dropdownMenu">
                    {subItems.map(({ icon, label, link }) => (
                      <li key={label} className="dropdownMenuItem dropdownMenuItemWhite">
                        {icon}
                        <Link className="dropdownLink dropdownMenuItemWhite" to={link}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={label} className="NavbarItem">
                  {icon}
                  <Link className="navLink" to={link}>{label}</Link>
                </li>
              )
            )}
            <li className="NavbarItem logout">
              <FaSignOutAlt className="logout-icon" />
              <Link className="navLink" to="/SignOut">Logout</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
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

        {/* Greeting */}
        <div className="greeting-container">
  <p className="greeting">{greeting}</p>
  <p className="admin-name">{adminUser ? adminUser.name : "Guest"}</p>
  </div>


        {/* Render page content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
