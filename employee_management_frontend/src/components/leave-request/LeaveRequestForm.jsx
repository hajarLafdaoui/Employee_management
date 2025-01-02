import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/leave-request', {
                leave_type: leaveType,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
            });

            alert('Leave request sent successfully');
        } catch (error) {
            alert('Error submitting the request');
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
            <button type="submit">Submit Request</button>
        </form>
    );
};

export default LeaveRequestForm;
