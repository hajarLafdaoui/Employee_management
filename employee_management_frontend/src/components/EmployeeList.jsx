import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./Config/axiosSetup";
import './EmployeeList.scss';

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; 
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      const usersWithFlags = await Promise.all(
        response.data.map(async (user) => {
          try {
            const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${user.country}?fullText=true`);
            const countryData = await countryResponse.json();
            const flagUrl = countryData[0]?.flags?.png || "";
            return { ...user, flagUrl };
          } catch (error) {
            console.error(`Error fetching flag for ${user.country}:`, error);
            return { ...user, flagUrl: "" };
          }
        })
      );
      setUsers(usersWithFlags);
    } catch (error) {
      setErrorMessage("Error fetching users.");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const handleStorageChange = () => {
      fetchUsers();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/users/${userId}`);
      fetchUsers(); // Re-fetch users to keep data updated
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Error deleting user.");
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
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

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
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Profile Picture</th>
              <th>Role</th>
              <th>Country</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const profilePictureUrl = user.profile_picture
                ? `http://localhost:8000/storage/${user.profile_picture}`
                : null;

              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.phone}</td>
                  <td>
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt="Profile"
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <p>No profile picture</p>
                    )}
                  </td>
                  <td>{user.role}</td>
                  <td>
                    {user.flagUrl && (
                      <img
                        src={user.flagUrl}
                        alt={`${user.country} flag`}
                        style={{ width: "30px", height: "20px", marginRight: "5px" }}
                      />
                    )}
                    {user.country}
                  </td>
                  <td>
                    {user.name === (JSON.parse(localStorage.getItem("user"))).name
                      ? "Active"
                      : "Inactive"}
                  </td>
                  <td>
                    <Link to={`/user-details/${user.id}`}>
                      <button
                        style={{
                          backgroundColor: "purple",
                          color: "white",
                          marginRight: "10px",
                        }}
                      >
                        View Details
                      </button>
                    </Link>
                    <Link to={`/update-user/${user.id}`}>
                      <button
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          marginRight: "10px",
                        }}
                      >
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, user.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        marginRight: "10px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
}
export default EmployeeList;
