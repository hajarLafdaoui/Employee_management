import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  
import axiosInstance from './axiosSetup';

const Dashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
const [attestations, setAttestations]=useState([])
  

useEffect(() => {

  //fetch users

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    //fetch Attestations
    const fetchAttestations=async()=>{
      try{
        const resp=await axiosInstance.get('/attestations')
        setAttestations(resp.data);

      }catch(error){
        console.error('error fetching attestations',error);

      }
    }
fetchAttestations()
    fetchUsers();
  }, []);

  const handleDeleteSuccess = (deletedUserId) => {
    setUsers(users.filter(user => user.id !== deletedUserId)); 
  };

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?'); 
    if (!isConfirmed) {
      return; 
    }

    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      console.log(response.data.message); 
      handleDeleteSuccess(userId); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  //delete  demande d'attestations

  const handleDeleteAttestationSuccess = (deletedAttestationId) => {
    setAttestations(attestations.filter(attestation => attestation.id !== deletedAttestationId));
  };

  const handleDeleteAttestation = async (attestationId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this attestation request?');
    if (!isConfirmed) return;


    try {
      const response = await axiosInstance.delete(`/attestations/${attestationId}`);
      console.log(response.data.message);
      handleDeleteAttestationSuccess(attestationId);
    } catch (error) {
      console.error('Error deleting attestation:', error);
    }
  };


  const handleStatusChange = async (attestationId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/attestations/${attestationId}`, { status: newStatus });
      alert(response.data.message || 'Status updated successfully.');
      setAttestations((prev) =>
        prev.map((attestation) =>
          attestation.id === attestationId ? { ...attestation, status: newStatus } : attestation
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };
  return (
    <div>
      <h2>User List</h2>

      <Link to="/create-user">
        <button style={{ backgroundColor: 'green', color: 'white' }}>
          Create User
        </button>
      </Link>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Profile Picture</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const profilePictureUrl = user.profile_picture
              ? `http://localhost:8000/storage/${user.profile_picture}` 
              : null;

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td>
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt="Profile" style={{ width: '100px', height: '100px' }} />
                  ) : (
                    <p>No profile picture</p>
                  )}
                </td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/user-details/${user.id}`}>
                    <button style={{ backgroundColor: 'purple', color: 'white', marginRight: '10px' }}>
                      View Details
                    </button>
                  </Link>
                  <Link to={`/update-user/${user.id}`}>
                    <button style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px' }}>
                      Update
                    </button>
                  </Link>

                  <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ backgroundColor: 'red', color: 'white' }}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={onLogout}>Logout</button>

      <h2>Attestation Requests</h2>
      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attestations.map((attestation) => (
            <tr key={attestation.id}>
              <td>{attestation.user?.name || 'Unknown'}</td>
              <td>{attestation.status}</td>
              <td>
                <button
                  onClick={() => handleStatusChange(attestation.id, 'Approved')}
                  disabled={attestation.status === 'Approved'}
                  style={{ marginRight: '10px' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(attestation.id, 'Printed')}
                  disabled={attestation.status === 'Printed'}
                  style={{ marginRight: '10px' }}
                >
                  Print
                </button>
                <button
                  onClick={() => handleDeleteAttestation(attestation.id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onLogout}>Logout</button>
    </div>


   
  );
};

export default Dashboard;
