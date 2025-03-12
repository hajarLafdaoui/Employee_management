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
import "./SalaryList.scss"

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
  const [salaryDetails, setSalaryDetails] = useState(null);  
  const [baseSalary, setBaseSalary] = useState("");
  const [department, setDepartment] = useState("");
  const [job, setJob] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);
  const rowsPerPage = 4;

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    filterSalaries();
  }, [nameSearch, dateSearch, salaries]);
const fetchSalaryDetails = async (id) => {
  try {
    
    const response = await axiosInstance.get(`/salaries/${id}`);
    console.log("Fetched Salary Details:", response.data); 
    setSalaryDetails(response.data.salary);
    setDepartment(response.data.department);
    setBaseSalary(response.data.basesalary);
    setJob(response.data.job);
    setShowSidebar(true); 
  } catch (err) {
    setError('An error occurred while fetching salary details.');
    setShowErrorAlert(true);
  }
};
useEffect(() => {
  console.log("Sidebar State:", showSidebar, "Salary Details:", salaryDetails);
}, [showSidebar, salaryDetails]);
  
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
        setShowSuccessAlert();
        setTimeout(() => {
          setShowSuccessAlert(true);
      }, 5000);
      } catch (err) {
        setError('Error deleting salary.');
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(true);
        }, 5000);
      }
    }
  };

  const sendMessage = async (user) => {
    if (!message.trim()) {
      setStatusMessage('Message cannot be empty.');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(true);
      }, 5000);
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
      setShowSuccessAlert();
      setTimeout(() => {
        setShowSuccessAlert(true);
    }, 5000);
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again.');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(true);
      }, 5000);
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


{showSidebar &&salaryDetails &&(
        <div className="salary-details-sidebar show">
                   

          <div className="sidebar-header">
          <div className="img-container">

            <img src="img/images3.jpg" alt="" className="imgdetails" />
            <button onClick={() => setShowSidebar(false)} className="btn1">
                    <img src="icons/close1.png" alt="" className="iconsuser" />

            </button>
          </div>
          </div>
          <div className="salary-details-content">
            <div className="head-user">
              <div className="imguser">
              <img src="img/images.jpg" alt=""  />
              </div>
           
          
            <p className="name">{salaryDetails.user.name}</p>
            <p> {job.name}</p>


            </div>
            <div className="total">
            <div className="totalatten"><p className="numbertitle">attendances</p><p className="number">{salaryDetails.attendances}days</p> </div>
            <div className="totalleave"><p className="numbertitle">leaves</p><p className="number">{salaryDetails.leaves}days</p> </div>

              </div>
            <div className="detais-user">
              <h4>Basic informition</h4>
            <p > <img src="icons/telephone.png" alt="" className="iconsuser" />phone..................{salaryDetails.user.phone}</p>
            <p><img src="icons/email.png" alt="" className="iconsuser" /> email..................{salaryDetails.user.email}</p>
            <p><img src="icons/countries.png" alt="" className="iconsuser" />country...............{salaryDetails.user.country}</p>

            <h4>Salary information</h4>
            <p>base salary.................{baseSalary} DH</p>
            <p>salary net...................{salaryDetails.total_salary}DH</p>
            <p>paid_on......................{new Date(salaryDetails.paid_on).toLocaleDateString()}</p>
            
            </div>
            <div className="items">
            <Link to={`/salary/${salaryDetails.id}`}  className="viewlink">
            <img className="viewicon" src="/icons/print1.png" alt="" />
          print 
            </Link>
            <div
                        onClick={() => handleShowMessageForm(salaryDetails.user)}
                  className="viewlink"
                      >
                       <img src="icons/email.png" alt=""  className="email"/>send email
                      </div>
                      </div>
          </div>
         
        </div>
      )}
    
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
          <img className='plusIcon' src="/icons/icons8-plus-50 (1).png"  alt="Add" />
          <Link to="/payroll">
            <button>Add Salary</button>
          </Link>
        </div>
      </div>
      <div className="">
      <div className="search-sort">
  <div className="input-search-container">
    <img src="icons/search.png" alt="search icon" />
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

  <div className="input-container">
    <input
      className="date-input"
      type="date"
      value={dateSearch}
      onChange={(e) => setDateSearch(e.target.value)}
      placeholder="Paid"
    />
    <img src="icons/calender.png" alt="calendar icon" className="email" />
   
  </div>
</div>

        {filteredSalaries.length === 0 ? (
          <p>No salaries found.</p>
        ) : (
          <div className="table-wrapper">
            <div className="table-header">
            <div>img</div>
              <div>Name</div>
              <div>Day Paid</div>
              <div>Start Date</div>
              <div>End Date</div>
              {/* <div>Attendances</div>
              <div>Leaves</div> */}
              <div>Total Salary</div>
              <div>Actions</div>
            </div>
            {getPaginatedSalaries().map((salary) => (
              <div key={salary.id} className="table-row">
                
                {/* <div><img src="{salary.user.profile_picture}" className="userprofile" alt="" /></div> */}
                <div> <img src="img/images.jpg" alt="#"className="userprofile" /></div>
                <div>{salary.user.name}</div>
                <div>{salary.paid_on}</div>
                <div>{salary.start_date}</div>
                <div>{salary.end_date}</div>
                {/* <div>{salary.attendances}</div>
                <div>{salary.leaves}</div> */}
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
                                    <div
      onClick={() => fetchSalaryDetails(salary.id)} 
      className="view-link"
    >
      <img className="view-icon" src="/icons/view.png" alt="View" />
    </div>
                      <Link to={`/salary/${salary.id}`}  className="view-link">
                        <img className="view-icon" src="/icons/print1.png" alt="" />
                      </Link>
                   
                      <div
                        onClick={() => handleShowMessageForm(salary.user)}
                        className="send-message-button"
                      >
                       <img src="icons/email.png" alt=""  className="view-icon"/>
                      </div>
                      <div
                        onClick={() => {
                          setDeleteSalaryId(salary.id);
                          setShowDeletePopUp(true);
                        }}
                        className="delete-container"
                      >
                        <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                      </div>
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
          overlayClassName="Department Detail Modal"
          contentLabel="Department Modal"
        className="modal-form"        >
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
            {sending ? <LoadingSpinner /> : <button onClick={() => sendMessage(currentUser)}>Send Message</button>}
          </div>
         
        </Modal>

        <DeleteModal
                                                showDeletePopUp={showDeletePopUp}
                                                setShowDeletePopUp={setShowDeletePopUp}
                                                handleDelete={handleDelete}
                                                itemType="department"
                                            />
      </div>

     






    </div>
  );
};

export default SalaryList;
