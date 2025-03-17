import React, { useEffect, useState } from "react";
import axiosInstance from "./Config/axiosSetup";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingSpinner from "../LoadingSpinner";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const usersWithFlags = await Promise.all(
        response.data.map(async (user) => {
          try {
            const countryResponse = await fetch(
              `https://restcountries.com/v3.1/name/${user.country}?fullText=true`
            );
            const countryData = await countryResponse.json();
            const flagUrl = countryData[0]?.flags?.png || "";
            return { ...user, flagUrl };
          } catch (error) {
            console.error(`Error fetching flag for ${user.country}:`, error);
            return { ...user, flagUrl: "" };
          }
        })
      );
      setUsers(usersWithFlags);
    } catch (error) {
      console.error("Error fetching users:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to load departments.");
    }
  };

  // Get department name by department_id
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dep) => dep.id === departmentId);
    return department ? department.name : "No Department";
  };

  // Toggle dropdown visibility
  const toggleDropdown = (userId) => {
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  // Handle delete action
  const handleDelete = async (e, userId) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      await axiosInstance.put(`/users/${userId}/toggle`);
      setUsers(users.filter((user) => user.id !== userId));
      console.log("User soft deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
      setErrorMessage("Error deleting user.");
    }
  };

  // Filter users based on selected criteria and search query
  const filteredUsers = users.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "" || user.gender === selectedGender;
    const matchesDepartment =
      selectedDepartment === "" || user.department_id === parseInt(selectedDepartment);
    const matchesCountry = selectedCountry === "" || user.country === selectedCountry;

    return matchesName && matchesGender && matchesDepartment && matchesCountry;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get pagination range
  const getPaginationRange = () => {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Display loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;

  return (
    <div className="">
      <div className="btnTitle">
        <h4>Employee List</h4>
        <div className="buttonContainer" onClick={() => navigate("/CreateUser")}>
          <img className='plusIcon' src="/icons/icons8-plus-50 (1).png" alt="Add" />
          <button>Add Employee</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar ">
        <div className="input-search-container">
          <img src="icons/search.png" alt="" />
          <input
            type="text"
            className="input-search"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="otherFiltering">
          <div className="">
            <select
              className=""
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="">Filter by Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="">
            <select
              className=""
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Filter by Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <select
              className=""
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Filter by Country</option>
              {[...new Set(users.map((user) => user.country))].map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <div className="table-wrapper">
        <div className="table-header">
          <div>#ID</div>
          <div>Name</div>
          <div>Gender</div>
          <div>Country</div>
          <div>Department</div>
          <div>Job</div> {/* Add Job column */}
          <div>Contact</div>
          <div>Actions</div>
        </div>
        {currentUsers.map((user) => (
          <div key={user.id} className="table-row">
            <div>{user.id}</div>
            <div>
              {user?.profile_picture ? (
                <img
                  src={`http://localhost:8000/storage/${user.profile_picture}`}
                  alt="Profile"
                  style={{ width: "38px", height: "38px", borderRadius: "50%", marginRight: "10px" }}
                />
              ) : (
                "No Picture"
              )}
              {user.username}
              <p>{user.name}</p>
            </div>
            <div>{user.gender}</div>
            <div>
              {user.country}
              {user.flagUrl && (
                <img src={user.flagUrl} alt={user.country} style={{ width: "20px", marginLeft: "10px" }} />
              )}
            </div>
            <div>{getDepartmentName(user.department_id)}</div>
            <div>{user.job_id ? (user.job ? user.job.name : "No Job") : "No Job"}</div> {/* Display job name */}
            <div>
              <span className="contact">{user.email}</span>
              <br className="spacer" />
              <span className="contact marginPhone">{user.phone}</span>
            </div>
            <div className="actions">
              {/* Dropdown for actions */}
              <img
                src={dropdownVisible === user.id ? "/icons/more2.png" : "/icons/more.png"}
                alt="More"
                onClick={() => toggleDropdown(user.id)}
                style={{ width: "30px", cursor: "pointer" }}
              />
              {dropdownVisible === user.id && (
                <div className="more-dropdown">
{/* view action */}

<div
                    onClick={() => {
                      navigate(`/Detailuser/${user.id}`);
                    }}
                    className="edit-container"
                  >
                    <img className="edit-icon" src="/icons/view.png" alt="Edit" />
                    <p>View</p>
                  </div>

                  {/* Edit action */}

                  <div
                    onClick={() => {
                      navigate(`/update-user/${user.id}`);
                    }}
                    className="edit-container"
                  >
                    <img className="edit-icon" src="/icons/edit.png" alt="Edit" />
                    <p>Edit</p>
                  </div>
                  {/* Delete action */}
                  <div
                    className="edit-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e, user.id);
                    }}
                  >
                    <img className="delete-icon" src="/icons/delete.png" alt="Delete" />
                    <p>Delete</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="page">
        <li
          className="page__btn"
          onClick={prevPage}
          style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
        >
          <span className="material-icons">
            <img src="icons/left-arrow.png" alt="left" />
          </span>
        </li>
        {getPaginationRange().map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page__numbers ${currentPage === pageNumber ? "active" : ""}`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </li>
        ))}
        <li
          className="page__btn"
          onClick={nextPage}
          style={{
            pointerEvents: currentPage === Math.ceil(filteredUsers.length / rowsPerPage) ? "none" : "auto",
          }}
        >
          <span className="material-icons">
            <img src="icons/right-arrow.png" alt="right" />
          </span>
        </li>
      </div>
    </div>
  );
};

export default EmployeeList;