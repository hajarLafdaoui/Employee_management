import React, { useEffect } from "react";
import "./alerts.scss";

const ErrorAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the alert after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  return (
    <div className="alert-container">
      <div className="success-alert"> {/* Keeping same styling for consistency */}
        <div className="alert-content">
          <div className="icon">
            <img src="icons/fail.png" className="error" alt="Error" />
          </div>
          <div className="text-content">
            <p className="text-white">Operation Failed</p>
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

export default ErrorAlert;