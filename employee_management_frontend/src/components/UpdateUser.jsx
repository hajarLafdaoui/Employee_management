import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Using useNavigate instead of useHistory
import axiosInstance from "./Config/axiosSetup";

const UpdateUser = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    role: "",
    profile_picture: null,
    base_salary: "",
    // add other fields if needed
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        console.log("Fetched user data:", response.data); // Log the fetched user data
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log the selected file
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the FormData
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("username", user.username);
    formData.append("phone", user.phone);
    formData.append("role", user.role);
    formData.append("base_salary", user.base_salary);
    if (user.profile_picture) {
      formData.append("profile_picture", user.profile_picture);
    }

    // Log the FormData before sending
    formData.forEach((value, key) => {
      console.log(key, value); // Log the data being sent
    });

    try {
      const response = await axiosInstance.put(`/users/${id}`, formData);
      console.log("Response:", response); // Log the response from the server

      // After successful update
      setLoading(false);
      navigate("/EmployeeList"); // Redirect to employee list page
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      setError(error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <div>
      <h2>Update User</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={user.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="sub-admin">Sub-admin</option>
          </select>
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          {user.profile_picture && (
            <p>Selected file: {user.profile_picture.name}</p>
          )}
        </div>
        <div>
          <label>Base Salary:</label>
          <input
            type="number"
            name="base_salary"
            value={user.base_salary}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
