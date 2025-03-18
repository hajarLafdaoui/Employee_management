import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from './Config/axiosSetup';
import LoadingSpinner from '../LoadingSpinner';
import { FaUserEdit, FaHome, FaSuitcase, FaFileInvoice, FaGift, FaCog } from 'react-icons/fa';
import './DetailUser.scss';

const DetailUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data);
        console.log(user)
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
              <div className='backimg'>
                <img src="/img/images3.jpg" alt="" className="imgdetail" />
              </div>
              <div className='head1'>
                <div className='infohead'>
              <img 
                src={user.profile_picture ? `http://localhost:8000/storage/${user.profile_picture}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="profile-img"
              />
                            <h3>{user.name}</h3>
                            <p className='jobtitle'>{user.job.name || 'N/A'}</p>
                            </div>

              <img
                className="imgedit"
                src="/icons/edit2.png"
                alt="Edit"
                onClick={() => navigate(`/update-user/${user.id}`)}
              />
              </div>
              <div className='infoside'>
              <div className='groupinfo'><p>ID</p> <span>{user.id}</span></div>
              <span className="groupinfo">{user.department?.name || 'N/A'}</span>

              <div className='groupinfo'><p>Create at</p> <span>{user.id}</span></div>
              <div className='groupinfo'><p>User Name</p> <span>{user.username}</span></div>

            </div>
            </div>
            <div className="sidebarright">
              <div className="info">

   



                <div className="data-grid">
                <p>information personnelle</p>          
<p></p>
                <div className='groupinfo'>
  <p>name</p>
  <span>{user.name}</span>
</div>
      <div className='groupinfo'>
  <p>Email</p>
  <span>{user.email}</span>
</div>
<div className='groupinfo'>
  <p>Phone</p>
  <span>{user.phone}</span>
</div>
<div className='groupinfo'>
  <p>Gender</p>
  <span>{user.gender}</span>
</div>
<div className='groupinfo'>
  <p>Country</p>
  <span>{user.country} </span>
</div>
<div className='groupinfo'>
  <p>Job</p>
  <span>{user.job.name || 'N/A'} </span>
</div><div className='groupinfo'>
  <p>BaseSAlary</p>
  <span>{user.job.salary || 'N/A'} </span>
</div>
<div className='groupinfo'>
  <p>Role</p>
  <span>{user.role}</span>
</div>
<div className='groupinfo'>
  <p>Active</p>
  <span className={user.is_active ? "active" : "inactive"}>
    {user.is_active ? 'Yes' : 'No'}
  </span>

                </div>
                </div>
                <div className="contact-info">
                <div>
  <p>Contact:</p>
  <div className='groupinfo'>
    <p>Email</p>
    <span>{user.email}</span>
  </div>
  <div className='groupinfo'>
    <p>Phone</p>
    <span>{user.phone}</span>
  </div>
</div>
                </div>
              </div>
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailUser;