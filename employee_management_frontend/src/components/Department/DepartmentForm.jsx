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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert logo to base64 if a logo is provided
    let logoBase64 = null;
    if (logo) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        logoBase64 = reader.result;
  
        try {
          let response;
          if (department?.id) {
            // If updating an existing department, send a PUT request
            console.log("Updating department with ID:", department.id);
            response = await axiosInstance.put(`/departments/${department.id}`, {
              name: name.trim(),
              description: description,
              logo: logoBase64, // Send base64 image
            });
          } else {
            // If creating a new department, send a POST request
            console.log("Creating new department");
            response = await axiosInstance.post("/departments", {
              name: name.trim(),
              description: description,
              logo: logoBase64, // Send base64 image
            });
          }
  
          console.log("API Response:", response.data);
          onSuccess(response.data);  // Trigger the success callback
          onClose();  // Immediately close the modal
          navigate("/departments");  // Redirect to the departments page
        } catch (error) {
          console.error("API Error:", error.response?.data || error.message);
          setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
      };
  
      reader.readAsDataURL(logo); // Start reading the image file as base64
    } else {
      // If no logo is provided, submit the form without it
      try {
        let response;
        if (department?.id) {
          response = await axiosInstance.put(`/departments/${department.id}`, {
            name: name.trim(),
            description: description,
          });
        } else {
          response = await axiosInstance.post("/departments", {
            name: name.trim(),
            description: description,
          });
        }
  
        console.log("API Response:", response.data);
        onSuccess(response.data);  // Trigger the success callback
        onClose();  // Immediately close the modal
        navigate("/departments");  // Redirect to the departments page
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "An error occurred. Please try again.");
      }
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="form form-vertical">
      <div className="inputs inputs-vertical">
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
              onChange={(e) => setLogo(e.target.files[0])} // Set the logo file
            />
          </label>
        </div>
      </div>

      <button className="button-form vertical-button-form" type="submit">
        {department?.id ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;