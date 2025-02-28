import React from "react";
import "./alerts.scss"; // Ensure styling is consistent
const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="alert-container">
      <div className="success-alert">
        <div className="alert-content">
          <div className="icon">
            <img src="icons/success.png" className="success" alt="Success" />
          </div>
          <div className="text-content">
            <p className="text-white">Done successfully :)</p>
            <p className="text-gray">{message}</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <img src="icons/close.png" className="close" alt="Close" />
        </button>
      </div>
    </div>
  );
};


export default SuccessAlert;
