import { useState } from "react";
import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image"; // Import Image from Next.js for optimization

export default function MenuItemTile({ onAddToCart, ...item }) {
  const { image, description, name, basePrice, sizes, extraIngredientPrices } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;

  const [isAdding, setIsAdding] = useState(false); // State to control button disabling

  // Handle item addition to cart and show an alert
  const handleAddToCart = () => {
    if (isAdding) return; // Prevent repeated clicks while adding

    setIsAdding(true); // Disable the button
    onAddToCart(); // Call the original onAddToCart function
    alert(`${name} has been added to the cart!`); // Show alert when item is added

    // Re-enable the button after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 2000); // 2 seconds delay before re-enabling
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center">
        {image ? (
          // Using Next.js Image component for better image optimization
          <Image
            src={image} 
            alt={name}
            className="max-h-24 block mx-auto"
            width={96} // Set width for optimization
            height={96} // Set height for optimization
          />
        ) : (
          <div className="max-h-24 block mx-auto bg-gray-300 rounded" /> // Placeholder for missing image
        )}
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">{description}</p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={handleAddToCart} // Use the modified handleAddToCart function
        basePrice={basePrice}
        disabled={isAdding} // Disable the button while adding
      />
    </div>
  );
}
