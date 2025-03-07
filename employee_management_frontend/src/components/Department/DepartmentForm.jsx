import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";

const DepartmentForm = ({
  departments,
  setDepartments,
  department = {},
  onClose,
  onSuccess,
  setShowErrorAlert,
}) => {
  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState(null); // State to handle form errors
  const navigate = useNavigate();

  // Reset form fields when the `department` prop changes
  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setDescription(department.description || "");
      setLogo(null);
    } else {
      setName("");
      setDescription("");
      setLogo(null);
    }
  }, [department]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the name field
    if (!name.trim()) {
      setError("The name field is required."); // Set error message
      return;
    }

    // Clear any previous errors
    setError(null);

    // Prepare form data
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description);
    if (logo) formData.append("logo", logo);

    // Debugging: Log the form data
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const url = department?.id
        ? `http://127.0.0.1:8000/api/departments/${department.id}`
        : "http://127.0.0.1:8000/api/departments";

      const method = department?.id ? "put" : "post";
      const response = await axiosInstance[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type for file uploads
        },
      });

      if (response.data) {
        console.log("API Response:", response.data);
        onSuccess(response.data); // Notify parent component of success
      }

      onClose(); // Close the form
    } catch (error) {
      console.error("API Error:", error);

      // Handle specific error cases
      if (error.response) {
        // Backend returned an error response
        setError(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        // No response received from the server
        setError("No response from the server. Please check your connection.");
      } else {
        // Something went wrong in setting up the request
        setError("An unexpected error occurred. Please try again.");
      }

      // Optionally, navigate to a fallback route
      navigate("/departments");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form form-vertical">
      <div className="inputs inputs-vertical">
        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <input
            placeholder=" "
            required
            type="text"
            name="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-vertical"
          />
          <label className="user-label">Department Name</label>
        </div>

        <div className="input-group">
          <textarea
            placeholder=" "
            required
            name="description"
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-vertical"
          />
          <label className="user-label">Description</label>
        </div>

        <div className="input-group">
          <label className="custum-file-upload" htmlFor="file">
            <div className="icon">📁</div>
            <div className="text">
              <span>Click to upload logo</span>
            </div>
            <input
              type="file"
              id="file"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </label>
        </div>

        {/* Display current logo if updating */}
        {department?.logo && (
          <div className="current-logo">
            <img src={department.logo} alt="Current logo" />
            <p>Current Logo</p>
          </div>
        )}
      </div>

      <button className=" button-form vertical-button-form" type="submit">
        {department?.id ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;