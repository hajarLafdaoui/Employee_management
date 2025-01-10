import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBuilding,
  FaCalendarAlt,
  FaChartPie,
  FaFileInvoiceDollar,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from "react-icons/fa";

const AdminMenu = ({ user }) => {
  const [navVisible, setNavVisible] = useState(true);
  const [dropdowns, setDropdowns] = useState({});
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleNav = () => setNavVisible((prev) => !prev);

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
        <div className="hamburger" onClick={toggleNav}>
          <FaBars />
        </div>
        {navVisible && (
          <nav className="Navbar">
            <div className="logoContainer">
              <Link className="navLink" to="/dashboard">
                <img src="/logo/logo.png" alt="Logo" />
              </Link>
            </div>
            <ul className="NavbarMenu">
              <li className="NavbarItem">
                <FaTachometerAlt />
                <Link className="navLink" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              {renderDropdown("Employees", <FaUsers />, "employees", [
                { icon: <FaUserPlus />, label: "Add Employee", link: "/create-user" },
                { icon: <FaUsers />, label: "Employee List", link: "/crud" },
                { icon: <FaCalendarCheck />, label: "Employee Leave", link: "/leave" },
                { icon: <FaMoneyBillWave />, label: "Employee Payroll", link: "/payroll" },
              ])}
              <li className="NavbarItem">
                <FaBuilding />
                <Link className="navLink" to="/departments">
                  Departments
                </Link>
              </li>
              <li className="NavbarItem">
                <FaCalendarAlt />
                <Link className="navLink" to="/AttendanceHeader">
                  Attendance
                </Link>
              </li>
              {renderDropdown("Payroll", <FaMoneyBillWave />, "payroll", [
                { icon: <FaFileInvoiceDollar />, label: "View Payroll", link: "/payroll/view" },
                { icon: <FaMoneyBillWave />, label: "Generate Payroll", link: "/payroll/generate" },
              ])}
              <li className="NavbarItem">
                <FaChartPie />
                <Link className="navLink" to="/reports">
                  Reports
                </Link>
              </li>
            </ul>
            <div className="admin-email">
              <img className="admin-img" src="/admin/admin.png" alt="Admin" />
              <div className="admin-details">
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </nav>
        )}
      </div>
      <div className="secondPart">
        <div className="head">
          <div className="input-container">
            <img className="searchIcon" src="/icons/search.png" alt="search" />
            <input className="input" type="text" placeholder="Search" />
          </div>
          <div className="right">
            <div className="dark-mode-toggle" onClick={toggleDarkMode}>
              <img
                className="icon"
                src={`/icons/${isDarkMode ? "sun" : "moon"}.png`}
                alt={isDarkMode ? "Light Mode" : "Dark Mode"}
              />
            </div>
            <div className="admin-email">
              <img className="admin-img" src="/admin/admin.png" alt="Admin" />
              <div className="admin-details">
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="greeting-container">
          <p className="greeting">
            {date.getHours() < 12
              ? "Good Morning,"
              : date.getHours() < 16
              ? "Good Afternoon,"
              : "Good Evening,"}
          </p>
          <p className="admin-name">{user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
