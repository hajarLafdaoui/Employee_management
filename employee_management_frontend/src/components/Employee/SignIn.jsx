import React, { useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import "./SignIn.scss";

const SignIn = () => {
  const [email, setEmail] = useState('jane.smith@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle login
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

      if (user.role === "employee") {
        localStorage.setItem("employeeUser", JSON.stringify(user));
        navigate("/Employee_dashboard");
      } else if (user.role === "admin") {
        localStorage.setItem("adminUser", JSON.stringify(user));
        navigate("/");
      }
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
      {/* <img src="/logo/logo.png" alt="Logo" className="logo"/> */}

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
                <span className="toggle-password" onClick={togglePassword}>👁️</span>
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
    </div>
  );
};

export default SignIn;
