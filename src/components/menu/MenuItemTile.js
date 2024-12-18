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
    <div className="menu-item-tile bg-gray-100 p-4 rounded-lg text-center group hover:bg-gray-200 transition-all w-full">
      <div className="text-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            className="max-h-32 block mx-auto"
            width={128}
            height={128}
          />
        ) : (
          <div className="max-h-32 block mx-auto bg-gray-300 rounded" />
        )}
      </div>
      <h4 className="font-semibold text-lg my-2">{name}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className={`text-sm font-semibold flex items-center justify-center space-x-1`}>
        {isAvailable ? (
          <span className="text-green-600">Available</span>
        ) : (
          <span className="text-red-600">Sold Out</span>
        )}
      </p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={handleAddToCart}
        basePrice={basePrice}
        disabled={isAdding || !isAvailable}
      />
    </div>
  );
}
