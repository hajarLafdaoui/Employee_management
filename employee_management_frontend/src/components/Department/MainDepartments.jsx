import React, { useState } from 'react';
import DepartmentsList from './DepartmentList';
import Modal from 'react-modal';
import DepartmentForm from './DepartmentForm';
import BarChart from './BarChart';
import PieChart from './PieChart';
import SuccessAlert from '../Alerts/SuccessAlert';
import ErrorAlert from '../Alerts/ErrorAlert';
import "./departments.scss";

Modal.setAppElement('#root');

const MainDepartments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = (department = null) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSuccess = (updatedDepartment) => {
    setDepartments((prev) =>
      selectedDepartment
        ? prev.map((dept) => (dept.id === updatedDepartment.id ? updatedDepartment : dept)) // Update existing department
        : [...prev, updatedDepartment] // Add new department
    );

    setSuccessMessage(selectedDepartment ? "Department has been updated!" : "Department has been added!");
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  return (
    <div>
      <div className="DepaHead">
        <h3>Department</h3>
        <div onClick={() => openModal()} className="buttonContainer">
          <img className='plusIcon' src="/icons/icons8-plus-50 (1).png" alt="Add" />
          <button>Add New</button>
        </div>
      </div>

      <div className="graphs">
        <BarChart />
        <PieChart />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Department Modal"
        className="modal-form"
      >
        <div className="modal-header">
          <h2>{selectedDepartment ? "Edit Department" : "Add a Department"}</h2>
          <img src="/icons/close.png" className='close' alt="Close" onClick={closeModal} />
        </div>

        <DepartmentForm
          departments={departments} 
          setDepartments={setDepartments} 
          department={selectedDepartment}
          onClose={closeModal}
          onSuccess={handleSuccess} // Pass the handleSuccess function
          setShowErrorAlert={(message) => {
            setErrorMessage(message);
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
          }}
        />
      </Modal>

      {showSuccessAlert && (
        <SuccessAlert 
          message={successMessage} 
          onClose={() => setShowSuccessAlert(false)} 
        />
      )}

      {showErrorAlert && (
        <ErrorAlert 
          message={errorMessage} 
          onClose={() => setShowErrorAlert(false)} 
        />
      )}

      <DepartmentsList 
        onEdit={openModal} 
        departments={departments} 
        setDepartments={setDepartments} 
      />
    </div>
  );
};

export default MainDepartments;