//app/receipt/edit/[id].js this is for edit receipt page
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const EditReceiptPage = () => {
  const [receipt, setReceipt] = useState(null);
  const [customer, setCustomer] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchReceipt = async () => {
        try {
          const response = await fetch(`/api/receipt?_id=${id}`);
          const data = await response.json();
          if (data) {
            setReceipt(data);
            setCustomer(data.customer);
            setCartProducts(data.cartProducts);
            setSubtotal(data.subtotal);
          }
        } catch (error) {
          console.error('Failed to fetch receipt:', error);
        }
      };
      fetchReceipt();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedReceipt = {
      customer,
      cartProducts,
      subtotal,
    };

    try {
      const response = await fetch(`/api/receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id, ...updatedReceipt }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Receipt updated successfully!');
        router.push('/receipt'); // Redirect to receipt list
      } else {
        toast.error('Failed to update receipt');
      }
    } catch (error) {
      toast.error('Error updating receipt');
    }
  };

  return (
    <section className="mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Edit Receipt</h1>
      </div>
      {receipt && (
        <form onSubmit={handleSave} className="mt-8 bg-white p-4 shadow-md rounded-md">
          {/* Form Fields for Editing */}
          <div>
            <h3 className="font-semibold">Customer Information</h3>
            <input
              type="text"
              value={customer.name || ''}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              placeholder="Name"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              value={customer.email || ''}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              placeholder="Email"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              value={customer.phone || ''}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              placeholder="Phone"
              className="mt-2 w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Cart products list can be editable here as well */}
          {/* Implement similar fields for cart products if necessary */}

          <div className="mt-4 flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push('/receipt')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default EditReceiptPage;
