import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useTranslation } from 'react-i18next';

const AttestationPage = () => {
  const { t } = useTranslation();
  const [attestation, setAttestation] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchAttestationStatus(user.id);
    }
  }, []);

  const fetchAttestationStatus = async (userId) => {
    try {
      const resp = await axiosInstance.get(`/attestations/user/${userId}`);

      if (resp.data && resp.data.length > 0) {
        setAttestation(resp.data);
      } else {
        setAttestation([]);
      }
    } catch (error) {
      console.error('Error fetching attestation status', error.message);
      alert(t('failed_to_fetch'));
      setAttestation([]);
    }
  };

  const handleRequestAttestation = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const resp = await axiosInstance.post('/attestations', { user_id: user.id });
      alert(resp.data.message);

      fetchAttestationStatus(user.id);
    } catch (error) {
      console.error('Error requesting attestation', error);
      alert(t('failed_to_submit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{t('attestation_requests')}</h1>
      <div>
        {attestation.length > 0 ? (
          <div>
            <h3>{t('last_attestation_requests')}</h3>
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
      <button onClick={handleRequestAttestation} disabled={loading}>
        {loading ? t('requesting') : t('request_attestation')}
      </button>
    </div>
  );
};

export default AttestationPage;
