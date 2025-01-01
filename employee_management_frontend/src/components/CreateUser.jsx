import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); 
  const [message, setMessage] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !departmentId) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        name,
        email,
        password,
        role,
        department_id: departmentId,
      });
      setMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setRole('employee');
      setDepartmentId('');
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.response?.data?.message || 'Error creating user');
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/department');
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

        <button type="submit">Create User</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateUser;
