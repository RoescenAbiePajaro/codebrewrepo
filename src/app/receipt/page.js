// ReceiptPage.js
'use client'; 
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from "@/components/layout/Modal"; // Import the Modal component

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null); // State for the selected receipt
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
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
    </section>
  );
};

export default ReceiptPage;