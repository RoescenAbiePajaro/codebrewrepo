// components/layout/CustomerInputs.js
export default function CustomerInputs({ customerProps, setCustomerProp }) {
    return (
      <div>
        <label>Name</label>
        <input
          type="text"
          value={customerProps.name || ''}
          onChange={(e) => setCustomerProp('name', e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Customer Name"
        />
      </div>
    );
  }
  