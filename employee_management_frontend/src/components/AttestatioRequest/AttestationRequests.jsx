import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorAlert from "../Alerts/ErrorAlert";
import SuccessAlert from "../Alerts/SuccessAlert"; 
import "../EmployeeList.scss"
import "../salary/SalaryList.scss"
import DeleteModal from "../Cnfirm/DeleteModal";
import Confirmation from "../Confirmation"; 

const AttestationRequests = () => {
    const [attestations, setAttestations] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null); 
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);  
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4); 
    const [activeMenu, setActiveMenu] = useState(null);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [selectedAttestationId, setSelectedAttestationId] = useState(null);

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false); 
    const [attestationToChangeStatus, setAttestationToChangeStatus] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttestations = async () => {
            try {
                const resp = await axiosInstance.get('/attestations');
                const filteredAttestations = resp.data.filter(attestation => attestation.status !== 'Approved');
                setAttestations(filteredAttestations);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attestations', error);
                setError('Error fetching attestations');
                setLoading(false);
                setShowErrorAlert(true);
                setTimeout(() => {
                    setShowErrorAlert(false);
                }, 5000); 
            }
        };
        fetchAttestations();
    }, []);

    const handleDeleteAttestationSuccess = (deletedAttestationId) => {
        setAttestations(attestations.filter(attestation => attestation.id !== deletedAttestationId));
        setSuccessMessage('Attestation deleted successfully!');
        setShowSuccessAlert(true);  
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 5000); 
    };

    const handleDeleteAttestation = async (attestationId) => {
        try {
            const response = await axiosInstance.delete(`/attestations/${attestationId}`);
            console.log(response.data.message);
            handleDeleteAttestationSuccess(attestationId);
            setShowDeletePopUp(false); 
        } catch (error) {
            console.error('Error deleting attestation:', error);
            setError('Error deleting attestation');
            setShowErrorAlert(true);
            setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000); 
            setShowDeletePopUp(false); 
        }
    };

    const handleStatusChange = (attestationId, newStatus) => {
        setAttestationToChangeStatus({ id: attestationId, newStatus });
        setShowConfirmationDialog(true); 
    };

    const confirmStatusChange = async () => {
        if (!attestationToChangeStatus) return;
        const { id, newStatus } = attestationToChangeStatus;

        try {
            const response = await axiosInstance.put(`/attestations/${id}`, { status: newStatus });
            setAttestations((prev) =>
                prev.map((attestation) =>
                    attestation.id === id ? { ...attestation, status: newStatus } : attestation
                ).filter(attestation => attestation.status !== 'Approved')
            );
            setSuccessMessage('Status updated successfully!');
            setShowSuccessAlert(true);  
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000); 
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status');
            setShowErrorAlert(true);
            setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000); 
        }

        setShowConfirmationDialog(false); 
    };

    const cancelStatusChange = () => {
        setShowConfirmationDialog(false);
    };

    const printAttestation = (user) => {
        navigate('/print-attestation', { state: { user } });
    };

    const getPaginatedAttestations = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return attestations.slice(startIndex, endIndex);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(attestations.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleMenu = (attestationId) => {
        setActiveMenu((prevMenu) => (prevMenu === attestationId ? null : attestationId));
    };

    const openDeleteModal = (attestationId) => {
        setSelectedAttestationId(attestationId);
        setShowDeletePopUp(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            {showErrorAlert && (
                <ErrorAlert 
                    message={error} 
                    onClose={() => setShowErrorAlert(false)} 
                />
            )}

            {showSuccessAlert && (
                <SuccessAlert 
                    message={successMessage} 
                    onClose={() => setShowSuccessAlert(false)} 
                />
            )}

            <h4>Attestation Requests</h4>

            {attestations.length === 0 ? (
                <p className="no-salaries-message">No attestations Requests data available.</p>  
            ) : (
                <div className="table-wrapper">
                    <div className="table-header">
                        <div>photo</div>
                        <div>User</div>
                        <div>Status</div>
                        <div>date</div>
                        <div>Actions</div>
                    </div>

                    {getPaginatedAttestations().map((attestation) => (
                        <div key={attestation.id} className="table-row">
                            <div> 
                                <img src={`http://localhost:8000/storage/${attestation.user.profile_picture}`} alt="#" className="userprofile" />
                            </div>
                            <div>{attestation.user?.name || 'Unknown'}</div>
                            <div>{attestation.status}</div>
                            <div>
                                {new Date(attestation.created_at).toLocaleString('en-MA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false, 
                                })}
                            </div>
                            <div className="actions">
                                <button
                                    className="button action-button"
                                    onClick={() => toggleMenu(attestation.id)}
                                >
                                    &#x22EE;
                                </button>

                                {activeMenu === attestation.id && (
                                    <div className="dropdown-menu">
                                        <div
                                            onClick={() => handleStatusChange(attestation.id, 'Approved')}
                                            className="viewlink"
                                        >
                                            <img src="icons/mark.png" alt="" className="view-icon" />
                                            <p>Approve</p>
                                        </div>
                                        <div
                                            onClick={() => openDeleteModal(attestation.id)} 
                                            className="viewlink"
                                        >
                                            <img src="icons/remove.png" alt="" className="view-icon" />
                                            <p>Delete</p>
                                        </div>
                                        <div
                                            onClick={() => printAttestation(attestation.user)}
                                            className="viewlink"
                                        >
                                            <img className="view-icon" src="/icons/print1.png" alt="" />
                                            <p>Print</p> 
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="page">
                <li
                    className="page__btn"
                    onClick={prevPage}
                    style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                >
                    <span className="material-icons">
                        <img src="icons/left-arrow.png" alt="left" className="left" />
                    </span>
                </li>
                {[...Array(Math.ceil(attestations.length / rowsPerPage)).keys()].map((index) => (
                    <li
                        key={index + 1}
                        className={`page__numbers ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </li>
                ))}
                <li
                    className="page__btn"
                    onClick={nextPage}
                    style={{
                        pointerEvents: currentPage === Math.ceil(attestations.length / rowsPerPage) ? 'none' : 'auto',
                    }}
                >
                    <span className="material-icons">
                        <img src="icons/right-arrow.png" alt="right" />
                    </span>
                </li>
            </div>

            <DeleteModal
                showDeletePopUp={showDeletePopUp}
                setShowDeletePopUp={setShowDeletePopUp}
                handleDelete={() => handleDeleteAttestation(selectedAttestationId)} 
                itemType="Attestation Request"
            />

            <Confirmation
                showConfirmPopUp={showConfirmationDialog}
                setShowConfirmPopUp={setShowConfirmationDialog}
                handleConfirm={confirmStatusChange}
                itemType="attestation"
            />
        </div>
    );
};

export default AttestationRequests;
