// HistoryPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import LoadingSpinner from '../../LoadingSpinner';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const resp = await axiosInstance.get('/attestations');
                setHistory(resp.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching historique', error);
                setLoading(false);
            }
        };
        fetchHistorique();
    }, []);
    if (loading) return <LoadingSpinner/>;

    return (
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
    );
};

export default HistoryPage;
