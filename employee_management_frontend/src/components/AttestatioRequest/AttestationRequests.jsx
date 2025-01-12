import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosSetup';
import { useNavigate } from 'react-router-dom';

const AttestationRequests = () => {
    const [attestations, setAttestations] = useState([]);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false); // State to toggle historique display

    const navigate = useNavigate();

    // Fetch attestations
    useEffect(() => {
        const fetchAttestations = async () => {
            try {
                const resp = await axiosInstance.get('/attestations');
                // Filter out "Printed" attestations
                const filteredAttestations = resp.data.filter(attestation => attestation.status !== 'Approved');
                setAttestations(filteredAttestations);
            } catch (error) {
                console.error('Error fetching attestations', error);
            }
        };
        fetchAttestations();
    }, []);

    // Fetch historique
    const fetchHistorique = async () => {
        try {
            const resp = await axiosInstance.get('/attestations');
            setHistory(resp.data);
            setShowHistory(true); // Show historique after fetching
        } catch (error) {
            console.error('Error fetching historique', error);
        }
    };

    const handleDeleteAttestationSuccess = (deletedAttestationId) => {
        setAttestations(attestations.filter(attestation => attestation.id !== deletedAttestationId));
    };

    const handleDeleteAttestation = async (attestationId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this attestation request?');
        if (!isConfirmed) return;

        try {
            const response = await axiosInstance.delete(`/attestations/${attestationId}`);
            console.log(response.data.message);
            handleDeleteAttestationSuccess(attestationId);
        } catch (error) {
            console.error('Error deleting attestation:', error);
        }
    };

    const handleStatusChange = async (attestationId, newStatus) => {
        try {
            const response = await axiosInstance.put(`/attestations/${attestationId}`, { status: newStatus });
            alert(response.data.message || 'Status updated successfully.');
            setAttestations((prev) =>
                prev.map((attestation) =>
                    attestation.id === attestationId ? { ...attestation, status: newStatus } : attestation
                ).filter(attestation => attestation.status !== 'Approved')
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const printAttestation = (user) => {
        navigate('/print-attestation', { state: { user } });
    };

    return (
        <div>
            <h2>Attestation Requests</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attestations.map((attestation) => (
                        <tr key={attestation.id}>
                            <td>{attestation.user?.name || 'Unknown'}</td>
                            <td>{attestation.status}</td>
                            <td>
                                <button
                                    onClick={() => handleStatusChange(attestation.id, 'Approved')}
                                    style={{ marginRight: '10px' }}
                                >
                                    Approve
                                </button>
                              
                                <button
                                    onClick={() => handleDeleteAttestation(attestation.id)}
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => printAttestation(attestation.user)}
                                    style={{ backgroundColor: 'green', color: 'white' }}
                                >
                                    Print Attestation
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={fetchHistorique} style={{ marginTop: '20px' }}>
                {showHistory ? 'Reload Historique' : 'Show Historique'}
            </button>

            {showHistory && (
                <div>
                    <h2>Historique</h2>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.user?.name || 'Unknown'}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttestationRequests;