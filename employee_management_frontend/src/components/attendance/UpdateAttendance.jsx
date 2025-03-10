import axiosInstance from "../Config/axiosSetup";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAttendance = ({ id }) => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching attendance for ID:", id); // Debugging
        if (!id) {
            setError("Invalid attendance ID.");
            setLoading(false);
            return;
        }
        
        const fetchAttendanceData = async () => {
            try {
                const resp = await axiosInstance.get(`/attendance/${id}`);
                console.log("Attendance data:", resp.data); // Debugging
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
    }, [id]);

    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/attendance/${id}`, { status });
            alert("Attendance updated successfully!");
            navigate("/AttendanceHeader");
        } catch (err) {
            setError("Failed to update attendance.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
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
                        <label>Department Name: </label>
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
                    <button className="updateAtt" type="submit">Update Attendance</button>
                </form>
            )}
        </div>
    );
};


export default UpdateAttendance;
