import React, { useEffect, useState } from 'react';
import Marking from './Marking';
import Attendance from './Attendance';
import axiosInstance from "../Config/axiosSetup";
import Admin_dashboard from '../Admin/Admin_dashboard';
import './attendance.scss';
import AttendanceChart from "./AttendanceChart";

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

    // Filtering
    const filteredAttendance = attendance.filter((entry) => {
        const entryDate = new Date(entry.attendance_date);
        return entryDate.toDateString() === currentDate.toDateString();
    });

    const numberOfAbsent = filteredAttendance.filter(entry => entry.status === "absent").length;
    const numberOfLeave = filteredAttendance.filter(entry => entry.status === "leave").length;
    const numberOfPresent = filteredAttendance.filter(entry => entry.status === "present").length;

    return (
        <div>
            <div className="headAtt">
                <div className="attFirstPart">
                    <div className="attFirstPartHeader">
                        <h3>Attendance</h3>
                        <div className="dateNav">
                            <p onClick={handleLeftButtonClick}>
                                <img className='lessGreaterIcon' src="/icons/less-than.png" alt="Previous Day" />
                            </p>
                            <p>{currentDate.toDateString()}</p>
                            <p onClick={handleRightButtonClick}>
                                <img className='lessGreaterIcon' src="/icons/greater-than.png" alt="Next Day" />
                            </p>
                        </div>
                    </div>

                    <div className='toggleAttButton' onClick={HandleAttendanceButton}>
                        <img src="/icons/icons8-plus-50 (1).png" alt="Toggle Button" />
                        <p>{text}</p>
                    </div>
                </div>

                <div className="attSecondPart">
                    <div className="attendanceSummary">
                        <h5>Attendance Summary</h5>
                        <div className="ps">
                            <p>Number of Present: <span>{numberOfPresent}</span></p>
                            <hr />
                            <p>Number of Absent: <span>{numberOfAbsent}</span></p>
                            <hr />
                            <p>Number of Leave: <span>{numberOfLeave}</span></p>
                        </div>
                    </div>
                    <div className="lineGraph">
                        <h5>Attendance Trends for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h5>
                        <div className="line">
                            <AttendanceChart attendance={attendance} />
                        </div>
                    </div>
                </div>

                {text === 'add attendance' ? (
                    <Attendance
                        attendance={attendance}
                        currentDate={currentDate}
                        refreshAttendance={fetchAttendance} // Pass the refresh function
                    />
                ) : (
                    <Marking currentDate={currentDate} />
                )}
            </div>
        </div>
    );
};

export default AttendanceHeader;