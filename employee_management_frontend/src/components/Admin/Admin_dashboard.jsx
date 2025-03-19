import React, { useEffect, useState, useMemo } from "react";
import {
  FaSignOutAlt, FaSearch, FaSun, FaMoon, FaBell, FaBars, FaChevronLeft,
  FaChevronDown, FaChevronUp, FaTachometerAlt, FaUserPlus, FaUsers,
  FaCalendarCheck, FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaGift,
  FaClipboardList, FaHistory, FaIdCard, FaUser, FaVenusMars,
  FaGlobe, FaEnvelope, FaPhone
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Confirmation from "../Confirmation";

const AdminDashboard = () => {
  const [dropdowns, setDropdowns] = useState({ employees: true, payroll: false });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  const [showAdminInfo, setShowAdminInfo] = useState(false);



  // Ensure first dropdown stays open if none are open
  useEffect(() => {
    if (!Object.values(dropdowns).some(v => v)) {
      setDropdowns(prev => ({ ...prev, employees: true }));
    }
  }, [dropdowns]);

  // Initialize admin user
  // if (!adminUser) {
  //   navigate("/SignIn");
  // }
  useEffect(() => {
    if (!adminUser) {
      navigate("/SignIn");
    }
  }, [adminUser, navigate]);

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
  // Add click handler for profile image
  const handleProfileClick = () => {
    setShowAdminInfo(!showAdminInfo);
  };

  // Add close handler for the side panel
  const closeAdminInfo = () => {
    setShowAdminInfo(false);
  };


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
            {/* In AdminDashboard component */}
            <div className="admin-image-container" onClick={handleProfileClick}>
              <img
                className="admin-image"
                src={
                  adminUser?.profile_picture
                    ? `http://localhost:8000/storage/${adminUser.profile_picture}`
                    : "/admin/admin.png"
                }
                alt="Admin Profile"
                onError={(e) => {
                  e.target.src = "/icons/default-profile.jpg";
                }}
              />
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

      {/* 
         */}
      {showAdminInfo && (
        <div className="admin-info-panel">
          <div className="panel-header">
            <h4>{adminUser?.name}</h4>
            <img width="25px" className="closee" src="icons/close1.png" alt="" onClick={closeAdminInfo} />
          </div>
          <div className="panel-content">
            <div className="profile-section">
              <div className='backimgg'>
                <img src="/img/images3.jpg" alt="" className="imgdetail" />
              </div>
              <div className='head1'>
                <div className='infohead'>
                  <img
                    src={adminUser.profile_picture ? `http://localhost:8000/storage/${adminUser.profile_picture}` : 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>
                <img
                  className="imgedit"
                  src="/icons/edit2.png"
                  alt="Edit"
                  onClick={() => {
                    navigate(`/update-user/${adminUser.id}`);
                    closeAdminInfo(); // Add this line to close the panel
                  }}
                />
              </div>
            </div>
            <div className="admin-details">
              <h4>Basic information</h4>
              <div className="info-grid">
                <div className='groupinfoall'>
                  <FaIdCard />
                  <div className='groupinfo'>
                    <p>ID</p>
                    <span>{adminUser.id}</span>
                  </div>
                </div>
                <div className='groupinfoall'>
                  <FaUser />
                  <div className='groupinfo'>
                    <p>Username</p>
                    <span>{adminUser.username}</span>
                  </div>
                </div>
              
                <div className='groupinfoall'>
                  <FaGlobe />
                  <div className='groupinfo'>
                    <p>Country</p>
                    <span>{adminUser.country}</span>
                  </div>
                </div>
              </div>

              <h4>Contact information</h4>
              <div className='groupinfoall'>
                <FaEnvelope />
                <div className='groupinfo'>
                  <p>Email</p>
                  <span>{adminUser.email}</span>
                </div>
              </div>
              <div className='groupinfoall'>
                <FaPhone />
                <div className='groupinfo'>
                  <p>Phone</p>
                  <span>{adminUser.phone}</span>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
      {/* Add CSS styles */}
      <style jsx>{`
          .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    margin-bottom: 5px;
  }

  .groupinfoall {
    display: flex;
    align-items: center;
    gap:10px;
    padding: 5px ;
    background: ${isDarkMode ? '#404040' : '#f0f0f0'};
    border-radius: 8px;
    min-width: 0;
  }
    .closee{
    cursor:pointer
    }

  .groupinfo {
    flex: 1;
    min-width: 0;
  }

  .groupinfo p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  .groupinfo span {
    display: block;
    font-weight: 500;
    color: ${isDarkMode ? '#fff' : '#333'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-details h4 {
    margin: 20px 0 5px;
    color: ${isDarkMode ? '#fff' : '#333'};
    font-size: 1.1rem;
  }
        .admin-info-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 325px;
          height: 100%;
          background: ${isDarkMode ? '#2c2c2c' : '#fff'};
          box-shadow: -2px 0 5px rgba(0,0,0,0.1);
          z-index: 1000;
          padding: 10px;
          transition: transform 0.3s ease-in-out;
          // overflow-y:scroll;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 15px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 35px;
          cursor: pointer;
          color: ${isDarkMode ? '#fff' : '#333'};
        }

        .admin-image-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: block;
        }

        .admin-details {
          padding: 5px;
          background: ${isDarkMode ? '#363636' : '#f5f5f5'};
          border-radius: 8px;
        }

        .admin-details p {
          margin: 5px 0;
          color: ${isDarkMode ? '#fff' : '#333'};
        }

        .admin-image-container {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .admin-image-container:hover {
          transform: scale(1.05);
        }
          .backimgg{
        
          }
      `}</style>

    </div >
  );
};

export default AdminDashboard;