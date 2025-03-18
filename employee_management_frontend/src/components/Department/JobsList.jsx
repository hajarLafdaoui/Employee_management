import { useEffect, useState } from "react";
import axios from "axios";

const JobsList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/jobs")
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.error("Error fetching jobs!", error);
            });
    }, []);

    return (
        <div>
            <h4>Jobs</h4>
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>
                        <strong>{job.name}</strong>
                        <p>{job.description}</p>
                        <p>Salary: ${job.salary}</p>
                        <p>Department: {job.department?.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobsList;
