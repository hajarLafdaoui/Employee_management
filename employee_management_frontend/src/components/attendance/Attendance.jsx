import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";

const Attendance = ({ attendance, currentDate }) => {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDepartments = async () => {
        try {
            const resp = await axiosInstance.get("/departments");
            setDepartments(resp.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch departments data.");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const filteredAttendance = attendance.filter((attend) => {
        const filterByDate =
            new Date(attend.attendance_date).toDateString() === currentDate.toDateString();
        const filterByEmployee = attend.user.name.toLowerCase().includes(search.toLowerCase());
        const filterByDepartment =
            !selectedDepartment || String(attend.user.department_id) === String(selectedDepartment);
        const filterByStatus = !status || String(attend.status) === String(status);

        return filterByDate && filterByEmployee && filterByDepartment && filterByStatus;
    });

    if (!attendance.length) return <div>Loading...</div>;

    return (
        <div>
            <h1>Attendance</h1>
            <input
                type="text"
                value={search}
                placeholder="Search by employee name"
                onChange={(e) => setSearch(e.target.value)}
            />
            <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
            >
                <option value="">All Departments</option>
                {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                        {department.name}
                    </option>
                ))}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                {["present", "absent", "leave"].map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

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
                    {filteredAttendance.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.user_id}</td>
                            <td>
                                {entry.user.name} <br />
                                {entry.user.email}
                            </td>
                            <td>{entry.user?.department?.name || "No Department"}</td>
                            <td style={{ textAlign: "center" }}>
                                {entry.user?.profile_picture ? (
                                    <img
                                        src={`http://localhost:8000/storage/${entry.user.profile_picture}`}
                                        alt="Profile"
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                ) : (
                                    'No Picture'
                                )}
                            </td>
                            <td>{entry.attendance_date}</td>
                            <td>{entry.status}</td>
                            <td>
                                <Link to={`/update-attendance/${entry.id}`}>
                                    <button>Update</button>
                                </Link>
                                <Link to={`/delete-attendance/${entry.id}`}>
                                    <button>Delete</button>
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
