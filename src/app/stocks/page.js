// src\app\stocks\page.js
'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProfile } from "@/components/UseProfile";
import StockModal from "@/components/layout/StockModal"; // Updated import
import TablePagination from '@mui/material/TablePagination';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});
  const { loading: profileLoading, data: profileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [filterOption, setFilterOption] = useState('all');

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
    fetchStocks();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    if (newStock < 0 || isNaN(newStock)) return; // Ensure valid stock value
  
    setUpdateLoading((prev) => ({ ...prev, [id]: true }));
  
    try {
      const response = await axios.put('/api/menu-items', { _id: id, stock: newStock });
  
      if (response.status === 200) {
        setStocks((prev) =>
          prev.map((item) => (item._id === id ? { ...item, stock: newStock } : item))
        );
        toast.success('Stock updated successfully');
      } else {
        toast.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [id]: false }));
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

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterOption === 'all' ||
                          (filterOption === 'soldOut' && stock.stock <= 0) ||
                          (filterOption === 'inStock' && stock.stock > 0);
    return matchesSearch && matchesFilter;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
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
      <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">Manage Stocks</h1>
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />
        <div className="flex justify-end mb-4">
          <label>
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All</option>
              <option value="soldOut">Sold Out</option>
              <option value="inStock">In Stock</option>
            </select>
          </label>
        </div>
        {filteredStocks.length > 0 ? (
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
              {filteredStocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
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
                        disabled={updateLoading[item._id]} 
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
      <StockModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onUpdate={handleUpdateStock} 
        stockItem={selectedStock} 
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStocks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </section>
  );
};

export default StocksPage;
