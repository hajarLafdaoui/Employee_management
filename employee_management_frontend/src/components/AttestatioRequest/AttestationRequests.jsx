import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';

const AttestationRequests = () => {
    const [attestations, setAttestations] = useState([]);
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();

    // Fetch attestations
    useEffect(() => {
        const fetchAttestations = async () => {
            try {
                const resp = await axiosInstance.get('/attestations');
                const filteredAttestations = resp.data.filter(attestation => attestation.status !== 'Approved');
                setAttestations(filteredAttestations);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching attestations', error);
                setLoading(false);

            }
        };
        fetchAttestations();
    }, []);

 

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
    if (loading) return <LoadingSpinner/>;

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

          

        </div>
    );
};

export default AttestationRequests;
