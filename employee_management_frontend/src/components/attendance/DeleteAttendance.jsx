import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosSetup";
import { useParams, useNavigate } from 'react-router-dom';

const DeleteAttendance = () => {
    const { entryId } = useParams();

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const deleteAttendance = async () => {
            try {
                await axiosInstance.delete(`/attendance/${entryId}`);
                navigate('/AttendanceHeader');  
            } catch (err) {
                console.error(err.response);
                setError("Failed to delete attendance.");
            }
        };

        deleteAttendance();
    }, [entryId, navigate]);

    return (
        <div>
            {error ? <div>{error}</div> : <div>Deleting attendance...</div>}
        </div>
    );
};

export default DeleteAttendance;
