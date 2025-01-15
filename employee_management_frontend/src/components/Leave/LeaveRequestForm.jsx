import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Fetch user data on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userParsed = JSON.parse(storedUser);
            console.log('User from localStorage:', userParsed);
            setUser(userParsed);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
            setError('User not found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/leave-request', {
                user_id: user.id,
                leave_type: leaveType,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
            });

            alert('Leave request sent successfully');
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
        } catch (error) {
            console.error('Error submitting the request:', error.response?.data || error);
            setError(error.response?.data?.message || 'Failed to submit leave request. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Leave Type:</label>
                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                >
                    <option value="">Select leave type</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick_leave">Sick Leave</option>
                    <option value="personal_leave">Personal Leave</option>
                    <option value="maternity_leave">Maternity Leave</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Reason:</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
    );
};

export default LeaveRequestForm;
