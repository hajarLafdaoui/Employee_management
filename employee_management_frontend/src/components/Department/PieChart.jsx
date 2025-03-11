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
        
        const pieChartData = data
          .filter(department => department.employee_count > 0)
          .map((department) => {
            
            let color = '#973AA8';

            if (department.employee_count <= 5) {
              color = '#973AA8';
            } else if (department.employee_count <= 10) {
              color = '#C05299';
            } else if (department.employee_count <= 15) {
              color = '#FF8BA0';
            } else if (department.employee_count <= 20) {
              color = '#BD68EE';
            } else if (department.employee_count > 20) {
              color = '#D55D92';
            }

            return {
              id: department.department,
              label: department.department,
              value: Math.round((department.employee_count / totalEmployees) * 100),
              color: color,
            };
          });

        setChartData(pieChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='pie'>
      {chartData.length > 0 ? (
        <ResponsivePie
          data={chartData}
          margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
          innerRadius={0.5}
          padAngle={0.2}
          cornerRadius={2}
          colors={d => d.data.color}
          borderWidth={0}
          borderColor="#fff"
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={20}
          arcLinkLabelsTextColor="#000"
          arcLinkLabelsDiagonalLength={10}
          arcLinkLabelsStraightLength={10}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsTextColor="#fff"
          sliceLabel={(e) => `${e.id}: ${Math.round(e.value)}%`}
          tooltip={({ datum }) => (
            <a style={{ color: 'black', background: 'white', padding: '5px', borderRadius: '2px' }}>
              {datum.id}: {Math.round(datum.value)}%
            </a>
          )}
          theme={{
            tooltip: {
              container: {
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
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
