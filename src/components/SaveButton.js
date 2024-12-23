// src\components\SaveButton.js
import { useState } from "react";

export default function SaveButton({ label, onSave }) {
  const [showConfirm, setShowConfirm] = useState(false);  // State to control confirmation visibility
  const [saving, setSaving] = useState(false);  // State to track saving status

  const handleSave = () => {
    setShowConfirm(true);  // Show confirmation dialog when trying to save
  };

  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to save?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              onClick={() => {
                setSaving(true);  // Set saving state to true
                setTimeout(() => {
                  onSave();  // Call the onSave function passed in props
                  setSaving(false);  // Reset saving status
                  setShowConfirm(false);  // Hide confirmation dialog
                }, 2000);  // Simulate a 2-second save process
              }}
              type="button"
              className="primary">
              Yes, Save!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : label || "Save"}
      </button>
    </div>
  );
}
