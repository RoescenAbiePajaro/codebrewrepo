import React, { useState, useEffect } from "react";

export default function Modal({ user, isOpen, onClose }) {
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [isAdminChecked, setIsAdminChecked] = useState(user?.admin || false);

  useEffect(() => {
    setEditedName(user?.name || "");
    setEditedEmail(user?.email || "");
    setIsAdminChecked(user?.admin || false);
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user?._id) {
      alert("User ID is missing.");
      return;
    }

    const updatedUser = {
      _id: user._id,
      name: editedName,
      email: editedEmail,
      admin: isAdminChecked,
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
      alert("User updated successfully");
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
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
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}