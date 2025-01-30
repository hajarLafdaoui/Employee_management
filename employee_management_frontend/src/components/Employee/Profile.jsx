import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = ({ onLogout }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <p>{t('loading_profile')}</p>;
  }

  const profilePictureUrl = user.profile_picture
    ? `http://localhost:8000/storage/${user.profile_picture}`
    : null;

  return (
    <div>
      <h1>{t('profile')}</h1>
      <div>
        <p>
          <strong>{t('profile_picture')}:</strong>
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt="Profile"
              style={{ width: '100px', height: '100px' }}
            />
          ) : (
            <p>{t('no_profile_picture')}</p>
          )}
        </p>
        <p><strong>{t('name')}:</strong> {user.name}</p>
        <p><strong>{t('email')}:</strong> {user.email}</p>
        <p><strong>{t('username')}:</strong> {user.username}</p>
        <p><strong>{t('phone')}:</strong> {user.phone}</p>
        <p><strong>{t('job_title')}:</strong> {user.job_title}</p>
        <Link to="/leaverequest">{t('leave_request')}</Link>
        <Link to="/attestations">{t('attestation_request')}</Link>
      </div>
      <button onClick={onLogout}>{t('logout')}</button>
    </div>
  );
};

export default Profile;
