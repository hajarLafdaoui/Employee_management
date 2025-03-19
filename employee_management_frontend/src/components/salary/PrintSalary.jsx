import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../Config/axiosSetup";
import { jsPDF } from "jspdf";
import LoadingSpinner from "../../LoadingSpinner";
import html2canvas from "html2canvas";
import { useRef } from "react";

import './SalaryDetail.scss';

const PrintSalary = () => {
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
                    <button className="btnslary" onClick={handlePrint}><img src="/icons/paper.png" alt=""                                                 className="edit2-icon"
                    />Print</button>
                    <button className="btnslary" onClick={handleDownloadPDF}> <img src="/icons/pdf.png" alt=""                                                 className="edit2-icon"
                    />Pdf</button>
                    </div>
            <div className="salary-container"ref={pdfRef}>
            <img src="/logo/logo.png" alt="Logo" className="logo1"/>
            <div className="salary-header">
                    <h4>Pays for the Month</h4>
                    <p>{new Date(salary.paid_on).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="salary-info">
                    <div className="user-info">
                        <p>User Name: {salary.user.name}</p>
                        <p>Department: {department.name}</p>
                        <p>Job Title: {job.name}</p>
                        <p>Start Date: {new Date(salary.start_date).toLocaleDateString()}</p>
                        <p>End Date: {new Date(salary.end_date).toLocaleDateString()}</p>
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
                                <td>{salary.leave_deduction}</td>
                            </tr>
                            <tr>
                                <td>Absent Deductions</td>
                                <td>{salary.attendance_bonus}</td>
                            </tr>
                            <tr>
                                <td>Tva</td>
                                <td>{salary.tva_rate*100}%</td>
                            </tr>
                            <tr>
                <td>Montant TVA</td>
                <td>{salary?.tva_amount}</td>
              </tr>
                         
                        </tbody>
                    </table>
                </div>

                <div className="net-salary">
                    <p> <strong>Net Salary:</strong> {salary.total_salary}</p>
                </div>

               
            </div>
            
        </>
    );
};

export default PrintSalary;
