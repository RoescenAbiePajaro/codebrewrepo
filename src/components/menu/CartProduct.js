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
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image
          width={240}
          height={240}
          src={product.image}
          alt={"productssimage"}
        />
      </div>
      <div className="grow text-gray-500">
        <h3 className="font-semibold">{product.name}</h3>
        {product.sizes?.length > 0 && (
          <div className="text-sm">
            Sizes: {product.sizes.map(sizes => (
              <span key={sizes._id}>
                {sizes.name} {formatToPeso(sizes.price)}
              </span>
            ))}
          </div>
        )}

        
       {product.extras?.length > 0 && (
  <div className="text-sm text-gray-500">
    {product.extras.map((extra) => (
      <span key={extra.name}>
        Extras: {extra.name} {formatToPeso(extra.price)}
      </span>
    ))}
  </div>
)}

        {/* Add base price below extra ingredients */}
        <div className="text-sm text-gray-500 mt-2">
          Base Price: {formatToPeso(product.basePrice)}
        </div>
      </div>
      <div className="text-lg font-semibold">
        {formatToPeso(cartProductPrice(product))}
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}
