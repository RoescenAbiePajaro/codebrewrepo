// pages/receipt/[id].js
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ReceiptDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchReceipt = async () => {
        try {
          const response = await fetch(`/api/receipt?_id=${id}`);
          if (!response.ok) throw new Error('Failed to fetch receipt');
          const data = await response.json();
          setReceipt(data);
        } catch (error) {
          console.error('Error fetching receipt:', error);
          toast.error('Failed to load receipt');
        } finally {
          setLoading(false);
        }
      };

      fetchReceipt();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!receipt) return <p>No receipt found.</p>;

  return (
    <div>
      <h1>Receipt Details</h1>
      {/* Render receipt details here */}
      <pre>{JSON.stringify(receipt, null, 2)}</pre>
    </div>
  );
};

export default ReceiptDetails;