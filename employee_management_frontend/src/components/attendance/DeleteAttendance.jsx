import React, { useEffect, useState } from 'react';
import axiosInstance from "../Config/axiosSetup";
import { useParams, useNavigate } from 'react-router-dom';

const DeleteAttendance = () => {
    const { id } = useParams();

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const deleteAttendance = async () => {
            try {
                await axiosInstance.delete(`/attendance/${id}`);
                navigate('/AttendanceHeader');
            } catch (err) {
                console.error(err.response);
                setError("Failed to delete attendance.");
            }
        };

        deleteAttendance();
    }, [id, navigate]);

    return (
        <div>
            {error ? <div>{error}</div> : <div>Deleting attendance...</div>}
        </div>
    );
};

export default DeleteAttendance;
