import React, { useEffect, useState } from 'react';
import axiosInstance from './Config/axiosSetup';
import { Link, useNavigate } from 'react-router-dom';
import CountrySelect from './CountrySelect';

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
    baseSalary: 0,
    gender: '',
    country: '',
    is_active: true,
  });

  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, username, role, phone, departmentId, baseSalary, gender, country } = userData;

    // Simple client-side validation for required fields
    if (!name || !email || !password || !role || !username || !departmentId  || !gender || !country) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true); // Disable submit button during submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('department_id', departmentId);
    formData.append('base_salary', baseSalary);
    formData.append('gender', gender);
    formData.append('country', country); // Add country to the form data
    formData.append('is_active', userData.is_active ? '1' : '0'); // Set is_active based on login status

    if (userData.profilePicture) {
      formData.append('profile_picture', userData.profilePicture);
    }

    try {
      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setUserData({
        name: '',
        email: '',
        password: '',
        username: '',
        role: 'employee',
        phone: '',
        profilePicture: null,
        departmentId: '',
        baseSalary: 0,
        gender: '',
        country: '',
        is_active: true,
      });
      navigate("/EmployeeList");
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.response?.data?.message || 'Error creating user');
    } finally {
      setIsSubmitting(false); // Enable submit button again
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
    setUserData((prevState) => ({
      ...prevState,
      profilePicture: e.target.files[0],
    }));
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
          {message && <div className="error-message">{message}</div>}

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

          {/* Dropdowns and Select elements remain unchanged */}
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

          <div className="input-group">
            <select
              className="select-empployee"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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

          <div className="select-empployee " >
            <CountrySelect className="select-empployee " onChange={handleCountryChange} />
          </div>

          <button className="button-form vertical-button-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;