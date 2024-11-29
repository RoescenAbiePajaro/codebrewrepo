import React, { useState } from "react";
import Image from "next/image";
import { cartProductPrice } from "@/components/AppContext";

const Modal = ({ isOpen, onClose, receipt, onUpdate, stockItem, user }) => {
  const initialStock = stockItem?.stock || 0;
  const initialUserData = { ...user, name: user?.name || "", admin: user?.admin || false };
  
  const [formData, setFormData] = useState(initialUserData);
  const [newStock, setNewStock] = useState(initialStock);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user._id, formData);
    onClose();
  };

  const handleStockUpdate = () => {
    if (onUpdate && stockItem) {
      onUpdate(stockItem._id, newStock);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
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
                      <span className="text-gray-600">
                        {product.name} (x{product.quantity})
                      </span>
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
                <b> paolonavarrosa @gmail.com</b>.
              </p>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleClose}
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
                onClick={handleStockUpdate}
                className="bg-green-500 text-white p-2 rounded"
              >
                Update
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : user ? (
          <>
            {/* User Edit Modal Content */}
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Email:</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly 
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Admin:</label>
                <input
                  type="checkbox"
                  name="admin"
                  checked={formData.admin}
                  onChange={handleChange} 
                  className="ml-2"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-gray-500">No content available.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;