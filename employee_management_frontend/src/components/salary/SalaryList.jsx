import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axiosInstance from "../Config/axiosSetup";
import emailjs from '@emailjs/browser'; // Import emailjs

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axiosInstance.get('/salaries');
      setSalaries(response.data.salaries);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching the salaries.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/salaries/${id}`);
      setSalaries(salaries.filter(salary => salary.id !== id));
    } catch (err) {
      setError('Error deleting salary.');
    }
  };

  // Handle sending message
  const sendMessage = async (user) => {
    try {

      await emailjs.send(
        'service_r02e0jl', 'template_uhdnaqw',  // Your template ID from EmailJS
        {
            from_email:"admin@example.com",
          from_name: 'Admin', // You can set this to a fixed name (or dynamic if needed)
          to_name: user.name, // Dynamic user name
          to_email: user.email, // Dynamic user email
          message: message,   // Dynamic message
        },
        'I3_55oUThRQx1UVWD'   // Your public key from EmailJS
      );

      setStatusMessage('Message sent successfully!');
      setShowMessageForm(false); // Hide the form after sending the message
      setMessage(''); // Clear the message field
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again.');
      console.error('Error:', error.text);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update the message as the user types
  };

  const handleShowMessageForm = (user) => {
    setCurrentUser(user);  // Set the current user whose message we will send
    setShowMessageForm(true); // Show the message form
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>All Salaries</h1>
      {statusMessage && <p>{statusMessage}</p>}
      {salaries.length === 0 ? (
        <p>No salaries found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Day Paid</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.id}>
                <td>{salary.user.name}</td>
                <td>{salary.paid_on}</td>
                <td>{salary.start_date}</td>
                <td>{salary.end_date}</td>
                <td>{salary.total_salary}</td>
                <td>
                  <Link to={`/salary/${salary.id}`}>Show</Link> {/* Link to SalaryDetail page */}
                  <button onClick={() => handleDelete(salary.id)}>Delete</button>
                  <button onClick={() => handleShowMessageForm(salary.user)}>Send Message</button>
                  {/* Button to show message form */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Message Form */}
      {showMessageForm && currentUser && (
        <div>
          <h2>Send a message to {currentUser.name}</h2>
          <textarea 
            value={message} 
            onChange={handleMessageChange} 
            placeholder="Write your message here..." 
            rows="4" 
            cols="50"
          />
          <br />
          <button onClick={() => sendMessage(currentUser)}>Send Message</button>
          <button onClick={() => setShowMessageForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SalaryList;
