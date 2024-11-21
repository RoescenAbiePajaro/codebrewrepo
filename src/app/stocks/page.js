// StocksPage.js
'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from "@/components/layout/Modal";

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('/api/menu-items');
      console.log('Fetched stocks:', response.data);
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to load stocks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks(); // Initial fetch
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    if (newStock < 0) return; // Prevent negative stock updates
    console.log('Updating stock for:', id, 'New stock:', newStock);
    setUpdateLoading((prev) => ({ ...prev, [id]: true })); // Set loading for this stock
    try {
      const response = await axios.put('/api/menu-items', { _id: id, stock: newStock });
      console.log('Updated stock response:', response.data);
      setStocks((prev) =>
        prev.map((item) => (item._id === id ? { ...item, stock: newStock } : item)) // Update stock immediately
      );
      toast.success('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [id]: false })); // Reset loading for this stock
    }
  };
  
  const openModal = (item) => {
    setSelectedStock(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  if (loading) return <p>Loading stocks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">Manage Stocks</h1>
        {stocks.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b p-2">Name</th>
                <th className="border-b p-2">Base Price</th>
                <th className="border-b p-2">Stock</th>
                <th className="border-b p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="border-b p-2 text-left">{item.name}</td>
                  <td className="border-b p-2 text-right">{item.basePrice ? `₱${item.basePrice.toFixed(2)}` : '₱0.00'}</td>
                  <td className="border-b p-2 text-right">
                    {item.stock > 0 ? (
                      <input
                        type="number"
                        value={isNaN(item.stock) ? 0 : item.stock}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue)) {
                            handleUpdateStock(item._id, newValue);
                          }
                        }}
                        className="border rounded p-1 w-20"
                        disabled={updateLoading[item._id]} // Disable input if loading
                      />
                    ) : (
                      <span className="text-red-500 font-bold cursor-pointer">
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="border-b p-2 text-center">
                    <button
                      onClick={() => openModal(item)}
                      className="bg-green-500 text-white rounded px-2 py-1"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No stocks found.</p>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onUpdate={handleUpdateStock} 
        stockItem={selectedStock} 
      />
    </section>
  );
};

export default StocksPage;