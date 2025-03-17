import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaMale,
  FaFemale,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobeAmericas,
  FaBuilding,
  FaUser,
  FaIdCard,
  FaBriefcase,
} from "react-icons/fa"; // Import React Icons
import "./profile.scss";

const Profile = ({ onLogout }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  if (!user) {
    return <p>{t("loading_profile")}</p>;
  }

  return (
    <div>
      <h1>{t("profile")}</h1>
      <div className="profile">
        <div className="profile-header">
          <div className="img">
            <img src="profile.jpg" width="500" alt="profile" />
          </div>
        </div>
        <div className="infos">
          <p>
            <FaUser /> <strong>{t("name")}:</strong> {user.name}
          </p>
          <p>
            {user.gender ? <FaFemale /> : <FaMale />}{" "}
            <strong>{t("gender")}:</strong> {user.gender ? "female" : "male"}
          </p>
          <p>
            <FaEnvelope /> <strong>{t("email")}:</strong> {user.email}
          </p>
          <p>
            <FaPhoneAlt /> <strong>{t("phone")}:</strong> {user.phone}
          </p>

          <p>
            <FaIdCard /> <strong>{t("username")}:</strong> {user.username}
          </p>
          <p>
            <FaGlobeAmericas /> <strong>{t("country")}:</strong> {user.country}
            {user.flagUrl && (
              <img
                src={user.flagUrl}
                alt={user.country}
                style={{ width: "20px", marginLeft: "10px" }}
              />
            )}
          </p>
          <p>
            <FaBuilding /> <strong>{t("department")}:</strong>{" "}
            {user.department.name}
          </p>
          <p>
            <FaBriefcase /> <strong>{t("job")}:</strong> {user.job}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
