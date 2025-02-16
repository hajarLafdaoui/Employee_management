import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('employee-count');
        // console.log(response.data);
        setChartData(response.data);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = chartData.map(d => ({
    department: d.department,
    employees: d.employee_count,
  }));

  return (
    <div className='bar'>
   

      {data.length > 0 ? (
        <ResponsiveBar
          data={data}
          keys={['employees']}
          indexBy="department"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          layout="vertical"
          colors={(d) => {
            if (d.value <= 1) {
              return '#D91656';  // Red for employee count <= 1
            } else if (d.value > 1 && d.value <= 3) {
              return '#EB5B00';  // Orange for employee count between 1 and 3
            } else if (d.value > 3 && d.value <= 5) {
              return '#FFB200';  // Yellow for employee count between 3 and 5
            } else {
              return '#FFB200';  // Yellow for employee count greater than 5
            }
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Employees',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickValues: [0, 1, 2, 3, 4, 5],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Departments',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
         <div className='meaning'
>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#D91656', marginRight: '5px' }}></div>
          <span>1 or fewer</span> 
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#EB5B00', marginRight: '5px' }}></div>
          <span>1-3</span> 
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#FFB200', marginRight: '5px' }}></div>
          <span>3-5</span> 
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#FFB200', marginRight: '5px' }}></div>
          <span>5+</span> 
        </div>
      </div>
    </div>
  );
};

export default BarChart;
