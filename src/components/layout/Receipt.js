// src\components\layout\Receipt.js
'use client';
import React from 'react';
import Image from 'next/image';
import { cartProductPrice } from "@/components/AppContext";

const Receipt = ({ customer = {}, cartProducts = [], subtotal = 0, createdAt, amountPaid = 0 }) => {
  const { staffname } = customer;
  const change = amountPaid - subtotal;

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
        <p>Name: <span className="font-medium">{staffname || "No Name"}</span></p>
        <p>Date: <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</span></p>
      </div>

      {/* Products List */}
      <div className="p-4">
        <h2 className="text-center font-bold">Receipt</h2>
        <div className="mt-4">
          {cartProducts.length > 0 ? (
            cartProducts.map((product, index) => {
              const productPrice = cartProductPrice(product) || product.price || 0;
              const totalProductPrice = (productPrice * product.quantity).toFixed(2);

              return (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{product.name} (x{product.quantity})</span>
                    <span>₱{totalProductPrice}</span>
                  </div>

                  {/* Size Details */}
                  {product.size && (
                    <div className="ml-4 text-sm text-gray-500">
                      <span>Size: </span><span className="font-medium">{product.size.name}</span>
                      {product.size.price && <span> - ₱{product.size.price}</span>}
                    </div>
                  )}

                  {/* Extras Details */}
                  {product.extras?.length > 0 && (
                    <div className="ml-4 text-sm text-gray-500">
                      {product.extras.map((extra) => (
                        <div key={extra.name}>
                          <span>{extra.name}</span> - <span>₱{extra.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No products in the cart</p>
          )}
        </div>

        {/* Subtotal and Total */}
        <div className="mt-4 text-right">
          <p><strong>Total:</strong> ₱{subtotal.toFixed(2)}</p>

          {/* Money Paid and Change */}
          {amountPaid > 0 && (
            <div className="mt-2">
              <p><strong>Amount Paid:</strong> ₱{amountPaid.toFixed(2)}</p>
              <p><strong>Change:</strong> ₱{change.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipt;
