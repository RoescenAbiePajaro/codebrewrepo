import React from "react";
import Image from "next/image";
import { cartProductPrice } from "@/components/AppContext";

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen) return null;

  if (!receipt) {
    return <p>No receipt data available.</p>;
  }

  const safeSubtotal = receipt.subtotal || 0; // Default to 0 if subtotal is not defined
  const staffName = receipt.customer?.staffname || "No Name"; // Default to "No Name" if staffname is undefined
  const cartProducts = receipt.cartProducts || []; // Default to an empty array if cartProducts is undefined
  const createdAt = receipt.createdAt || null;

  // Debugging logs to check data
  console.log('Cart Products:', cartProducts);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        {/* Company Information */}
        <div className="text-center mb-6">
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

        {/* Staff Information */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Staff Information</h3>
          <p>Name: <span className="font-medium">{staffName}</span></p>
          <p>Date: <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</span></p>
        </div>

        {/* Products List */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Products</h3>
          <ul className="divide-y divide-gray-200">
            {cartProducts.length > 0 ? (
              cartProducts.map((product, index) => {
                const productPrice = cartProductPrice(product) || 0; // Default to 0 if cartProductPrice is undefined
                const totalProductPrice = (productPrice * product.quantity).toFixed(2);

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

        {/* Subtotal and Total */}
        <div className="mt-4 flex justify-between font-bold text-gray-800">
          <span>Total:</span>
          <span>₱{safeSubtotal.toFixed(2)}</span>
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

        {/* Close Button */}
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;
