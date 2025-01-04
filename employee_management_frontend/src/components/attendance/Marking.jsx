import axiosInstance from "../axiosSetup";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Marking = ({currentDate}) => {
        const navigate = useNavigate();
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [attendance, setAttendance] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState([]); // Store existing attendance records

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesData, departmentsData, attendanceData] = await Promise.all([
                    axiosInstance.get("/employees"),
                    axiosInstance.get("/departments"),
                    axiosInstance.get("/attendance") // Fetch existing attendance records
                ]);
                console.log("Employees Data:", employeesData.data);  // Log employee data here
                setEmployees(employeesData.data);
                setDepartments(departmentsData.data);
                setAttendanceRecords(attendanceData.data); // Store the existing attendance data
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleSearch = (e) => setSearch(e.target.value);
    const handleSelect = (e) => setSelectedDepartment(e.target.value);
    
    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase());
        const matchesDepartment = !selectedDepartment || String(employee.department_id) === String(selectedDepartment);
        
        // Handle missing or undefined attendance_date by defaulting to currentDate
        const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Format current date
        const formattedEmployeeDate = employee.attendance_date ? employee.attendance_date.split('T')[0] : formattedCurrentDate;

        const matchesDate = formattedEmployeeDate === formattedCurrentDate;

        // Exclude employees who have already been marked as present, absent, or on leave for this date
        const alreadyMarked = attendanceRecords.some(record => record.user_id === employee.id && record.attendance_date === formattedCurrentDate);

        return matchesSearch && matchesDepartment && matchesDate && !alreadyMarked;
    });

    const handleAttendanceChange = (employeeId, status) => {
        setAttendance(prev => ({ ...prev, [employeeId]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const attendanceRecordsToSave = Object.entries(attendance).map(([employeeId, status]) => ({
            user_id: employeeId,
            attendance_date: currentDate.toISOString().split('T')[0], 
            status,
        }));
        
        console.log("Attendance Data:", attendanceRecordsToSave); // Log the data
        
        try {
            await axiosInstance.post("/attendance", { records: attendanceRecordsToSave });
            alert("Attendance saved successfully!");
            navigate('/AttendanceHeader');  

            // Re-fetch attendance data after submission
            const updatedAttendanceData = await axiosInstance.get("/attendance");
            setAttendanceRecords(updatedAttendanceData.data);
        } catch (error) {
            if (error.response) {
                // Log more detailed error from the server
                console.error("Server Error:", error.response.data);
                setError('Error saving attendance. Please try again.');
            } else {
                console.error("Request Error:", error.message);  // Log if there's a network issue or other error
                setError('Network error. Please check your connection.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by name"
            />

            <select onChange={handleSelect} value={selectedDepartment}>
                <option value="">All Departments</option>
                {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
            </select>

            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Profile Picture</th>
                            <th>Department</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => {
                            const department = departments.find(dept => dept.id === employee.department_id);
                            const departmentName = department ? department.name : "Unknown";

                            return (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}--{employee.email}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {employee.profile_picture ? (
                                            <img
                                                src={`http://localhost:8000/storage/${employee.profile_picture}`}
                                                alt="Profile"
                                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                            />
                                        ) : (
                                            'No Picture'
                                        )}
                                    </td>
                                    <td>{departmentName}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`attendance-${employee.id}`}
                                            value="present"
                                            onChange={() => handleAttendanceChange(employee.id, "present")}
                                        />
                                        Present
                                        <input
                                            type="radio"
                                            name={`attendance-${employee.id}`}
                                            value="absent"
                                            onChange={() => handleAttendanceChange(employee.id, "absent")}
                                        />
                                        Absent
                                        <input
                                            type="radio"
                                            name={`attendance-${employee.id}`}
                                            value="leave"
                                            onChange={() => handleAttendanceChange(employee.id, "leave")}
                                        />
                                        Leave
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button type="submit">Save Attendance</button>
            </form>
        </>
    );
};

export default Marking;
