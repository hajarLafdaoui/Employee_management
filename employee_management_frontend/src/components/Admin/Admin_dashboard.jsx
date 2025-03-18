import React, { useEffect, useState, useMemo } from "react";
import {
  FaSignOutAlt, FaSearch, FaSun, FaMoon, FaBell, FaBars, FaChevronLeft,
  FaChevronDown, FaChevronUp, FaTachometerAlt, FaUserPlus, FaUsers,
  FaCalendarCheck, FaMoneyBillWave, FaBuilding, FaCalendarAlt,
  FaGift,
  FaClipboardList,
  FaHistory
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Confirmation from "../Confirmation";

const AdminDashboard = ({ adminUser }) => {
  const [dropdowns, setDropdowns] = useState({ employees: true, payroll: false });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const navigate = useNavigate();
  
  // Ensure first dropdown stays open if none are open
  useEffect(() => {
    if (!Object.values(dropdowns).some(v => v)) {
      setDropdowns(prev => ({ ...prev, employees: true }));
    }
  }, [dropdowns]);

  // Initialize admin user
  adminUser = JSON.parse(localStorage.getItem("adminUser"));
  if (!adminUser) {
    navigate("/SignIn");
  }

  // Dark mode handling
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("employeeUser");
    localStorage.removeItem("adminUser");
    navigate("/SignIn");
  };

  const handleConfirmLogout = () => {
    handleLogout(); 
    setShowConfirmPopUp(false); 
  };

  // Dropdown toggle logic
  const toggleDropdown = (key) => {
    setDropdowns((prev) => {
      const newDropdowns = {};
      Object.keys(prev).forEach((dropdownKey) => {
        newDropdowns[dropdownKey] = dropdownKey === key ? !prev[dropdownKey] : false;
      });
      return newDropdowns;
    });
  };

  // Other state handlers
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning," : hour < 16 ? "Good Afternoon," : "Good Evening,";
  }, []);

  // Menu configuration
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
        { label: "Employee Holiday", icon: <FaCalendarAlt />, link: "/HolidayCrud" },
        { label: "Attestation Requests", icon: <FaClipboardList />, link: "/Attestation" },
        { label: "Attestation history", icon: <FaHistory />, link: "/historyattest" },
      ],
    },
    { label: "Departments", icon: <FaBuilding />, link: "/Departments" },
    { label: "Attendance", icon: <FaCalendarAlt />, link: "/Attendance" },
    {
      label: "Payroll",
      icon: <FaMoneyBillWave />,
      key: "payroll",
      subItems: [
        { label: "View Payroll", icon: <FaMoneyBillWave />, link: "/salarylist" },
        { label: "Generate Payroll", icon: <FaMoneyBillWave />, link: "/payroll" },
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
              <img src="/logo/logo.png" alt="Logo" className="logo" />
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
            
            <li className="NavbarItem logout" onClick={() => setShowConfirmPopUp(true)}>
              <FaSignOutAlt className="logout-icon" />
              <span className="navLink">Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="secondPart">
        <div className="head">
          <div className="greeting-container">
            <p className="greeting">{greeting}</p>
            <p className="admin-name">{adminUser?.name || "Guest"}</p>
          </div>

          <div className="right">
            <div className="icon-container dark-mode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun className="dark-icon" /> : <FaMoon className="dark-icon" />}
            </div>
            <div className="admin-image-container">
              <img className="admin-image" src="/admin/admin.png" alt="Admin" />
            </div>
          </div>
        </div>

        <Confirmation
          showConfirmPopUp={showConfirmPopUp}
          setShowConfirmPopUp={setShowConfirmPopUp}
          handleConfirm={handleConfirmLogout}
          itemType="Logout"
        />

        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;