import FlyingButton from 'react-flying-item'

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image, stock
}) {
  const isDisabled = stock <= 0;

  const handleAddToCart = () => {
    if (!isDisabled) {
      // Add the item to the cart
      onClick(basePrice);
    }
  };

  if (!hasSizesOrExtras || isDisabled) {
    return (
      <div className="flying-button-parent mt-4">
        { !isDisabled && (
          <FlyingButton
            targetTop={'5%'}
            targetLeft={'95%'}
            src={image || null}>
            <div onClick={handleAddToCart} className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
              Add to cart ₱{basePrice}
            </div>
          </FlyingButton>
        )}
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
      <span>Add to cart (from ₱{basePrice})</span>
    </button>
  );
}