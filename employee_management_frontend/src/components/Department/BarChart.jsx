import React, { useState, useEffect } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { ResponsiveBar } from '@nivo/bar';
import LoadingSpinner from '../../LoadingSpinner'; // Import the LoadingSpinner component

const BarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('employee-count');
        console.log("API Response:", response.data);
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Disable loading after data is fetched
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
    <div className='bar barDashboard'>
      {isLoading ? (
        <LoadingSpinner /> // Show the spinner while loading
      ) : data.length > 0 ? (
        <ResponsiveBar
          data={data}
          keys={['employees']}
          indexBy="department"
          layout="vertical" // Change layout to vertical
          margin={{ top: 50, right: 30, bottom: 100, left: 80 }} // Adjust margins for vertical layout
          padding={0.3}
          colors={(d) => {
            if (d.value <= 5 && d.value > 0) {
              return '#E9F7DF';
            } else if (d.value > 5 && d.value <= 10) {
              return '#D1F1BB';
            } else if (d.value > 10 && d.value <= 15) {
              return '#AFDC8F';
            } else if (d.value > 15 && d.value <= 20) {
              return '#87BB62';
            } else if (d.value > 20) {
              return '#63993D';
            } else {
              return 'transparent';
            }
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45, // Rotate department names for better readability
            legend: 'Departments',
            legendPosition: 'middle',
            legendOffset: 60, // Adjust legend offset for vertical layout
          }}
          axisLeft={{
            tickValues: [0, 5, 10, 15, 20, 25], // Number of employees starting from 0, 5, 10, ...
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Employees',
            legendPosition: 'middle',
            legendOffset: -60, // Adjust legend offset for vertical layout
            format: (value) => (value === 0 ? '' : value),
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="white"
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default BarChart;