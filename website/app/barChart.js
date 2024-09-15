// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartData = {
    labels: ['Positive', 'Negative'], // x values
    datasets: [
      {
        label: 'Sentiment Analysis',
        data: data, // y values (must be <= 1)
        backgroundColor: ['rgba(189, 231, 189,0.5)','rgba(255, 105, 98, 0.5)'],
        borderColor: ['rgba(189, 231, 189,0.5)','rgba(255, 105, 98, 0.5)'],
        borderWidth: 1,
      },
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
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
        x:{
            grid:{
                display: false
            },
        },
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.5,
        },
        grid:{
            display: false
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '600px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
