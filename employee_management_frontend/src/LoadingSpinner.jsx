// LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className='loading'>Loading ...</p>
    </div>
  );
}

export default LoadingSpinner;
