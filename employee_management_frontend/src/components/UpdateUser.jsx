import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const { userId } = useParams();  // To fetch the user ID from the URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('employee');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch the department list and user data on component mount
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

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setUsername(userData.username);
        setRole(userData.role);
        setPhone(userData.phone);
        setDepartmentId(userData.department_id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Failed to fetch user data.');
      }
    };

    fetchDepartments();
    fetchUserData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');  // Log to check if submission is triggered

    // Validate that all required fields are filled
    if (!name || !email || !username || !role || !phone || !departmentId) {
      setMessage('All fields are required.');
      return;
    }

    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('department_id', departmentId);

    

    try {
      const response = await axiosInstance.put(`/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Updated response:', response.data);
      if (response.data.success) {
        setMessage('User updated successfully!');
        navigate("/crud");
      }
      
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
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
        <button type="submit">Update User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUser;
