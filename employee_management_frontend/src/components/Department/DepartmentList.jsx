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
        salary: "",  // Add salary field
        department_id: null,
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        name: "",
        description: "",
        salary: "",  // Add salary field
        department_id: null,        
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/departments")
            .then(response => setDepartments(response.data))
            .catch(error => console.error("Error fetching departments:", error));
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axiosInstance.get("/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/jobs", jobsData);
            setJobs([...jobs, response.data]);
            setJobsData({ name: "", description: "", salary: "", department_id: jobsData.department_id });
        } catch (error) {
            console.error("Error adding job:", error);
        }
    };

    const deleteDepartment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/departments/${id}`);
            setDepartments(departments.filter(department => department.id !== id));
            alert("Department deleted successfully!");
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const handleJobUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/jobs/${editData.id}`, editData);
            const updatedJobs = jobs.map((job) => (job.id === editData.id ? response.data : job));
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

            setDepartments(departments.map(dept =>
                dept.id === selectedDepartment.id ? response.data : dept
            ));

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

    const closeJobsModal = () => {
        setJobsModal(false);
    };

    const deleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            // Send the DELETE request with only the job ID.
            await axiosInstance.delete(`/jobs/${id}`);
            // Filter out the deleted job from the jobs state.
            setJobs(jobs.filter(job => job.id !== id));
            alert("Job deleted successfully!");
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };
    
    const editJob = (job) => {
        setEditData(job);
        setShowEditForm(true);
    };

    return (
        <div>
            <h2>Departments</h2>
            <ul>
                {departments.map(department => (
                    <li key={department.id}>
                        <img src="/icons/delete.png" alt="Delete" onClick={() => deleteDepartment(department.id)} style={{ width: "30px", cursor: "pointer" }} />
                        <img src="/icons/edit.png" alt="Edit" onClick={() => openEditModal(department)} style={{ width: "30px", cursor: "pointer" }} />
                        <strong>{department.name}</strong>
                        <p>{department.description}</p>
                        <img src={department.full_logo_path} alt={department.name} width="50" />
                        <div>
                            <p onClick={() => seeAddJobs(department.id)} style={{ cursor: "pointer", color: "blue" }}>See jobs</p>
                            <p style={{ cursor: "pointer", color: "blue" }}>See employees</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Department Modal */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} contentLabel="Edit Department">
                <h2>Edit Department</h2>
                <label>Name:</label>
                <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
                <label>Description:</label>
                <input type="text" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
                <label>Logo:</label>
                <input type="file" onChange={handleLogoChange} />
                <button onClick={updateDepartment}>Update</button>
                <button onClick={closeEditModal}>Cancel</button>
            </Modal>

            {/* Jobs Modal */}
            <Modal isOpen={jobsModal} onRequestClose={closeJobsModal} contentLabel="Jobs">
                <h2>Jobs</h2>
                <form onSubmit={handleJobSubmit}>
                    <input type="text" name="name" value={jobsData.name} placeholder="Job name" onChange={(e) => setJobsData({ ...jobsData, name: e.target.value })} required />
                    <input type="text" name="description" value={jobsData.description} placeholder="Job description" onChange={(e) => setJobsData({ ...jobsData, description: e.target.value })} required />
                    <input type="number" name="salary" value={jobsData.salary} placeholder="Salary" onChange={(e) => setJobsData({ ...jobsData, salary: e.target.value })} required />
                    <button type="submit">Add Job</button>
                </form>

                {jobs.length > 0 ? jobs.map(j => (
                    <div key={j.id}>
                        <p><strong>{j.name}</strong></p>
                        <p>{j.description}</p>
                        <p>Salary: ${j.salary}</p>
                        <img src="/icons/edit.png" alt="Edit" onClick={() => editJob(j)} style={{ width: "30px", cursor: "pointer" }} />
                        <img src="/icons/delete.png" alt="Delete" onClick={() => deleteJob(j.id)} style={{ width: "30px", cursor: "pointer" }} />
                    </div>
                )) : <p>No jobs available.</p>}

                {showEditForm && (
                    <form onSubmit={handleJobUpdate}>
                        <input
                            type="text"
                            placeholder="Job Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Job Description"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={editData.salary}
                            onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                        />
                        <button type="submit">Update Job</button>
                    </form>
                )}

                <button onClick={closeJobsModal}>Close</button>
            </Modal>
        </div>
    );
};

export default DepartmentsList;
