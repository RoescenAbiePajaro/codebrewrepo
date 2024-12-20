import { useState } from 'react';
export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image, stock,
}) {
  const [isAdding, setIsAdding] = useState(false); // State to track if adding to cart
  const isDisabled = stock <= 0 || isAdding; // Disable if no stock or already adding

  const handleAddToCart = async () => {
    if (isDisabled) return;

    setIsAdding(true); // Disable button to prevent multiple clicks
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate any async operation (e.g., API call)

    onClick(basePrice); // Add to cart callback
    setIsAdding(false); // Re-enable button
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full ${isDisabled ? 'bg-gray-500' : 'bg-green-500'} text-white rounded px-4 py-1`}
        disabled={isDisabled}
      >
        <span>{`Add to cart`}</span>
      </button>
    </div>
  );
}