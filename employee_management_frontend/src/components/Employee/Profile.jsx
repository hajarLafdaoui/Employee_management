import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../DetailUser.scss";
import axiosInstance from "../Config/axiosSetup";
import {
  FaIdCard,
  FaVenusMars,
  FaGlobe,
  FaCalendarAlt,
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaCalendarDay,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState({
    total_present: 0,
    total_absent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchAttendanceSummary(user.id);
    }
  }, [user]);

  const fetchAttendanceSummary = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/attendance/monthly-summary/${userId}`
      );
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>{t("noUserData")}</div>;
  }

  return (
    <div className="main-content">
      <div className="employee-card">
        {/* <h2>{t("employeeDetails")}</h2> */}

        <div className="totalemploye">
  <div className="static1 day">
    
      <FaCalendarDay className="icon" /> 
      <span>{t("numberOfDays")}</span>
    
    <span style={{ fontWeight: "bold" }}>
      {Math.floor(
        (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
      )}
    </span>
  </div>
  <div className="static1 prst">
    
      <FaCheckCircle className="icon" /> 
      <span>{t("totalPresentThisMonth")}</span>
    
    <span style={{ fontWeight: "bold" }}>
      {attendanceSummary.total_present}
    </span>
  </div>
  <div className="static1 abst">
    
      <FaTimesCircle className="icon" /> 
      <span>{t("totalAbsentThisMonth")}</span>
    
    <span style={{ fontWeight: "bold" }}>
      {attendanceSummary.total_absent}
    </span>
  </div>
</div>

        {user && (
          <div className="employee-details">
            <div className="profile-section">
              <div className="backimg">
                <img src="/img/images3.jpg" alt="" className="imgdetail" />
              </div>
              <div className="head1">
                <div className="infohead">
                  <img
                    src={
                      user.profile_picture
                        ? `http://localhost:8000/storage/${user.profile_picture}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="profile-img"
                  />
                  <h3>{user.name}</h3>
                  <p className="jobtitle">{user.role}</p>
                </div>
              </div>
              <div className="infoside">
                <h3>{t("basicInformation")}</h3>
                <div className="groupinfoall">
                  <FaIdCard />
                  <div className="groupinfo">
                    <p>{t("id")}</p>
                    <span>{user.id}</span>
                  </div>
                </div>
                <div className="groupinfoall">
                  <FaVenusMars />
                  <div className="groupinfo">
                    <p>{t("gender")}</p>
                    <span>{user.gender ? t("female") : t("male")}</span>
                  </div>
                </div>
                <div className="groupinfoall">
                  <FaGlobe />
                  <div className="groupinfo">
                    <p>{t("country")}</p>
                    <span>{user.country}</span>
                  </div>
                </div>
                <div className="groupinfoall">
                  <FaCalendarAlt />
                  <div className="groupinfo">
                    <p>{t("createdAt")}</p>
                    <span>
                      {new Date(user.created_at).toISOString().split("T")[0]}
                    </span>
                  </div>
                </div>
                <div className="groupinfoall">
                  <FaUser />
                  <div className="groupinfo">
                    <p>{t("userName")}</p>
                    <span>{user.username}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebarright">
              <div className="info">
                <div className="radius">
                  <div className="titleinfo">
                    <FaBriefcase />
                    <h3>{t("professionalInformation")}</h3>
                  </div>
                  <div className="data-grid">
                    <div className="groupp">
                      <span>{t("departmentt")}</span>
                      {user.department.name}
                    </div>
                    <hr />
                    <div className="groupp">
                      <span>{t("job")}</span>
                      <span>{user.job.name || "N/A"}</span>
                    </div>
                    <hr />
                    <div className="groupp">
                      <span>{t("baseSalary")}</span>
                      <span>{user.job.salary || "N/A"}</span>
                    </div>
                    <hr />
                    <div className="groupp">
                      <span>{t("role")}</span>
                      <span>{user.role}</span>
                    </div>
                  </div>
                </div>
                <div className="radius">
                  <div className="titleinfo">
                    <FaEnvelope />
                    <h3>{t("contact")}</h3>
                  </div>
                  <div className="contact-info">
                    <div className="groupp">
                      <span>{t("emaill")}</span>
                      <span>{user.email}</span>
                    </div>
                    <hr />
                    <div className="groupp">
                      <span>{t("phonee")}</span>
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;