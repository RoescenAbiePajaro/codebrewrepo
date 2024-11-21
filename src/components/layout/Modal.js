import React, { useState } from "react"; 
import Image from "next/image"; 
import { cartProductPrice } from "@/components/AppContext"; 

const Modal = ({ isOpen, onClose, receipt, onUpdate, stockItem }) => {
  const [newStock, setNewStock] = useState(stockItem?.stock || 0);

  const handleSubmit = () => {
    if (onUpdate && stockItem) {
      onUpdate(stockItem._id, newStock);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        {receipt ? (
          <>
            {/* Receipt Modal Content */}
            <div className="text-center mb-6">
              <Image
                src="/tealerinlogo.png"
                alt="Company Logo"
                width={150}
                height={50}
                className="mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">TeaLerin</h2>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Customer Information</h3>
              <p>Name: <span className="font-medium">{receipt.customer?.name || "N/A"}</span></p>
              <p>Email: <span className="font-medium">{receipt.customer?.email || "N/A"}</span></p>
              <p>Phone: <span className="font-medium">{receipt.customer?.phone || "N/A"}</span></p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Products</h3>
              <ul className="divide-y divide-gray-200">
                {receipt.cartProducts.length > 0 ? (
                  receipt.cartProducts.map((product, index) => (
                    <li key={index} className="flex justify-between py-2">
                      <span className="text-gray-600">{product.name} (x{product.quantity})</span>
                      <span className="font-medium">
                        ₱{(cartProductPrice(product) * product.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No products in cart.</p>
                )}
              </ul>
            </div>

            <div className="mt-4 flex justify-between font-bold text-gray-800">
              <span>Subtotal:</span>
              <span>₱{receipt.subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-4 border-t pt-4 text-center text-gray-600">
              <p>Thank you for your purchase!</p>
              <p>Visit us again!</p>
              <p>
                Please note that this is a non-refundable amount. For any assistance, please email 
                <b> paolonavarrosa@gmail.com</b>.
              </p>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : stockItem ? (
          <>
          {/* Stock Update Modal Content */}
          <h2 className="text-lg font-bold mb-4">Update Stock for {stockItem.name}</h2>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value) || 0)} // Ensure it's a number
              className="border rounded p-1 w-20"
            />
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white p-2 rounded"
              >
                Update
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No content available.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
