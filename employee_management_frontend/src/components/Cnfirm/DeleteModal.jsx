import React from "react";
import "./DeleteModal.scss";

const DeleteModal = ({
  showDeletePopUp,
  setShowDeletePopUp,
  handleDelete,
  itemType,
}) => {
  if (!showDeletePopUp) return null;

  const deleteTitle = `Delete ${itemType}`;
  const deleteMessage = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;

  return (
    <div className="modal-overlay">
      <div className="delete-card">
        <div className="delete-header">
          <div className="delete-image">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className="delete-content">
            <span className="delete-title">{deleteTitle}</span>
            <p className="delete-message">{deleteMessage}</p>
          </div>
        </div>
        <div className="delete-actions">
          <button className="delete-button" type="button" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={() => setShowDeletePopUp(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;