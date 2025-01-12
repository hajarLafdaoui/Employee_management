import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosSetup"; 


const SalaryList = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


   
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axiosInstance.get('/salaries');  
        setSalaries(response.data.salaries);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching the salaries.');
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>All Salaries</h1>
            {salaries.length === 0 ? (
                <p>No salaries found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map((salary) => (
                            <tr key={salary.id}>
                                <td>{salary.user.name}</td>  
                                <td>{salary.start_date}</td>
                                <td>{salary.end_date}</td>
                                <td>{salary.total_salary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SalaryList;