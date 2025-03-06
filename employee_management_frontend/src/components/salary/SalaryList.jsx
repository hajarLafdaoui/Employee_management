import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import emailjs from '@emailjs/browser'; 
import LoadingSpinner from "../../LoadingSpinner";
import DeleteModal from "../Cnfirm/DeleteModal";
import Modal from "react-modal";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [deleteSalaryId, setDeleteSalaryId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
      setShowErrorAlert(true); 
    }
  };

  const handleDelete = async () => {
    if (deleteSalaryId) {
      try {
        await axiosInstance.delete(`/salaries/${deleteSalaryId}`);
        setSalaries(salaries.filter(salary => salary.id !== deleteSalaryId));
        setShowDeletePopUp(false);
        setShowSuccessAlert(true);
      } catch (err) {
        setError('Error deleting salary.');
        setShowErrorAlert(true);
      }
    }
  };

  const sendMessage = async (user) => {
    try {
      await emailjs.send(
        'service_r02e0jl', 'template_uhdnaqw',  
        {
          from_email: "admin@example.com",
          from_name: 'Admin', 
          to_name: user.name, 
          to_email: user.email,
          message: message,  
        },
        'I3_55oUThRQx1UVWD'   
      );

      setStatusMessage('Message sent successfully!');
      setShowMessageForm(false); 
      setMessage(''); 
      setShowSuccessAlert(true);
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again.');
      setShowErrorAlert(true);
      console.error('Error:', error.text);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); 
  };

  const handleShowMessageForm = (user) => {
    setCurrentUser(user);   
    setShowMessageForm(true); 
  };

  const toggleMenu = (salaryId) => {
    setActiveMenu((prevMenu) => (prevMenu === salaryId ? null : salaryId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {showSuccessAlert && (
        <SuccessAlert 
          message={statusMessage} 
          onClose={() => setShowSuccessAlert(false)} 
        />
      )}
      {showErrorAlert && (
        <ErrorAlert 
          message={error} 
          onClose={() => setShowErrorAlert(false)} 
        />
      )}



  
  <div className="DepaHead">
  <h1>All Salaries</h1>
  <div className="buttonContainer">
          <img className='plusIcon' src="/icons/plus.png" alt="Add" />
          <Link to="/payroll"><button>Add Salary</button>
          </Link>

        </div>
      </div>
      {salaries.length === 0 ? (
        <p>No salaries found.</p>
      ) : (
        <table className="salary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Day Paid</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Attendances</th>
            <th>Leaves</th>
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
              <td>{salary.attendances}</td>
              <td>{salary.leaves}</td>
              <td>{salary.total_salary}</td>
              <td className="actions">
                <button
                  className="button action-button"
                  onClick={() => toggleMenu(salary.id)}
                >
                  &#x22EE;
                </button>
                {activeMenu === salary.id && (
                  <div className="dropdown-menu">
                    <Link to={`/salary/${salary.id}`} className="view-link">
                      <img className="view-icon" src="/icons/view.png" alt="View" />
                    </Link>
                    <div
                      onClick={() => {
                        setDeleteSalaryId(salary.id); 
                        setShowDeletePopUp(true); 
                      }}
                      className="delete-container"
                    >
                      <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                    </div>
                    
                    <div
                      onClick={() => handleShowMessageForm(salary.user)} 
                      className="send-message-button"
                    >
                      <img className="view-icon" src="/icons/email.png" alt="Delete" />
                      </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       
      )}

      <Modal
        isOpen={showMessageForm}
        onRequestClose={() => setShowMessageForm(false)}
        contentLabel="Send Message"
        overlayClassName="modal"
        className="modal-content"
      >
        <div className="modal-header">
          <h2>Send a message to {currentUser?.name}</h2>
          <span
            className="modal-close"
            onClick={() => setShowMessageForm(false)}
          >
            <img className="close" src="icons/close.png" alt="Close" />
          </span>
        </div>
        <div>
          <textarea 
            value={message} 
            onChange={handleMessageChange} 
            placeholder="Write your message here..." 
            rows="4" 
            cols="50"
            className="input input-vertical"
          />
          <br />
          <button onClick={() => sendMessage(currentUser)} className="vertical-button">Send Message</button>
        </div>
      </Modal>

      <DeleteModal
        showDeletePopUp={showDeletePopUp}
        setShowDeletePopUp={setShowDeletePopUp}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default SalaryList;
