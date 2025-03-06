import React, { useState, useEffect } from 'react';
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

  return (
    <div>
      <h1>{t('profile')}</h1>
      <p><strong>{t('name')}:</strong> {user.name}</p>
      <p><strong>{t('email')}:</strong> {user.email}</p>
      <p><strong>{t('username')}:</strong> {user.username}</p>


    </div>
  );
};

export default Profile;
