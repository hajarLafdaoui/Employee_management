import React from 'react';
import { useLocation } from 'react-router-dom';
import './PrintAttestation.scss';

const PrintAttestation = () => {
  const location = useLocation();
  const { user } = location.state || {};

  if (!user) {
    return <p>No user data available for printing.</p>;
  }

  return (
    <>
     <div className="salary-actions">
     <button className="btnslary" onClick={() => window.print()}><img src="/icons/paper.png" alt=""                                                 className="edit2-icon"
                    />Print</button>
     </div>
     
 
    <div className="attestation-container">

      <img src="/logo/logo.png" alt="Logo" className="logo1" />

      <h1 className="title">Employment Certificate</h1>
      <div className="content">
        <p>We, the undersigned, certify that:</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p>
          Is employed with our company as a <strong>{user.role}</strong>, since the date of their hiring.
        </p>
        <p>
          This certificate is issued at the request of the concerned party for whatever purpose it may serve.
        </p>
      </div>
      <div className="footer">
        <p>Issued in Agadir, on {new Date().toLocaleDateString()}</p>
        <p>WORKIO Company</p>
      </div>
      
    </div></>
  );
};

export default PrintAttestation;
