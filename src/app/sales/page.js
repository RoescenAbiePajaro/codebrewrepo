'use client';
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import UserTabs from "@/components/layout/UserTabs";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesPage = () => {
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [monthlyInterpretation, setMonthlyInterpretation] = useState('');
  const [timeframe, setTimeframe] = useState('daily');

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`/api/sales?timeframe=${timeframe}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setSalesData({}); // Reset sales data on error
    }
  };

  useEffect(() => {
    fetchSalesData(); // Initial fetch
    const interval = setInterval(fetchSalesData, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [timeframe]);

  useEffect(() => {
    if (Object.keys(salesData).length > 0) {
      updateChartData();
      updateInterpretations();
    }
  }, [salesData, timeframe]);

  const updateChartData = () => {
    const labels = Object.keys(salesData).map((key) => {
      if (timeframe === 'daily') return key; // Date is already in the format YYYY-MM-DD
      if (timeframe === 'weekly') return `Week ${key}`; // Week number
      if (timeframe === 'monthly') return key; // Format as YYYY-MM
      return key;
    });

    const amounts = Object.values(salesData);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales Amount',
          data: amounts,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.1,
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
      The highest sales were on ${highestSalesDate} with a total of ₱${highestSalesAmount.toFixed(2)}
      The lowest sales were on ${lowestSalesDate} with a total of ₱${lowestSalesAmount.toFixed(2)}
      The average sales per day is ₱${averageSalesPerDay.toFixed(2)}
    `);

    // Monthly sales interpretation
    const monthlyData = Object.keys(salesData).reduce((acc, date) => {
      const month = date.substring(0, 7);
      acc[month] = (acc[month] || 0) + salesData[date];
      return acc;
    }, {});

    const totalMonthlySales = Object.values(monthlyData).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    const highestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] > monthlyData[acc] ? curr : acc);
    const lowestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] < monthlyData[acc] ? curr : acc);
    const averageMonthlySales = totalMonthlySales / Object.keys(monthlyData).length;

    const highestMonthlySalesAmount = Number(monthlyData[highestMonthlySalesMonth]) || 0;
    const lowestMonthlySalesAmount = Number(monthlyData[lowestMonthlySalesMonth]) || 0;

    setMonthlyInterpretation(`
      Total monthly sales amount: ₱${totalMonthlySales.toFixed(2)}
      The highest monthly sales were in ${highestMonthlySalesMonth} with a total of ₱${highestMonthlySalesAmount.toFixed(2)}
      The lowest monthly sales were in ${lowestMonthlySalesMonth} with a total of ₱${lowestMonthlySalesAmount.toFixed(2)}
      The average monthly sales are ₱${(averageMonthlySales || 0).toFixed(2)}
    `);
  };

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div>
        <div className="flex gap-4 mt-4">
          <button
            className={`px-4 py-2 rounded ${timeframe === 'daily' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('daily')}
            aria-pressed={timeframe === 'daily'}
          >
            Daily
          </button>
          <button
            className={`px-4 py-2 rounded ${timeframe === 'weekly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('weekly')}
            aria-pressed={timeframe === 'weekly'}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded ${timeframe === 'monthly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('monthly')}
            aria-pressed={timeframe === 'monthly'}
          >
            Monthly
          </button>
        </div>
        <div className="mt-6">
          {chartData ? (
            <>
              {timeframe === 'daily' && (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              )}
              {timeframe !== 'daily' && (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              )}
            </>
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold">Sales Interpretation</h2>
          <p>{interpretation}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold">Monthly Sales Interpretation</h2>
          <p>{monthlyInterpretation}</p>
        </div>
      </div>
    </section>
  );
};

export default SalesPage;