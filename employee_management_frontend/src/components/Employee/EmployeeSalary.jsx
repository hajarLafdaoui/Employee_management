import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../Config/axiosSetup"; 
import { jsPDF } from "jspdf";
import LoadingSpinner from "../../LoadingSpinner";
import html2canvas from "html2canvas";
import '../salary/SalaryDetail.scss';
import { useTranslation } from 'react-i18next';
import { t } from "i18next";

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
            setError(t('user_not_found'));
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
                        setError(t('no_salary_data_found'));
                    }
                } else {
                    setError(t('invalid_response_format'));
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching salary details:', err);  
                setError(t('error_fetching_salary'));
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
                    <img src="/icons/paper.png" alt="#" className="edit2-icon" />{t('print')}
                </button>
                <button className="btnslary" onClick={handleDownloadPDF}>
                    <img src="/icons/pdf.png" alt="#" className="edit2-icon" />{t('pdf')}
                </button>
            </div>

            <div className="salary-container" ref={pdfRef}>
                <img src="/logo/logo.png" alt="Logo" className="logo1" />
                <div className="salary-header">
                    <h1>{t('salary_for_the_month')}</h1>
                    <p>{new Date(salary.paid_on).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="salary-info">
                    <div className="user-info">
                        <p>{t('user_name')}: {salary.user.name}</p>
                        <p>{t('department')}: {department.name ||  t('not_available')}</p>
                        <p>{t('job_title')}: {job.name ||  t('not_available')}</p>
                        <p>{t('start_date')}: {new Date(salary.start_date).toLocaleDateString() ||  t('not_available')}</p>
                        <p>{t('end_date')}: {new Date(salary.end_date).toLocaleDateString() ||  t('not_available')}</p>
                    </div>

                    <div className="enterprise-info">
                        <p>{t('enterprise_name')}:{t("work")} </p>
                        <p>{t('enterprise_address')}: {t('adress')}</p>
                    </div>
                </div>

                <div className="salary-details">
                    <table>
                        <thead>
                            <tr>
                                <th>{t('description')}</th>
                                <th>{t('amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{t('base_salary')}</td>
                                <td>{baseSalary}</td>
                            </tr>
                            <tr>
                                <td>{t('leave_deductions')}</td>
                                <td>{salary.leave_deduction || 0}</td>
                            </tr>
                            <tr>
                                <td>{t('attendance_deductions')}</td>
                                <td>{salary.attendance_bonus || 0}</td>
                            </tr>
                            <tr>
                                <td>{t('tva')}</td>
                                <td>{salary.tva_rate ? `${salary.tva_rate * 100}%` : t('not_available')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="net-salary">
                    <p><strong>{t('net_salary')}:</strong> {salary.total_salary || t('not_available')}</p>
                </div>
            </div>
        </>
    );
};

export default EmployeeSalary;
