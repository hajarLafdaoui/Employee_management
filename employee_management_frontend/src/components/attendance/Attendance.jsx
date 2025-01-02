import axiosInstance from "../axiosSetup";
import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';


const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAttendance = async () => {
        try {
            const resp = await axiosInstance.get('/attendance');
            setAttendance(resp.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch attendance data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Attendance</h1>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Details</th>
                        <th>Department</th>
                        <th>Profile Picture</th>
                        <th>Attendance Date</th>
                        <th>Attendance Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.user_id}</td>
                            <td>
                                {entry.user.name} <br />
                                {entry.user.email}
                            </td>
                            <td>{entry.user?.department?.name || "No Department"}</td>
                            <td style={{ textAlign: "center" }}>
                                {entry.user?.profile_picture ? (
                                    <img
                                        src={entry.user.profile_picture}
                                        alt="Profile"
                                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                    />
                                ) : (
                                    "No Picture"
                                )}
                            </td>
                            <td>{entry.attendance_date}</td>
                            <td>{entry.status}</td>
                            <td>
                            <Link to={`/update-attendance/${entry.id}`}>
                                <button>
                                    Update
                                </button>
                            </Link>
                            

                            <Link to={`/delete-attendance/${entry.id}`}>
                                <button >
                                    Delete
                                </button>
                            </Link>
                            </td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
