// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";

const SignIn = () => {
  const [email, setEmail] = useState("alicejohnson@example.com");
  const [password, setPassword] = useState("aliceSecure789");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { user, token } = response.data;

      // Save user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update `is_active` status
      await axiosInstance.put(`/users/${user.id}/status`, { is_active: 1 });

      // Redirect based on role
      if (user.role === "employee") {
        localStorage.setItem("employeeUser", JSON.stringify(user));
        navigate("/Employee_dashboard");
      } else if (user.role === "admin") {
        localStorage.setItem("adminUser", JSON.stringify(user));
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("Invalid login credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default SignIn;
