import React, { useState } from 'react';
import axiosInstance from '../axiosSetup';
import { useNavigate } from 'react-router-dom';


const SignIn = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const response = await axiosInstance.post('/login', { email, password });
      console.log('Response:', response); 



      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.user && response.data.user.role) {

          const role = response.data.user.role; 
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
