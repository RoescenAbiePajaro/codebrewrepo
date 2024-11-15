'use client'; 

import { useSession } from "next-auth/react"; k
import React, { useEffect, useState } from 'react';
import UserTabs from "@/components/layout/UserTabs";

export default function CustomersList() {
  const { data: session } = useSession(); 
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!session) {
        setError("You must be logged in to view customers.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [session]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div>
        <h2 className="text-2xl font-bold mb-4">Customers</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Customer Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{customer.userEmail}</td>
                <td className="py-2 px-4 border-b">{customer.phone}</td>
                <td className="py-2 px-4 border-b">{customer.cartProducts.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}