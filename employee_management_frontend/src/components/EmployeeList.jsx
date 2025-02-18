import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./Config/axiosSetup";
import './EmployeeList.scss';

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (e, userId) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      await axiosInstance.put(`/users/${userId}/toggle`);
      setUsers(users.filter((user) => user.id !== userId));
      console.log("User soft deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
    }
  };

  const toggleMenu = (userId) => {
    setActiveMenu((prevMenu) => (prevMenu === userId ? null : userId));
  };




  const totalPages = Math.ceil(users.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  return (
    <div className="container">
      <div className="head">
      <h2>User List</h2>

      <Link to="/CreateUser">
        <button className="button create">Create User</button>
      </Link>
      </div>
      <div className="table-wrapper">
  <div className="table-header">

    <div>Name</div>
    
    <div>Username</div>
    <div>Phone</div>
    <div>Role</div>
    <div>Actions</div>
  </div>
  {currentUsers.map((user) => {
    const profilePictureUrl = user.profile_picture
      ? `http://localhost:8000/storage/${user.profile_picture}`
      : null;
    const isDeleted = user.is_deleted;

    return (
      <div key={user.id} className="table-row">
         
        <div className="  .profile-container"  ><div  >{profilePictureUrl ? (
            <img className="profileimg" src={profilePictureUrl} alt="Profile" />
          ) : (
            <img className="profileimg" src="images.jpeg" alt="Profile" />

          )}</div><div>{user.name}</div></div>
        <div>{user.username}</div>
        <div>{user.phone}</div>
     
        <div>{user.role}</div>
        <div className="actions">
          <button
            className="button action-button"
            onClick={() => toggleMenu(user.id)}
          >
            &#x22EE;
          </button>
          {activeMenu === user.id && (
            <div className="dropdown-menu">
              <Link to={`/user-details/${user.id}`}>
                <button className="button view" disabled={isDeleted}>View Details</button>
              </Link>
              <Link to={`/update-user/${user.id}`}>
                <button className="button update" disabled={isDeleted}>Update</button>
              </Link>
              <button
                onClick={(e) => handleDelete(e, user.id)}
                className="button delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  })}
</div>
<div className="pagination">
        <button 
          className="pagination-button" 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button 
          className="pagination-button" 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
