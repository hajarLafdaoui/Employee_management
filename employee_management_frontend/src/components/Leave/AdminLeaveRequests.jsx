import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosSetup";
import LoadingSpinner from "../../LoadingSpinner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import SuccessAlert from "../Alerts/SuccessAlert";
import ErrorAlert from "../Alerts/ErrorAlert";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [usersApproved, setUsersApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproved, setShowApproved] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/leave-requests");

        // Filter only pending requests
        const pendingRequests = response.data.filter(
          (request) => request.status === "pending"
        );
        setRequests(pendingRequests);

        // Set approved requests for the approved section
        const approvedRequests = response.data.filter(
          (request) => request.status === "approved"
        );
        setUsersApproved(approvedRequests);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = async () => {
    if (!searchDate) {
      alert("Please enter a valid date.");
      return;
    }

    try {
      const filteredApproved = usersApproved.filter(
        (request) =>
          request.start_date === searchDate ||
          request.end_date === searchDate ||
          (new Date(request.start_date) <= new Date(searchDate) &&
            new Date(request.end_date) >= new Date(searchDate))
      );
      setUsersApproved(filteredApproved);
    } catch (error) {
      console.error("Error searching approved leave requests:", error);
      alert("Failed to search approved leave requests.");
    }
  };

  const handleApprove = async (id) => {
    try {
      const approvedRequest = requests.find((request) => request.id === id);
      await axiosInstance.put(`/leave-request/${id}/approve`);
  
      setSuccessMessage("Request approved successfully!"); 
      setErrorMessage(""); 
  
      setRequests((prev) => prev.filter((request) => request.id !== id));
      setUsersApproved((prev) => [
        ...prev,
        { ...approvedRequest, status: "approved" },
      ]);
  
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to approve the request."); 
      setSuccessMessage("");
  
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/leave-request/${id}/reject`);
  
      setSuccessMessage("Request rejected successfully!"); 
      setErrorMessage("");
  
      setRequests((prev) => prev.filter((request) => request.id !== id));
  
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to reject the request."); 
      setSuccessMessage("");

      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Leave Requests</h1>
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.user.name}</td>
              <td>{request.user.department.name}</td>
              <td>{request.leave_type}</td>
              <td>{request.start_date}</td>
              <td>{request.end_date}</td>
              <td>{request.reason}</td>
              <td>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    marginRight: "10px",
                  }}
                  onClick={() => handleApprove(request.id)}
                  title="Approve"
                >
                  <FaCheckCircle size={24} color="green" />
                </button>
                <button
                  style={{ background: "none", border: "none" }}
                  onClick={() => handleReject(request.id)}
                  title="Reject"
                >
                  <FaTimesCircle size={24} color="red" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button  onClick={() => setShowApproved(!showApproved)}>
       <span className="hideShow">{showApproved ? "Hide Approved Users" : "Show Approved Users"}</span> 
      </button>
      {showApproved && (
        <div>
          <h2>Approved Users</h2>
          <div>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={handleSearch}> <span className="hideShow">Search by date</span></button>
          </div>
          <table border="1">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {usersApproved.map((approved, index) => (
                <tr key={index}>
                  <td>{approved.user.name}</td>
                  <td>{approved.user.department.name}</td>
                  <td>{approved.leave_type}</td>
                  <td>{approved.start_date}</td>
                  <td>{approved.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
