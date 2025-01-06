import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';

const Profile = ({onLogout}) => {
  const [user, setUser] = useState(null);
const [loading,setLoading]=useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user:', storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);



  //Demande Attestation de travail
  const handeleRequestAttestation=async(e)=>{
    e.preventDefault()
    if (!user)return;
    console.log("Sending user_id:", user.id)
setLoading(true);
try {
  const resp = await axiosInstance.post('/attestations', { user_id: user.id });
  alert(resp.data.message);
}catch(error){
  console.error('Error requesting attestation',error);
  alert('Failed to submit attestation request , plyse try again')

}finally{
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
     
      </div>
      <button onClick={handeleRequestAttestation} disabled={loading}>{loading?'Requesting...':'Request Attestation'}</button>
      <button onClick={onLogout}>Logout</button>

    </div>
  );
}

export default Profile;
