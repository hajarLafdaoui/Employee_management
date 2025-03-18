import React, { useEffect } from "react";
import "./alerts.scss";

const ErrorAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-container">
      <div className="success-alert"> {/* Class name kept for consistency */}
        <div className="alert-content">
          <div className="icon">
            <img
              src={`${process.env.PUBLIC_URL}/icons/fail.png`}
              className="error"
              alt="Error"
            />
          </div>
          <div className="text-content-alert">
            <p className="MSG">Operation Failed</p>
            <p className="msg2">{message}</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <img
            src={`${process.env.PUBLIC_URL}/icons/close1.png`}
            className="closee"
            alt="Close"
          />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;