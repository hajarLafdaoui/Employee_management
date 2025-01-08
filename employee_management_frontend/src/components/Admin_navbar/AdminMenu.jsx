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

const AdminMenu = () => {
    const [navVisible, setNavVisible] = useState(true);
    const [dropdowns, setDropdowns] = useState({});

    const toggleNav = () => setNavVisible(!navVisible);

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderDropdown = (title, icon, key, items) => (
        <li className={`dropdown-item ${dropdowns[key] ? 'expanded' : ''}`}>
            <div className="dropdown-title" onClick={() => toggleDropdown(key)}>
                {icon}
                <span>{title}</span>
                {dropdowns[key] ? <FaChevronUp className="dropdownArrow" /> : <FaChevronDown className="dropdownArrow" />}
            </div>
            <ul className="dropdownMenu">
                {items.map(({ icon, label, link }) => (
                    <li key={label}>
                        {icon}
                        <Link className="dropdownLink" to={link}>{label}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );

    return (
        <div className="AdminMenu">
            <div className="menuToggle">
                <span className='collapse' onClick={toggleNav}>
                <img className='collapse-img' src="/icons/collapse.png" alt="collapse" />
                </span>
            </div>

            {navVisible && (
                <nav className="Navbar">
                    <div className="logoContainer">
                        <Link className="navLink" to="/dashboard">
                            <img src="/logo/logo.png" alt="Logo" />
                        </Link>
                    </div>
                    <p className="menuText">Menu</p>
                    <ul className="NavbarMenu">
                        <li className="NavbarItem">
                            <FaTachometerAlt />
                            <Link className="navLink" to="/dashboard">Dashboard</Link>
                        </li>

                        {renderDropdown("Manage Employees", <FaUsers />, "employees", [
                            { icon: <FaUserPlus />, label: "Add Employee", link: "/create-user" },
                            { icon: <FaUsers />, label: "Employee List", link: "/crud" },
                            { icon: <FaCalendarCheck />, label: "Employee Leave", link: "/leave" },
                            { icon: <FaMoneyBillWave />, label: "Employee Payroll", link: "/payroll" }
                        ])}

                        <li className="NavbarItem">
                            <FaBuilding />
                            <Link className="navLink" to="/departments">Manage Departments</Link>
                        </li>

                        <li className="NavbarItem">
                            <FaCalendarAlt />
                            <Link className="navLink" to="/AttendanceHeader">Attendance Management</Link>
                        </li>

                        <li className="NavbarItem">
                            <FaCalendarCheck />
                            <Link className="navLink" to="/leave">Leave Management</Link>
                        </li>

                        {renderDropdown("Payroll Management", <FaMoneyBillWave />, "payroll", [
                            { icon: <FaFileInvoiceDollar />, label: "View Payroll", link: "/payroll/view" },
                            { icon: <FaMoneyBillWave />, label: "Generate Payroll", link: "/payroll/generate" }
                        ])}

                        <li className="NavbarItem">
                            <FaChartPie />
                            <Link className="navLink" to="/reports">Reports</Link>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default AdminMenu;
