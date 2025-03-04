import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('employee-count');
        console.log("API Response:", response.data); 
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  const data = chartData
    .map(d => ({
      department: d.department || "Unknown",
      employees: Number(d.employee_count) || 0,
    }))
    .sort((a, b) => a.employees - b.employees);

  return (
    <div className='bar'>
      {data.length > 0 ? (
        <ResponsiveBar
          data={data}
          keys={['employees']}
          indexBy="department"
          layout="horizontal"
          margin={{ top: 10, right: 30, bottom: 50, left: 100 }}
          padding={0.3}
          colors={(d) => {
            if (d.value <= 5 && d.value > 0) {
              return '#973AA8';
            } else if (d.value > 5 && d.value <= 10) {
              return '#C05299';
            } else if (d.value > 10 && d.value <= 15) {
              return '#FF8BA0';
            } else if (d.value > 15 && d.value <= 20) {
              return '#BD68EE';
            } else if (d.value > 20) {
              return '#D55D92';
            } else {
              return 'transparent';
            }
          }}
          axisBottom={{
            tickValues: [5, 10, 15, 20, 25],
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Employees',
            legendPosition: 'middle',
            legendOffset: 32,
            format: (value) => (value === 0 ? '' : value),
          }}
          axisLeft={{
            legend: 'Departments',
            legendPosition: 'middle',
            legendOffset: -80,
            format: (value) => `${value}`,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="white"
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default BarChart;
