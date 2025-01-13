import React, { useEffect, useState } from 'react';
import axiosInstance from './Config/axiosSetup';
import { Link, useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('employee');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !username || !departmentId) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('department_id', departmentId);

    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await axiosInstance.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setUsername('');
      setRole('employee');
      setPhone('');
      setProfilePicture(null);
      setDepartmentId('');
      navigate("/crud")
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.response?.data?.message || 'Error creating user');
    }
  };

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

  return (
    <div>
      <h2>Create User</h2>
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="sub-admin">sub-admin</option>
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

        <button type="submit">Create User</button>
      </form>
      <p>{message}</p>

      <Link to="/crud">
        <button style={{ backgroundColor: 'gray', color: 'white' }}>
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default CreateUser;
