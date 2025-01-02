import axiosInstance from "../axiosSetup";
import React, { useState, useEffect } from "react";

const Marking = () => {
    // State declarations 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesData, departmentsData] = await Promise.all([
                    axiosInstance.get("/employees"),
                    axiosInstance.get("/departments")
                ]);
                setEmployees(employeesData.data);
                setDepartments(departmentsData.data);
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
        return matchesSearch && matchesDepartment;
    });

    const handleAttendanceChange = (employeeId, status) => {
        setAttendance(prev => ({ ...prev, [employeeId]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const attendanceRecords = Object.entries(attendance).map(([employeeId, status]) => ({
            user_id: employeeId,
            attendance_date: new Date().toISOString().split('T')[0], 
            status,
        }));

        try {
            await axiosInstance.post("/attendance", { records: attendanceRecords });
            alert("Attendance saved successfully!");

            // Filter out employees whose attendance has been saved
            const updatedEmployees = employees.filter(
                employee => !attendance[employee.id]
            );
            setEmployees(updatedEmployees);

            setAttendance({});
        } catch (error) {
            console.error(error);  // Log error details
            alert("Error saving attendance. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <p>Date: {new Date().toISOString().split('T')[0]}</p>

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
                                    <td>{employee.name}</td>
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
