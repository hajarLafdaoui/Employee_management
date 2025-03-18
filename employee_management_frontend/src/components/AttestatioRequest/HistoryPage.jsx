import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import LoadingSpinner from '../../LoadingSpinner';
import ErrorAlert from "../Alerts/ErrorAlert";
import "../EmployeeList.scss"
import "../salary/SalaryList.scss"

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const rowsPerPage = 4;

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const resp = await axiosInstance.get('/attestations');
                const filteredAttestations = resp.data.filter(attestation => attestation.status !== 'Pending');

                setHistory(filteredAttestations);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching historique', error);
                setError("Error fetching historique")
                setLoading(false);
                setShowErrorAlert(true);
                setTimeout(() => {
                  setShowErrorAlert(true);
                }, 5000);
            }
        };
        fetchHistorique();
    }, []);

    const getPaginatedHistory = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return history.slice(startIndex, endIndex);
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

<h4>Historique</h4>

{history.length === 0 ? (
                <p className="no-salaries-message">No historical data available.</p>  
            ) : (
            <div className="table-wrapper">
            <div className="table-header">
            <div>photo</div>
                        <div>User</div>
                        <div>Status</div>
                        <div>Date</div>

                </div>
                
                    {getPaginatedHistory().map((item) => (
              <div key={item.id} className="table-row">
                                <div> <img  src={`http://localhost:8000/storage/${item.user.profile_picture}`} alt="#"className="userprofile" /></div>

                            <div>{item.user?.name || 'Unknown'}</div>
                            <div>{item.status}</div>
                            <div>  {new Date(item.created_at).toLocaleString('en-MA', {
    year: 'numeric',
    day: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  })}</div>

                        </div>
                    ))}
                
            </div>
            )}
            <div className="page">
                <li
                    className="page__btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                >
                    <span className="material-icons">
                        <img src="icons/left-arrow.png" alt="left" />
                    </span>
                </li>
                {[...Array(Math.ceil(history.length / rowsPerPage)).keys()].map((index) => (
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                        pointerEvents: currentPage === Math.ceil(history.length / rowsPerPage) ? 'none' : 'auto',
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

export default HistoryPage;
