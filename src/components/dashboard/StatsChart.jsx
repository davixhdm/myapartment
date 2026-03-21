import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatsChart = ({ type = 'bar', data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const ChartComponent = type === 'pie' ? Pie : Bar;

  return (
    <div className="h-64">
      <ChartComponent data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export default StatsChart;