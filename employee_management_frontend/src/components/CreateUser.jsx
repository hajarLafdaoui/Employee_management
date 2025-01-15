import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';
import { Link, useNavigate } from 'react-router-dom';

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
    baseSalary: '',
  });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, username, role, phone, departmentId, baseSalary, profilePicture } = userData;

    // Check if required fields are filled
    if (!name || !email || !password || !role || !username || !departmentId || !baseSalary) { 
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
    formData.append('base_salary', baseSalary); // Add base salary to form data

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
      setUserData({
        name: '',
        email: '',
        password: '',
        username: '',
        role: 'employee',
        phone: '',
        profilePicture: null,
        departmentId: '',
        baseSalary: '',
      });
      navigate("/crud");
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

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={userData.phone}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
        />

        <select
          name="role"
          value={userData.role}
          onChange={handleInputChange}
        >
          <option value="employee">Employee</option>
          <option value="sub-admin">Sub-Admin</option>
        </select>

        <select
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

        <input
          type="text"
          name="baseSalary"
          placeholder="Base Salary"
          value={userData.baseSalary}
          onChange={handleInputChange}
        />

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
