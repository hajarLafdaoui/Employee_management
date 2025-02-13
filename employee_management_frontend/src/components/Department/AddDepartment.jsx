import { useState } from "react";
import axios from "axios";

const AddDepartment = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (logo) {
            formData.append("logo", logo);
        }
    
        try {
            await axios.post("http://127.0.0.1:8000/api/departments", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Department added!");
        } catch (error) {
            console.error("Error adding department:", error.response?.data || error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Department Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <input type="file" name="logo" onChange={(e) => setLogo(e.target.files[0])} />
            <button type="submit">Add Department</button>
        </form>
    );
};

export default AddDepartment;
