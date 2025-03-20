import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import LoadingSpinner from "../../LoadingSpinner"; // Import the LoadingSpinner component

const Marking = ({ currentDate }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [search, setSearch] = useState("");
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [attendance, setAttendance] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // Alert states
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesData, departmentsData, attendanceData, leaveData] = await Promise.all([
                    axiosInstance.get("/employees"),
                    axiosInstance.get("/departments"),
                    axiosInstance.get("/attendance"),
                    axiosInstance.get("/leave-requests"),
                ]);

                setEmployees(employeesData.data);
                setDepartments(departmentsData.data);
                setAttendanceRecords(attendanceData.data);
                setLeaveRequests(leaveData.data);
            } catch (error) {
                setError("Failed to fetch data. Please try again later.");
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search input change
    const handleSearch = (e) => setSearch(e.target.value);

    // Handle department selection change
    const handleSelect = (e) => setSelectedDepartment(e.target.value);

    // Filter employees based on search, department, and date
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase());
        const matchesDepartment = !selectedDepartment || String(employee.department_id) === String(selectedDepartment);

        const formattedCurrentDate = currentDate.toISOString().split("T")[0];
        const formattedEmployeeDate = employee.attendance_date ? employee.attendance_date.split("T")[0] : formattedCurrentDate;
        const matchesDate = formattedEmployeeDate === formattedCurrentDate;

        const alreadyMarked = attendanceRecords.some(
            (record) => record.user_id === employee.id && record.attendance_date === formattedCurrentDate
        );

        return matchesSearch && matchesDepartment && matchesDate && !alreadyMarked;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentItems = filteredEmployees.slice(startIndex, endIndex);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Check if an employee is on leave
    const getLeaveStatus = (employeeId) => {
        const leaveRequest = leaveRequests.find(
            (request) =>
                request.user_id === employeeId &&
                new Date(request.start_date) <= currentDate &&
                new Date(request.end_date) >= currentDate &&
                request.status === "approved"
        );
        return leaveRequest ? "leave" : null;
    };

    // Handle attendance status change
    const handleAttendanceChange = (employeeId, status) => {
        setAttendance((prev) => ({ ...prev, [employeeId]: status }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const attendanceRecordsToSave = Object.entries(attendance).map(([employeeId, status]) => ({
            user_id: employeeId,
            attendance_date: currentDate.toISOString().split("T")[0],
            status,
        }));

        try {
            await axiosInstance.post("/attendance", { records: attendanceRecordsToSave });
            setSuccessMessage("Attendance saved successfully!");
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);

            // Refresh attendance records
            const updatedAttendanceData = await axiosInstance.get("/attendance");
            setAttendanceRecords(updatedAttendanceData.data);

            // Navigate to the attendance page
            navigate("/AttendanceHeader");
        } catch (error) {
            setErrorMessage("Failed to save attendance. Please try again.");
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
            console.error("Error saving attendance:", error);
        }
    };

    if (loading) return <LoadingSpinner />; // Use the LoadingSpinner component here
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="title-search-sort">
                <h5>Attendance</h5>
                <div className="search-sort">
                    <div className="input-search-container">
                        <img src="icons/search.png" alt="Search" />
                        <input
                            className="input-search"
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search employees..."
                        />
                    </div>

                    <select value={selectedDepartment} onChange={handleSelect}>
                        <option value="">All Departments</option>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th># ID</th>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Contact</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((employee) => {
                            const department = departments.find((dept) => dept.id === employee.department_id);
                            const departmentName = department ? department.name : "Unknown";
                            const leaveStatus = getLeaveStatus(employee.id);
                            const currentAttendance = attendance[employee.id] || leaveStatus || "";

                            return (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>
                                        {employee?.profile_picture ? (
                                            <img
                                                src={`http://localhost:8000/storage/${employee.profile_picture}`}
                                                alt="Profile"
                                                style={{ width: "38px", height: "38px", borderRadius: "50%", marginRight: "10px" }}
                                            />
                                        ) : (
<img style={{ width: '38px', height: '38px', borderRadius: '50%', marginRight: '10px' }}
                                    src='icons/default-profile.jpeg' />
                                                                            )}
                                        {employee.name || "Unknown"}
                                    </td>
                                    <td>{employee.country || "Unknown"}</td>
                                    <td>{employee.role || "Unknown"}</td>
                                    <td>{departmentName}</td>
                                    <td className="conCon">
                                        <span className="contact">{employee.email || "No Email"}</span>
                                        <br className="spacer" />
                                        <span className="contact marginPhone">{employee.phone || "No Phone"}</span>
                                    </td>
                                    <td>
                                        {leaveStatus ? (
                                            <div>
                                                <input
                                                    type="radio"
                                                    name={`attendance-${employee.id}`}
                                                    value="leave"
                                                    checked={currentAttendance === "leave"}
                                                    readOnly
                                                />
                                                Leave
                                            </div>
                                        ) : (
                                            <div className="preAbs">
                                                <input
                                                    type="radio"
                                                    name={`attendance-${employee.id}`}
                                                    value="present"
                                                    checked={currentAttendance === "present"}
                                                    onChange={() => handleAttendanceChange(employee.id, "present")}
                                                />
                                                Present
                                                <input
                                                    type="radio"
                                                    name={`attendance-${employee.id}`}
                                                    value="absent"
                                                    checked={currentAttendance === "absent"}
                                                    onChange={() => handleAttendanceChange(employee.id, "absent")}
                                                />
                                                Absent
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="page">
                    <li
                        className="page__btn"
                        onClick={prevPage}
                        style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
                    >
                        <span className="material-icons">
                            <img src="icons/left-arrow.png" alt="left" />
                        </span>
                    </li>

                    {[...Array(totalPages).keys()]
                        .slice(
                            Math.max(0, Math.min(currentPage - 2, totalPages - 3)),
                            Math.max(3, Math.min(currentPage + 1, totalPages))
                        )
                        .map((index) => (
                            <li
                                key={index + 1}
                                className={`page__numbers ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </li>
                        ))}

                    <li
                        className="page__btn"
                        onClick={nextPage}
                        style={{
                            pointerEvents: currentPage === totalPages ? "none" : "auto",
                        }}
                    >
                        <span className="material-icons">
                            <img src="icons/right-arrow.png" alt="right" />
                        </span>
                    </li>
                </div>

                <button className="saveMarkingAtt" type="submit">
                    Save Attendance
                </button>
            </form>

            {/* Success and Error Alerts */}
            {showSuccessAlert && <SuccessAlert message={successMessage} onClose={() => setShowSuccessAlert(false)} />}
            {showErrorAlert && <ErrorAlert message={errorMessage} onClose={() => setShowErrorAlert(false)} />}
        </>
    );
};

export default Marking;