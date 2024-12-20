export default function CustomerInputs({ customerProps, setCustomerProp, userName }) {
  return (
    <div>
      <label>Name</label>
      <input
        type="text"
        value={customerProps.staffname || ''} // Bind to `staffname` field
        onChange={(e) => setCustomerProp('staffname', e.target.value)} // Update the `staffname` field
        className="border p-2 rounded w-full"
        placeholder={userName} // Display username in placeholder if available
      />
    </div>
  );
}
