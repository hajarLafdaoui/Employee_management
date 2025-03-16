import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../Config/axiosSetup"; 
import { jsPDF } from "jspdf";
import LoadingSpinner from "../../LoadingSpinner";
import html2canvas from "html2canvas";
import '../salary/SalaryDetail.scss';

const EmployeeSalary = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [baseSalary, setBaseSalary] = useState("");
    const [job, setJob] = useState("");
    const [department, setDepartment] = useState("");
    const pdfRef = useRef();

    useEffect(() => {
        if (!user || !user.id) {
            setError('User not found. Please log in.');
            setLoading(false);
            return;
        }

        const fetchSalary = async () => {
            try {
                const response = await axiosInstance.get('/salaries');
                console.log('API Response:', response); 

                if (response.data && Array.isArray(response.data.salaries) && response.data.salaries.length > 0) {
                    const latestSalary = response.data.salaries
                        .filter(salary => salary.user.id === user.id) 
                        .sort((a, b) => new Date(b.paid_on) - new Date(a.paid_on))[0]; 

                    if (latestSalary) {
                        setSalary(latestSalary);
                        setBaseSalary(latestSalary.total_salary || 0);
                        setJob(latestSalary.user.job || {}); 
                        setDepartment(latestSalary.user.department || {}); 
                    } else {
                        setError('No salary data found for the logged-in user.');
                    }
                } else {
                    setError('Invalid response format from the API.');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching salary details:', err);  
                setError('An error occurred while fetching the salary details.');
                setLoading(false);
            }
        };

        fetchSalary();
    }, [user]); 

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
                <button className="btnslary" onClick={handlePrint}>
                    <img src="/icons/paper.png" alt="Print" className="edit2-icon" />Print
                </button>
                <button className="btnslary" onClick={handleDownloadPDF}>
                    <img src="/icons/pdf.png" alt="Download PDF" className="edit2-icon" />Pdf
                </button>
            </div>

            <div className="salary-container" ref={pdfRef}>
                <img src="/logo/logo.png" alt="Logo" className="logo1" />
                <div className="salary-header">
                    <h1>Pays for the Month</h1>
                    <p>{new Date(salary.paid_on).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="salary-info">
                    <div className="user-info">
                        <p>User Name: {salary.user.name}</p>
                        <p>Department: {department.name || 'N/A'}</p>
                        <p>Job Title: {job.name || 'N/A'}</p>
                        <p>Start Date: {new Date(salary.start_date).toLocaleDateString() || 'N/A'}</p>
                        <p>End Date: {new Date(salary.end_date).toLocaleDateString() || 'N/A'}</p>
                    </div>

                    <div className="enterprise-info">
                        <p>Enterprise Name: WORKIO </p>
                        <p>Enterprise Address: 123 Main Street, City</p>
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
                                <td>Base Salary</td>
                                <td>{baseSalary}</td>
                            </tr>
                            <tr>
                                <td>Leave Deductions</td>
                                <td>{salary.leave_deduction || 0}</td>
                            </tr>
                            <tr>
                                <td>Attendance Deductions</td>
                                <td>{salary.attendance_bonus || 0}</td>
                            </tr>
                            <tr>
                                <td>Tva</td>
                                <td>{salary.tva_rate ? `${salary.tva_rate * 100}%` : 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="net-salary">
                    <p><strong>Net Salary:</strong> {salary.total_salary || 'N/A'}</p>
                </div>
            </div>
        </>
    );
};

export default EmployeeSalary;
