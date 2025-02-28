import React from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the current user's data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("employeeUser"); // If you're storing specific user info
    localStorage.removeItem("adminUser"); // If you're storing admin user info
    
    // Redirect to the login page after logging out
    navigate("/SignIn");
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SignOut;
