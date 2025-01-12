import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosSetup';

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attestation, setAttestation] = useState(null);

  // Fetching user and attestation status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Fetch attestation status once the user is set
      fetchAttestationStatus(userData.id);
    }
  }, []);

  // Fetch attestation status for the user
  const fetchAttestationStatus = async (userId) => {
    try {
      console.log('Fetching attestation status for user ID:', userId); // Debugging step
      const resp = await axiosInstance.get(`/attestations/user/${userId}`);
      console.log('Attestation response:', resp.data); // Debugging step
      if (resp.data) {
        setAttestation(resp.data);
      } else {
        setAttestation(null); // Reset attestation if no data found
      }
    } catch (error) {
      console.error('Error fetching attestation status', error);
      alert('Failed to fetch attestation status');
    }
  };

  // Attestation request
  const handleRequestAttestation = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const resp = await axiosInstance.post('/attestations', { user_id: user.id });
      alert(resp.data.message);

      // After submitting the request, fetch the updated attestation status
      fetchAttestationStatus(user.id);
    } catch (error) {
      console.error('Error requesting attestation', error);
      alert('Failed to submit attestation request, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const profilePictureUrl = user.profile_picture
    ? `http://localhost:8000/storage/${user.profile_picture}`
    : null;

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p><strong>Profile Picture:</strong> 
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt="Profile" style={{ width: '100px', height: '100px' }} />
          ) : (
            <p>No profile picture</p>
          )}
        </p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Job Title:</strong> {user.job_title}</p>
        <Link to={"/leaverequest"}>Leave Request</Link>
      </div>

      <div>
        {attestation ? (
          <div>
            <p><strong>Attestation Status:</strong> {attestation.status}</p>
            {attestation.status === 'Approved' && <p>Your attestation has been approved.</p>}
            {attestation.status === 'Pending' && <p>Your attestation request is pending.</p>}
          </div>
        ) : (
          <p>No attestation request found.</p>
        )}
      </div>

      <button onClick={handleRequestAttestation} disabled={loading}>
        {loading ? 'Requesting...' : 'Request Attestation'}
      </button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Profile;
