// BarChart.js
import React from 'react';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, labels }) => {
  const [datasets, setDatasets] = useState([]);

  function getData(value){
    var d = [];
    for(const ticker of labels){
      if(value[ticker]){
        d.push(value[ticker][0] * 2 - 1);
      }else{
        d.push(0);
      }
    }
    return d;
  }

  useEffect(()=>{
    var ds = [];
    for (const [key, value] of Object.entries(data)) {
      ds.push({
        label : key,
        data : getData(value),
        backgroundColor: ['rgba(199, 210, 254, 0.5)'],
        borderColor: ['rgba(199, 210, 254, 0.5)'],
        borderWidth: 1,
        grouped: false,
      })
    }
    setDatasets(ds);
    /*
    [
      {
        label: 'CNN',
        data: data, // y values (must be <= 1)
        backgroundColor: ['rgba(199, 210, 254, 0.5)'],
        borderColor: ['rgba(199, 210, 254, 0.5)'],
        borderWidth: 1,
        grouped: false,

      }
    ]
    */
    
  }, [data])

  

  const options = {
    responsive: true,
    animation: {
        duration: 100, // Duration of the animation in milliseconds
        easing: 'linear', // Easing function for the animation
      },
    plugins: {
      legend: {
        display: true
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
      <Bar data={{labels : labels, datasets : datasets}} options={options} />
    </div>
  );
};

export default BarChart;
 