import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosSetup';
import { useNavigate, useParams } from 'react-router-dom'; 

const UpdateUser = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
const navigate=useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setDepartmentId(user.department_id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch departments
  

    fetchUserData();
  }, [userId]); 
  useEffect(()=>{
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/department');
        setDepartments(response.data); 
      } catch (error) {
        console.error('Error fetching departments:', error);
      }

    };
    fetchDepartments();
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/users/${userId}`, {
        name,
        email,
        password,
        role,
        department_id: departmentId, 
      });
      navigate("/dashboard")
      setMessage(response.data.message); 
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
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button type="submit">Update User</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UpdateUser;
