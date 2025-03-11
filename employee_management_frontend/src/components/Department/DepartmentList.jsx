import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import axiosInstance from "../Config/axiosSetup";
import DeleteModal from "../Cnfirm/DeleteModal";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import DepartmentForm from "./DepartmentForm";
import { useNavigate } from "react-router-dom";

const DepartmentsList = ({ onEdit, departments, setDepartments }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedLogo, setUpdatedLogo] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [jobsData, setJobsData] = useState({
        name: "",
        description: "",
        salary: "",
        department_id: null,
    });
    const [editData, setEditData] = useState({
        id: null,
        name: "",
        description: "",
        salary: "",
        department_id: null,
    });
    const [employees, setEmployees] = useState([]);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailActiveTab, setDetailActiveTab] = useState("employees");
    const columns = ["id", "name", "email", "username", "gender"];
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [sortOrder, setSortOrder] = useState("alphabetical");
    const [currentPage, setCurrentPage] = useState(1);
    const [departmenId, setDepartmenId] = useState();
    const rowsPerPage = 4;
    const [search, setSearch] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/departments")
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Error fetching departments:", error));
    }, [onEdit]);

    const fetchDepartmentJobs = async (departmentId) => {
        try {
            const response = await axiosInstance.get("/jobs");
            const filteredJobs = response.data.filter(
                (job) => job.department_id === departmentId
            );
            // setJobs([...jobs, response.data]);
            // setJobsData({ name: "", description: "", salary: "", department_id: jobsData.department_id });
            setJobs(filteredJobs);
        } catch (error) {
            console.error("Error fetching department jobs:", error);
        }
    };

    const fetchEmployees = async (departmentId) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/departments/${departmentId}/employees`
            );
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    const addJob = async (jobData) => {
        try {
            const response = await axiosInstance.post("/jobs", jobData);
            setJobs((prevJobs) => [...prevJobs, response.data]);

            // thiiiiiis one
            setSuccessMessage("Job added successfully!");
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
            // to thiiiis

            // Clear inputs
            setJobsData({ name: "", description: "", salary: "", department_id: "" });

          
            // Close the detail modal
            setDetailModalOpen(false);

            // Redirect to /departments
            navigate('/departments');
        } catch (error) {
            setErrorMessage("Failed to add job!");
            setShowErrorAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);

            console.error("Error adding job:", error);
        }
    };

    const updateJob = async (jobId, updatedJobData) => {
        try {
            const response = await axiosInstance.put(`/jobs/${jobId}`, updatedJobData);
    
            setJobs((prevJobs) =>
                prevJobs.map((job) => (job.id === jobId ? response.data : job))
            );
    
            setSuccessMessage("Job updated successfully!");
            setShowSuccessAlert(true);
    
            // Hide the success alert after 5 seconds
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
    
            // Clear inputs
            setEditData({ id: null, name: "", description: "", salary: "", department_id: null });
    
            // Close the detail modal
            setDetailModalOpen(false);
    
            // Redirect to /departments
            navigate('/departments');
        } catch (error) {
            console.error("Error updating job:", error);
            setErrorMessage("Failed to update job!");
            setShowErrorAlert(true);
        }
    };
    const deleteDepartment = async (id) => {
        setItemToDelete({ type: 'Department', id });
        setShowDeletePopUp(true);
    };
    // delete job function
    const deleteJob = async (id) => {
        setItemToDelete({ type: 'Job', id });
        setShowDeletePopUp(true);
    };
    // 
    const handleDelete = async () => {
        const { type, id } = itemToDelete;
        try {
            let endpoint = '';
            if (type === 'Department') {
                endpoint = `/departments/${id}`;
            } else if (type === 'Job') {
                endpoint = `/jobs/${id}`;
            }
    
            const response = await axiosInstance.delete(endpoint);
            if (response.status === 200) {
                if (type === 'Department') {
                    setDepartments((prevDepartments) => prevDepartments.filter((dept) => dept.id !== id));
                    // Close the detail modal
                    setDetailModalOpen(false);
    
                    // Redirect to /departments
                    navigate('/departments');
                } else if (type === 'Job') {
                    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
                    // Close the detail modal
                    setDetailModalOpen(false);
    
                    // Redirect to /departments
                    navigate('/departments');
                }
    
                // Show the success alert
                setShowDeletePopUp(false);
                setSuccessMessage(`${type} deleted successfully!`);
                setShowSuccessAlert(true);
    
                // Hide the success alert after 5 seconds
                setTimeout(() => {
                    setShowSuccessAlert(false);
                }, 5000);
    
            } else {
                console.error(`Failed to delete ${type}: ${response.data.message}`);
                setErrorMessage(`Failed to delete ${type}.`);
                setShowErrorAlert(true);
            }
        } catch (error) {
            console.error("Error deleting:", error);
            setErrorMessage(`Failed to delete ${type}. Please try again.`);
            setShowErrorAlert(true);
        }
    };
    

    const openEditModal = (department) => {
        setSelectedDepartment(department);
        setUpdatedName(department.name);
        setUpdatedDescription(department.description);
        setUpdatedLogo(department.logo);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDepartment(null);
    };

    const openDetailModal = (department) => {
        setSelectedDepartment(department);
        setDetailModalOpen(true);
        setDetailActiveTab("employees");
        fetchEmployees(department.id);
        fetchDepartmentJobs(department.id);
        setJobsData((prevData) => ({
            ...prevData,
            department_id: department.id, // Set the department_id here
        }));
    };
    const filteredDepartments = [...departments]

        .filter((department) => department?.name?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === "alphabetical") {
                return a.name.localeCompare(b.name);
            } else if (sortOrder === "newest") {
                return b.id - a.id;
            } else {
                return a.id - b.id;
            }
        });

    const toggleSort = () => {
        setSortOrder((prevOrder) =>
            prevOrder === "alphabetical" ? "newest" : prevOrder === "newest" ? "oldest" : "alphabetical"
        );
    };

    const getPaginationRange = () => {
        const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
        const maxPagesToShow = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };
    const getPaginatedDepartments = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredDepartments.slice(startIndex, endIndex);
    };

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to go to the next page
    const nextPage = () => {
        const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const toggleDropdown = (jobId) => {
        console.log("Toggling dropdown for job ID:", jobId); // Debugging
        setDropdownVisible((prevVisible) => (prevVisible === jobId ? null : jobId));
    };

    return (
        <div className="dep-con">
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
            <div className="tableContainer">
                <div className="title-search-sort">
                    <p>All Departments</p>
                    <div className="search-sort">
                        <div className="input-search-container">
                            <img src="icons/search.png" alt="" />
                            <input
                                className="input-search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search departments..."
                            />
                        </div>
                        <div className="sortingConatiner">
                            <img src="icons/sorting.png" alt="" />
                            <p onClick={toggleSort}>
                                {sortOrder === "alphabetical"
                                    ? "Sort by Newest"
                                    : sortOrder === "newest"
                                        ? "Sort by Oldest"
                                        : "Sort Alphabetically"}
                            </p>
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedDepartments().length > 0 ? (
                            getPaginatedDepartments()?.map((department) => (
                                <tr key={department.id} {...department}>
                                    <td>
                                        {department?.full_logo_path ? (
                                            <img
                                                src={department.full_logo_path}
                                                width="50"
                                                alt="Logo"
                                            />
                                        ) : (
                                            <p>No logo available</p>
                                        )}
                                    </td>
                                    <td>{department?.name || 'No Name Available'}</td>
                                    <td>{department?.description || 'No Description Available'}</td>
                                    <td>
                                        <div className="action-icons">
                                            <img
                                                className="edit2-icon"
                                                src="/icons/edit2.png"
                                                alt="Edit"
                                                onClick={() => onEdit(department)}
                                            />
                                            <img
                                                className="delete-icon"
                                                src="/icons/delete.png"
                                                alt="Delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteDepartment(department.id); // Or deleteJob(job.id) based on the item
                                                }}
                                            />
                                            {/*  */}

                                            <DeleteModal
                                                showDeletePopUp={showDeletePopUp}
                                                setShowDeletePopUp={setShowDeletePopUp}
                                                handleDelete={handleDelete}
                                                itemType="department"
                                                itemId={departmenId} // Pass the specific ID here
                                            />

                                            <img
                                                className="view-icon"
                                                src="/icons/view.png"
                                                alt="View"
                                                onClick={() => openDetailModal(department)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">No departments available</td></tr>
                        )}
                    </tbody>
                </table>
               
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
                {getPaginationRange().map((pageNumber) => (
                    <li
                        key={pageNumber}
                        className={`page__numbers ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                ))}
                <li
                    className="page__btn"
                    onClick={nextPage}
                    style={{
                        pointerEvents: currentPage === Math.ceil(filteredDepartments.length / rowsPerPage) ? 'none' : 'auto',
                    }}
                >
                    <span className="material-icons">
                        <img src="icons/right-arrow.png" alt="right" />
                    </span>
                </li>
            </div>
            </div>
            <Modal
                isOpen={detailModalOpen} // Ensure this is correctly bound
                onRequestClose={() => setDetailModalOpen(false)} // Close modal on request
                contentLabel="Department Detail Modal"
                className="modal modal-content"
            >
                {/* Modal content */}
                <div className="modal-header">
                    <h2>{selectedDepartment?.name}</h2>
                    <img className="close" src="icons/close.png" alt="" onClick={() => setDetailModalOpen(false)} />
                </div>
                <div className="modal-links">
                    <p
                        onClick={() => setDetailActiveTab("employees")}
                        className={detailActiveTab === "employees" ? "active" : "nonActive"}
                    >
                        Employees
                    </p>
                    <p
                        onClick={() => setDetailActiveTab("jobs")}
                        className={detailActiveTab === "jobs" ? "active" : "nonActive"}
                    >
                        Jobs
                    </p>
                </div>
                <div className="content">
                    {detailActiveTab === "employees" && (
                        <div>
                            {employees.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            {columns.map((col) => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee) => (
                                            <tr key={employee.id}>
                                                {columns.map((col) => (
                                                    <td key={col}>
                                                        {col === "job"
                                                            ? employee.job
                                                                ? employee.job.name
                                                                : "N/A"
                                                            : employee[col]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No employees found for this department.</p>
                            )}
                        </div>
                    )}

                    {detailActiveTab === "jobs" && (
                        <div><form
                            className="form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                console.log("Form submitted with editData:", editData); // Debugging
                                console.log("Form submitted with jobsData:", jobsData); // Debugging

                                if (editData.id === null) {
                                    await addJob(jobsData);
                                } else {
                                    await updateJob(editData.id, jobsData);
                                }
                            }}
                        >
                            <div className="inputs inputs-med">
                                <div className="input-group input-group-med">
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        autoComplete="off"
                                        value={jobsData.name}
                                        onChange={(e) =>
                                            setJobsData({ ...jobsData, name: e.target.value })
                                        }
                                        className="input input-med"
                                    />
                                    <label className="user-label">Job Name</label>
                                </div>

                                <div className="input-group input-group-med">
                                    <input
                                        required
                                        type="text"
                                        name="description"
                                        autoComplete="off"
                                        value={jobsData.description}
                                        onChange={(e) =>
                                            setJobsData({ ...jobsData, description: e.target.value })
                                        }
                                        className="input input-med"
                                    />
                                    <label className="user-label">Job Description</label>
                                </div>

                                <div className="input-group input-group-med">
                                    <input
                                        required
                                        type="number"
                                        name="salary"
                                        autoComplete="off"
                                        value={jobsData.salary}
                                        onChange={(e) =>
                                            setJobsData({ ...jobsData, salary: e.target.value })
                                        }
                                        className="input input-med"
                                    />
                                    <label className="user-label">Salary</label>
                                </div>
                            </div>
                            <button className=" button-form button-med" type="submit">
                                {editData && editData.id ? "Update Job" : "Add Job"}
                            </button>
                        </form>

                            <h2>All Jobs</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((j, index) => (
                                        <tr key={index}>
                                            <td>{j.name}</td>
                                            <td>{j.description}</td>
                                            <td>${j.salary}</td>
                                            <td>
                                                <img
                                                    src={dropdownVisible === j.id ? "/icons/more2.png" : "/icons/more.png"}
                                                    alt="More"
                                                    onClick={() => toggleDropdown(j.id)} // Correctly calling toggleDropdown
                                                    style={{ width: "30px", cursor: "pointer" }}
                                                />
                                                {dropdownVisible === j.id && (
                                                    <div className="more-dropdown">
                                                        <div
                                                            onClick={() => {
                                                                setEditData(j);
                                                                setJobsData(j);
                                                            }}
                                                            className="edit-container"
                                                        >
                                                            <img className="edit-icon" src="/icons/edit.png" alt="Edit" />
                                                            <p>Edit</p>
                                                        </div>
                                                        <div
                                                            className="edit-container"

                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteJob(j.id);

                                                            }}
                                                        >
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
                        </div>
                    )}
                </div>
            </Modal>

            {/* {showDeletePopUp && (
                <DeleteModal
                    setShowDeletePopUp={setShowDeletePopUp}
                    handleDelete={handleDelete}
                    itemType={itemToDelete?.type}
                    itemId={itemToDelete?.id}
                />
            )} */}
        </div>
    );
};

export default DepartmentsList;