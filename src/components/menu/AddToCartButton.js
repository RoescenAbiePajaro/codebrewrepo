import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AddToCartButton({
  menuItem, hasSizesOrExtras, onClick, basePrice, image, stock,
}) {
  const [isAdding, setIsAdding] = useState(false); // State to track if adding to cart
  const isDisabled = stock <= 0 || isAdding; // Disable if no stock or already adding

  const handleAddToCart = async () => {
    if (isDisabled) return;

    setIsAdding(true); // Disable button to prevent multiple clicks

    // Simulate async operation (e.g., API call)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Update stock and handle sold-out behavior
    if (stock > 0) {
      const newStock = stock - 1;
      await updateStock(newStock); // Update stock on the server

      if (newStock === 0) {
        toast.success('Item is now sold out!');
      }
    }

    onClick(basePrice); // Trigger parent callback to add item to cart
    setIsAdding(false); // Re-enable button
  };

  // Function to update stock on the server
  async function updateStock(newStock) {
    try {
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: menuItem._id, stock: newStock }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Could not update stock. Please try again.');
    }
  }

  if (!hasSizesOrExtras || isDisabled) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full ${isDisabled ? 'bg-gray-500' : 'bg-green-500'} text-white rounded-full px-8 py-2`}
          disabled={isDisabled}
        >
          <span>{`Add to cart ₱${basePrice}`}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={`mt-4 ${isDisabled ? 'bg-gray-500' : 'bg-green-500'} text-white rounded-full px-8 py-2`}
      disabled={isDisabled}
    >
      <span>{`Add to cart (from ₱${basePrice})`}</span>
    </button>
  );
}
