'use client';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import UserTabs from "@/components/layout/UserTabs";

// Register Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Main SalesPage component
const SalesPage = () => {
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [timeframe, setTimeframe] = useState('daily');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`/api/sales?timeframe=${timeframe}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setSalesData({});
      }
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, 30000); // Polling every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe]);

  useEffect(() => {
    if (Object.keys(salesData).length > 0) {
      updateChartData();
      updateInterpretations();
    }
  }, [salesData]);

  const updateChartData = () => {
    const labels = Object.keys(salesData);
    const amounts = Object.values(salesData);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales Amount',
          data: amounts,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.1,
        },
      ],
    });

    setPieData({
      labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            'rgba(75,192,192,0.6)',
            'rgba(54,162,235,0.6)',
            'rgba(255,206,86,0.6)',
            'rgba(153,102,255,0.6)',
            'rgba(255,159,64,0.6)',
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const updateInterpretations = () => {
    const totalSales = Object.values(salesData).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const highestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] > salesData[acc] ? curr : acc);
    const lowestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] < salesData[acc] ? curr : acc);
    const averageSalesPerDay = totalSales / Object.keys(salesData).length;

    const highestSalesAmount = Number(salesData[highestSalesDate]) || 0;
    const lowestSalesAmount = Number(salesData[lowestSalesDate]) || 0;

    setInterpretation(`
      Total sales amount: ₱${totalSales.toFixed(2)}
      The highest sales were on ${highestSalesDate} with ₱${highestSalesAmount.toFixed(2)}.
      The lowest sales were on ${lowestSalesDate} with ₱${lowestSalesAmount.toFixed(2)}.
      The average sales per day is ₱${averageSalesPerDay.toFixed(2)}.
    `);
  };

  return (
    <section className="mt-8 max-w-4xl mx-auto p-4">
      <UserTabs isAdmin={true} />
      <TimeframeButtons timeframe={timeframe} setTimeframe={setTimeframe} />
      <ChartSection chartData={chartData} pieData={pieData} />
      <InterpretationSection interpretation={interpretation} />
    </section>
  );
};

// Timeframe button component
const TimeframeButtons = ({ timeframe, setTimeframe }) => (
  <div className="flex gap-4 mt-4">
    <button
      className={`px-4 py-2 rounded ${timeframe === 'daily' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('daily')}
    >
      Daily
    </button>
    <button
      className={`px-4 py-2 rounded ${timeframe === 'weekly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('weekly')}
    >
      Weekly
    </button>
    <button
      className={`px-4 py-2 rounded ${timeframe === 'monthly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('monthly')}
    >
      Monthly
    </button>
  </div>
);

// Chart section component
const ChartSection = ({ chartData, pieData }) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {chartData && (
      <>
        <div>
          <h2 className="text-lg font-bold mb-4">Line Chart</h2>
          <Line data={chartData} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Bar Chart</h2>
          <Bar data={chartData} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Pie Chart</h2>
          <Pie data={pieData} />
        </div>
      </>
    )}
  </div>
);

// Interpretation section component
const InterpretationSection = ({ interpretation }) => (
  <div className="mt-6">
    <h2 className="text-lg font-bold">Sales Interpretation</h2>
    <p className="whitespace-pre-line">{interpretation}</p>
  </div>
);

export default SalesPage;