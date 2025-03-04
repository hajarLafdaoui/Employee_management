import React, { useState, useEffect } from "react";
import axios from "axios";

const DepartmentForm = ({ 
  departments,
  setDepartments,
  department, 
  onClose, 
  onSuccess, 
  onUpdate, 
  setShowErrorAlert 
}) => {
  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [logo, setLogo] = useState(null);

  // Update form fields when the department prop changes.
  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setDescription(department.description || "");
      setLogo(null); // Reset logo if department changes
    } else {
      setName(""); // Clear form fields if no department
      setDescription("");
      setLogo(null);
    }
  }, [department]);
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) {
      formData.append("logo", logo);
    }
  
    try {
      let response;
      if (department && department.id) {
        response = await axios.post(
          `http://127.0.0.1:8000/api/departments/${department.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/departments",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      
      
  
      if (response.data) {
        setDepartments((prevDepartments) => {
          if (department) {
            return prevDepartments.map((dept) =>
              dept.id === department.id ? response.data : dept
            );
          } else {
            return [...prevDepartments, response.data];
          }
        });
      }
  
      onClose();  // Close modal
      onSuccess();  // Success message
  
      if (!department) {
        // Reset form after adding new department
        setName("");
        setDescription("");
        setLogo(null);
      }
    } catch (error) {
      onClose();
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 10000);
      console.error("Error with department operation:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form form-vertical">
      <div className="inputs inputs-vertical">
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
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
                <g strokeWidth="0"></g>
                <g strokeLinejoin="round" strokeLinecap="round"></g>
                <g>
                  <path fill=""
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    clipRule="evenodd" fillRule="evenodd"
                  ></path>
                </g>
              </svg>
            </div>
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

        {department?.logo && (
          <div className="current-logo">
            <img src={department.logo} alt="Current logo" />
            <p>Current Logo</p>
          </div>
        )}
      </div>

      <button className="vertical-button" type="submit">
        {department ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;
