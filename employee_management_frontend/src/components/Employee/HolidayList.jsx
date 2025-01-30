import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useTranslation } from 'react-i18next';
const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axiosInstance.get('/holidays');
        setHolidays(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch holidays');
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (loading) {
    return <div>Loading holidays...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Holiday List</h3>
      <ul>
        {holidays.map((holiday) => (
          <li key={holiday.id}>
  
            {t(`holidays.${holiday.name}`)} - {new Date(holiday.date).toLocaleDateString()}
          </li>          
        ))}
      </ul>
    </div>
  );
};

export default HolidayList;
