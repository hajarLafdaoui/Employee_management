import React, { useState, useEffect } from "react";
import axiosInstance from '../Config/axiosSetup';

const AdminHolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [editHoliday, setEditHoliday] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const response = await axiosInstance.get("/holidays");
    setHolidays(response.data);
  };

  const addHoliday = async () => {
    await axiosInstance.post("/holidays", newHoliday);
    fetchHolidays();
    setNewHoliday({ name: "", date: "" });
    setShowModal(false);
  };

  const deleteHoliday = async (id) => {
    await axiosInstance.delete(`/holidays/${id}`);
    fetchHolidays();
  };

  const handleEditHoliday = (holiday) => {
    setEditHoliday(holiday);  
    setNewHoliday({ name: holiday.name, date: holiday.date });
    setShowModal(true); 
  };

  const updateHoliday = async () => {
    await axiosInstance.put(`/holidays/${editHoliday.id}`, newHoliday);
    fetchHolidays();
    setNewHoliday({ name: "", date: "" });
    setShowModal(false);
    setEditHoliday(null); 
  };

  return (
    <div>
      <h2>Manage Holidays</h2>
      <button onClick={() => setShowModal(true)}>Add Holiday</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editHoliday ? "Edit Holiday" : "Add New Holiday"}</h3>
            <input
              type="text"
              placeholder="Holiday Name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
            />
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            />
            <button onClick={editHoliday ? updateHoliday : addHoliday}>
              {editHoliday ? "Update Holiday" : "Add Holiday"}
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ul>
        {holidays.map((holiday) => (
          <li key={holiday.id}>
            {holiday.name} - {holiday.date}
            <button onClick={() => handleEditHoliday(holiday)}>Edit</button>
            <button onClick={() => deleteHoliday(holiday.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          width: 300px;
          text-align: center;
        }
        button {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminHolidayManagement;
