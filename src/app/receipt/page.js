// ReceiptPage.js
'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from "@/components/layout/Modal";
import * as XLSX from "xlsx";
import TablePagination from '@mui/material/TablePagination'; 
import DownloadIcon from '@mui/icons-material/Download'; 

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null); // State for the selected receipt
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchReceipts = async () => {
    try {
      const response = await fetch('/api/receipt', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch receipts');
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to load receipts');
    }
  };

  useEffect(() => {
    fetchReceipts(); // Initial fetch
    const interval = setInterval(fetchReceipts, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt); // Set the selected receipt
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this receipt?");
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/receipt?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch (e) {
          errorDetails = { error: 'Failed to delete receipt' };
        }
        console.error('Error details:', errorDetails);
        throw new Error(errorDetails.error || 'Failed to delete receipt');
      }

      setReceipts((prevReceipts) => prevReceipts.filter((receipt) => receipt._id !== id));
      toast.success('Receipt deleted successfully');
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (receipts.length === 0) {
      toast.error("No data available for download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      receipts.map((receipt) => ({
        "Customer Name": receipt.customer?.name || "N/A",
        "Customer Email": receipt.customer?.email || "N/A",
        "Customer Phone": receipt.customer?.phone || "N/A",
        Subtotal: `₱${receipt.subtotal.toFixed(2)}`,
        "Created At": formatDate(receipt.createdAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    XLSX.writeFile(workbook, "receipts.xlsx");
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Manila',
    };
    return new Date(dateString).toLocaleString('en-PH', options);
  };

  const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

return (
  <section className ="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <UserTabs isAdmin={true} />
    <div className="flex justify-between items-center mt-8">
      <h2 className="text-xl font-bold">Receipts</h2>
    </div>
    <button
        onClick={handleDownloadExcel}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        <DownloadIcon /> 
      </button>
    <div className="mt-8">
      {receipts.length > 0 ? (
        receipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((receipt) => (
          <div
            key={receipt._id}
            className="bg-gray-100 rounded-lg mb-2 p-4 flex items-center gap-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
              <div className="text-gray-900">
                {receipt.customer ? (
                  <>
                    <span>{receipt.customer.name}</span>
                    <span className="block text-gray-500 text-sm">
                      {receipt.customer.email}
                    </span>
                    <span className="block text-gray-500 text-sm">
                      {receipt.customer.phone}
                    </span>
                  </>
                ) : (
                  <span className="italic">No customer</span>
                )}
              </div>
              <span className="text-gray-500">
                ₱{receipt.subtotal.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm">
                {formatDate(receipt.createdAt)}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleView(receipt)}
                className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600`}
              >
                View
              </button>

              <button
                onClick={() => handleDelete(receipt._id)}
                className={`px-4 py-2 ${deleteLoading ? 'bg-gray-400' : 'bg-red-500'} text-white rounded-md hover:bg-red-600`}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No receipts found.</p>
      )}
    </div>
    <Modal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      receipt={selectedReceipt} 
    />
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={receipts.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </section>
);
}
export default ReceiptPage;