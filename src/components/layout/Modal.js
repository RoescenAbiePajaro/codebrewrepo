'use client';
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Modal({ user, isOpen, onClose }) {
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedfirstName, setEditedfirstName] = useState(user?.firstName || "");
  const [editedlastName, setEditedlastName] = useState(user?.lastName || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [isAdminChecked, setIsAdminChecked] = useState(user?.admin || false);
  const [isVerified, setIsVerified] = useState(user?.isVerified || false); // State for 'Verified'

  useEffect(() => {
    setEditedName(user?.name || "");
    setEditedfirstName(user?.firstName || "");
    setEditedlastName(user?.lastName || "");
    setEditedEmail(user?.email || "");
    setIsAdminChecked(user?.admin || false);
    setIsVerified(user?.isVerified || false);
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user?._id) {
      toast.error("User ID is missing.");
      return;
    }

    const updatedUser = {
      _id: user._id,
      name: editedName,
      firstName: editedfirstName,
      lastName: editedlastName,
      email: editedEmail,
      admin: isAdminChecked,
      isVerified, // Include the new state here
    };

    try {
      const response = await fetch("/api/modal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      toast.success("User updated successfully");
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">User Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={editedfirstName}
            onChange={(e) => setEditedfirstName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={editedlastName}
            onChange={(e) => setEditedlastName(e.target.value)}
          />
        </div>


        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isAdminChecked}
              onChange={(e) => setIsAdminChecked(e.target.checked)}
            />
            <span className="ml-2">Admin</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)} // Handle verification checkbox
            />
            <span className="ml-2">Verify User</span>
          </label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
