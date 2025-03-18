import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import './leaveRequestForm.scss';
import { useTranslation } from 'react-i18next';
const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const { t } = useTranslation();
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
            setError(t('leave_request_form.user_not_found'));
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

            alert(t('leave_request_form.leave_request_sent_success'));
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
        } catch (error) {
            console.error('Error submitting the request:', error.response?.data || error);
            setError(error.response?.data?.message ||  t('leave_request_form.leave_request_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="leave-request-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>{t('leave_request_form.leave_type')}:</label>
                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                >
                    <option value="">{t('leave_request_form.select_leave_type')}</option>
                    <option value="vacation">{t('leave_request_form.vacation')}</option>
                    <option value="sick_leave">{t('leave_request_form.sick_leave')}</option>
                    <option value="personal_leave">{t('leave_request_form.personal_leave')}</option>
                    <option value="maternity_leave">{t('leave_request_form.maternity_leave')}</option>
                    <option value="other">{t('leave_request_form.other')}</option>
                </select>
            </div>
            <div className="input-group">
                <label>{t('leave_request_form.start_date')}:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label>{t('leave_request_form.end_date')}:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label>{t('leave_request_form.reason')}:</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="button-form" type="submit" disabled={loading}>
                {loading ? t('leave_request_form.submitting') : t('leave_request_form.submit_request')}
            </button>
        </form>
    );
};

export default LeaveRequestForm;
