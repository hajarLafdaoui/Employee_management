import React, { useEffect, useState } from 'react';

const Profile = ({onLogout}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      <button onClick={onLogout}>Logout</button>

    </div>
  );
}

export default Profile;
