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
      navigate("/EmployeeList");
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
    <div className="create-user">
      <h4 className="employeeTitle">Update User</h4>

      <div className="form form-vertical small-form">
        <form onSubmit={handleSubmit} className="small-form-inputs inputs inputs-vertical">
          {/* Two Inputs in One Line */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder=" "
                value={user.name}
                onChange={handleChange}
                className="input input-vertical"
                required
              />
              <label className="user-label">Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={user.email}
                onChange={handleChange}
                className="input input-vertical"
                required
              />
              <label className="user-label">Email</label>
            </div>
          </div>

          {/* Two Inputs in One Line */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder=" "
                value={user.username}
                onChange={handleChange}
                className="input input-vertical"
                required
              />
              <label className="user-label">Username</label>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder=" "
                value={user.phone}
                onChange={handleChange}
                className="input input-vertical"
              />
              <label className="user-label">Phone</label>
            </div>
          </div>
          <div className="input-group">
            <label className="custum-file-upload" htmlFor="file">
              <div className="icon">📁</div>
              <div className="text">
                <span>Click to upload profile picture</span>
              </div>
              <input
                type="file"
                id="file"
                name="profile_picture"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Single Input */}
          <div className="input-group">
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="select-empployee"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {/* <label className="user-label">Gender</label> */}
          </div>
            {/* Department Select */}
            <div className="input-group">
            <select
              name="department_id"
              value={user.department_id}
              onChange={handleChange}
              className="select-empployee"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {/* <label className="user-label">Department</label> */}
          </div>

          {/* Single Input */}
          <div  className="select-empployee" >
            <CountrySelect
              onChange={handleCountryChange}
              defaultValue={user.country} // Pass the previous country as the default value
              className="select-empployee"
            />
            {/* <label className="user-label">Country</label> */}
          </div>

          {/* File Upload */}
          

        

          {/* Buttons */}
          <div className="input-row">
            <button className="button-form vertical-button-form" type="submit">
              Update
            </button>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;