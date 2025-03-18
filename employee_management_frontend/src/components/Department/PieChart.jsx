import React, { useEffect, useState } from 'react';
import axiosInstance from '../Config/axiosSetup';
import { ResponsivePie } from '@nivo/pie';
import LoadingSpinner from '../../LoadingSpinner'; // Import the LoadingSpinner component

const PieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('employee-count');
        const data = response.data;
        const totalEmployees = data.reduce((sum, department) => sum + department.employee_count, 0);

        const pieChartData = data
          .filter(department => department.employee_count > 0)
          .map((department) => {
            let color = '#973AA8'; // Default color if no condition matches

            // Color logic from BarChart
            if (department.employee_count <= 5) {
              color = '#FFE8CC';
            } else if (department.employee_count > 5 && department.employee_count <= 10) {
              color = '#FCCB8F';
            } else if (department.employee_count > 10 && department.employee_count <= 15) {
              color = '#F8AE54';
            } else if (department.employee_count > 15 && department.employee_count <= 20) {
              color = '#F5921B';
            } else if (department.employee_count > 20) {
              color = '#CA6C0F';
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
      } finally {
        setIsLoading(false); // Disable loading after data is fetched
      }
    };

    fetchData();
  }, []);

  
return (
    <div className='pie'>
      {isLoading ? (
        <LoadingSpinner />
      ) : chartData.length > 0 ? (
        <ResponsivePie
          data={chartData}
          margin={{ top: 0, right: 80, bottom: 0, left: 80 }}
          innerRadius={0.5}
          padAngle={0.2}
          cornerRadius={2}
          colors={d => d.data.color}
          borderWidth={0}
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={20}
          arcLinkLabelsDiagonalLength={10}
          arcLinkLabelsStraightLength={10}
          arcLinkLabelsColor={{ from: 'color' }}
          sliceLabel={(e) => `${e.id}: ${Math.round(e.value)}%`}
         
          tooltip={({ datum }) => (
            <a style={{ color: 'black', background: 'white', padding: '5px', borderRadius: '2px' }}>
              {datum.id}: {Math.round(datum.value)}%
            </a>
          )}
          theme={{
            labels: {
              text: {
                fontSize: 12
              }
            },
            tooltip: {
              container: {
                padding: 0,
                background: 'transparent',
                boxShadow: 'none'
              }
            }
          }}
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};
export default PieChart;