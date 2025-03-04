import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import { jsPDF } from "jspdf";
import LoadingSpinner from "../../LoadingSpinner";
import html2canvas from "html2canvas";
import { useRef } from "react";

import './SalaryDetail.scss';

const SalaryDetail = () => {
    const { id } = useParams();  
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [baseSalary, setBaseSalary] = useState("");
    const [job, setJob] = useState("");
    const [department, setDepartment] = useState("");
    const pdfRef = useRef();

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await axiosInstance.get(`/salaries/${id}`);
                console.log(response.data);  

                setSalary(response.data.salary);
                setBaseSalary(response.data.basesalary);
                setJob(response.data.job);
                setDepartment(response.data.department);
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching the salary details.');
                setLoading(false);
            }
        };

        fetchSalary();
    }, [id]);

    if (loading) return <div className="loading-spinner"><LoadingSpinner /></div>;
    if (error) return <div className="error-message">{error}</div>;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("salary_details.pdf");
        });
    };
    

    return (
        <>
        <div className="salary-actions">
                    <button onClick={handlePrint}>Print</button>
                    <button onClick={handleDownloadPDF}> PDF</button>
                    </div>
            <div className="salary-container"ref={pdfRef}>
                <div className="salary-header">
                    <h1>Pays for the Month</h1>
                    <p><strong>{new Date(salary.paid_on).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong></p>
                </div>

                <div className="salary-info">
                    <div className="user-info">
                        <p><strong>User Name:</strong> {salary.user.name}</p>
                        <p><strong>Department:</strong> {department.name}</p>
                        <p><strong>Job Title:</strong> {job.name}</p>
                        <p><strong>Start Date:</strong> {new Date(salary.start_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(salary.end_date).toLocaleDateString()}</p>
                    </div>

                    <div className="enterprise-info">
                        <p><strong>Enterprise Name:</strong> XYZ Corporation</p>
                        <p><strong>Enterprise Address:</strong> 123 Main Street, City</p>
                    </div>
                </div>

                <div className="salary-details">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Base Salary</strong></td>
                                <td>{baseSalary}</td>
                            </tr>
                            <tr>
                                <td><strong>Leave Deductions</strong></td>
                                <td>{salary.leave_deduction}</td>
                            </tr>
                            <tr>
                                <td><strong>Attendance Deductions</strong></td>
                                <td>{salary.attendance_bonus}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Salary</strong></td>
                                <td>{salary.total_salary}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="net-salary">
                    <p><strong>Net Salary:</strong> {salary.total_salary}</p>
                </div>

               
            </div>
            
        </>
    );
};

export default SalaryDetail;
