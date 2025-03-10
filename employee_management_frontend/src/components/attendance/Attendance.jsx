import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import Modal from 'react-modal';
import UpdateAttendance from './UpdateAttendance'; // Import the update form component
import SuccessAlert from '../Alerts/SuccessAlert';
import ErrorAlert from '../Alerts/ErrorAlert';
import "./attendance.scss"; // Ensure you have a corresponding SCSS file for attendance

Modal.setAppElement('#root');

const Attendance = ({ attendance, currentDate }) => {
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
        console.log("Opening modal with ID:", id);
        setSelectedAttendance(id); // Only set the ID
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setSelectedAttendance(null);
    };

    const handleSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
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

    if (!attendance.length) return <div>Loading...</div>;

    return (
        <div>
            <div className="title-search-sort">
                <h5>Attendance</h5>
                <div className="search-sort">
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

                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">All Departments</option>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Status</option>
                        {['present', 'absent', 'leave'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th className="table-header"># ID</th>
                        <th className="table-headerr">
                            <span>Name</span>
                        </th>
                        <th className="table-header">
                            <span>Country</span>
                        </th>
                        <th className="table-header">
                            <span>Role</span>
                        </th>
                        <th className="table-header">
                            <span>Department</span>
                        </th>
                        <th className="table-header">
                            <span>Contact</span>
                        </th>
                        <th className="table-header">
                            <span>Status</span>
                        </th>
                        <th className="table-header">
                            <span>Actions</span>
                        </th>
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

                                        <div className="edit-container" onClick={() => window.location.href = `/DeleteAttendance/${entry.id}`}>
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
                        onClose={closeModal}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                ) : (
                    <p>Loading...</p>
                )}
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
        </div>
    );
};

export default Attendance;