export default function AmountInputs({ changeProps, setChangeProp, inputAmount, subtotal }) { 
    return (
      <div>
        <label>Change</label>
        <input
          type="number"
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              const calculatedChange = inputAmount - subtotal;
              setChangeProp(calculatedChange);
            } else {
              setChangeProp(null);
            }
          }}
          placeholder="Enter amount"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
    );
  }
  