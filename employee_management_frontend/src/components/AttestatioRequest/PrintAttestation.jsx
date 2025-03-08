import React from 'react';
import { useLocation } from 'react-router-dom';
import "./PrintAttestation.scss"

const PrintAttestation = () => {
  const location = useLocation();
  const { user } = location.state || {};

  if (!user) {
    return <p>No user data available for printing.</p>;
  }

  return (
    <div className="attestation-container">
      <h1 className="title">Attestation de Travail</h1>
      <div className="content">
        <p>Nous, soussignés, attestons que :</p>
        <p><strong>Nom:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p>
          Est employé(e) dans notre entreprise en qualité de 
          <strong> {user.role}</strong>, et ce depuis la date de son embauche.
        </p>
        <p>
          Cette attestation est délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.
        </p>
      </div>
      <div className="footer">
        <p>Fait à Agadir, le {new Date().toLocaleDateString()}</p>
        <p>Entreprise Name</p>
      </div>
      <button
        onClick={() => window.print()}
        className="print-button"
      >
        Print
      </button>
    </div>
  );
};

export default PrintAttestation;
