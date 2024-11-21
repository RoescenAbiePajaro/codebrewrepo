'use client';
import React from 'react';
import Image from 'next/image'; 
import { cartProductPrice } from "@/components/AppContext"; 

const Receipt = ({ customer = {}, cartProducts = [], subtotal = 0, createdAt }) => {
  return (
    <div id="receipt" className="p-6 bg-white shadow-lg rounded-lg">
      {/* Company Information */}
      <div className="text-center">
        <Image 
          src="/tealerinlogo.png" 
          alt="Company Logo" 
          width={150} 
          height={50} 
          className="mx-auto mb-4" 
        />
        <h2 className="text-xl font-bold text-gray-800">TeaLerin</h2>
        <p>Contact: 0927-368-5006 | Block 10 Lot 23 Long Road</p>
      </div>

      {/* Customer Information */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Staff Information</h3>
        <p>Name: <span className="font-medium">{customer.name || "N/A"}</span></p>
        <p>Email: <span className="font-medium">{customer.email || "N/A"}</span></p>
        <p>Phone: <span className="font-medium">{customer.phone || "N/A"}</span></p>
        <p>Date: <span className="font-medium">{createdAt || "N/A"}</span></p>
      </div>

      {/* Products List */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Products</h3>
        <ul className="divide-y divide-gray-200">
          {cartProducts.length > 0 ? (
            cartProducts.map((product, index) => (
              <li key={index} className="flex justify-between py-2">
                <span className="text-gray-600">{product.name} (x{product.quantity})</span>
                <span className="font-medium">₱{(cartProductPrice(product) * product.quantity).toFixed(2)}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No products in cart.</p>
          )}
        </ul>
      </div>

      {/* Subtotal */}
      <div className="mt-4 flex justify-between font-bold text-gray-800">
        <span>Subtotal:</span>
        <span>₱{subtotal.toFixed(2)}</span>
      </div>

      {/* Thank You Note */}
      <div className="mt-4 border-t pt-4 text-center text-gray-600">
        <p>Thank you for your purchase!</p>
        <p>Visit us again!</p>
        <p>
          Please note that this is a non-refundable amount. For any assistance, please email 
          <b> paolonavarrosa@gmail.com</b>.
        </p>
      </div>
    </div>
  );
};

export default Receipt;