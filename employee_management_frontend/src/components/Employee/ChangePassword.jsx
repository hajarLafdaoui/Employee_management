import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../Config/axiosSetup';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorAlert from "../Alerts/ErrorAlert";
import SuccessAlert from "../Alerts/SuccessAlert"; 
import Confirmation from "../Confirmation"; 

const ChangePassword = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage(t('please_fill_all_fields'));
      setShowErrorAlert(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('passwords_do_not_match'));
      setShowErrorAlert(true);
      return;
    }

    setShowConfirmationDialog(true);
  };

  const confirmPasswordChange = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccessMessage(t('password_updated_successfully'));
      setShowSuccessAlert(true);
      setShowConfirmationDialog(false);
      setErrorMessage('');
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setErrorMessage(error.response?.data?.message || t('password_update_failed'));
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowConfirmationDialog(false);
  };

  return (
    <div className="salaryform">
      <div className="form-container">
        <h2>{t('change_password')}</h2>

        {showErrorAlert && <ErrorAlert message={errorMessage} onClose={() => setShowErrorAlert(false)} />}
        {showSuccessAlert && <SuccessAlert message={successMessage} onClose={() => setShowSuccessAlert(false)} />}

        <form className="form form-vertical">
          <div className="inputs inputs-vertical">
            <div className="input-group">
              <input
                placeholder=" "
                required
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input input-vertical"
              />
              <label className="user-label">{t('old_password')}</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                required
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-vertical"
              />
              <label className="user-label">{t('new_password')}</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                required
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-vertical"
              />
              <label className="user-label">{t('confirm_new_password')}</label>
            </div>
          </div>

          <button
            className="button-form vertical-button-form"
            type="button"
            disabled={loading}
            onClick={handlePasswordChange}
          >
            {loading ? t('loading') : t('change_password')}
          </button>
        </form>
      </div>

      <Confirmation
        showConfirmPopUp={showConfirmationDialog}
        setShowConfirmPopUp={setShowConfirmationDialog}
        handleConfirm={confirmPasswordChange}
        handleCancel={cancelPasswordChange}
        itemType={t('password')}
      />
    </div>
  );
};

export default ChangePassword;
