import React, { useEffect, useState } from "react";
import axiosInstance from "../Config/axiosSetup";
import LoadingSpinner from "../../LoadingSpinner";
import "./EmployeeAttendance.scss";

const EmployeeAttendance = ({ userId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [timeRange, setTimeRange] = useState("week"); // "week" or "month"
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Get the start and end of the week based on the week offset
  const getWeekRange = (weekOffset) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Adjust for Monday as the first day of the week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  // Get the start and end of the month
  const getMonthRange = (month) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), month - 1, 1);
    const endOfMonth = new Date(now.getFullYear(), month, 0); // Last day of the month

    return { startOfMonth, endOfMonth };
  };

  // Fetch attendance data based on the selected time range
  const fetchUserAttendance = async (startDate, endDate) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/attendance/user/${userId}`, {
        params: {
          start_date: startDate.toLocaleDateString("en-CA"), // YYYY-MM-DD format
          end_date: endDate.toLocaleDateString("en-CA"), // YYYY-MM-DD format
        },
      });

      // Sort the data by date after fetching
      const sortedData = sortAttendanceData(response.data, sortOrder);
      setAttendanceData(sortedData);

      if (response.data.length === 0) {
        setError("No attendance records found for the selected date range.");
      }
    } catch (error) {
      console.error("Failed to fetch user attendance:", error);
      setError("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  // Sort attendance data by date
  const sortAttendanceData = (data, order = "asc") => {
    return data.sort((a, b) => {
      const dateA = new Date(a.attendance_date);
      const dateB = new Date(b.attendance_date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Toggle sorting order
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    const sortedData = sortAttendanceData(attendanceData, newOrder);
    setAttendanceData(sortedData);
  };

  // Fetch data when the component mounts or when dependencies change
  useEffect(() => {
    if (timeRange === "week") {
      const { startOfWeek, endOfWeek } = getWeekRange(selectedWeek);
      fetchUserAttendance(startOfWeek, endOfWeek);
    } else if (timeRange === "month") {
      const { startOfMonth, endOfMonth } = getMonthRange(selectedMonth);
      fetchUserAttendance(startOfMonth, endOfMonth);
    }
  }, [userId, timeRange, selectedWeek, selectedMonth, sortOrder]);

  // Generate the days of the selected week (Monday to Sunday)
  const generateWeekDays = () => {
    const { startOfWeek } = getWeekRange(selectedWeek);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day.toLocaleDateString("en-CA")); // YYYY-MM-DD format
    }

    return days;
  };

  // Generate the days of the selected month
  const generateMonthDays = () => {
    const { startOfMonth, endOfMonth } = getMonthRange(selectedMonth);
    const days = [];
    const currentDay = new Date(startOfMonth);

    while (currentDay <= endOfMonth) {
      days.push(currentDay.toLocaleDateString("en-CA")); // YYYY-MM-DD format
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // Get the status for a specific day
  const getStatusForDay = (day) => {
    const record = attendanceData.find((entry) => entry.attendance_date === day);
    return record ? record.status : "unknown";
  };

  // Define colors for each status
  const statusColors = {
    present: "#36A2EB", // Blue for present
    late: "#FFCE56", // Yellow for late
    absent: "#FF6384", // Red for absent
    unknown: "#eeeeee", // Gray for unknown
  };

  return (
    <div className="employee-attendance">
    <h2>My Attendance</h2>

    <div className="title-search-sort">
        <label>Filter by:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Week</option>
            <option value="month">Month</option>
        </select>

        {timeRange === "week" && (
            <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            >
                <option value={0}>Current Week</option>
                <option value={-1}>Previous Week</option>
                <option value={-2}>Two Weeks Ago</option>
            </select>
        )}

        {timeRange === "month" && (
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
                {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ].map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                        {month}
                    </option>
                ))}
            </select>
        )}

        {/* <button onClick={toggleSortOrder}>
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button> */}
    </div>

    {loading ? (
        <div className="loading-spinner">
            <LoadingSpinner />
        </div>
    ) : error ? (
        <div className="error-message">{error}</div>
    ) : (
        <>
            <div className="attendance-grid">
                {timeRange === "week"
                    ? generateWeekDays().map((day, index) => (
                          <div
                              key={day}
                              className={`attendance-day ${getStatusForDay(day)}`}
                          >
                              {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                      ))
                    : generateMonthDays().map((day, index) => (
                          <div
                              key={day}
                              className={`attendance-day ${getStatusForDay(day)}`}
                          >
                              {new Date(day).getDate()}
                          </div>
                      ))}
            </div>

            <div className="attendance-wrapper">
  <div className="attendance-header">
    <div>Date</div>
    <div>Status</div>
  </div>
  {attendanceData.length > 0 ? (
    attendanceData.map((entry) => (
      <div key={entry.id} className="attendance-row">
        <div>{entry.attendance_date}</div>
        <div>{entry.status}</div>
      </div>
    ))
  ) : (
    <div className="attendance-row">
      <div colSpan="2">No attendance records found.</div>
    </div>
  )}
</div>

        </>
    )}
</div>
  );
};

export default EmployeeAttendance;