import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    FaChevronUp
} from 'react-icons/fa';

const AdminMenu = ({ user }) => {
    const [navVisible, setNavVisible] = useState(true);
    const [dropdowns, setDropdowns] = useState({});

    const toggleNav = () => setNavVisible(!navVisible);

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderDropdown = (title, icon, key, items) => (
        <li className={`dropdown-item dropdown-${key} ${dropdowns[key] ? 'expanded' : ''}`}>
            <div className={`dropdown-title dropdown-title-${key}`} onClick={() => toggleDropdown(key)}>
                {icon}
                <span>{title}</span>
                {dropdowns[key] ? <FaChevronUp className={`dropdownArrow dropdownArrow-${key}`} /> : <FaChevronDown className={`dropdownArrow dropdownArrow-${key}`} />}
            </div>
            <ul className={`dropdownMenu dropdownMenu-${key}`}>
                {items.map(({ icon, label, link }) => (
                    <li key={label} className={`dropdownMenuItem dropdownMenuItem-${key}`}>
                        {icon}
                        <Link className={`dropdownLink dropdownLink-${key}`} to={link}>{label}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );


    return (
        <div className="Container">
            <div className="AdminMenu">
                <div className="menuToggle">
                    <span className="collapse" onClick={toggleNav}>
                        <img className="collapse-img" src="/icons/collapse.png" alt="collapse" />
                    </span>
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
                                <Link className="navLink" to="/dashboard">Dashboard</Link>
                            </li>

                            {/* Render Dropdown for Employees */}
                            {renderDropdown("Employees", <FaUsers />, "employees", [
                                { icon: <FaUserPlus />, label: "Add Employee", link: "/create-user", className: "add-employee" },
                                { icon: <FaUsers />, label: "Employee List", link: "/crud", className: "employee-list" },
                                { icon: <FaCalendarCheck />, label: "Employee Leave", link: "/leave", className: "employee-leave" },
                                { icon: <FaMoneyBillWave />, label: "Employee Payroll", link: "/payroll", className: "employee-payroll" }
                            ])}



                            <li className="NavbarItem">
                                <FaBuilding />
                                <Link className="navLink" to="/departments">Departments</Link>
                            </li>

                            <li className="NavbarItem">
                                <FaCalendarAlt />
                                <Link className="navLink" to="/AttendanceHeader">Attendance </Link>
                            </li>

                            <li className="NavbarItem">
                                <FaCalendarCheck />
                                <Link className="navLink" to="/leave">Leave </Link>
                            </li>
                            {/* Render Dropdown for Payroll */}
                            {renderDropdown("Payroll", <FaMoneyBillWave />, "payroll", [
                                { icon: <FaFileInvoiceDollar />, label: "View Payroll", link: "/payroll/view", className: "view-payroll" },
                                { icon: <FaMoneyBillWave />, label: "Generate Payroll", link: "/payroll/generate", className: "generate-payroll" }
                            ])}

                            <li className="NavbarItem">
                                <FaChartPie />
                                <Link className="navLink" to="/reports">Reports</Link>
                            </li>
                        </ul>
                        <div className="admin-email">
                            <img src={user.profile_picture} alt="" />
                            <p> {user.email}</p>
                        </div>
                    </nav>

                )}
            </div>


            <p>Welcome, {user.name}</p>


        </div>
    );
};

export default AdminMenu;
