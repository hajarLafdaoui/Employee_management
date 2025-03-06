import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../Config/axiosSetup';

const ChangePassword = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <h2>{t('change_password')}</h2>
      <form onSubmit={handlePasswordChange}>
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
    </div>
  );
};

export default ChangePassword;
