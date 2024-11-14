// components/layout/Receipt.js
import React from 'react';
import Image from 'next/image'; // Import Image component for optimized image loading
import { cartProductPrice } from "@/components/AppContext"; // Ensure this line is present

const Receipt = ({ customer, cartProducts, subtotal }) => {
  return (
    <div id="receipt" className="p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <Image src="/tealerinlogo.png" alt="Company Logo" width={150} height={50} className="mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Receipt</h2>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Customer Information</h3>
        <p>Name: <span className="font-medium">{customer.name}</span></p>
        <p>Email: <span className="font-medium">{customer.email}</span></p>
        <p>Phone: <span className="font-medium">{customer.phone}</span></p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Products</h3>
        <ul className="divide-y divide-gray-200">
          {cartProducts.map((product, index) => (
            <li key={index} className="flex justify-between py-2">
              <span className="text-gray-600">{product.name} (x{product.quantity})</span>
              <span className="font-medium">₱{cartProductPrice(product) * product.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between font-bold text-gray-800">
        <span>Subtotal:</span>
        <span>₱{subtotal}</span>
      </div>
      <div className="mt-4 border-t pt-4 text-center text-gray-600">
        <p>Thank you for your purchase!</p>
        <p>Visit us again!</p>
      </div>
    </div>
  );
};

export default Receipt;