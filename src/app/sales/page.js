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
import * as XLSX from 'xlsx'; 
import DownloadIcon from '@mui/icons-material/Download'; 
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading spinner

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
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state to track fetching status

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/sales?groupBy=products`);
        if (!response.ok) throw new Error("Failed to fetch product data");
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProductData();
  }, []);

  // Fetch sales data periodically
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

  // Update chart and interpretation data when sales data changes
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
          label: 'Sales Amount (₱)',
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
    const averageSalesPerDay = totalSales / Object.keys(salesData).length;

    const salesEntries = Object.entries(salesData).map(([date, amount]) => ({
      date,
      amount: Number(amount) || 0,
    }));

    salesEntries.sort((a, b) => b.amount - a.amount); // Sort descending

    let interpretationText = `Total sales amount: ₱${totalSales.toFixed(2)}\n`;
    interpretationText += `Average sales per day: ₱${averageSalesPerDay.toFixed(2)}\n\n`;
    interpretationText += `Sales per date:\n`;

    salesEntries.forEach(({ date, amount }) => {
      interpretationText += `- ${date}: ₱${amount.toFixed(2)}\n`;
    });

    setInterpretation(interpretationText);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Object.entries(salesData).map(([date, amount]) => ({ Date: date, Amount: amount })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
    XLSX.writeFile(workbook, "sales_data.xlsx");
  };

  // Show loading spinner until data is fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress /> {/* Show spinner while loading */}
      </div>
    );
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <TimeframeButtons timeframe={timeframe} setTimeframe={setTimeframe} />
      <button
        onClick={downloadExcel}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
      >
        <DownloadIcon /> Export to Excel
      </button>
      <ChartSection chartData={chartData} pieData={pieData} productData={productData} />
      <InterpretationSection interpretation={interpretation} />
    </section>
  );
};

// Timeframe button component
const TimeframeButtons = ({ timeframe, setTimeframe }) => (
  <div className="flex gap-4 mt-4">
    <button
      className={`px-4 py-2 rounded-lg transition duration-300 ${timeframe === 'daily' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('daily')}
    >
      Daily
    </button>
    <button
      className={`px-4 py-2 rounded-lg transition duration-300 ${timeframe === 'weekly' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('weekly')}
    >
      Weekly
    </button>
    <button
      className={`px-4 py-2 rounded-lg transition duration-300 ${timeframe === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('monthly')}
    >
      Monthly
    </button>
  </div>
);

// Chart section component
const ChartSection = ({ chartData, pieData, productData }) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {chartData && (
      <>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Sales Trend (Line Chart)</h2>
          <Line data={chartData} />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Sales Distribution (Bar Chart)</h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Revenue Streams (Pie Chart)</h2>
          <Pie data={pieData} />
        </div>
      </>
    )}
    {productData && (
      <>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Product Sales Trend (Line Chart)</h2>
          <Line
            data={{
              labels: Object.keys(productData),
              datasets: [
                {
                  label: 'Product Sales (₱)',
                  data: Object.values(productData),
                  borderColor: 'rgba(255,99,132,1)',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Product Sales Distribution (Bar Chart)</h2>
          <Bar
            data={{
              labels: Object.keys(productData),
              datasets: [
                {
                  label: 'Product Sales (₱)',
                  data: Object.values(productData),
                  backgroundColor: 'rgba(54,162,235,0.6)',
                },
              ],
            }}
          />
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Product Revenue Streams (Pie Chart)</h2>
          <Pie data={{
            labels: Object.keys(productData),
            datasets: [
              {
                data: Object.values(productData),
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
          }} />
        </div>
      </>
    )}
  </div>
);

// Interpretation section component
const InterpretationSection = ({ interpretation }) => (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-4">Sales Interpretation</h2>
    <pre>{interpretation}</pre>
  </div>
);

export default SalesPage;
