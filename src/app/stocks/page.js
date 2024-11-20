'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import UserTabs from "@/components/layout/UserTabs";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('/api/stocks');
        setStocks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    try {
      const response = await axios.put(`/api/stocks/${id}`, { stock: newStock });
      setStocks((prev) =>
        prev.map((item) => (item._id === id ? { ...item, stock: response.data.stock } : item))
      );
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) return <p>Loading stocks...</p>;

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={true} />
        <div className="stocks-page">
        <h1>Manage Stocks</h1>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Base Price</th>
                <th>Stock</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {stocks.map((item) => (
                <tr key={item._id}>
                <td>{item.name}</td>
                <td>${item.basePrice.toFixed(2)}</td>
                <td>
                    <input
                    type="number"
                    value={item.stock || 0}
                    onChange={(e) => handleUpdateStock(item._id, parseInt(e.target.value))}
                    />
                </td>
                <td>
                    <button onClick={() => handleUpdateStock(item._id, item.stock)}>Update</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </section>
  );
}
