import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./Config/axiosSetup";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Define fetchUsers outside of useEffect
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
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

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await axiosInstance.put(`/users/${userId}/status`, { is_active: newStatus });
      fetchUsers(); // Re-fetch users to get the updated status
    } catch (error) {
      console.error("Error toggling status:", error);
      setErrorMessage("Error toggling user status.");
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <Link to="/create-user">
        <button style={{ backgroundColor: "green", color: "white" }}>
          Create User
        </button>
      </Link>

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
                  {/* {user.is_active ? "Active" : "Inactive"} */}

                    {user.name === (JSON.parse(localStorage.getItem('user'))).name ? "Active" : ""}
                    {!(user.name === (JSON.parse(localStorage.getItem('user'))).name )? "Inactive" : ""}
                    {/* <button
                      onClick={() => toggleStatus(user.id, user.is_active)}
                      style={{ marginLeft: "10px" }}
                    >
                      Toggle Status
                    </button> */}
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

export default EmployeeList;
