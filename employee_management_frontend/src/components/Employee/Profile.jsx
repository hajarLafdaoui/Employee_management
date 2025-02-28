import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../Config/axiosSetup';

const Profile = ({ onLogout }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage(t('please_fill_all_fields'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('passwords_do_not_match'));
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.put('/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccessMessage(t('password_updated_successfully'));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || t('password_update_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>{t('loading_profile')}</p>;
  }

  return (
    <div>
      <h1>{t('profile')}</h1>
      <p><strong>{t('name')}:</strong> {user.name}</p>
      <p><strong>{t('email')}:</strong> {user.email}</p>
      <p><strong>{t('username')}:</strong> {user.username}</p>

      <form onSubmit={handlePasswordChange}>
        <h2>{t('change_password')}</h2>
        <div>
          <label>{t('old_password')}</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('new_password')}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('confirm_new_password')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? t('loading') : t('change_password')}
        </button>
      </form>

      <button onClick={onLogout}>{t('logout')}</button>
    </div>
  );
};

export default Profile;
