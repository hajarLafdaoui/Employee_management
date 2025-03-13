import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorAlert from "../Alerts/ErrorAlert"; 
import "../EmployeeList.scss"
import "../salary/SalaryList.scss"
const AttestationRequests = () => {
    const [attestations, setAttestations] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(4); 
  const [activeMenu, setActiveMenu] = useState(null);

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
            setError('Error deleting attestation');
            setShowErrorAlert(true);
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



    const toggleMenu = (salaryId) => {
        setActiveMenu((prevMenu) => (prevMenu === salaryId ? null : salaryId));
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

            <h2>Attestation Requests</h2>


            {attestations.length === 0 ? (
                <p className="no-salaries-message">No attestations Requests data available.</p>  
            ) : (
            <div className="table-wrapper">
            <div className="table-header">
                       <div>photo</div>

                        <div>User</div>
                        <div>Status</div>
                        <div>Actions</div>
                   
                </div>
               
                    {getPaginatedAttestations().map((attestation) => (
              <div key={attestation.id} className="table-row">
                       <div> <img src="img/images.jpg" alt="#"className="userprofile" /></div>
                            <div>{attestation.user?.name || 'Unknown'}</div>
                            <div>{attestation.status}</div>
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
                              <img src="icons/mark.png" alt=""  className="view-icon"/><p>  Approve</p>

                                  
                                </div>
                                <div
                                    onClick={() => handleDeleteAttestation(attestation.id)}
                                    className="viewlink"    >
                             <img src="icons/remove.png" alt=""  className="view-icon"/><p>Delete</p>

                                    
                                </div>
                                <div
                                    onClick={() => printAttestation(attestation.user)}
                                    className="viewlink"                                >
                               <img className="view-icon" src="/icons/print1.png" alt="" /><p>print</p> 
 
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
                        <img src="icons/left-arrow.png" alt="left" />
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
        </div>
    );
};

export default AttestationRequests;
