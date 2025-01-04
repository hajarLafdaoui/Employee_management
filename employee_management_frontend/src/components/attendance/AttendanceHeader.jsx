import React, { useEffect, useState } from 'react';
import Marking from './Marking';
import Attendance from './Attendance';
import axiosInstance from "../axiosSetup";

const AttendanceHeader = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [text, setText] = useState('add attendance');
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchAttendance = async () => {
        try {
            const resp = await axiosInstance.get("/attendance");
            setAttendance(resp.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch attendance data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const HandleAttendanceButton = () => {
        setText((prevText) => (prevText === 'show attendance' ? 'add attendance' : 'show attendance'));
    };

    const handleLeftButtonClick = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleRightButtonClick = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (currentDate < today) {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        }
    };

    // Filter attendance data based on the selected date
    const filteredAttendance = attendance.filter((entry) => {
        const entryDate = new Date(entry.attendance_date);
        return entryDate.toDateString() === currentDate.toDateString();
    });

    const numberOfAbsent = filteredAttendance.filter(entry => entry.status === "absent").length;
    const numberOfLeave = filteredAttendance.filter(entry => entry.status === "leave").length;
    const numberOfPresent = filteredAttendance.filter(entry => entry.status === "present").length;

    return (
        <div>
            <div>
                <button onClick={handleLeftButtonClick}>⩤</button>
                <p>{currentDate.toDateString()}</p>
                <button onClick={handleRightButtonClick}>⩥</button>
            </div>
            <button onClick={HandleAttendanceButton}>{text}</button>

            <div>
                <p>Number of Present: {numberOfPresent}</p>
                <p>Number of Absent: {numberOfAbsent}</p>
                <p>Number of Leave: {numberOfLeave}</p>
            </div>
            {text === 'add attendance' ? <Attendance attendance={attendance} currentDate={currentDate} /> : <Marking  currentDate={currentDate}/>}
        </div>
    );
};

export default AttendanceHeader;
