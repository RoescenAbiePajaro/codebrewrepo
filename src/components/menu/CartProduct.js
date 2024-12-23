import { cartProductPrice } from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove, index }) {
  const formatToPeso = (price) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <div className="flex items-center gap-6 border-b py-6">
      <div className="w-24 h-24 overflow-hidden rounded-lg">
        <Image
          width={240}
          height={240}
          src={product.image}
          alt={`${product.name} image`}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 text-gray-600">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        {product.size ? (
  <div className="text-sm text-gray-400 mt-1">
    <span className="font-medium">Size: </span>
    {product.size.name} {formatToPeso(product.size.price)}
  </div>
) : (
  <div className="text-sm text-red-500 mt-1">Size not selected</div> // Debug message
)}


        {/* Display selected extras */}
{product.extraIngredients?.length > 0 ? (
  <div className="text-sm text-gray-400 mt-1">
    <span className="font-medium">Extras: </span>
    {product.extraIngredients.map((extra, idx) => (
      <span key={extra._id}>
        {extra.name} {formatToPeso(extra.price)}
        {idx < product.extraIngredients.length - 1 && ", "}
      </span>
    ))}
  </div>
) : (
  <div className="text-sm text-red-500 mt-1">Extras not selected</div> // Debug message
)}

        {/* Display base price */}
        <div className="text-sm text-gray-500 mt-2">
          <span className="font-medium">Base Price: </span>
          {formatToPeso(product.basePrice)}
        </div>
      </div>

      {/* Display total price */}
      <div className="text-lg font-semibold text-gray-800">
        {formatToPeso(cartProductPrice(product))}
      </div>

      {/* Remove item button */}
      {!!onRemove && (
        <div className="ml-4">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
