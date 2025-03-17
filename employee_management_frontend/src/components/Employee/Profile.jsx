import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
          <p>{user.name}</p>
          <p>{user.gender ? "" : "male"}</p>
        </div>
        <div className="infos">
          <div>
            <p>
              <strong>{t("username")}:</strong> {user.username}
            </p>
            <p>
              <strong>{t("email")}:</strong> {user.email}
            </p>
            <p>
              <strong>{t("phone")}:</strong> {user.phone}
            </p>
          </div>
          <div>
            <p>
              <strong>{t("country")}:</strong> {user.country}
              {user.flagUrl && (
                <img
                  src={user.flagUrl}
                  alt={user.country}
                  style={{ width: "20px", marginLeft: "10px" }}
                />
              )}
            </p>
            <p>
              <strong>{t("department")}:</strong> {user.department.name}
            </p>

            <p>
              <strong>{t("department")}:</strong> {user.department.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
