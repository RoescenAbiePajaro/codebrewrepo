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
import { useProfile } from "@/components/UseProfile";

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
  const { loading: profileLoading, data: profileData } = useProfile();
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

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }
  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <TimeframeButtons timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="flex justify-end mt-4">
        <button
          onClick={downloadExcel}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
        >
          <DownloadIcon /> Download Excel
        </button>
      </div>
      <ChartSection chartData={chartData} pieData={pieData} />
      <InterpretationSection interpretation={interpretation} />
    </section>
  );
};

// Timeframe button component
const TimeframeButtons = ({ timeframe, setTimeframe }) => (
  <div className="flex gap-4 mt-4 mb-6 justify-center">
    <button
      className={`px-6 py-3 rounded-lg transition duration-300 ${timeframe === 'daily' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('daily')}
    >
      Daily
    </button>
    <button
      className={`px-6 py-3 rounded-lg transition duration-300 ${timeframe === 'weekly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setTimeframe('weekly')}
    >
      Weekly
    </button>
    <button
      className={`px-6 py-3 rounded-lg transition duration-300 ${timeframe === 'monthly' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
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
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Sales Trend (Line Chart)</h2>
          <Line data={chartData} />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Sales Distribution (Bar Chart)</h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Revenue Streams (Pie Chart)</h2>
          <Pie data={pieData} />
        </div>
      </>
    )}
  </div>
);

// Interpretation section component
const InterpretationSection = ({ interpretation }) => (
  <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-xl">
    <h2 className="text-xl font-semibold mb-4">Sales Interpretation</h2>
    <p className="whitespace-pre-line">{interpretation}</p>
  </div>
);

export default SalesPage;
