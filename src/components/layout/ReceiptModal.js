// src\components\layout\ReceiptModal.js
import React from "react";
import Image from "next/image";

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen) return null;

  if (!receipt) {
    return <p>No receipt data available.</p>;
  }

  // Updated cartProductPrice function with validation
  const cartProductPrice = (product) => {
    const basePrice = product.basePrice || 0; // Default to 0 if basePrice is undefined
    const quantity = product.quantity || 0; // Default to 0 if quantity is undefined
    return basePrice * quantity;
  };

  const safeSubtotal = receipt.subtotal || 0; // Default to 0 if subtotal is not defined
  const userName = receipt.name?.userName || "No Name"; // Default to "No Name" if staffname is undefined
  const cartProducts = receipt.cartProducts || []; // Default to an empty array if cartProducts is undefined
  const createdAt = receipt.createdAt || null;
  const change = typeof receipt.change === "number" ? receipt.change : null; // Ensure change is a valid number

  // Function to print the receipt
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content').innerHTML;
    const originalContent = document.body.innerHTML;
    window.print();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        {/* Receipt Content for Printing */}
        <div id="receipt-content" className="text-center mb-6">
          <Image
            src="/tealerinlogo.png"
            alt="Company Logo"
            width={150}
            height={50}
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">TeaLerin</h2>
          <p>Contact: 0927-368-5006 | Block 10 Lot 23 Long Road</p>

          {/* Staff Information */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Staff Information</h3>
            <p>Name: <span className="font-medium">{userName}</span></p>
            <p>Date: <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</span></p>
          </div>

          {/* Products List */}
<div className="mt-4">
  <h3 className="font-semibold text-gray-700">Products</h3>
  <ul className="divide-y divide-gray-200">
    {cartProducts.length > 0 ? (
      cartProducts.map((product, index) => {
        const productPrice = cartProductPrice(product) || 0; // Default to 0 if cartProductPrice is undefined
        const totalProductPrice = productPrice.toFixed(2);

        return (

          <li key={index} className="flex justify-between py-2">
            <div>

              <span className="text-gray-600">{product.name} (x{product.quantity})</span>
              <div className="mt-1 text-gray-500">
                {product.sizes && product.sizes.length > 0 && (
                  <div>Sizes: {product.sizes.map(size=> `${size.name} (₱${size.price.toFixed(2)})`).join(', ')}</div>
                )}

               {product.extraIngredients && product.extraIngredients.length > 0 && (
  <div>Extras: {product.extraIngredients.map(extra => `${extra.name} (₱${extra.price.toFixed(2)})`).join(', ')}</div>
)}

                {/* Add base price to display */}
                <div className="mt-1 text-gray-500">
                  Base Price: ₱{product.basePrice.toFixed(2)}
                </div>
              </div>
            </div>
            {/* Here, you can choose between showing the base price or the total */}
            <span className="font-medium">₱{totalProductPrice}</span>
          </li>
        );
      })
    ) : (
      <p className="text-gray-500">No products in cart.</p>
    )}
  </ul>
</div>


          {/* Subtotal */}
          <div className="mt-4 flex flex-col md:flex-row justify-between font-bold text-gray-800">
            <span>Total:</span>
            <span>₱{safeSubtotal.toFixed(2)}</span>
          </div>

          {/* Change Section */}
          {change !== null && (
            <div className="mt-2 flex flex-col md:flex-row justify-between font-semibold text-gray-800">
              <span>Change:</span>
              <span>₱{change.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
