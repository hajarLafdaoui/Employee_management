import React, { useState } from 'react';
import DepartmentsList from './DepartmentList';
import Modal from 'react-modal';
import AddDepartment from './AddDepartment';
import BarChart from './BarChart';
import PieChart from './PieChart';
import "./departments.scss";


Modal.setAppElement('#root');

const MainDepartments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="DepaHead">
        <h3>Department</h3>

        <div className="buttonContainer">
          <img className='plusIcon' src="/icons/plus.png" alt="Logo" />

          <button onClick={openModal}>
            Add New
          </button>
        </div>

      </div>

      <div className="graphs">
        <BarChart />
        <PieChart></PieChart>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Department"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Department</h2>
        <img src="/icons/close.png" alt="Logo" onClick={closeModal} />

        <AddDepartment />
        <button onClick={closeModal}>Close</button>
      </Modal>

      <DepartmentsList />
    </div>
  );
};

export default MainDepartments;
