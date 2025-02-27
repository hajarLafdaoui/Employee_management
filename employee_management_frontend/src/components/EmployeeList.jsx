import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./Config/axiosSetup";

const EmployeeList = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isConfirmed) return;

    try {
      await axiosInstance.put(`/users/${userId}/toggle`);

      setUsers(users.filter((user) => user.id !== userId));

      console.log("User soft deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <h2>User List</h2>

      <Link to="/CreateUser">
        <button style={{ backgroundColor: "green", color: "white" }}>
          Create User
        </button>
      </Link>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Profile Picture</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const profilePictureUrl = user.profile_picture
              ? `http://localhost:8000/storage/${user.profile_picture}`
              : null;
            const isDeleted = user.is_deleted;
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
                  <Link to={`/user-details/${user.id}`}>
                    <button
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        marginRight: "10px",
                      }}
                      disabled={isDeleted}
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
                      disabled={isDeleted}
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
      
    </div>
  );
};

export default EmployeeList;
