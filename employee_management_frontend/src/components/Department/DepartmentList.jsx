import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import EditDepartment from "./EditDepartment";
import axiosInstance from "../Config/axiosSetup";
import DeleteModal from "../Cnfirm/DeleteModal";
import SuccessAlert from "../Alerts/SuccessAlert"; // Import your alert component
import ErrorAlert from "../Alerts/ErrorAlert";
import DepartmentForm from "./DepartmentForm";


const DepartmentsList = ({ onEdit }) => { // ✅ Accept `onEdit` as a prop
    const [departments, setDepartments] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedLogo, setUpdatedLogo] = useState(null);
    const [jobsModal, setJobsModal] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [jobsData, setJobsData] = useState({
        name: "",
        description: "",
        salary: "",
        department_id: "",
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        name: "",
        description: "",
        salary: "",
        department_id: null,
    });
    const [employeesModal, setEmployeesModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailActiveTab, setDetailActiveTab] = useState("employees");
    const columns = ["id", "name", "email", "username", "gender"];
    const [dropdownVisible, setDropdownVisible] = useState(null); const toggleDropdown = (id) => {
        setDropdownVisible(dropdownVisible === id ? null : id);
    };
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [jobId, setJobId] = useState(false);
    const [departmenId, setDepartmenId] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(""); // Alert message state
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Alert visibility
    const [errorMessage, setErrorMessage] = useState(""); // Alert message state
    const [showErrorAlert, setShowErrorAlert] = useState(false); // Alert visibility


    // departments list 
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/departments")
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Error fetching departments:", error));
    }, []);

    // jobs list
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

    // employees list
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

    // add/edit job
    const handleJobSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editData.id === null) {
                // Add new job
                const response = await axiosInstance.post("/jobs", jobsData);
                setJobs((prevJobs) => [...prevJobs, response.data]); // Update UI
                setSuccessMessage("Job added successfully!");
            } else {
                // Update job
                const response = await axiosInstance.put(`/jobs/${editData.id}`, jobsData);
                setJobs((prevJobs) =>
                    prevJobs.map((job) => (job.id === editData.id ? response.data : job))
                );
                setSuccessMessage("Job edited successfully!");
            }
        
            setShowSuccessAlert(true);
            setShowEditForm(false);
            setJobsData({ name: "", description: "", salary: "", department_id: "" }); // Reset form
        } catch (error) {
            if (editData.id === null) {
                setErrorMessage("Failed to add job!");
            } else {
                setErrorMessage("Failed to edit job!");
            }
            console.error("Error processing job:", error);
            setShowErrorAlert(true); // Show alert
        }
    }
    
    

    // delete department function
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
                } else if (type === 'Job') {
                    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
                }
                setShowDeletePopUp(false);
                setSuccessMessage(`${type} deleted successfully!`);
                setShowSuccessAlert(true);
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
        setUpdatedName(department.name || "");
        setUpdatedDescription(department.description || "");
        setUpdatedLogo(null);
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
    };
    return (
        <div>
            {/* alert */}
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
                    {departments.length > 0 ? (
                        departments.map((department) => (
                            <tr key={department.id}>
                                <td>
                                    <img
                                        src={department.full_logo_path}
                                        alt={department.name}
                                        width="50"
                                    />
                                </td>
                                <td>{department.name}</td>
                                <td>{department.description}</td>
                                <td>
                                    <div className="action-icons">
                                        <img
                                            className="edit2-icon"
                                            src="/icons/edit2.png"
                                            alt="Edit"
                                            onClick={() => onEdit(department)} // ✅ Use `onEdit`

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
                                        {/*  */}
                                        <img
                                            className="view-icon"
                                            src="/icons/view.png"
                                            alt="View"
                                            onClick={() => {
                                                setJobsData((prev) => ({
                                                    ...prev,
                                                    department_id: department.id,
                                                }));
                                                openDetailModal(department);
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No departments available.</td>
                        </tr>
                    )}
                </tbody>
            </table>



           

            {/* Employees Modal */}
            <Modal
                isOpen={employeesModal}
                onRequestClose={() => setEmployeesModal(false)}
                contentLabel="Employees"
            >
                {employees.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.username}</td>
                                    <td>{employee.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employees found for this department.</p>
                )}
                <button onClick={() => setEmployeesModal(false)}>Close</button>
            </Modal>

            {/* Department Detail Modal */}
            <Modal
                isOpen={detailModalOpen}
                onRequestClose={() => setDetailModalOpen(false)}
                contentLabel="Department Details"
                overlayClassName="modal"
                className="modal-content"
            >
                <div className="modal-header">
                    <h2>{selectedDepartment?.name}</h2>
                    <span
                        className="modal-close"
                        onClick={() => setDetailModalOpen(false)}
                    >
                        <img className="close" src="icons/close.png" alt="" />
                    </span>
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
                        <div>
                            <form className="form" onSubmit={handleJobSubmit}>
                                <div className="inputs">
                                    <div className="input-group">
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            value={jobsData.name}
                                            onChange={(e) =>
                                                setJobsData({ ...jobsData, name: e.target.value })
                                            }
                                            className="input "
                                        />
                                        <label className="user-label">Job Name</label>
                                    </div>

                                    <div className="input-group">
                                        <input
                                            required
                                            type="text"
                                            name="description"
                                            autoComplete="off"
                                            value={jobsData.description}
                                            onChange={(e) =>
                                                setJobsData({ ...jobsData, description: e.target.value })
                                            }
                                            className="input"
                                        />
                                        <label className="user-label">Job Description</label>
                                    </div>

                                    <div className="input-group">
                                        <input
                                            required
                                            type="number"
                                            name="salary"
                                            autoComplete="off"
                                            value={jobsData.salary}
                                            onChange={(e) =>
                                                setJobsData({ ...jobsData, salary: e.target.value })
                                            }
                                            className="input"
                                        />
                                        <label className="user-label">Salary</label>
                                    </div>
                                </div>
                                <button type="submit">
                                    {editData ? "Update Job" : "Add Job"}
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
                                    {jobs.length > 0 ? (
                                        jobs.map((j) => (
                                            <tr key={j.id}>
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
                                                                    setEditData(j); // Set edit data when "Edit" is clicked
                                                                    setJobsData(j); // Set jobsData to pre-populate the form
                                                                }}
                                                                className="edit-container"
                                                            >
                                                                <img className="edit-icon" src="/icons/edit.png" alt="Edit" />
                                                                <p>Edit</p>
                                                            </div>
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteJob(j.id); // Or deleteJob(job.id) based on the item
                                                                }}
                                                            >
                                                                <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                                                                <p>Delete</p>
                                                            </div>
                                                            <DeleteModal
                                                                showDeletePopUp={showDeletePopUp}
                                                                setShowDeletePopUp={setShowDeletePopUp}
                                                                handleDelete={handleDelete}
                                                                itemType="Job"
                                                                itemId={jobId} // Pass the specific ID here
                                                            />

                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No jobs available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DepartmentsList;
