import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import axiosInstance  from '../Config/axiosSetup'

const DepartmentsList = () => {
    const [departments, setDepartments] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedDescription, setUpdatedDescription] = useState("");
    const [updatedLogo, setUpdatedLogo] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/departments")
            .then(response => setDepartments(response.data))
            .catch(error => console.error("There was an error fetching the departments!", error));
    }, []);

    const deleteDepartment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/departments/${id}`);
            setDepartments(departments.filter(department => department.id !== id));
            alert("Department deleted successfully!");
        } catch (error) {
            console.log(error);
        }
    };

    const openEditModal = (department) => {
        setSelectedDepartment(department);
        setUpdatedName(department.name || ""); // Assure que le champ n'est pas vide
        setUpdatedDescription(department.description || "");
        setUpdatedLogo(null);
        setIsEditModalOpen(true);
    
        console.log("Department loaded:", department);
        setTimeout(() => {
            console.log("Updated Name (after state update):", updatedName);
            console.log("Updated Description (after state update):", updatedDescription);
        }, 100); // Donne le temps au state de se mettre à jour
    };
    

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDepartment(null);
    };

    const handleLogoChange = (event) => {
        setUpdatedLogo(event.target.files[0]);
    };

    const updateDepartment = async () => {
        try {
            console.log("Sending data:", { updatedName, updatedDescription, updatedLogo });
    
            const formData = new FormData();
            formData.append("name", updatedName);
            formData.append("description", updatedDescription);
            if (updatedLogo) {
                formData.append("logo", updatedLogo);
            }
    
            await axiosInstance(`http://127.0.0.1:8000/api/departments/${selectedDepartment.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            setDepartments(departments.map(dep =>
                dep.id === selectedDepartment.id
                    ? { ...dep, name: updatedName, description: updatedDescription, logo: updatedLogo }
                    : dep
            ));
    
            alert("Department updated successfully!");
            closeEditModal();
        } catch (error) {
            console.log("Error updating department:", error);
        }
    };
    
    

    return (
        <div>
            <h2>Departments</h2>
            <ul>
                {departments.map(department => (
                    <li key={department.id}>
                        <img src="/icons/delete.png" alt="Delete" onClick={() => deleteDepartment(department.id)} style={{ width: '30px', cursor: 'pointer' }} />
                        <img src="/icons/edit.png" alt="Edit" onClick={() => openEditModal(department)} style={{ width: '30px', cursor: 'pointer' }} />
                        <strong>{department.name}</strong>
                        <p>{department.description}</p>
                        <img src={department.full_logo_path} alt={department.name} width="50" />
                    </li>
                ))}
            </ul>

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
        </div>
    );
};

export default DepartmentsList;