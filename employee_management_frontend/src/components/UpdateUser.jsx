import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./Config/axiosSetup";
import CountrySelect from "./CountrySelect"; // Import the CountrySelect component

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    department_id: "",
    profile_picture: null,
    username: "", // Add username
    gender: "", // Add gender
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchDepartments();
  }, []);

  // Fetch the user details
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      setUser({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        country: response.data.country || "", // Fetch the previous country
        department_id: response.data.department_id,
        profile_picture: null, // Reset profile picture to avoid sending old data
        username: response.data.username || "", // Add username
        gender: response.data.gender || "", // Add gender
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch available departments
  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (allow only images)
      if (file.type.startsWith("image/")) {
        setUser({ ...user, profile_picture: file });
      } else {
        alert("Please upload a valid image file.");
        e.target.value = null; // Clear the file input
      }
    }
  };

  // Handle country change
  const handleCountryChange = (selectedCountry) => {
    setUser({ ...user, country: selectedCountry.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the profile picture file to base64
    let profilePictureBase64 = null;
    if (user.profile_picture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        profilePictureBase64 = reader.result; // Base64 string
        sendFormData(profilePictureBase64); // Call the function to send data
      };
      reader.readAsDataURL(user.profile_picture); // Read the file as base64
    } else {
      sendFormData(profilePictureBase64); // Call the function without profile picture
    }
  };

  // Send form data to the backend
  const sendFormData = async (profilePictureBase64) => {
    const formData = {
      name: user.name,
      email: user.email,
      phone: user.phone || "", // Optional field
      country: user.country || "", // Optional field
      department_id: user.department_id,
      profile_picture: profilePictureBase64, // Base64 string or null
      username: user.username, // Add username
      gender: user.gender, // Add gender
    };

    console.log("Form Data:", formData); // Log form data for debugging

    try {
      const response = await axiosInstance.put(`/users/${id}`, formData, {
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
      });

      alert("User updated successfully!");
      navigate("/employee-list");
    } catch (error) {
      console.error("Error updating user:", error);

      // Display validation errors to the user
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        let errorMessage = "Validation errors:\n";
        for (const [field, messages] of Object.entries(errors)) {
          errorMessage += `${field}: ${messages.join(", ")}\n`;
        }
        alert(errorMessage);
      } else {
        alert("Failed to update user.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender:</label>
          <select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country:</label>
          <CountrySelect
            onChange={handleCountryChange}
            defaultValue={user.country} // Pass the previous country as the default value
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Picture:</label>
          <input
            type="file"
            name="profile_picture"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department:</label>
          <select
            name="department_id"
            value={user.department_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Update
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-3"
          onClick={() => navigate("/employee-list")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;