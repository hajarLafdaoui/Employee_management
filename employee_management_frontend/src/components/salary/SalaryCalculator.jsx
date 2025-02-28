import React, { useState, useEffect } from 'react';
import axiosInstance from "../Config/axiosSetup";

const SalaryCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paidOn, setPaidOn] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (userId && startDate && endDate) {
      try {
        const response = await axiosInstance.post('/calculate-salary', {
          start_date: startDate,
          end_date: endDate,
          paid_on: paidOn,
          user_id: userId
        });
    
        console.log("API Response: ", response.data); 
  
        if (response.data.salary) {
          setSalaryData(response.data.salary);  
          setShowModal(true);  
        } else {
          setMessage(response.data.message);
        }
      } catch (err) {
        setError('Failed to calculate salaries. Please try again.');
        console.error(err);
      }
    } else {
      setError('Please fill all fields.');
    }
  };
  

  return (
    <div>
      <h2>Salary Calculator</h2>
      <form onSubmit={handleCalculate}>
        <div>
          <label>User:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Paid day</label>
          <input
            type="date"
            value={paidOn}
            onChange={(e) => setPaidOn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {showModal && salaryData && (
  <div className={`modal ${showModal ? 'show' : ''}`}>
    <div className="modal-content">
      <span className="close" onClick={() => setShowModal(false)}>&times;</span>
      <h3>Salary Details for {salaryData.name}</h3>
      <h3>Salary Paid On: {salaryData.paidOn}</h3>
      <p>Attendances: {salaryData.attendances}</p>
      <p>Leaves: {salaryData.leaves}</p>
      <p>Base Salary: {salaryData.base_salary}</p>
      <p>Attendance Bonus: {salaryData.attendance_bonus}</p>
      <p>Leave Deduction: {salaryData.leave_deduction}</p>
      <p>Tva: {salaryData.tvaRate}</p>
      <p>tvaAmount: {salaryData.tvaAmount}</p>

      <p>Total Salary: {salaryData.total_salary}</p>
    </div>
  </div>
)}

    </div>
  );
};

export default SalaryCalculator;
