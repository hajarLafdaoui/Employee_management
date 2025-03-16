import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../Config/axiosSetup";
import LoadingSpinner from "../../LoadingSpinner";
import "./EmployeeAttendance.scss"; 

const EmployeeAttendance = ({ userId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeekRange = (weekOffset) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);

    if (dayOfWeek === 0) {
      startOfWeek.setDate(now.getDate() - 6 + weekOffset * 7);
    } else {
      startOfWeek.setDate(now.getDate() - (dayOfWeek - 1) + weekOffset * 7);
    }

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  const getMonthRange = (month) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), month - 1, 1);
    const endOfMonth = new Date(now.getFullYear(), month, 0);
    return { startOfMonth, endOfMonth };
  };

  const fetchUserAttendance = async (startDate, endDate) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/attendance/user/${userId}`, {
        params: {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        },
      });

      setAttendanceData(response.data);

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

  useEffect(() => {
    if (timeRange === "week") {
      const { startOfWeek, endOfWeek } = getWeekRange(selectedWeek);
      fetchUserAttendance(startOfWeek, endOfWeek);
    } else if (timeRange === "month") {
      const { startOfMonth, endOfMonth } = getMonthRange(selectedMonth);
      fetchUserAttendance(startOfMonth, endOfMonth);
    }
  }, [userId, timeRange, selectedWeek, selectedMonth]);

  const filteredAttendance = useMemo(() => {
    return attendanceData
      .filter((entry) => {
        const entryDate = new Date(entry.attendance_date);
        return entryDate.getMonth() + 1 === selectedMonth;
      })
      .sort((a, b) => new Date(a.attendance_date) - new Date(b.attendance_date));
  }, [attendanceData, selectedMonth]);

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Attendance</h2>

      {/* Time Range Selection */}
      <div className="filter-container">
        <select
          className="filter-dropdown"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        {timeRange === "week" && (
          <select
            className="filter-dropdown"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          >
            <option value={0}>Current Week</option>
            <option value={-1}>Previous Week</option>
          </select>
        )}

        {timeRange === "month" && (
          <select
            className="filter-dropdown"
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
      </div>

      {/* Attendance Table */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.attendance_date}</td>
                    <td className={`status ${entry.status.toLowerCase()}`}>
                      {entry.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="no-data">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
