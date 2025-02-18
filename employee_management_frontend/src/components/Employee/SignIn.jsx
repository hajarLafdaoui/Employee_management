import React, { useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import "./SignIn.scss"
const SignIn = () => {
  const [email, setEmail] = useState('jane.smith@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {

      const response = await axiosInstance.post('/login', { email, password });
      console.log('Response:', response);



      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.user && response.data.user.role) {

          const role = response.data.user.role;
          if (role === 'employee') {
            navigate('/Employee_dashboard');
          } else if (role === 'admin') {
            navigate('/');
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


  const handleFocus = () => {
    setError('');
  };


  return (
    <div className="all">
    <div className="signin-container">
      <div className="form-section">
      <form className="form-details" onSubmit={handleLogin}>
      <h2 className='title'>welcom to our site</h2>

      <div className="form-group">
  <label className='label' htmlFor="email">Email:</label>
  <input id="email" className='input' type="email" value={email}  onFocus={handleFocus} onChange={(e) => setEmail(e.target.value)}  />
</div>

<div className="form-group">
  <label className='label' htmlFor="password">Password:</label>
  <div class="password-container">

  <input id="password" className='input' onFocus={handleFocus} type={passwordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
  <span class="toggle-password" onClick={togglePassword}>👁️</span>
</div>
</div>

{error && <div className="error-popup">{error}</div>}
<button type="submit"  className="submit-btn">Login</button>
      </form>
      </div>
      <div className="image-section">
        <div className="overlay-content">
          <p>employees information</p>
          <span>24h ------ 24h</span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
