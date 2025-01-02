import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLeaveRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const response = await axios.get('/api/leave-requests');
            setRequests(response.data);
        };

        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        await axios.put(`/api/leave-request/${id}/approve`);
        alert('Request approved');
        setRequests(requests.filter((request) => request.id !== id));
    };

    const handleReject = async (id) => {
        await axios.put(`/api/leave-request/${id}/reject`);
        alert('Request rejected');
        setRequests(requests.filter((request) => request.id !== id));
    };

    return (
        <div>
            <h1>Leave Requests</h1>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <p>{request.leave_type}</p>
                        <p>{request.start_date} - {request.end_date}</p>
                        <p>{request.reason}</p>
                        <button onClick={() => handleApprove(request.id)}>Approve</button>
                        <button onClick={() => handleReject(request.id)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminLeaveRequests;
