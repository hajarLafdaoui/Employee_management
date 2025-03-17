import React from "react";
import "./Confirmation.scss";

const Confirmation = ({
  showConfirmPopUp,
  setShowConfirmPopUp,
  handleConfirm,
  itemType,
}) => {
  if (!showConfirmPopUp) return null;

  const confirmTitle = `Confirm ${itemType}`;
  const confirmMessage = `Are you sure you want to confirm this ${itemType}? This action cannot be undone.`;

  return (
    <div className="dialog-container">
      <div className="dialog-box">
        <div className="dialog-header">
          <div className="icon-container">
          <svg
  aria-hidden="true"
  stroke="currentColor"
  strokeWidth="1.5"
  viewBox="0 0 24 24"
  fill="none"
>
  <path
    d="M20 6L9 17l-5-5"
    strokeLinejoin="round"
    strokeLinecap="round"
  ></path>

            </svg>
          </div>
          <div className="dialog-body">
            <span className="dialog-title">{confirmTitle}</span>
            <p className="dialog-message">{confirmMessage}</p>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="confirm-button" type="button" onClick={handleConfirm}>
            Confirm
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={() => setShowConfirmPopUp(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
