import React, { useEffect, useState } from "react";
import {
  FaSignOutAlt, FaSearch, FaSun, FaMoon, FaBell, FaBars, FaChevronLeft,
  FaChevronDown, FaChevronUp, FaTachometerAlt, 
  FaMoneyBillWave, FaBuilding, FaCalendarAlt
} from "react-icons/fa";
import { MdLibraryAddCheck } from "react-icons/md";
import { FaRectangleList } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { PiCertificateFill } from "react-icons/pi";
import { FaAddressBook } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next'; // Import the translation hook

const Employee_dashboard = ({ employeeUser }) => {
  const { t } = useTranslation(); // Get the translation function
  const [dropdowns, setDropdowns] = useState({ profile: false, payroll: false });
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  employeeUser = JSON.parse(localStorage.getItem("employeeUser"));
  if (!employeeUser) {
    navigate("/SignIn");
  }

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
    setDropdowns((prev) => {
      const newDropdowns = {};
      Object.keys(prev).forEach((dropdownKey) => {
        newDropdowns[dropdownKey] = dropdownKey === key ? !prev[dropdownKey] : false;
      });
      return newDropdowns;
    });
  };

  useEffect(() => {
    const allClosed = Object.values(dropdowns).every((isOpen) => !isOpen);
    if (allClosed) {
      setDropdowns((prev) => ({ ...prev, profile: true }));
    }
  }, [dropdowns]);

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
            <img src="/logo/logo.png" alt="Logo" className="logo"/>
            </Link>
          </div>
          <ul className="NavbarMenu">
            <li className="NavbarItem">
              <FaTachometerAlt className="darkIcon" />
              <Link className="navLink" to="/Employee_dashboard">{t('dashboard')}</Link> {/* Translated */}
            </li>
            {renderDropdown(t('Profile'), <FaAddressBook />, "profile", [
              { icon: <PiCertificateFill />, label: t('Attestation'), link: "attestations" },
              { icon: <MdLibraryAddCheck />, label: t('Leave_request'), link: "leave" },
              { icon: <RiLockPasswordFill />, label: t('Change_password'), link: "ChangePassword" },
              { icon: <FaRectangleList />, label: t('Holidays_of_year'), link: "HolidayList" },
            ])}
            <li className="NavbarItem">
              <FaBuilding />
              <Link className="navLink" to="/Departments">{t('departments')}</Link>
            </li>
            <li className="NavbarItem">
              <FaCalendarAlt />
              <Link className="navLink" to="EmployeeAttendance">{t('attendance')}</Link>
            </li>
            {renderDropdown(t('payroll'), <FaMoneyBillWave />, "payroll", [
              { icon: <FaMoneyBillWave />, label: t('view_payroll'), link: "view" },
            ])}
            <li className="NavbarItem logout">
              <FaSignOutAlt className="logout-icon" />
              <Link className="navLink" to="/SignOut">{t('logout')}</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="secondPart">
        <div className="head">
          <div className="input-container input-container-desktop">
            <FaSearch className="searchIcon" />
            <input className="input" type="text" placeholder={t('search')} />
          </div>

          <div className="right">
            <div className="icon-container dark-mode-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun className="dark-icon" /> : <FaMoon className="dark-icon" />}
            </div>
            <div className="icon-container">
              <FaBell className="notification-icon" aria-label={t('notification')} />
            </div>
            <div className="admin-image-container">
              <img className="admin-image" src="/admin/admin.png" alt="Admin" />
            </div>
          </div>
        </div>

        <div className="greeting-container">
          <p className="greeting">
            {date.getHours() < 12 ? t('good_morning') : date.getHours() < 16 ? t('good_afternoon') : t('good_evening')}
          </p>
          <p className="admin-name">{employeeUser ? employeeUser.name : t('loading')}</p> {/* Add check for employeeUser*/}
        </div>
        <div className="icon-container">
          <LanguageSwitcher /> {/* Add the LanguageSwitcher component here */}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Employee_dashboard;