import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useTranslation } from 'react-i18next';
import "./AtesstationPage.scss";
import LoadingSpinner from '../../LoadingSpinner';
import ErrorAlert from "../Alerts/ErrorAlert";
import SuccessAlert from "../Alerts/SuccessAlert";
import Confirmation from "../Confirmation";

const AttestationPage = () => {
  const { t } = useTranslation();
  const [attestation, setAttestation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchAttestationStatus(user.id);
    }
  }, []);

  const fetchAttestationStatus = async (userId) => {
    setLoading(true); 
    try {
      const resp = await axiosInstance.get(`/attestations/user/${userId}`);

      if (resp.data && resp.data.length > 0) {
        setAttestation(resp.data);
      } else {
        setAttestation([]);
      }
    } catch (error) {
      console.error('Error fetching attestation status', error.message);
      setError(t('failed_to_fetch'));
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
      setAttestation([]);
    } finally {
      setLoading(false);  
    }
  };

  const handleRequestAttestation = async (e) => {
    if (e) {
      e.preventDefault();  
    }

    if (!user) return;
    setLoading(true);

    try {
      const resp = await axiosInstance.post('/attestations', { user_id: user.id });
      setSuccessMessage(resp.data.message);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
      fetchAttestationStatus(user.id);
    } catch (error) {
      console.error('Error requesting attestation', error);
      setError(t('failed_to_submit'));
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationRequest = () => {
    setShowConfirmationDialog(true);
  };

  const confirmAttestationRequest = async () => {
    setShowConfirmationDialog(false);
    handleRequestAttestation();  
  };

  const cancelAttestationRequest = () => {
    setShowConfirmationDialog(false);
  };

  return (
    <div className="salaryform">
      {showErrorAlert && (
        <ErrorAlert message={error} onClose={() => setShowErrorAlert(false)} />
      )}

      {showSuccessAlert && (
        <SuccessAlert message={successMessage} onClose={() => setShowSuccessAlert(false)} />
      )}

      <h1>{t('attestation_requests')}</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {attestation.length > 0 ? (
            <div>
              <p className='attestitle'>{t('last_attestation_requests')}</p>
              <table>
                <thead>
                  <tr>
                    <th>{t('status')}</th>
                    <th>{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {attestation.map((att, index) => (
                    <tr key={index}>
                      <td>{t(`status_values.${att.status}`)}</td>
                      <td>{new Date(att.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{t('no_attestation_found')}</p>
          )}
        </div>
      )}

      <button
        className='btnattestation'
        onClick={handleConfirmationRequest}
        disabled={loading}
      >
        {loading ? t('requesting') : t('request_attestation')}
      </button>

      <Confirmation
        showConfirmPopUp={showConfirmationDialog}
        setShowConfirmPopUp={setShowConfirmationDialog}
        handleConfirm={confirmAttestationRequest}
        handleCancel={cancelAttestationRequest}
        itemType="attestation"
      />
    </div>
  );
};

export default AttestationPage;
