import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosSetup'; 
import { Link, useNavigate, useParams } from 'react-router-dom';

const UpdateUser = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'employee',
    phone: '',
    profilePicture: null,
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const user = response.data;
        setFormData({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          departmentId: user.department_id,
          password: '',
          profilePicture: null, 
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch departments list on load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle form field changes in a single handler
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axiosInstance.put(`/users/${userId}`, formToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);

      // Optionally navigate or reset fields
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage(error.response?.data?.message || 'Error updating user');
    }
  };

  return (
    <div>
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="tel"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="file"
          name="profilePicture"
          onChange={handleChange}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button type="submit">Update User</button>
      </form>
      {message && <p>{message}</p>}

      <Link to="/dashboard">
        <button style={{ backgroundColor: 'gray', color: 'white' }}>
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default UpdateUser;
