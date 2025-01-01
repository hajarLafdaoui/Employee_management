import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from './axiosSetup';

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

  return (
    <div>
      <h2>User Details</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
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
