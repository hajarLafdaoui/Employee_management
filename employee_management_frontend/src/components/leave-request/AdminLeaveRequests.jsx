import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosSetup";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [usersApproved, setUsersApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproved, setShowApproved] = useState(false);

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

  const handleApprove = async (id) => {
    try {
      const approvedRequest = requests.find((request) => request.id === id);
      await axiosInstance.put(`/leave-request/${id}/approve`);
      alert("Request approved");

      setRequests((prev) => prev.filter((request) => request.id !== id));
      setUsersApproved((prev) => [...prev, { ...approvedRequest, status: "approved" }]);
    } catch (error) {
      console.error("Error approving the request:", error);
      alert("Failed to approve the request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/leave-request/${id}/reject`);
      alert("Request rejected");

      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error rejecting the request:", error);
      alert("Failed to reject the request.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
      <button onClick={() => setShowApproved(!showApproved)}>
        {showApproved ? "Hide Approved Users" : "Show Approved Users"}
      </button>
      {showApproved && (
        <div>
          <h2>Approved Users</h2>
          <table border="1">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {usersApproved.map((approved, index) => (
                <tr key={index}>
                  <td>{approved.user.name}</td>
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
