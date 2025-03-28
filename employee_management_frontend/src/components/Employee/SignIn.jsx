import React, { useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import "./SignIn.scss";
import SuccessAlert from '../Alerts/SuccessAlert'; 

const SignIn = () => {
  const [email, setEmail] = useState('Olivia@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Making login request with:", { email, password });

      const response = await axiosInstance.post("/login", { email, password });
      console.log("Login response:", response); 

      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error("No user or token found in the response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await axiosInstance.put(`/users/${user.id}/status`, { is_active: 1 });

      setShowSuccessAlert(true);

      setTimeout(() => {
        if (user.role === "employee") {
          localStorage.setItem("employeeUser", JSON.stringify(user));
          navigate("/Employee_dashboard");
        } else if (user.role === "admin") {
          localStorage.setItem("adminUser", JSON.stringify(user));
          navigate("/");
        }
      }, 2000); 

    } catch (error) {
      setError("Invalid login credentials.");
      console.error("Login error:", error);
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
            <h2 className="title">Welcome to our site</h2>

            {/* Email input */}
            <div className="form-group">
              <label className="label" htmlFor="email">Email:</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onFocus={handleFocus}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password input */}
            <div className="form-group">
              <label className="label" htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  id="password"
                  className="input"
                  onFocus={handleFocus}
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="toggle-password" onClick={togglePassword}>
                  <img src="/icons/view.png" className='view-icon' alt="" />
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && <div className="error-popup">{error}</div>}

            {/* Login button */}
            <button type="submit" className="submit-btn">Login</button>
          </form>
        </div>

        <div className="image-section">
          <div className="overlay-content">
            <p>Employee information</p>
            <span>24h ------ 24h</span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          message="Login successful! Redirecting..."
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default SignIn;