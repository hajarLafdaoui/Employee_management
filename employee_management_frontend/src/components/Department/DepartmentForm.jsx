import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DepartmentForm = ({ 
  departments, 
  setDepartments, 
  department = {},  
  onClose, 
  onSuccess, 
  setShowErrorAlert 
}) => { 

  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) formData.append("logo", logo);
    
    try {
      const url = department?.id 
        ? `http://127.0.0.1:8000/api/departments/${department.id}`
        : "http://127.0.0.1:8000/api/departments";
      
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data) {
        setDepartments((prev) =>
          department?.id
            ? prev.map((dept) => (dept.id === department.id ? response.data : dept))
            : [...prev, response.data]
        );
      }

      onClose();
      onSuccess(response.data);

      if (!department) {
        setName("");
        setDescription("");
        setLogo(null);
      }
    } catch (error) {
      console.error("Error with department operation:", error.response?.data || error);
      
      // Close the modal and redirect to "/departments" on failure
      onClose();
      setShowErrorAlert(department?.id ? "Failed to update department. Please try again later." : "Failed to add department. Please try again later.");
      navigate("/departments");
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
            <div className="icon">📁</div>
            <div className="text"><span>Click to upload logo</span></div>
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
        {department?.id ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;
