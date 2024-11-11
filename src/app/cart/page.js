'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import CustomerInputs from "@/components/layout/CustomerInputs"; // Updated import
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartProducts, removeCartProduct, setCartProducts } = useContext(CartContext);
  const [customer, setCustomer] = useState({});
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.name || profileData?.email) {
      const { name, email, phone } = profileData;
      setCustomer({ name, email, phone });
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }

  function handleCustomerChange(propName, value) {
    setCustomer(prevCustomer => ({ ...prevCustomer, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          cartProducts,
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: 'Preparing your order...',
      success: 'Redirecting to payment...',
      error: 'Something went wrong... Please try again later',
    });
  }

  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return; // Prevent quantity from being less than 1
    setCartProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity = newQuantity;
      return updatedProducts;
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Cart is empty 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div>No products in cart</div>
          )}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <div key={index} className="mb-4 flex items-center justify-between">
              <CartProduct
                product={product}
                index={index} // Pass index here
                onRemove={removeCartProduct}
              />
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-200 p-2 rounded-full"
                  onClick={() => updateQuantity(index, product.quantity - 1)}
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  className="bg-gray-200 p-2 rounded-full"
                  onClick={() => updateQuantity(index, product.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:<br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ₱{subtotal}<br />
              ₱{subtotal}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <CustomerInputs
              customerProps={customer}  // Updated usage
              setCustomerProp={handleCustomerChange} // Updated handler function
            />
            <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
              Pay ₱{subtotal}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
