import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import { jsPDF } from "jspdf";

const SalaryDetail = () => {
    const { id } = useParams();  // Get the salary ID from the URL
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await axiosInstance.get(`/salaries/${id}`);
                setSalary(response.data.salary);
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching the salary details.');
                setLoading(false);
            }
        };

        fetchSalary();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    // Function to handle printing
    const handlePrint = () => {
        window.print();
    };

    // Function to handle PDF generation
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text("Salary Details", 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${salary.user.name}`, 20, 40);
        doc.text(`Start Date: ${salary.start_date}`, 20, 50);
        doc.text(`End Date: ${salary.end_date}`, 20, 60);
        doc.text(`Total Salary: ${salary.total_salary}`, 20, 70);

        // Download the PDF
        doc.save("salary_details.pdf");
    };

    return (
        <div>
            <h1>Salary Details</h1>
            {salary ? (
                <div>
                    <p><strong>Name:</strong> {salary.user.name}</p>
                    <p><strong>day Paid:</strong> {salary.paid_on}</p>
                    <p><strong>Start Date:</strong> {salary.start_date}</p>

                    <p><strong>End Date:</strong> {salary.end_date}</p>
                    <p><strong>Total Salary:</strong> {salary.total_salary}</p>
                    
                    {/* Add print and download buttons */}
                    <button onClick={handlePrint}>Print</button>
                    <button onClick={handleDownloadPDF}>Download as PDF</button>
                </div>
            ) : (
                <p>No salary details found.</p>
            )}
        </div>
    );
};

export default SalaryDetail;
