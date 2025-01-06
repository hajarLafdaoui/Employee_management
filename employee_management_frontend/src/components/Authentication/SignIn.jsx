import React, { useState } from 'react';
import axiosInstance from '../axiosSetup';
import { useNavigate } from 'react-router-dom';


const SignIn = () => {
  const [email, setEmail] = useState('alice.johnson@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const response = await axiosInstance.post('/login', { email, password });
      console.log('Response:', response); // Log the entire response to check its structure

      // onLogin(); // Update the authentication state


      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
        // Check if 'user' object is in the response and contains 'role'
        if (response.data.user && response.data.user.role) {

          const role = response.data.user.role; // Get role from the 'user' object

          // Redirect based on the role
          if (role === 'employee') {
            navigate('/profile');
          } else if (role === 'admin') {
            navigate('/dashboard');
          } else {
            setError('Unknown role');
          }
        } else {
          setError('User or role not found in response');
        }
      } else {
        setError('No token received');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid credentials or network issue');
    }
  };





  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;
