import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import axiosInstance from "../Config/axiosSetup";

const DepartmentsList = () => {
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
        salary: "", // Add salary field
        department_id: null,
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        name: "",
        description: "",
        salary: "", // Add salary field
        department_id: null,
    });

    const [employeesModal, setEmployeesModal] = useState(false);
    const [employees, setEmployees] = useState([]);

    // New state for the detail modal (with navbar using same styling as Navbar modal)
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailActiveTab, setDetailActiveTab] = useState("employees");
    const columns = ["id", "name", "email", "username"];


    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/departments")
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Error fetching departments:", error));
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axiosInstance.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    // New function to fetch jobs for a specific department
    const fetchDepartmentJobs = async (departmentId) => {
        try {
            // Here we fetch all jobs and filter by department_id
            const response = await axiosInstance.get("/jobs");
            const filteredJobs = response.data.filter(
                (job) => job.department_id === departmentId
            );
            setJobs(filteredJobs);
        } catch (error) {
            console.error("Error fetching department jobs:", error);
        }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/jobs", jobsData);
            setJobs([...jobs, response.data]);
            setJobsData({
                name: "",
                description: "",
                salary: "",
                department_id: jobsData.department_id,
            });
        } catch (error) {
            console.error("Error adding job:", error);
        }
    };

    const deleteDepartment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?"))
            return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/departments/${id}`);
            setDepartments(departments.filter((department) => department.id !== id));
            alert("Department deleted successfully!");
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const handleJobUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/jobs/${editData.id}`, editData);
            const updatedJobs = jobs.map((job) =>
                job.id === editData.id ? response.data : job
            );
            setJobs(updatedJobs);
            alert("Job updated successfully!");
            setShowEditForm(false); // Close the form after successful update
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job.");
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

    const handleLogoChange = (event) => {
        setUpdatedLogo(event.target.files[0]);
    };

    const updateDepartment = async () => {
        if (!selectedDepartment) return;

        const formData = new FormData();
        formData.append("name", updatedName);
        formData.append("description", updatedDescription);
        if (updatedLogo) {
            formData.append("logo", updatedLogo);
        }

        try {
            const response = await axiosInstance.post(
                `/departments/${selectedDepartment.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setDepartments(
                departments.map((dept) =>
                    dept.id === selectedDepartment.id ? response.data : dept
                )
            );

            alert("Department updated successfully!");
            closeEditModal();
        } catch (error) {
            console.error("Error updating department:", error);
            alert("Failed to update department.");
        }
    };

    const seeAddJobs = (id) => {
        fetchJobs(); // Fetch jobs when opening the modal
        setJobsData({ ...jobsData, department_id: id });
        setJobsModal(true);
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

    const seeEmployees = (id) => {
        fetchEmployees(id); // Fetch employees when opening the modal
        setEmployeesModal(true);
    };

    const closeJobsModal = () => {
        setJobsModal(false);
    };

    const deleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await axiosInstance.delete(`/jobs/${id}`);
            setJobs(jobs.filter((job) => job.id !== id));
            alert("Job deleted successfully!");
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const editJob = (job) => {
        setEditData(job);
        setShowEditForm(true);
    };

    // New function to open the detail modal (with navbar for Employees and Jobs)
    const openDetailModal = (department) => {
        setSelectedDepartment(department);
        setDetailModalOpen(true);
        setDetailActiveTab("employees");
        fetchEmployees(department.id);
        fetchDepartmentJobs(department.id);
    };

    return (
        <div>
            <div className="cards-Container">
                {departments.map((department) => (
                    <div
                        key={department.id}
                        className="card"
                        onClick={() => openDetailModal(department)}
                    >
                        <div className="crad-head">
                            <div className="logoName">
                                <img
                                    src={department.full_logo_path}
                                    alt={department.name}
                                    width="50"
                                />
                                <p className="cradName">{department.name}</p>
                            </div>
                            <div className="cards-action">
                                <img
                                    className="trash"
                                    src="/icons/delete.png"
                                    alt="Delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDepartment(department.id);
                                    }}
                                />
                                <img
                                    src="/icons/edit.png"
                                    alt="Edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(department);
                                    }}
                                />
                            </div>
                        </div>
                        <p className="card-body">{department.description}</p>
                    </div>
                ))}
            </div>

            {/* Edit Department Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Department"
            >
                <h2>Edit Department</h2>
                <label>Name:</label>
                <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                />
                <label>Description:</label>
                <input
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                />
                <label>Logo:</label>
                <input type="file" onChange={handleLogoChange} />
                <button onClick={updateDepartment}>Update</button>
                <button onClick={closeEditModal}>Cancel</button>
            </Modal>

            {/* Jobs Modal */}
            <Modal
                isOpen={jobsModal}
                onRequestClose={closeJobsModal}
                contentLabel="Jobs"
            >
                <h2>Jobs</h2>
                <form onSubmit={handleJobSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={jobsData.name}
                        placeholder="Job name"
                        onChange={(e) =>
                            setJobsData({ ...jobsData, name: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={jobsData.description}
                        placeholder="Job description"
                        onChange={(e) =>
                            setJobsData({ ...jobsData, description: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        name="salary"
                        value={jobsData.salary}
                        placeholder="Salary"
                        onChange={(e) =>
                            setJobsData({ ...jobsData, salary: e.target.value })
                        }
                        required
                    />
                    <button type="submit">Add Job</button>
                </form>

                {jobs.length > 0 ? (
                    jobs.map((j) => (
                        <div key={j.id}>
                            <p>
                                <strong>{j.name}</strong>
                            </p>
                            <p>{j.description}</p>
                            <p>Salary: ${j.salary}</p>
                            <img
                                src="/icons/edit.png"
                                alt="Edit"
                                onClick={() => editJob(j)}
                                style={{ width: "30px", cursor: "pointer" }}
                            />
                            <img
                                src="/icons/delete.png"
                                alt="Delete"
                                onClick={() => deleteJob(j.id)}
                                style={{ width: "30px", cursor: "pointer" }}
                            />
                        </div>
                    ))
                ) : (
                    <p>No jobs available.</p>
                )}

                {showEditForm && (
                    <form onSubmit={handleJobUpdate}>
                        <input
                            type="text"
                            placeholder="Job Name"
                            value={editData.name}
                            onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Job Description"
                            value={editData.description}
                            onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={editData.salary}
                            onChange={(e) =>
                                setEditData({ ...editData, salary: e.target.value })
                            }
                        />
                        <button type="submit">Update Job</button>
                    </form>
                )}

                <button onClick={closeJobsModal}>Close</button>
            </Modal>

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
                                <th>username</th>
                                <th>Job</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.username}</td>
                                    <td><img src={employee.profile_picture} alt="" /></td>


                                    <td>{employee.job ? employee.job.name : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employees found for this department.</p>
                )}
                <button onClick={() => setEmployeesModal(false)}>Close</button>
            </Modal>

            {/* Detail Modal with Navbar for Employees and Jobs (using same style/classes as Navbar modal) */}
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
                                            //   placeholder="Job name"
                                            onChange={(e) =>
                                                setJobsData({ ...jobsData, name: e.target.value })
                                            }
                                            className="input"
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
                                            //   placeholder="Job description"
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
                                            //   placeholder="Salary"
                                            onChange={(e) =>
                                                setJobsData({ ...jobsData, salary: e.target.value })
                                            }
                                            className="input"
                                        />
                                        <label className="user-label">Salary</label>
                                    </div>
                                </div>


                                <button type="submit">Add Job</button>
                            </form>


                            {jobs.length > 0 ? (
                                jobs.map((j) => (
                                    <div key={j.id}>
                                        <p>
                                            <strong>{j.name}</strong>
                                        </p>
                                        <p>{j.description}</p>
                                        <p>Salary: ${j.salary}</p>
                                        <img
                                            src="/icons/edit.png"
                                            alt="Edit"
                                            onClick={() => editJob(j)}
                                            style={{ width: "30px", cursor: "pointer" }}
                                        />
                                        <img
                                            src="/icons/delete.png"
                                            alt="Delete"
                                            onClick={() => deleteJob(j.id)}
                                            style={{ width: "30px", cursor: "pointer" }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No jobs available.</p>
                            )}

                            {showEditForm && (
                                <form onSubmit={handleJobUpdate}>
                                    <input
                                        type="text"
                                        placeholder="Job Name"
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData({ ...editData, name: e.target.value })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Job Description"
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData({ ...editData, description: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Salary"
                                        value={editData.salary}
                                        onChange={(e) =>
                                            setEditData({ ...editData, salary: e.target.value })
                                        }
                                    />
                                    <button type="submit">Update Job</button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DepartmentsList;
