import React, { useState, useEffect } from 'react';
import axiosInstance from "../Config/axiosSetup";
import { Link } from 'react-router-dom';
import ErrorAlert from '../Alerts/ErrorAlert';
import SuccessAlert from '../Alerts/SuccessAlert';
import Modal from "react-modal";

const SalaryCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paidOn, setPaidOn] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false); 
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [basesalary, setBasesalary] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Échec de la récupération des utilisateurs. Veuillez réessayer.');
        console.error(err);
        setShowErrorAlert(true);
      }
    };
    fetchUsers();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors
  
    if (userId && startDate && endDate) {
      try {
        const response = await axiosInstance.post('/calculate-salary', {
          start_date: startDate,
          end_date: endDate,
          paid_on: paidOn,
          user_id: userId
        });
  
        setUserId('');
        setPaidOn('');
        setStartDate('');
        setEndDate('');
  
        if (response.data.salary) {
          setSalaryData(response.data.salary);
          setBasesalary(response.data.basesalary);
          setShowModal(true);
        } else {
          setMessage(response.data.message);  
        }
  
        setShowSuccessAlert(true);
        setShowErrorAlert(false); 
  
      } catch (err) {
        if (err.response && err.response.data) {
          setError('Échec du calcul du salaire. Veuillez réessayer.');
        }
        console.error(err);
        setShowErrorAlert(true); 
      }
    } else {
      setError('Veuillez remplir tous les champs.');
      setShowErrorAlert(true); 
    }
  };
  

  return (
    <div className="salaryform">
      {showSuccessAlert && (
        <SuccessAlert message={message} onClose={() => setShowSuccessAlert(false)} />
      )}
      {showErrorAlert && (
        <ErrorAlert message={error} onClose={() => setShowErrorAlert(false)} />
      )}
      <h2>Calculateur de Salaire</h2>
      <form onSubmit={handleCalculate} className="form form-vertical">
        <div className="inputs inputs-vertical">
          <div className="select-input-container">
            <select 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              required 
              className="input input-vertical select-input">
              <option value="">Sélectionnez un utilisateur</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <input
              type="date"
              value={paidOn}
              onChange={(e) => setPaidOn(e.target.value)}
              required
              className="input input-vertical"
            />
            <label className="user-label date">Jour de paiement</label>
          </div>

          <div className="input-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="input input-vertical"
            />
            <label className="user-label date">Date de début</label>
          </div>

          <div className="input-group">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="input input-vertical"
            />
            <label className="user-label">Date de fin</label>
          </div>
        </div>

        <button className="button-form vertical-button-form" type="submit">Calculer</button>
      </form>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Détails du Salaire"
           overlayClassName="Department Detail Modal"
        className="modal modal-content"
      >
        <div className="modal-header">
          <h3>Détails du salaire </h3>
          <span className="modal-close" onClick={() => setShowModal(false)}>
            <img className="close" src="icons/close.png" alt="Fermer" />
          </span>
        </div>
        <div>
          <table className="salary-details-table">
            <thead>
              <tr>
                <th>Champ</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Salaire payé le</td>
                <td>{salaryData?.paid_on}</td>
              </tr>
              <tr>
                <td>Salaire de base</td>
                <td>{basesalary}</td>
              </tr>
              <tr>
                <td>Présences</td>
                <td>{salaryData?.attendances}</td>
              </tr>
              <tr>
                <td>Congés</td>
                <td>{salaryData?.leaves}</td>
              </tr>
              <tr>
                <td>Prime de présence</td>
                <td>{salaryData?.attendance_bonus}</td>
              </tr>
              <tr>
                <td>Déduction de congés</td>
                <td>{salaryData?.leave_deduction}</td>
              </tr>
              <tr>
                <td>Taux TVA</td>
                <td>{salaryData?.tva_rate}</td>
              </tr>
              <tr>
                <td>Montant TVA</td>
                <td>{salaryData?.tva_amount}</td>
              </tr>
              <tr>
                <td>Salaire total</td>
                <td>{salaryData?.total_salary}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <Link to="/salarylist" className="vertical-button" >Voir la liste des salaires</Link> */}
      </Modal>
    </div>
  );
};

export default SalaryCalculator;
