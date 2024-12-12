// src\app\staffreceipt\page.js
'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ReceiptModal from "@/components/layout/ReceiptModal"; 
import TablePagination from '@mui/material/TablePagination'; 
import CircularProgress from '@mui/material/CircularProgress'; 
import { useSession } from "next-auth/react"; 
import {useProfile} from "@/components/UseProfile";

const ReceiptPage = () => {
  const [receipts, setReceipts,user] = useState([]);
  const [loading, setLoading,data,] = useState(true); // Set loading to true initially
  const router = useRouter();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession(); 

  const isAdmin = session?.user?.isAdmin || false;

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchReceipts = async () => {
    setLoading(true); // Set loading to true when starting to fetch
    try {
      const response = await fetch('/api/receipt', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch receipts');
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false); // Set loading to false once data is fetched or an error occurs
    }
  };

  useEffect(() => {
    fetchReceipts();
    const interval = setInterval(fetchReceipts, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt); 
    setIsModalOpen(true); 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return 'Loading user info...';
  }
  
  if (!session?.user) {
    return 'Not an User.'; // Check if session and session.user are available
  }
  
  

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={isAdmin} /> {/* Pass isAdmin to UserTabs */}

      
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-bold">Receipts</h2>
      </div>

      <div className="mt-8">
        {loading ? ( // Show loading spinner while fetching data
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          receipts.length > 0 ? (
            receipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((receipt) => (
              <div key={receipt._id} className="bg-gray-100 rounded-lg mb-2 p-4 flex items-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                  <div className="text-gray-900">{receipt.customer ? <span>{receipt.customer.staffname}</span> : <span className="italic">No Name</span>}</div>
                  <span className="text-gray-500">₱{receipt.subtotal.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm">{new Date(receipt.createdAt).toLocaleString('en-PH')}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(receipt)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">View</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No receipts found.</p>
          )
        )}
      </div>
      <ReceiptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} receipt={selectedReceipt} />
      <TablePagination
        component="div"
        count={receipts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </section>
  );
};

export default ReceiptPage;
