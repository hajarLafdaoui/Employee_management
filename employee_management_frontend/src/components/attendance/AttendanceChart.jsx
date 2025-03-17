import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import LoadingSpinner from "../../LoadingSpinner";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AttendanceChart = ({ attendance }) => {
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Get current month (0-based)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Get current year

    // Get the current month's days in an array
    const getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).getDate());
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    // Get the days in the current month
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    // Prepare the data for each day in the current month
    const dataForMonth = daysInMonth.map(day => {
        const dayData = attendance.filter(entry => {
            const entryDate = new Date(entry.attendance_date); // Ensure this matches the property in your data
            return entryDate.getDate() === day && entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });

        // Ensure no missing data for the day
        const present = dayData.filter(entry => entry.status === "present").length || 0;
        const absent = dayData.filter(entry => entry.status === "absent").length || 0;
        const leave = dayData.filter(entry => entry.status === "leave").length || 0;

        return { present, absent, leave };
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Set loading to false after data is "fetched"
        }, 2000); // Simulate a 2-second delay

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    // Prepare the chart data
    const data = {
        labels: daysInMonth, // X-axis is the days of the current month
        datasets: [
            {
                label: "Present",
                data: dataForMonth.map(item => item.present),
                borderColor: "#36A2EB",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Absent",
                data: dataForMonth.map(item => item.absent),
                borderColor: "#FF6384",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Leave",
                data: dataForMonth.map(item => item.leave),
                borderColor: "#FFCE56",
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Options for the line chart
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                min: 0,            // Explicitly set the minimum value to 0
            },
        },
    };

    return (
        <>
            {isLoading ? (
                <LoadingSpinner /> // Show the spinner while loading
            ) : (
                <Line data={data} options={options} /> // Show the chart when data is ready
            )}
        </>
    );
};

export default AttendanceChart;