'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import UserTabs from "@/components/layout/UserTabs";
import axios from 'axios';

const SalesReport = () => {
  const [salesData, setSalesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartVisibility, setChartVisibility] = useState({
    bar: false,
    line: false,
    pie: false,
    monthlyBar: false,
    monthlyLine: false,
    monthlyPie: false,
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/sales'); // Ensure this is a GET request
        setSalesData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalesData();
  }, []);

  if (loading) return <div className="loading">Loading sales data...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!Object.keys(salesData).length) return <div className="no-data">No sales data available.</div>;

  // Prepare chart data
  const chartData = Object.keys(salesData).map(date => ({
    date,
    value: salesData[date],
  }));

  // Monthly data aggregation
  const monthlyData = Object.keys(salesData).reduce((acc, date) => {
    const month = date.substring(0, 7); // Extract month from date
    acc[month] = (acc[month] || 0) + salesData[date];
    return acc;
  }, {});

  const monthlyChart = Object.keys(monthlyData).map(month => ({
    month,
    value: monthlyData[month],
  }));

  // Sales interpretations
  const totalSales = Object.values(salesData).reduce((acc, curr) => acc + curr, 0);
  const highestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] > salesData[acc] ? curr : acc);
  const lowestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] < salesData[acc] ? curr : acc);
  const averageSalesPerDay = totalSales / Object.keys(salesData).length;

  const interpretation = `
    Total sales amount: ₱${totalSales.toFixed(2)}
    The highest sales were on ${highestSalesDate} with a total of ₱${salesData[highestSalesDate].toFixed(2)}
    The lowest sales were on ${lowestSalesDate} with a total of ₱${salesData[lowestSalesDate].toFixed(2)}
    The average sales per day is ₱${averageSalesPerDay.toFixed(2)}
  `;

  // Monthly sales interpretation
  const totalMonthlySales = Object.values(monthlyData).reduce((acc, curr) => acc + curr, 0);
  const highestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] > monthlyData[acc] ? curr : acc);
  const lowestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] < monthlyData[acc] ? curr : acc);
  const averageMonthlySales = totalMonthlySales / Object.keys(monthlyData).length;

  const monthlyInterpretation = `
    Total monthly sales amount: ₱${totalMonthlySales.toFixed(2)}
    The highest monthly sales were in ${highestMonthlySalesMonth} with a total of ₱${monthlyData[highestMonthlySalesMonth].toFixed(2)}
    The lowest monthly sales were in ${lowestMonthlySalesMonth} with a total of ₱${monthlyData[lowestMonthlySalesMonth].toFixed(2)}
    The average monthly sales are ₱${averageMonthlySales.toFixed(2)}
  `;

  // Toggle chart visibility
  const toggleChart = (chartType) => {
    setChartVisibility(prevState => ({
      ...prevState,
      [chartType]: !prevState[chartType],
    }));
  };

  return (
    <div>
      <UserTabs />
      <h1>Sales Report</h1>
      <div>
        <button onClick={() => toggleChart('bar')}>Toggle Bar Chart</button>
        <button onClick={() => toggleChart('line')}>Toggle Line Chart</button>
        <button onClick={() => toggleChart('pie')}>Toggle Pie Chart</button>
        <button onClick={() => toggleChart('monthlyBar')}>Toggle Monthly Bar Chart</button>
        <button onClick={() => toggleChart('monthlyLine')}>Toggle Monthly Line Chart</button>
        <button onClick={() => toggleChart('monthlyPie')}>Toggle Monthly Pie Chart</button>
      </div>
      <div>
        {chartVisibility.bar && (
          <BarChart width={600} height={300} data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )}
        {chartVisibility.line && (
          <LineChart width={600} height={300} data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        )}
        {chartVisibility.pie && (
          <PieChart width={400} height={400}>
            <Pie data={chartData} dataKey="value" nameKey="date" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        )}
        {chartVisibility.monthlyBar && (
          <BarChart width={600} height={300} data={monthlyChart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        )}
        {chartVisibility.monthlyLine && (
          <LineChart width={600} height={300} data={monthlyChart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </LineChart>
        )}
        {chartVisibility.monthlyPie && (
          <PieChart width={400} height={400}>
            <Pie data={monthlyChart} dataKey="value" nameKey="month" cx="50%" cy="50%" outerRadius={80} fill="#ff7300" label />
            <Tooltip />
          </PieChart>
        )}
      </div>
      <div>
        <h2>Sales Interpretation</h2>
        <pre>{interpretation}</pre>
        <h2>Monthly Sales Interpretation</h2>
        <pre>{monthlyInterpretation}</pre>
      </div>
    </div>
  );
};

export default SalesReport;