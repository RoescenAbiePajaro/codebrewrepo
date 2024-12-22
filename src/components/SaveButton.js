import { useState } from "react";

export default function DeleteButton({ label, onDelete, onSave }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);  // State to track saving status

  const handleSave = () => {
    setSaving(true);
    // Simulate a save operation (this can be an API call or other logic)
    setTimeout(() => {
      onSave();  // Call the onSave function passed in props
      setSaving(false);  // Reset saving status
    }, 2000);  // Simulate a 2-second save processA
  };


  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to delete?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowConfirm(false);
              }}
              type="button"
              className="primary">
              Yes,&nbsp;Delete!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      <button type="button" onClick={() => setShowConfirm(true)}>
        {label}
      </button>
    </div>
  );
}
