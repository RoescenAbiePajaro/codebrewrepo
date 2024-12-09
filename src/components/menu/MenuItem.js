'use client';
import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";

export default function MenuItem(menuItem) {
  const {
    image, name, description, basePrice, stock: initialStock,
    sizes, extraIngredientPrices,
  } = menuItem;

  // State hooks
  const [stock] = useState(initialStock); // Track stock but don't modify
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  // Function to calculate total price
  function calculateTotalPrice() {
    const sizePrice = selectedSize?.price || 0;
    const extrasPrice = selectedExtras.reduce((total, extra) => total + extra.price, 0);
    return (basePrice + sizePrice + extrasPrice) * quantity;
  }

  // Function to handle Add to Cart button click
  async function handleAddToCartButtonClick() {
    if (stock <= 0) {
      toast.error('This item is sold out and cannot be added to the cart.');
      return;
    }

    const hasOptions = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }

    // Add item to cart with selected options and quantity
    addToCart(menuItem, selectedSize, selectedExtras, quantity);

    // Show success message
    toast.success('Item added to cart successfully!');

    // Close the popup after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(false);
  }

  // Handle selecting extras
  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => prev.filter(e => e._id !== extraThing._id));
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md">
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: 'calc(100vh - 100px)' }}>
              <Image
                src={image || null} // Check if `image` is empty and set to null if so
                alt={name}
                width={300}
                height={200}
                className="mx-auto" />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?._id === size._id}
                        name="size"
                      />
                      {size.name} ₱{size.price}
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Any extras?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.some(e => e._id === extraThing._id)}
                        name={extraThing.name}
                      />
                      {extraThing.name} +₱{extraThing.price}
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <button
                  className="text-gray-700 p-2 border rounded"
                  onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                  disabled={stock <= 0} // Disable button when sold out
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  className="text-gray-700 p-2 border rounded"
                  onClick={() => setQuantity(prev => Math.min(prev + 1, stock))} // Limit to stock
                  disabled={stock <= 0} // Disable button when sold out
                >
                  +
                </button>
              </div>
              <div className="primary sticky bottom-2">
                <button
                  onClick={handleAddToCartButtonClick}
                  className="w-full p-3 bg-green-500 text-white rounded-md">
                  Add to cart ₱{calculateTotalPrice()}
                </button>
              </div>
              <button
                className="mt-2"
                onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}
