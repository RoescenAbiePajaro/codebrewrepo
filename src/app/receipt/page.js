'use client';  // Add this since we're using hooks

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Receipt from "@/components/layout/Receipt";

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch('/api/receipt', {
          // Add cache: 'no-store' to prevent caching
          cache: 'no-store'
        });
        if (!response.ok) throw new Error('Failed to fetch receipts');
        const data = await response.json();
        setReceipts(data);
      } catch (error) {
        console.error('Error fetching receipts:', error);
        toast.error('Failed to load receipts');
      }
    };

    fetchReceipts();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Updated API route path to match App Router convention
      const response = await fetch(`/api/receipt/${id}`, { 
        method: 'DELETE',
        cache: 'no-store'
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Receipt deleted successfully!');
        setReceipts(receipts.filter((receipt) => receipt._id !== id));
        router.refresh(); // Add this to refresh the page data
      } else {
        toast.error(result.message || 'Failed to delete receipt');
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.error('An error occurred while deleting receipt');
    }
  };

  const handleEdit = (id) => {
    router.push(`/receipt/edit/${id}`);
  };

  return (
    <section className="mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Receipts</h1>
      </div>
      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
            <div key={receipt._id} className="bg-white p-4 shadow-md rounded-md">
              <Receipt
                customer={receipt.customer}
                cartProducts={receipt.cartProducts}
                subtotal={receipt.subtotal}
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(receipt._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(receipt._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No receipts found.</p>
        )}
      </div>
    </section>
  );
};

export default ReceiptPage;