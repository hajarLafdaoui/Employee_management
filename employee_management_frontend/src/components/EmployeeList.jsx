import React, { useEffect, useState } from "react";
import axiosInstance from "./Config/axiosSetup";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const usersWithFlags = await Promise.all(
        response.data.map(async (user) => {
          try {
            const countryResponse = await fetch(
              `https://restcountries.com/v3.1/name/${user.country}?fullText=true`
            );
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
      console.error("Error fetching users:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to load users.");
    }
  };

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
      setErrorMessage("Error deleting user.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Employee List</h2>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                {user.country}
                {user.flagUrl && (
                  <img src={user.flagUrl} alt={user.country} style={{ width: "30px", marginLeft: "10px" }} />
                )}
              </td>
              <td>
                <Link to={`/update-user/${user.id}`} className="btn btn-primary btn-sm me-2">
                  Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(e, user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
