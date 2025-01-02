import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosSetup'; 
import { Link, useNavigate, useParams } from 'react-router-dom';

const UpdateUser = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const user = response.data;
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
        setPhone(user.phone);
        setRole(user.role);
        setDepartmentId(user.department_id);
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

  // Handle file change for profile picture
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !email || !role || !phone || !departmentId) {
      setMessage('Please fill out all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password); 
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('department_id', departmentId);
    formData.append('username', username);
    if (profilePicture) formData.append('profile_picture', profilePicture);

    

    try {
      const response = await axiosInstance.put(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log('Response from backend:', response.data);
    
      // Check the updated user data in the response
      const updatedUser = response.data.user;
      if (updatedUser) {
        setName(updatedUser.name);
        setEmail(updatedUser.email);
        setUsername(updatedUser.username);
        setPhone(updatedUser.phone);
        setRole(updatedUser.role);
        setDepartmentId(updatedUser.department_id);
      }
    
      setMessage(response.data.message || 'User updated successfully');
      navigate("/dashboard"); // Redirect after successful update
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
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
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="file"
          onChange={handleFileChange}
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
