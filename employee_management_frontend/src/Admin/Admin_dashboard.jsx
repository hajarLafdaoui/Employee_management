import React from 'react'
import AdminMenu from '../components/Admin_navbar/AdminMenu'
import { Navigate } from 'react-router-dom';

const Admin_dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
  
    if (!user || user.role !== 'admin' || !token) {
      Navigate('/signin');
    }
  return (
    <div>
      
      <AdminMenu user={user} />

    </div>
  )
}

export default Admin_dashboard
