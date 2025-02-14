import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';
import { useNavigate, useParams, Link } from 'react-router-dom';

const UpdateUser = () => {
  const { id } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    phone: '',
    username: '',
    department_id: '',
    base_salary: '', // Add base_salary to the state
  });
  const [departments, setDepartments] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setMessage('Error fetching user details.');
      }
    };

    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    fetchDepartments();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    console.log([...formData.entries()]);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
        const response = await axiosInstance.put(`/users/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response);
      setMessage('User updated successfully!');
      navigate('/crud');
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
          name="name"
          placeholder="Name"
          value={userData.name || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (leave blank to keep current)"
          value={userData.password || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={userData.phone || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="base_salary"
          placeholder="Base Salary"
          value={userData.base_salary || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        />
        <input
          type="file"
          onChange={handleProfilePictureChange}
        />
        <select
          name="role"
          value={userData.role || 'employee'} // Default to 'employee' if undefined
          onChange={handleInputChange}
        >
          <option value="employee">Employee</option>
          <option value="sub-admin">Sub-Admin</option>
        </select>
        <select
          name="department_id"
          value={userData.department_id || ''} // Default to empty string if undefined
          onChange={handleInputChange}
        >
          <option value="">Select Department</option>
          {isLoading ? (
            <option disabled>Loading...</option>
          ) : (
            departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))
          )}
        </select>
        <button type="submit">Update User</button>
      </form>
      <p>{message}</p>

      <Link to="/crud">
        <button style={{ backgroundColor: 'gray', color: 'white' }}>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default UpdateUser;
