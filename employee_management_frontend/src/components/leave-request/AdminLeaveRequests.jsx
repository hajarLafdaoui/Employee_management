import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosSetup";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await axiosInstance.get("/leave-requests");
      setRequests(response.data);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    await axiosInstance.put(`/leave-request/${id}/approve`);
    alert("Request approved");
    setRequests(requests.filter((request) => request.id !== id));
  };

  const handleReject = async (id) => {
    await axiosInstance.put(`/leave-request/${id}/reject`);
    alert("Request rejected");
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div>
      <h1>Leave Requests</h1>
      <table border="1">
        <thead>
          <tr>
            <th>User Name</th>
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
              <td>{request.leave_type}</td>
              <td>{request.start_date}</td>
              <td>{request.end_date}</td>
              <td>{request.reason}</td>
              <td>
                <button
                  onClick={() => handleApprove(request.id)}
                  style={{ marginRight: "10px" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeaveRequests;
