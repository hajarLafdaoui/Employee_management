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
    FaFileInvoiceDollar 
} from 'react-icons/fa'; 

import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 

const AdminMenu = () => {
    const [nav, setNav] = useState(true); 
    const [dropdown, setDropdown] = useState(false); 
    const [dropdown2, setDropdown2] = useState(false); 

    const togglDropdown0 = () => setNav(!nav); 
    const togglDropdown = () => setDropdown(!dropdown); 
    const togglDropdown2 = () => setDropdown2(!dropdown2); 

    return (
        <>
            <div className='menuToggle' onClick={togglDropdown0}>
                <button>{nav ? "Hide Menu" : "Show Menu"}</button> 
            </div>

            {nav && (
                <nav className='Navbar'>
                    <div className='logoContainer'>
                        <Link className="navLink" to="/dashboard">
                            <img src="/logo/logo.png" alt="Logo" />
                        </Link>
                    </div>
                    <p className='menuText'>Menu</p>
                    <ul className='NavbarMenu'>
                        <li className='NavbarItem'>
                            <FaTachometerAlt />
                            <Link className="navLink" to="/dashboard">Dashboard</Link>
                        </li>

                        <li className='NavbarItem dropdown'>
                            <div className="dropdown-title" onClick={togglDropdown}>
                                <FaUsers />
                                <span>Manage Employees</span>
                                {dropdown ? (
                                    <FaChevronUp className="dropdownArrow" />
                                ) : (
                                    <FaChevronDown className="dropdownArrow" />
                                )}
                            </div>
                            {dropdown && (
                                <ul className='dropdownMenu'>
                                    <li>
                                        <FaUserPlus />
                                        <Link className="dropdownLink" to="/create-user">Add Employee</Link>
                                    </li>
                                    <li>
                                        <FaUsers />
                                        <Link className="dropdownLink" to="/crud">Employee List</Link>
                                    </li>
                                    <li>
                                        <FaCalendarCheck />
                                        <Link className="dropdownLink" to="/leave">Employee Leave</Link>
                                    </li>
                                    <li>
                                        <FaMoneyBillWave />
                                        <Link className="dropdownLink" to="/payroll">Employee Payroll</Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className='NavbarItem'>
                            <FaBuilding />
                            <Link className="navLink" to="/departments">Manage Departments</Link>
                        </li>

                        <li className='NavbarItem'>
                            <FaCalendarAlt />
                            <Link className="navLink" to="/AttendanceHeader">Attendance Management</Link>
                        </li>

                        <li className='NavbarItem'>
                            <FaCalendarCheck />
                            <Link className="navLink" to="/leave">Leave Management</Link>
                        </li>

                        <li className='NavbarItem dropdown'>
                            <div className='dropdown-title' onClick={togglDropdown2}>
                                <FaMoneyBillWave />
                                <span>Payroll Management</span>
                                {dropdown2 ? (
                                    <FaChevronUp className="dropdownArrow" />
                                ) : (
                                    <FaChevronDown className="dropdownArrow" />
                                )}
                            </div>
                            {dropdown2 && (
                                <ul className='dropdownMenu'>
                                    <li>
                                        <FaFileInvoiceDollar />
                                        <Link className="dropdownLink" to="/payroll/view">View Payroll</Link>
                                    </li>
                                    <li>
                                        <FaMoneyBillWave />
                                        <Link className="dropdownLink" to="/payroll/generate">Generate Payroll</Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className='NavbarItem'>
                            <FaChartPie />
                            <Link className="navLink" to="/reports">Reports</Link>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
};

export default AdminMenu;
