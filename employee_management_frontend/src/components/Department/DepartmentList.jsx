import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import axiosInstance from "../Config/axiosSetup";
import DeleteModal from "../Cnfirm/DeleteModal";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";
import DepartmentForm from "./DepartmentForm";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from '../../LoadingSpinner'; // Import the LoadingSpinner component

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
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/departments");
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setErrorMessage("Failed to fetch departments.");
                setShowErrorAlert(true);
            } finally {
                setIsLoading(false); // Disable loading after data is fetched
            }
        };

        fetchDepartments();
    }, [onEdit, setDepartments]);

    const fetchDepartmentJobs = async (departmentId) => {
        try {
            const response = await axiosInstance.get("/jobs");
            const filteredJobs = response.data.filter(
                (job) => job.department_id === departmentId
            );
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

            setSuccessMessage("Job added successfully!");
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);

            setJobsData({ name: "", description: "", salary: "", department_id: "" });
            setDetailModalOpen(false);
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
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);

            setEditData({ id: null, name: "", description: "", salary: "", department_id: null });
            setDetailModalOpen(false);
            navigate('/departments');
        } catch (error) {
            console.error("Error updating job:", error);
            setErrorMessage("Failed to update job!");
            setShowErrorAlert(true);
        }
    };

    // delete department function
    const deleteDepartment = async (id) => {
        console.log('hh')
        console.log(id)


        setItemToDelete({ type: 'Department', id });
        setShowDeletePopUp(true);
    };
    // delete job function
    const deleteJob = async (id) => {
        console.log('gg')

        setItemToDelete({ type: 'Job', id });
        setShowDeletePopUp(true);
    };
    // 
    const handleDelete = async () => {
        const { type, id } = itemToDelete;
        console.log(type, id)
        try {
            let endpoint = '';
            if (type === 'Department') {
                console.log(type, id)

                endpoint = `/departments/${id}`;
            } else if (type === 'Job') {
                console.log(type, id)

                endpoint = `/jobs/${id}`;
            }

            const response = await axiosInstance.delete(endpoint);
            // Check if the status code is in the 2xx range
            if (response.status >= 200 && response.status < 300) {
                if (type === 'Department') {
                    setDepartments((prevDepartments) => prevDepartments.filter((dept) => dept.id !== id));
                } else if (type === 'Job') {
                    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
                }
                setShowDeletePopUp(false);
                setSuccessMessage(`${type} deleted successfully!`);
                setShowSuccessAlert(true);
            } else {
                console.error(`Failed to delete ${type}:`, response);
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
            department_id: department.id,
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

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const toggleDropdown = (jobId) => {
        setDropdownVisible((prevVisible) => (prevVisible === jobId ? null : jobId));
    };

    return (
        <div className="dep-con">
            {isLoading ? (
                <LoadingSpinner /> // Show the spinner while loading
            ) : (
                <>
                    <DeleteModal
                        showDeletePopUp={showDeletePopUp}
                        setShowDeletePopUp={setShowDeletePopUp}
                        handleDelete={handleDelete}
                        itemType={itemToDelete?.type} // Pass the type (Department/Job)
                    />
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
                                                <img
                                                    src={department.full_logo_path || "/icons/default-logo.png"}
                                                    width="50"
                                                    alt={department.full_logo_path ? "Department Logo" : "Default Logo"}
                                                    onError={(e) => {
                                                        e.target.onerror = null; // Prevent infinite loop
                                                        e.target.src = "/icons/default-logo.png";
                                                    }}
                                                />
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
                                                            deleteDepartment(department.id);
                                                        }}
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
                        isOpen={detailModalOpen}
                        onRequestClose={() => setDetailModalOpen(false)}
                        contentLabel="Department Detail Modal"
                        className="modal modal-content"
                        style={{
                            content: {
                                width: "90%",
                                maxWidth: "900px",
                                right: "80px",
                                left: "auto",
                                margin: "20px",
                                padding: "20px",
                                borderRadius: "8px",
                                position: "fixed",
                                top: "50%",
                                transform: "translateY(-50%)",
                            },

                        }}
                    >
                        <div className="modal-header">
                            <h4>{selectedDepartment?.name}</h4>
                            <img className="closee" src="icons/close1.png" alt="" onClick={() => setDetailModalOpen(false)} />
                        </div>
                        <div className="modal-links">
                            <p
                                onClick={() => setDetailActiveTab("employees")}
                                className={detailActiveTab === "employees" ? "activee" : "nonActive"}
                            >
                                Employees
                            </p>
                            <p
                                onClick={() => setDetailActiveTab("jobs")}
                                className={detailActiveTab === "jobs" ? "activee" : "nonActive"}
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
                                <div>
                                    <form
                                        className="form"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
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

                                    <h4>All Jobs</h4>
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
                                                            onClick={() => toggleDropdown(j.id)}
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
                </>
            )}
        </div>
    );
};

export default DepartmentsList;