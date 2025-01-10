import React from 'react';
import AdminMenu from '../Admin_navbar/AdminMenu';
import { Navigate } from 'react-router-dom';

const Admin_dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Check if user is authenticated and has admin role
  if (!user || user.role !== 'admin' || !token) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <AdminMenu user={user} />
      {/* <h1>Welcome, Admin!</h1> */}
    </div>
  );
};

export default Admin_dashboard;
