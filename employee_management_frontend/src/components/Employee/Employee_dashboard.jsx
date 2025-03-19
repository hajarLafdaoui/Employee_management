import React, { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
  FaBars,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
  FaTachometerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaLock,
  FaUserCircle,
  FaThList,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import "./Employee_dashboard.scss";
import Confirmation from "../Confirmation";

const Employee_dashboard = ({ employeeUser }) => {
  const { t } = useTranslation();
  const [dropdowns, setDropdowns] = useState({ profile: false, payroll: false });
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const { i18n } = useTranslation();
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
    const currentLang = i18n.language;
    if (currentLang === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }, [i18n.language]);

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
    <li
      className={`dropdown-item dropdown-${key} ${dropdowns[key] ? "expanded" : ""}`}
    >
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
              <img src="/logo/logo.png" alt="Logo" className="logo" />
            </Link>
          </div>
          <ul className="NavbarMenu">
            <li className="NavbarItem">
              <FaTachometerAlt className="darkIcon" />
              <Link className="navLink" to="/Employee_dashboard">
                {t("dashboard")}
              </Link>
            </li>
            {renderDropdown(t("Profile"), <FaUserCircle />, "profile", [
              {
                icon: <FaCalendarAlt />,
                label: t("My attendance"),
                link: "EmployeeAttendance",
              },
              {
                icon: <FaFileAlt />,
                label: t("Attestation"),
                link: "attestations",
              },
              {
                icon: <FaCalendarCheck />,
                label: t("Leave_request"),
                link: "leave",
              },
              {
                icon: <FaLock />,
                label: t("Change_password"),
                link: "ChangePassword",
              },
              {
                icon: <FaThList />,
                label: t("Holidays_of_year"),
                link: "HolidayList",
              },
            ])}
            {renderDropdown(t('payroll'), <FaMoneyBillWave />, "payroll", [
              { icon: <FaMoneyBillWave />, label: t('view_payroll'), link: "view" },
            ])}
            <li className="NavbarItem logout" onClick={() => setShowConfirmPopUp(true)}>
              <FaSignOutAlt className="logout-icon" />
              <span className="navLink">{t('logout')}</span>
            </li>
            <Confirmation
              showConfirmPopUp={showConfirmPopUp}
              setShowConfirmPopUp={setShowConfirmPopUp}
              handleConfirm={handleConfirmLogout}
              itemType="Logout"
            />
          </ul>
        </nav>
      </div>

      <div className="secondPart">
        <div className="head">
          <div className="greeting-container">
            <p className="greeting">
              {date.getHours() < 12
                ? t("good_morning")
                : date.getHours() < 16
                  ? t("good_afternoon")
                  : t("good_evening")}
            </p>
            <p className="admin-name">{employeeUser ? employeeUser.name : t('loading')}</p>
          </div>

          <div className="right ">
            <div
              className="icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <FaSun className="dark-icon" />
              ) : (
                <FaMoon className="dark-icon" />
              )}
            </div>

            <div className="language-container">
              <LanguageSwitcher />
            </div>
            {/* <div className="admin-image-container">
              <img className="admin-image" src="/admin/admin.png" alt="Admin" />
            </div> */}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Employee_dashboard;