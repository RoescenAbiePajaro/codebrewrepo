import React from "react";
import Image from "next/image";

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen) return null;

  if (!receipt) {
    return <p>No receipt data available.</p>;
  }

  const safeSubtotal = parseFloat(receipt.subtotal) || 0;
  const staffName = receipt.customer?.staffname || "No Name";
  const cartProducts = receipt.cartProducts || [];
  const createdAt = receipt.createdAt || null;
  const change = typeof receipt.change === "number" ? receipt.change : 0;

  // Function to print the receipt
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg mx-auto shadow-lg">
        <div id="receipt-content" className="text-center mb-6">
          <Image
            src="/tealerinlogo.png"
            alt="Company Logo"
            width={150}
            height={50}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">TeaLerin</h2>
          <p className="text-gray-600 text-sm">Contact: 0927-368-5006 | Block 10 Lot 23 Long Road</p>

          {/* Staff Information */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700">Staff Information</h3>
            <p className="text-gray-600">Name: <span className="font-medium">{staffName}</span></p>
            <p className="text-gray-600">Date: <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</span></p>
          </div>

          {/* Products List */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700">Products</h3>
            <ul className="divide-y divide-gray-200">
              {cartProducts.length > 0 ? (
                cartProducts.map((product, index) => {
                  const totalProductPrice = (product.price * product.quantity).toFixed(2);
                  return (
                    <li key={index} className="flex justify-between py-2">
                      <span className="text-gray-600">{product.name} (x{product.quantity})</span>
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
          <div className="mt-6 flex justify-between font-bold text-gray-800">
            <span>Total:</span>
            <span>₱{safeSubtotal.toFixed(2)}</span>
          </div>

          {/* Change Section */}
          {change !== null && (
            <div className="mt-2 flex justify-between font-semibold text-gray-800">
              <span>Change:</span>
              <span>₱{change.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
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
