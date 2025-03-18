import React, { useState, useEffect } from "react";
import axiosInstance from '../Config/axiosSetup';
import Modal from "react-modal";
import "../Department/departments.scss";
import DeleteModal from "../Cnfirm/DeleteModal";
import LoadingSpinner from "../../LoadingSpinner";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";

const AdminHolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [editHoliday, setEditHoliday] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(null);


  const toggleDropdown = (holidayId) => {
    setDropdownVisible(dropdownVisible === holidayId ? null : holidayId);
  };
  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axiosInstance.get("/holidays");
      setHolidays(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage("Failed to fetch holidays.");
      setShowErrorAlert(true);
    }
  };

  const addHoliday = async () => {
    try {
      await axiosInstance.post("/holidays", newHoliday);
      fetchHolidays();
      setNewHoliday({ name: "", date: "" });
      setShowModal(false);
      setSuccessMessage("Holiday added successfully.");
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage("Failed to add holiday.");
      setShowErrorAlert(true);
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await axiosInstance.delete(`/holidays/${id}`);
      fetchHolidays();
      setShowDeletePopUp(true);
      setSuccessMessage("Holiday deleted successfully.");
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage("Failed to delete holiday.");
      setShowErrorAlert(true);
    }
  };

  const handleEditHoliday = (holiday) => {
    setEditHoliday(holiday);
    setNewHoliday({ name: holiday.name, date: holiday.date, number_of_days: holiday.number_of_days });
    setShowModal(true);
  };

  const updateHoliday = async () => {
    try {
      await axiosInstance.put(`/holidays/${editHoliday.id}`, newHoliday);
      fetchHolidays();
      setNewHoliday({ name: "", date: "" });
      setShowModal(false);
      setEditHoliday(null);
      setSuccessMessage("Holiday updated successfully.");
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage("Failed to update holiday.");
      setShowErrorAlert(true);
    }
  };

  const confirmDeleteHoliday = (holidayId) => {
    setHolidayToDelete(holidayId);
    setShowDeletePopUp(true);
  };

  const handleDelete = async () => {
    await deleteHoliday(holidayToDelete);
    setShowDeletePopUp(false);
    setHolidayToDelete(null);
  };

  const handleCreateHoliday = () => {
    setNewHoliday({ name: "", date: "" });
    setEditHoliday(null);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
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

      <div className="DepaHead">
        <h4>Manage Holidays</h4>
        <div onClick={handleCreateHoliday} className="buttonContainer">
          <img className='plusIcon' src="/icons/icons8-plus-50 (1).png" alt="Add" />
          <button>Add New</button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel={editHoliday ? "Edit Holiday" : "Add New Holiday"}
        overlayClassName="Department Detail Modal"
        className="modal-form"
      >
        <div className="modal-header">
          <h3>{editHoliday ? "Edit Holiday" : "Add New Holiday"}</h3>
          <span
            className="modal-close"
            onClick={() => setShowModal(false)}
          >
            <img className="close" src="icons/close.png" alt="close" />
          </span>
        </div>
        <form className="form form-vertical">
          <div className="inputs inputs-vertical">
            <div className="input-group">
              <input
                placeholder=" "
                required
                type="text"
                name="name"
                autoComplete="off"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                className="input input-vertical"
              />
              <label className="user-label">Holiday Name</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                required
                type="date"
                name="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                className="input input-vertical"
              />
              <label className="user-label">Holiday Date</label>
            </div>

            <div className="input-group">
              <input
                placeholder=" "
                required
                type="text"
                name="date"
                value={newHoliday.number_of_days}
                onChange={(e) => setNewHoliday({ ...newHoliday, number_of_days: e.target.value })}
                className="input input-vertical"
              />
              <label className="user-label">Holiday Number</label>
            </div>

            <div className="button-group">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (editHoliday) {
                    updateHoliday();
                  } else {
                    addHoliday();
                  }
                }}
                className="button-form vertical-button-form"
              >
                {editHoliday ? "Update Holiday" : "Add Holiday"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="table-wrapper">
        <div className="table-header">
          <div>Holiday Name</div>
          <div>Holiday Date</div>
          <div>Number of Days</div>

          <div>Actions</div>
        </div>

        {holidays.map((holiday) => (
          <div key={holiday.id} className="table-row">
            <div>{holiday.name}</div>
            <div>{holiday.date}</div>
            <div>{holiday.number_of_days}</div>

            <div >
              <img
                src={dropdownVisible === holiday.id ? "/icons/more2.png" : "/icons/more.png"}
                alt="More"
                onClick={() => toggleDropdown(holiday.id)}
                style={{ width: "24px", cursor: "pointer" }}
              />
              {dropdownVisible === holiday.id && (
                                    <div style={{display:"flex", flexDirection:'column', gap: '0'}} className="more-dropdown">
                  <div
                    onClick={() => {
                      handleEditHoliday(holiday);
                      setDropdownVisible(null);
                    }}
                    className="dropdown-item"
                  >
                    <img className="edit-icon" src="/icons/edit.png" alt="Edit" />
                    <span>Edit</span>
                  </div>
                  <div
                    onClick={() => {
                      confirmDeleteHoliday(holiday.id);
                      setDropdownVisible(null);
                    }}
                    className="dropdown-item"
                  >
                    <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                    <span>Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <DeleteModal
        showDeletePopUp={showDeletePopUp}
        setShowDeletePopUp={setShowDeletePopUp}
        handleDelete={handleDelete}
        itemType="holiday"
        itemId={holidayToDelete}
      />
    </div>
  );
};

export default AdminHolidayManagement;
