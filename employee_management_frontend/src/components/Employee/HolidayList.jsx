import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../LoadingSpinner';

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

  if (loading) return <LoadingSpinner />;


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>{t('holidayListTitle')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('date')}</th>
            <th>{t('number-of-days')}</th>

          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.id}>
              <td>{t(`holidays.${holiday.name}`)}</td>

              <td>{new Date(holiday.date).toLocaleDateString()}</td>
              <td>{holiday.number_of_days}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HolidayList;
