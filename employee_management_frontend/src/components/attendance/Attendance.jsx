import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import Modal from 'react-modal';
import UpdateAttendance from './UpdateAttendance'; // Import the update form component
import SuccessAlert from '../Alerts/SuccessAlert';
import ErrorAlert from '../Alerts/ErrorAlert';
import DeleteModal from '../Cnfirm/DeleteModal'; // Import the DeleteModal component
import "./attendance.scss"; // Ensure you have a corresponding SCSS file for attendance

Modal.setAppElement('#root');
const Attendance = ({ attendance, currentDate, refreshAttendance }) => {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    // Alert states
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // Delete modal state
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchDepartments = async () => {
        try {
            const resp = await axiosInstance.get("/departments");
            setDepartments(resp.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch departments data.");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const toggleDropdown = (id) => {
        setDropdownVisible(dropdownVisible === id ? null : id);
    };

    const openModal = (id) => {
        setSelectedAttendance(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAttendance(null);
    };

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
        refreshAttendance(); // Refresh attendance data after success
    };

    const handleError = (message) => {
        setErrorMessage(message);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
    };

    const filteredAttendance = attendance.filter((attend) => {
        const filterByDate =
            new Date(attend.attendance_date).toDateString() === currentDate.toDateString();
        const filterByEmployee = attend.user.name.toLowerCase().includes(search.toLowerCase());
        const filterByDepartment = !selectedDepartment || String(attend.user.department_id) === String(selectedDepartment);
        const filterByStatus = !status || String(attend.status) === String(status);
        return filterByDate && filterByEmployee && filterByDepartment && filterByStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentItems = filteredAttendance.slice(startIndex, endIndex);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setConfirmDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteId(null);
        setConfirmDeleteModal(false);
    };

    const deleteAttendance = async () => {
        try {
            await axiosInstance.delete(`/attendance/${deleteId}`);
            handleSuccess("Attendance deleted successfully.");
            closeDeleteModal();
        } catch (error) {
            handleError("Failed to delete attendance.");
        }
    };

    return (
        <div>
            <div className="title-search-sort">
                <h5>Attendance</h5>
                <div className="search-sort search-sortAttendance">
                    <div className="input-search-container">
                        <img src="icons/search.png" alt="" />
                        <input
                            className="input-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search employees..."
                        />
                    </div>
                    <div className="selects">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>

                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All Status</option>
                            {["present", "absent", "leave"].map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th># ID</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.user_id}</td>
                            <td>
                                {entry.user?.profile_picture ? (
                                    <img
                                        src={`http://localhost:8000/storage/${entry.user.profile_picture}`}
                                        alt="Profile"
                                        style={{ width: '38px', height: '38px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                ) : ('No Picture')}
                                {entry.user.name}
                            </td>
                            <td>{entry.user?.country}</td>
                            <td>{entry.user?.role}</td>
                            <td>{entry.user?.department?.name || "No Department"}</td>
                            <td className='conCon'>
                                <span className='contact'>{entry.user.email} </span><br className="spacer" />
                                <span className='contact marginPhone'>{entry.user.phone}</span>
                            </td>
                            <td>{entry.status}</td>
                            <td>
                                <img
                                    src={dropdownVisible === entry.id ? "/icons/more2.png" : "/icons/more.png"}
                                    alt="More"
                                    onClick={() => toggleDropdown(entry.id)}
                                    style={{ width: "30px", cursor: "pointer" }}
                                />
                                {dropdownVisible === entry.id && (
                                    <div className="more-dropdown">
                                        <div onClick={() => openModal(entry.id)} className="edit-container">
                                            <img className="edit-icon" src="/icons/edit.png" alt="Edit" />
                                            <p>Edit</p>
                                        </div>

                                        <div className="edit-container" onClick={() => openDeleteModal(entry.id)}>
                                            <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
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

                {[...Array(totalPages).keys()]
                    .slice(
                        Math.max(0, Math.min(currentPage - 2, totalPages - 3)),
                        Math.max(3, Math.min(currentPage + 1, totalPages))
                    )
                    .map((index) => (
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
                        pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                    }}
                >
                    <span className="material-icons">
                        <img src="icons/right-arrow.png" alt="right" />
                    </span>
                </li>
            </div>

                {/* Update Attendance Modal */}
<Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Edit Attendance"
    className="modal-form"
>
    <div className="modal-header">
        <h2>Edit Attendance</h2>
        <img src="/icons/close.png" className='close' alt="Close" onClick={closeModal} />
    </div>

    {selectedAttendance ? (
        <UpdateAttendance
            id={selectedAttendance}
            onClose={closeModal} // Pass the closeModal function
            onSuccess={handleSuccess} // Pass the handleSuccess function
            onError={handleError} // Pass the handleError function
        />
    ) : (
        <p>Loading...</p>
    )}
</Modal>
                {/* Delete Confirmation Modal */}
                {/* Delete Confirmation Modal */}
                <DeleteModal
                    showDeletePopUp={confirmDeleteModal}
                    setShowDeletePopUp={setConfirmDeleteModal}
                    handleDelete={deleteAttendance}
                    itemType="attendance"
                />

                {/* Success and Error Alerts */}
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
            </div>

            );
};

            export default Attendance;