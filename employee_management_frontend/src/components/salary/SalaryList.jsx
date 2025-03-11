import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import emailjs from '@emailjs/browser';
import LoadingSpinner from "../../LoadingSpinner";
import DeleteModal from "../Cnfirm/DeleteModal";
import Modal from "react-modal";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import "../EmployeeList.scss"

import { CalendarIcon } from "@heroicons/react/solid";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);  
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [deleteSalaryId, setDeleteSalaryId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameSearch, setNameSearch] = useState('');  
  const [dateSearch, setDateSearch] = useState(''); 

  const rowsPerPage = 4;

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    filterSalaries();
  }, [nameSearch, dateSearch, salaries]);

  const fetchSalaries = async () => {
    try {
      const response = await axiosInstance.get('/salaries');
      setSalaries(response.data.salaries);
      setFilteredSalaries(response.data.salaries);
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
    if (!message.trim()) {
      setStatusMessage('Message cannot be empty.');
      setShowErrorAlert(true);
      return;
    }

    setSending(true);  
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
    } finally {
      setSending(false); 
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

  const getPaginatedSalaries = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredSalaries.slice(startIndex, endIndex); 
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSalaries.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filterSalaries = () => {
    let filtered = salaries;
    if (nameSearch) {
      filtered = filtered.filter(salary => salary.user.name.toLowerCase().includes(nameSearch.toLowerCase()));
    }
    if (dateSearch) {
      filtered = filtered.filter(salary => salary.paid_on.includes(dateSearch));
    }
    setFilteredSalaries(filtered);
    setCurrentPage(1); 
  };

  useEffect(() => {
    if (getPaginatedSalaries().length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  }, [filteredSalaries]);

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
          <Link to="/payroll">
            <button>Add Salary</button>
          </Link>
        </div>
      </div>
      <div className="">
        <div className="search-sort">
          <div className="input-search-container">
            <img src="icons/search.png" alt="" />
            <input
              className="input-search"
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search by Name"
            />
            {nameSearch && (
              <button onClick={() => setNameSearch('')}>Clear</button>
            )}
          </div>
          <div className="input-search-container">
            <input
            className="date-input"
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              placeholder="Search by Date"
            />
            {dateSearch && (
              <button onClick={() => setDateSearch('')}>Clear</button>
            )}
          </div>
        </div>

        {filteredSalaries.length === 0 ? (
          <p>No salaries found.</p>
        ) : (
          <div className="table-wrapper">
            <div className="table-header">
              <div>Name</div>
              <div>Day Paid</div>
              <div>Start Date</div>
              <div>End Date</div>
              <div>Attendances</div>
              <div>Leaves</div>
              <div>Total Salary</div>
              <div>Actions</div>
            </div>
            {getPaginatedSalaries().map((salary) => (
              <div key={salary.id} className="table-row">
                <div>{salary.user.name}</div>
                <div>{salary.paid_on}</div>
                <div>{salary.start_date}</div>
                <div>{salary.end_date}</div>
                <div>{salary.attendances}</div>
                <div>{salary.leaves}</div>
                <div>{salary.total_salary}</div>
                <div className="actions">
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
                      <button
                        onClick={() => handleShowMessageForm(salary.user)}
                        className="send-message-button"
                      >
                        Send Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="page">
          <li
            className="page__btn"
            onClick={prevPage}
            style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
          >
            <span className="material-icons">
              <img src="icons/left-arrow.png" alt="left" />
            </span>
          </li>
          {[...Array(Math.ceil(filteredSalaries.length / rowsPerPage)).keys()].map((index) => (
            <li
              key={index + 1}
              className={`page__numbers ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </li>
          ))}
          <li
            className="page__btn"
            onClick={nextPage}
            style={{
              pointerEvents: currentPage === Math.ceil(filteredSalaries.length / rowsPerPage) ? 'none' : 'auto',
            }}
          >
            <span className="material-icons">
              <img src="icons/right-arrow.png" alt="right" />
            </span>
          </li>
        </div>

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
              aria-label="Close modal"
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
            {sending ? <LoadingSpinner /> : <button onClick={() => sendMessage(currentUser)} className="vertical-button">Send Message</button>}
          </div>
        </Modal>

        <DeleteModal
          showDeletePopUp={showDeletePopUp}
          setShowDeletePopUp={setShowDeletePopUp}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default SalaryList;
