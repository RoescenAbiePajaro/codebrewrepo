import { useState } from 'react';
import { cartProductPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove, index }) {
  const [quantity, setQuantity] = useState(product.quantity || 1); // Set initial quantity

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1); // Prevent going below 1

  const totalPrice = cartProductPrice(product) * quantity;

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image width={240} height={240} src={product.image} alt={"productssimage"} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">
          {product.name}
        </h3>
        {product.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map(extra => (
              <div key={extra.name}>{extra.name} ${extra.price}</div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <button 
          onClick={handleDecrease} 
          className="px-3 py-1 bg-gray-200 rounded-full"
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          onClick={handleIncrease} 
          className="px-3 py-1 bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
      <div className="text-lg font-semibold">
        ₱{totalPrice}
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(index)} // Pass index here
            className="p-2"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
