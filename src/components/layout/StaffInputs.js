// components/layout/CustomerInputs.js
export default function StaffInputs({ StaffProps, setStaffProp }) {
    return (
      <div>
        <label>Staff Name</label>
        <input
          type="text"
          value={StaffProps.staffname || ''} // Bind to `staffname` field
          onChange={(e) => setStaffProp('staffname', e.target.value)} // Update the `staffname` field
          className="border p-2 rounded w-full"
          placeholder="Staff Name"
        />
      </div>
    );
  }
  