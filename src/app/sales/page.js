// /pages/sales.js
'use client';
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import UserTabs from "@/components/layout/UserTabs";

export default function SalesPage() {
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('daily');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`/api/sales?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [timeframe]);

  useEffect(() => {
    if (Object.keys(salesData).length > 0) {
      const labels = Object.keys(salesData);
      const amounts = Object.values(salesData);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Sales Amount',
            data: amounts,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [salesData]);

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div>
        <h1>Sales Data</h1>
        <div>
          <button onClick={() => setTimeframe('daily')}>Daily</button>
          <button onClick={() => setTimeframe('weekly')}>Weekly</button>
          <button onClick={() => setTimeframe('monthly')}>Monthly</button>
        </div>
        {chartData ? (
          <div>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true, position: 'top' } } }} />
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: true, position: 'top' } } }} />
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </section>
  );
};


