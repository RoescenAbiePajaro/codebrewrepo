export default function AddressInputs({ addressProps, setAddressProp, disabled = false }) {
  const { phone, streetAddress } = addressProps;
  return (
    <>
      <label>Phone</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Phone number"
        value={phone || ''}
        onChange={ev => setAddressProp('phone', ev.target.value)}
      />
      <label>Street Address</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Street address"
        value={streetAddress || ''}
        onChange={ev => setAddressProp('streetAddress', ev.target.value)}
      />
    </>
  );
}