import FlyingButton from 'react-flying-item'

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image, stock
}) {
  const isDisabled = stock <= 0;

  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image || null}>
          <div onClick={isDisabled ? null : onClick} className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
            Add to cart ₱{basePrice}
          </div>
        </FlyingButton>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={isDisabled ? null : onClick}
      className={`mt-4 ${isDisabled ? 'bg-gray-500' : 'bg-green-500'} text-white rounded-full px-8 py-2`}
      disabled={isDisabled}
    >
      <span>Add to cart (from ₱{basePrice})</span>
    </button>
  );
}