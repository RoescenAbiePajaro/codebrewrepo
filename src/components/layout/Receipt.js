// src/components/layout/Receipt.js
'use client';
import React from 'react';
import Image from 'next/image'; 

// Function to calculate the price of a product
const cartProductPrice = (product) => {
  return product.price || 0; // Ensure this returns 0 if no price is found
};

const Receipt = ({ customer = {}, cartProducts = [], subtotal = 0, createdAt }) => {
  const { staffname } = customer; // Extract staff name from customer info

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
        <h3 className="font-semibold text-gray-700">Customer Information</h3>
        <p>Name: <span className="font-medium">{staffname || "No Customer"}</span></p>
        <p>Date: <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</span></p>
      </div>

      {/* Products List */}
      <div className="p-4">
        <h2 className="text-center font-bold">Receipt</h2>
        <div className="mt-4">
          {cartProducts.length > 0 ? (
            cartProducts.map((product, index) => (
              <div key={index} className="flex justify-between">
                <span>{product.name}</span>
                <span>₱{cartProductPrice(product).toFixed(2)}</span>  {/* Displaying price */}
              </div>
            ))
          ) : (
            <p>No products in the cart</p>
          )}
        </div>
        
        {/* Subtotal and Total */}
        <div className="mt-4 text-right">
          <p><strong>Total:</strong> ₱{subtotal.toFixed(2)}</p>
        </div>
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
