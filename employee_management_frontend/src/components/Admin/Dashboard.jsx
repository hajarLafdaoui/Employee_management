import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "../Config/axiosSetup";
import LoadingSpinner from "../../LoadingSpinner"; // Assuming you have a loading spinner component
import "./Dashboard.scss"; // Import the CSS file for styling
import { ResponsiveBar } from "@nivo/bar"; // Import ResponsiveBar from @nivo/bar
import { FaUserPlus, FaUsers } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [allemployees, setAllEmployees] = useState([]);

    const [employeeCountData, setEmployeeCountData] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [newEmployees, setNewEmployees] = useState(0);
    const [deleteEmployees, setDeleteEmployees] = useState(0);

    const [genderStats, setGenderStats] = useState({ male: 0, female: 0, other: 0 });
    const [departmentStats, setDepartmentStats] = useState([]);

    // Fetch all employees from the API
    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await axiosInstance.get("/getall");
                console.log("Employees Data:", response.data);
                setAllEmployees(response.data);

            } catch (error) {
                console.error("Error fetching employees:", error);
                setError("Failed to fetch employees.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllEmployees();
    }, []);
  
// Fetch all employees from the API
useEffect(() => {
    const fetchAllEmployees = async () => {
        try {
            const response = await axiosInstance.get("/getall"); 
            console.log("Employees all:", response.data); 
            setAllEmployees(response.data); 
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees.");
        } finally {
            setLoading(false);
        }
    };

    fetchAllEmployees();
}, []);

    // Fetch statistics data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get("/users");
                console.log("Employees Data:", response.data); // Log the data
                setEmployees(response.data);
                // Calculate statistics
                calculateStatistics(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                setError("Failed to fetch employees.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // Calculate statistics from the employees data
    const calculateStatistics = (employees) => {
        // Total employees
        setTotalEmployees(employees.length);

        // New employees (created in the last two days)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Subtract 2 days from the current date

        const newEmployeesCount = employees.filter((employee) => {
            const createdAt = new Date(employee.created_at); // Ensure this matches the property in your data
            return createdAt >= twoDaysAgo; // Only include employees created in the last two days
        }).length;

        const employeesToDelete = allemployees.filter((employee) => {
            return employee.is_deleted === 1;
        }).length;

        setNewEmployees(newEmployeesCount);
        // Gender statistics
        const genderCounts = employees.reduce(
            (acc, employee) => {
                if (employee.gender === "male") acc.male++;
                else if (employee.gender === "female") acc.female++;
                return acc;
            },
            { male: 0, female: 0 }
        );
        setGenderStats(genderCounts);
    };



    useEffect(() => {
        const employeesToDelete = allemployees.filter((employee) => employee.is_deleted === 1).length;
        setDeleteEmployees(employeesToDelete);
    }, [allemployees])




    // Pagination state for employee table
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(5); // Number of rows per page
    const [search, setSearch] = useState(""); // Search state

    // Fetch attendance data
    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axiosInstance.get("/attendance");
                console.log("Attendance Data:", response.data); // Log the data
                setAttendanceData(response.data);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
                setError("Failed to fetch attendance data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendanceData();
    }, []);

    // Fetch departments data
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get("/departments");
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setError("Failed to fetch departments.");
            }
        };
        fetchDepartments();
    }, []);

    // Fetch employees data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get("/users");
                console.log("Employees Data:", response.data); // Log the data
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                setError("Failed to fetch employees.");
            }
        };
        fetchEmployees();
    }, []);

    // Fetch employee count data for the bar chart
    useEffect(() => {
        const fetchEmployeeCountData = async () => {
            try {
                const response = await axiosInstance.get("/employee-count");
                console.log("Employee Count Data:", response.data); // Log the data
                setEmployeeCountData(response.data);
            } catch (error) {
                console.error("Error fetching employee count data:", error);
            }
        };
        fetchEmployeeCountData();
    }, []);

    // Get department name by department_id
    const getDepartmentName = (departmentId) => {
        const department = departments.find((dep) => dep.id === departmentId);
        return department ? department.name : "N/A";
    };

    // Get the current month and year
    const currentMonth = new Date().getMonth(); // 0-based (0 = January, 11 = December)
    const currentYear = new Date().getFullYear();

    // Get the days in the current month
    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).getDate());
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    // Prepare the data for each day in the current month
    const dataForMonth = daysInMonth.map((day) => {
        const dayData = attendanceData.filter((entry) => {
            const entryDate = new Date(entry.attendance_date); // Ensure this matches the property in your data
            return (
                entryDate.getDate() === day &&
                entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear
            );
        });

        // Ensure no missing data for the day
        const present = dayData.filter((entry) => entry.status === "present").length || 0;
        const absent = dayData.filter((entry) => entry.status === "absent").length || 0;
        const leave = dayData.filter((entry) => entry.status === "leave").length || 0;

        return { present, absent, leave };
    });

    // Prepare the chart data
    const chartData = {
        labels: daysInMonth, // X-axis is the days of the current month
        datasets: [
            {
                label: "Present",
                data: dataForMonth.map((item) => item.present),
                borderColor: "#36A2EB",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Absent",
                data: dataForMonth.map((item) => item.absent),
                borderColor: "#FF6384",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Leave",
                data: dataForMonth.map((item) => item.leave),
                borderColor: "#FFCE56",
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Options for the line chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                min: 0, // Explicitly set the minimum value to 0
            },
        },
    };

    // Prepare data for the bar chart
    const barChartData = employeeCountData
        .map((d) => ({
            department: d.department || "Unknown",
            employees: Number(d.employee_count) || 0,
        }))
        .sort((a, b) => a.employees - b.employees);

    // Filter employees based on search
    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic for employee table
    const indexOfLastEmployee = currentPage * rowsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get pagination range
    const getPaginationRange = () => {
        const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
        const maxPagesToShow = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    if (loading) return <LoadingSpinner />; // Show the spinner while loading
    if (error) return <div>{error}</div>; // Show the error message if there's an error

    return (
        <div>
            <div className="statics">
                {/* Total Employees */}
                <div className="total-employees">

                    <img src="/icons/employes.png" alt="" className="icontotal" />
                    <div className="textemploye">
                        <p className="titleemplo">Total Employees:</p>
                        <p>{totalEmployees}</p>
                    </div>
                </div>
                {/* New Employees (Last 2 Days) */}
                <div className="new-employees">
                    <img src="/icons/employeesadd.png" alt="" className="icontotal" />
                    <div className="textemploye">
                        <p className="titleemplo">New  (Last 2 Days)         <img src="/icons/augmenter.png" alt="" className="iconaug" />
                        </p>

                        <p>{newEmployees}</p>
                    </div>

                </div>
                <div className="delete-employees">
                    <img src="/icons/supprimer.png" alt="" className="icontotal" />

                    <div className="textemploye">
                        <p className="titleemplo">delete employee   <img src="/icons/diminuer.png" alt="" className="iconaug" />
                        </p>

                        <p>{deleteEmployees}</p>

                    </div>

                </div>
                {/* By Gender */}
                <div className="by-gender">
                    <img src="/icons/gender.png" alt="" className="icontotal" />

                    <div className="textemploye">
                        <p className="titleemplo">By Gender:</p>
                        <p>{genderStats.male}M, {genderStats.female}F</p>
                    </div>
                </div>

                {/* By Department */}
                {/* <div className="by-department">
                    <p>By Department</p>
                    <div>
                        {departmentStats.map((dept) => (
                            <p key={dept.department_id}>
                                {dept.department_name}: {dept.employee_count}
                            </p>
                        ))}
                    </div>
                </div> */}
            </div>
            <div className="dashboardGraphs">
                <div className="attGraph">
                    {/* Render the attendance chart manually */}
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div className="DepGraph">
                    <div className="bar dashboard-bar">
                        {barChartData.length > 0 ? (
                            <ResponsiveBar
                                data={barChartData}
                                keys={["employees"]}
                                indexBy="department"
                                layout="vertical" // Changed from horizontal to vertical
                                margin={{ top: 50, right: 30, bottom: 100, left: 80 }} // Adjusted margins
                                padding={0.3}
                                colors={(d) => {
                                    if (d.value <= 5 && d.value > 0) return "#E9F7DF";
                                    if (d.value > 5 && d.value <= 10) return "#D1F1BB";
                                    if (d.value > 10 && d.value <= 15) return "#AFDC8F";
                                    if (d.value > 15 && d.value <= 20) return "#87BB62";
                                    if (d.value > 20) return "#63993D";
                                    return "transparent";
                                }}
                                axisBottom={{
                                    tickRotation: -45, // Rotate department labels
                                    legend: "Departments",
                                    legendPosition: "middle",
                                    legendOffset: 60,
                                }}
                                axisLeft={{
                                    tickValues: [0, 5, 10, 15, 20, 25],
                                    legend: "Number of Employees",
                                    legendPosition: "middle",
                                    legendOffset: -60,
                                    format: (value) => (value === 0 ? "" : value),
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor="white"
                            />
                        ) : (
                            <div>No data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Employee table rendering */}
            <div className="tableContainer">
                <div className="title-search-sortt title-search-sort-dashboard">
                    <p>All Employees</p>
                    <div className="search-sortt">
                        <div className="input-search-container">
                            <img src="icons/search.png" alt="" />
                            <input
                                className="input-search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search employees..."
                            />
                        </div>
                    </div>
                </div>
                <div className="table-wrapper">
                    <div className="table-header">
                        <div>#ID</div>
                        <div>Name</div>
                        <div>Gender</div>
                        <div>Country</div>
                        <div>Department</div>
                        <div>Contact</div> {/* Add Contact column */}
                    </div>
                    {currentEmployees.length > 0 ? (
                        currentEmployees.map((user) => (
                            <div key={user.id} className="table-row">
                                <div>{user.id}</div>
                                <div>
                                    {user?.profile_picture ? (
                                        <img
                                            src={`http://localhost:8000/storage/${user.profile_picture}`}
                                            alt="Profile"
                                            style={{ width: "38px", height: "38px", borderRadius: "50%", marginRight: "10px" }}
                                        />
                                    ) : (
                                        "No Picture"
                                    )}
                                    {user.username}
                                    <p>{user.name}</p>
                                </div>
                                <div>{user.gender}</div>
                                <div>
                                    {user.country}
                                    {user.flagUrl && (
                                        <img src={user.flagUrl} alt={user.country} style={{ width: "20px", marginLeft: "10px" }} />
                                    )}
                                </div>
                                <div>{getDepartmentName(user.department_id)}</div>
                                <div> {/* Add Contact information */}
                                    <span className="contact">{user.email}</span>
                                    <br className="spacer" />
                                    <span className="contact marginPhone">{user.phone}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="table-row">
                            <div colSpan="6">No employees found.</div>
                        </div>
                    )}
                </div>
                <div className="page">
                    <li
                        className="page__btn"
                        onClick={() => paginate(currentPage - 1)}
                        style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
                    >
                        <span className="material-icons">
                            <img src="icons/left-arrow.png" alt="left" />
                        </span>
                    </li>
                    {getPaginationRange().map((pageNumber) => (
                        <li
                            key={pageNumber}
                            className={`page__numbers ${currentPage === pageNumber ? "active" : ""}`}
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </li>
                    ))}
                    <li
                        className="page__btn"
                        onClick={() => paginate(currentPage + 1)}
                        style={{
                            pointerEvents:
                                currentPage === Math.ceil(filteredEmployees.length / rowsPerPage) ? "none" : "auto",
                        }}
                    >
                        <span className="material-icons">
                            <img src="icons/right-arrow.png" alt="right" />
                        </span>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;