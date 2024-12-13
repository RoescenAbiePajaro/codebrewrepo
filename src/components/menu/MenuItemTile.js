import { useState } from "react";
import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image"; // Import Image from Next.js for optimization

export default function MenuItemTile({ onAddToCart, stock, ...item }) {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;

  const [isAdding, setIsAdding] = useState(false); // State to control button disabling

  // Handle item addition to cart and show an alert
  const handleAddToCart = () => {
    if (isAdding) return; // Prevent repeated clicks while adding

    setIsAdding(true); // Disable the button
    onAddToCart(); // Call the original onAddToCart function

    // Re-enable the button after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 2000); // 2 seconds delay before re-enabling
  };

  // Check if the item is available
  const isAvailable = stock > 0;

  return (
    <div className="bg-gray-200 p-2 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        {image ? (
          // Using Next.js Image component for better image optimization
          <Image
            src={image}
            alt={name}
            className="max-h-16 block mx-auto"
            width={64} // Reduced width for smaller tiles
            height={64} // Reduced height for smaller tiles
          />
        ) : (
          <div className="max-h-16 block mx-auto bg-gray-300 rounded" /> // Placeholder for missing image
        )}
      </div>
      <h4 className="font-semibold text-lg my-2">{name}</h4> {/* Smaller font size */}
      <p className="text-gray-600 text-xs">{description}</p> {/* Smaller font size */}
      <p className={`text-base font-semibold flex items-center justify-center space-x-2`}>
        {isAvailable ? (
          <span className="text-green-600">Available</span>
        ) : (
          <span className="text-red-600">Sold Out</span>
        )}
      </p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={handleAddToCart} // Use the modified handleAddToCart function
        basePrice={basePrice}
        disabled={isAdding || !isAvailable} // Disable button if sold out
      />
    </div>
  );
}
