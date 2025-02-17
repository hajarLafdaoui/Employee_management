import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { ResponsivePie } from '@nivo/pie';

const PieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('employee-count');
        const data = response.data;
        const totalEmployees = data.reduce((sum, department) => sum + department.employee_count, 0);
        const pieChartData = data.map(department => ({
          id: department.department,
          label: department.department,
          value: (department.employee_count / totalEmployees) * 100,
        }));

        setChartData(pieChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const customColors = [
    '#FF6363', '#FFB03B', '#FFDA5C', '#70D8A5', '#6D7C8A', '#A0A9D3', '#9B71E8'
  ];

  return (
    <div className='pie' >
      {chartData.length > 0 ? (
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={customColors}
          borderWidth={1}
          borderColor="white"
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={20}
          arcLinkLabelsTextColor="#000"
          arcLinkLabelsDiagonalLength={20}
          arcLinkLabelsStraightLength={20}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsTextColor="#000"
          sliceLabel={(e) => `${e.id}: ${Math.round(e.value)}%`}
          tooltip={({ datum }) => (
            <strong>{datum.id}: {Math.round(datum.value)}%</strong>
          )}
          theme={{
            labels: {
              text: {
                fontSize: 16, // Increase text size of labels
              }
            },
            legends: {
              text: {
                fontSize: 14, // Adjust legend text size if needed
              }
            },
            arcLinkLabels: {
              text: {
                fontSize: 16, // Increase arc link label font size
              }
            }
          }}
        />

      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PieChart;
