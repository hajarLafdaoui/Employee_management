import React, { useEffect, useState } from 'react';
import axiosInstance from './Config/axiosSetup';
import { Link, useNavigate } from 'react-router-dom';
import CountrySelect from './CountrySelect';
import SuccessAlert from './Alerts/SuccessAlert';
import ErrorAlert from './Alerts/ErrorAlert';

const CreateUser = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    role: 'employee',
    phone: '',
    profilePicture: null,
    departmentId: '',
    job_id: '', // Add job_id
    baseSalary: 0,
    gender: '',
    country: '',
    is_active: true,
  });

  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]); // State for jobs
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const fetchJobsByDepartment = async (departmentId) => {
    if (!departmentId) {
      setJobs([]); // Clear jobs if no department is selected
      return;
    }

    try {
      const response = await axiosInstance.get(`/departments/${departmentId}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setUserData((prevState) => ({
      ...prevState,
      departmentId,
      job_id: '', // Reset job_id when department changes
    }));
    fetchJobsByDepartment(departmentId); // Fetch jobs for the selected department
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting gender:", userData.gender); // Add this line

    const { name, email, password, username, role, phone, departmentId, job_id, baseSalary, gender, country, profilePicture } = userData;

    // Simple client-side validation for required fields
    if (!name || !email || !password || !role || !username || !departmentId || !job_id || !gender || !country) {
      setMessage('Please fill in all required fields.');
      setShowErrorAlert(true); // Show error alert
      return;
    }
    console.log("Submitting gender:", userData.gender); // Add this line


    setIsSubmitting(true); // Disable submit button during submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('department_id', departmentId);
    formData.append('job_id', job_id); // Include job_id
    formData.append('base_salary', baseSalary);
    formData.append('gender', gender);
    formData.append('country', country);
    formData.append('is_active', userData.is_active ? '1' : '0');

    // Append profile_picture as a base64 string
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
        console.log("Submitting gender:", userData.gender); // Add this line

      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Failed to add employee');
      setShowSuccessAlert(true); // Show alert immediately


      setUserData({
        name: '',
        email: '',
        password: '',
        username: '',
        role: 'employee',
        phone: '',
        profilePicture: null,
        departmentId: '',
        job_id: '', // Reset job_id
        gender: '',
        country: '',
        is_active: true,
      });
      setTimeout(() => {
        navigate("/EmployeeList"); // Navigate after 5 seconds
      }, 5000);
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.response?.data?.message || 'Error creating user');
      setShowErrorAlert(true); // Show error alert
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevState) => ({
          ...prevState,
          profilePicture: reader.result, // Store the base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setUserData((prevState) => ({
      ...prevState,
      country: selectedCountry.value,
    }));
  };

  return (
    <div className="create-user">
      <h4 className='employeeTitle'>Create User</h4>

      <div className="form form-vertical small-form">
        <form onSubmit={handleSubmit} className="small-form-inputs inputs inputs-vertical">
          {/* {message && <div className="error-message">{message}</div>} */}

          {/* Two Inputs in One Line */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder=" "
                value={userData.name}
                onChange={handleInputChange}
                className="input input-vertical"
              />
              <label className="user-label">Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={userData.email}
                onChange={handleInputChange}
                className="input input-vertical"
              />
              <label className="user-label">Email</label>
            </div>
          </div>

          {/* Two Inputs in One Line */}
          <div className="input-row">
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder=" "
                value={userData.password}
                onChange={handleInputChange}
                className="input input-vertical"
              />
              <label className="user-label">Password</label>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder=" "
                value={userData.username}
                onChange={handleInputChange}
                className="input input-vertical"
              />
              <label className="user-label">Username</label>
            </div>
          </div>

          {/* Single Input */}
          <div className="input-group">
            <input
              type="text"
              name="phone"
              placeholder=" "
              value={userData.phone}
              onChange={handleInputChange}
              className="input input-vertical"
            />
            <label className="user-label">Phone</label>
          </div>

          {/* File Upload */}
          <div className="input-group">
            <label className="custum-file-upload" htmlFor="file">
              <div className="icon">📁</div>
              <div className="text">
                <span>Click to upload profile picture</span>
              </div>
              <input
                type="file"
                id="file"
                name="profilePicture"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Dropdowns and Select elements */}
          <div className="input-group">
            <select
              className="select-empployee"
              name="role"
              value={userData.role}
              onChange={handleInputChange}
            >
              <option value="employee">Employee</option>
              <option value="sub-admin">Sub-Admin</option>
            </select>
          </div>

          {/* Gender Dropdown */}
          <div className="input-group">
            <select
              className="select-empployee"
              name="gender" // Ensure this matches state key
              value={userData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="input-group select-group">
            <select
              className="select-empployee"
              name="departmentId"
              value={userData.departmentId}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {isLoading ? (
                <option disabled>Loading...</option>
              ) : (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="input-group select-group">
            <select
              className="select-empployee"
              name="job_id"
              value={userData.job_id}
              onChange={handleInputChange}
              disabled={!userData.departmentId} // Disable if no department is selected
            >
              <option value="">Select Job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-empployee">
            <CountrySelect className="select-empployee" onChange={handleCountryChange} />
          </div>


          <button className="button-form vertical-button-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Render SuccessAlert if showSuccessAlert is true */}
      {showSuccessAlert && (
        <SuccessAlert
          message="User created successfully!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          message={message}
          onClose={() => setShowErrorAlert(false)}
        />
      )}
    </div>
  );
};

export default CreateUser;