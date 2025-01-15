import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from './Config/axiosSetup';

const DetailUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError('Error fetching user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const profilePictureUrl = user.profile_picture
    ? `http://localhost:8000/storage/${user.profile_picture}`
    : null;
  return (
    <div>
      <h2>User Details</h2>
      {user ? (
        <div>
          {user.profile_picture && (
            <p><strong>Profile Picture:</strong>
              {profilePictureUrl ? (
                <img src={profilePictureUrl} alt="Profile" style={{ width: '100px', height: '100px' }} />
              ) : (
                <p>No profile picture</p>
              )}
            </p>
          )}
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p> {/* Add Username */}
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p> {/* Add Phone */}

          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Department:</strong> {user.department?.name || 'N/A'}</p>

          <Link to={`/update-user/${user.id}`}>
            <button style={{ backgroundColor: 'blue', color: 'white', marginRight: '10px' }}>
              Update
            </button>
          </Link>

          <Link to="/dashboard">
            <button style={{ backgroundColor: 'gray', color: 'white' }}>
              Back to Dashboard
            </button>
          </Link>
        </div>
      ) : (
        <p>No user details found</p>
      )}
    </div>
  );
};

export default DetailUser;
