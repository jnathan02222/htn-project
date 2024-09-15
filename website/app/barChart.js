// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartData = {
    labels: ['ARM', 'LIN', 'AZN', 'BKR', 'AVGO', 'BIIB', 'BKNG', 'CDNS', 'ARM', 'LIN', 'AZN', 'BKR', 'AVGO', 'BIIB', 'BKNG', 'CDNS'], // x values
    datasets: [
      {
        label: '',
        data: data, // y values (must be <= 1)
        backgroundColor: ['rgba(199, 210, 254, 0.5)'],
        borderColor: ['rgba(199, 210, 254, 0.5)'],
        borderWidth: 1,
        grouped: false,

      },
      {
        label: '',
        data: data.map(val=>val/2), // y values (must be <= 1)
        backgroundColor: ['rgba(199, 210, 254, 0.5)'],
        borderColor: ['rgba(199, 210, 254, 0.5)'],
        borderWidth: 1,
        grouped: false,

      }
    ],
  };

  const options = {
    responsive: true,
    animation: {
        duration: 1000, // Duration of the animation in milliseconds
        easing: 'linear', // Easing function for the animation
      },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
        
      },
    },
    scales: {
      x:{
          grid:{
              display: false
          },
          
          offset: true,
      },
      y: {
        min: -1,
        max: 1,
        ticks: {
          stepSize: 1,
        },
        grid:{
            display: false
        },
        beginAtZero: true,
      },
    },
    barPercentage: 1.0, 
    categoryPercentage: 1.0, 
  };

  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
