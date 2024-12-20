'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProfile } from "@/components/UseProfile";
import StockModal from "@/components/layout/StockModal"; 
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

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

  useEffect(() => {
    setPage(0);  // Reset page when search or filter option changes
  }, [searchQuery, filterOption]);

  const handleUpdateStock = async (id, newStock) => {
    if (newStock < 0 || isNaN(newStock)) return; 

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
    return (
          <div className="flex justify-center items-center min-h-screen">
            <CircularProgress size={60} />
          </div>
        );
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded p-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border focus:outline-black"
          />
          <label className="ml-0 sm:ml-4">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="border rounded p-2 w-full sm:w-auto"
            >
              <option value="all">All</option>
              <option value="soldOut">Sold Out</option>
              <option value="inStock">In Stock</option>
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          {filteredStocks.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Name</th>
                  <th className="border-b p-2 text-right">Base Price</th>
                  <th className="border-b p-2 text-right">Stock</th>
                  <th className="border-b p-2 text-center">Action</th>
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
            <p className="text-gray-500 text-center">No stocks found.</p>
          )}
        </div>
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
        count={filteredStocks.length}  // This should be filteredStocks length
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}

        sx={{ backgroundColor: 'white' }}
      />
    </section>
  );
};

export default StocksPage;
