import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosSetup';

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(true);

// list of employees
  useEffect(() => {
    axiosInstance.get('/users')
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (employeeId, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [employeeId]: status,
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const attendanceData = Object.keys(attendanceStatus).map((employeeId) => ({
    user_id: employeeId,
    status: attendanceStatus[employeeId],
  }));

  axiosInstance.post('/attendances', attendanceData)
    .then((response) => {
      console.log('Attendance marked successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error marking attendance:', error);
    });

  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Mark Attendance</h1>
      <form onSubmit={handleSubmit}>
        {employees.map((employee) => (
          <div key={employee.id}>
            <h3>{employee.name}</h3>
            <div>
              <select
                value={attendanceStatus[employee.id] || ''}
                onChange={(e) => handleStatusChange(employee.id, e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>
            <hr />
          </div>
        ))}
        <button type="submit">Submit Attendance</button>
      </form>
    </div>
  );
};

export default MarkAttendance;
