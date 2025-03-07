import React, { useEffect } from "react";
import "./alerts.scss"; // Ensure styling is consistent

const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the alert after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <div className="alert-container">
      <div className="success-alert">
        <div className="alert-content">
          <div className="icon">
            <img src="icons/success.png" className="success" alt="Success" />
          </div>
          <div className="text-content-alert">
            <p className="MSG ">Done successfully :)</p>
            <p className="msg2">{message}</p>
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