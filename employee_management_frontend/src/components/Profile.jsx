import React, { useEffect, useState } from 'react';

const Profile = () => {
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

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Job Title:</strong> {user.job_title}</p>
        <p><strong>Company:</strong> {user.company}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Last Login:</strong> {new Date(user.last_login).toLocaleString()}</p>
        <p><strong>Profile Picture:</strong> <img src={user.profile_picture} alt="Profile" style={{ width: '100px', height: '100px' }} /></p>
      </div>
    </div>
  );
}

export default Profile;
