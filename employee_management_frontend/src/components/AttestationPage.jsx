
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosSetup';

const AttestationPage = () => {
  const [attestation, setAttestation] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const user = JSON.parse(localStorage.getItem('user')); 

  // Fetching last 3 attestation requests
  useEffect(() => {
    if (user) {
        fetchAttestationStatus(user.id);
      }
  }, []); 

 
  const fetchAttestationStatus = async (userId) => {
    try {
      const resp = await axiosInstance.get(`/attestations/user/${userId}`);
      // console.log('Attestation response:', resp.data);
  
      if (resp.data && resp.data.length > 0) {
        setAttestation(resp.data); 
      } else {
        setAttestation([]);
      }
    } catch (error) {
      console.error('Error fetching attestation status',  error.message);
      alert('Failed to fetch attestation status');
      setAttestation([]);

    }
  };
  
  
  // Attestation request
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
      alert('Failed to submit attestation request, please try again');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Attestation Requests</h1>
      <div>
        {attestation ? (
          <div>
            <h3>Last Attestation Requests</h3>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attestation.map((att, index) => (
                  <tr key={index}>
                    <td>{att.status}</td>
                    <td>{new Date(att.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attestation request found.</p>
        )}
      </div>
      <button onClick={handleRequestAttestation} disabled={loading}>
          {loading ? 'Requesting...' : 'Request Attestation'}
        </button>
    </div>
  );
};

export default AttestationPage;
