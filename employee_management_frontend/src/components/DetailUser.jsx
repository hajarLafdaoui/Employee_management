import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from './Config/axiosSetup';
import LoadingSpinner from '../LoadingSpinner';
import { FaUserEdit, FaHome, FaSuitcase, FaFileInvoice, FaGift, FaCog } from 'react-icons/fa';
import './DetailUser.scss';

const DetailUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Error fetching user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
      <div className="main-content">
        <div className="employee-card">
          <h2>Employee Details</h2>
          {user && (
            <div className="employee-details">
              <div className="profile-section">
                <img 
                  src={user.profile_picture ? `http://localhost:8000/storage/${user.profile_picture}` : 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="profile-img"
                />
                <h3>{user.name}</h3>
                <span className="position">{user.job_id || 'N/A'}</span>
                <span className="department">{user.department?.name || 'N/A'}</span>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
<div className="sidebarright">
              <div className="info">
                <div className="data-grid">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Country:</strong> {user.country}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Active:</strong> <span className={user.is_active ? "active" : "inactive"}>{user.is_active ? 'Yes' : 'No'}</span></p>
                </div>

                <div className="contact-info">
                  <p><strong>Contact:</strong></p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                </div>
                </div>
                <div className="buttons">
                  <Link to={`/update-user/${user.id}`} className="btn update">
                    <FaUserEdit /> Update
                  </Link>
                  <Link to="/EmployeeList" className="btn back">Back to List</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default DetailUser;
