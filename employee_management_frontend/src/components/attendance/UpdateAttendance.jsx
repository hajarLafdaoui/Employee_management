import axiosInstance from "../axiosSetup";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAttendance = () => {
    const { entryId } = useParams();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const resp = await axiosInstance.get(`/attendance/${entryId}`);
                setAttendance(resp.data);
                setStatus(resp.data.status);
            } catch (err) {
                console.error("Error fetching attendance data:", err);
                setError("Failed to fetch attendance data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [entryId]);

    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/attendance/${entryId}`, { status });
            alert("Attendance updated successfully!");
            navigate("/attendance");
        } catch (err) {
            setError("Failed to update attendance.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Update Attendance</h1>
            {attendance && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>User ID: </label>
                        <span>{attendance.user_id}</span>
                    </div>
                    <div>
                        <label>User Name: </label>
                        <span>{attendance.user?.name || "No name available"}</span>
                    </div>
                    <div>
                        <label>Attendance Date: </label>
                        <span>{attendance.attendance_date}</span>
                    </div>
                    <div>
                        <label>department name: </label>
                        <span>{attendance.user.department.name}</span>
                    </div>
                    <div>
                        <label>Status: </label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="present"
                                    checked={status === 'present'}
                                    onChange={handleChangeStatus}
                                />
                                Present
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="absent"
                                    checked={status === 'absent'}
                                    onChange={handleChangeStatus}
                                />
                                Absent
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="leave"
                                    checked={status === 'leave'}
                                    onChange={handleChangeStatus}
                                />
                                Leave
                            </label>
                        </div>
                    </div>
                    <button type="submit">Update Attendance</button>
                </form>
            )}
        </div>
    );
};

export default UpdateAttendance;
