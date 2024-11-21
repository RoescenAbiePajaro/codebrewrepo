'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import CustomerInputs from "@/components/layout/CustomerInputs"; 
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Receipt from "@/components/layout/Receipt";

export default function CartPage() {
  const { cartProducts, removeCartProduct, setCartProducts } = useContext(CartContext);
  const [customer, setCustomer] = useState({});
  const { data: profileData } = useProfile();
  const [showReceipt, setShowReceipt] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData && (profileData.name || profileData.email)) {
      const { name, email, phone } = profileData;
      setCustomer({ name, email, phone });
    }
  }, [profileData]);

  let subtotal = 0;
  if (cartProducts) {
    for (const p of cartProducts) {
      subtotal += cartProductPrice(p);
    }
  }

  function handleCustomerChange(propName, value) {
    setCustomer(prevCustomer => ({ ...prevCustomer, [propName]: value }));
  }

  // Save the receipt to the database
  async function saveReceipt(ev) {
    ev.preventDefault();
  
    const promise = new Promise((resolve, reject) => {
      fetch('/api/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          cartProducts,
          subtotal,
        }),
      }).then(async (response) => {
        if (response.ok) {
          const savedReceipt = await response.json();
          resolve(savedReceipt);
          toast.success('Receipt saved successfully!');
        } else {
          reject(new Error('Saving receipt failed'));
        }
      }).catch((error) => {
        reject(error);
      });
    });
  
    await toast.promise(promise, {
      loading: 'Saving your receipt...',
      success: 'Receipt saved!',
      error: (err) => err.message || 'Something went wrong... Please try again later',
    });
  }
  

  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return; 
    setCartProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity = newQuantity;
      return updatedProducts;
    });
  }

  if (!cartProducts || cartProducts.length === 0) {
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
          {cartProducts.map((product, index) => (
            <div key={index} className="mb-4 flex items-center justify-between">
              <CartProduct
                product={product}
                index={index} 
                onRemove={removeCartProduct}
              />
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-200 p-2 rounded-full no-print"
                  onClick={() => updateQuantity(index, product.quantity - 1)}
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  className="bg-gray-200 p-2 rounded-full no-print"
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

        {/* Checkout Form */}
        <div className="bg-gray-100 p-4 rounded-lg no-print">
          <h2>Checkout</h2>
          <form onSubmit={saveReceipt}>
            <CustomerInputs
              customerProps={customer}  
              setCustomerProp={handleCustomerChange} 
            />
            <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md no-print">
              Save Receipt
            </button>
          </form>

          <button 
            onClick={() => setShowReceipt(true)} 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md no-print"
          >
            Print Receipt
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="relative p-8 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <Receipt 
              customer={customer} 
              cartProducts={cartProducts} 
              subtotal={subtotal} 
              createdAt={new Date().toLocaleString()} 
            />
            <button 
              onClick={() => {
                window.print();
                setShowReceipt(false);
              }} 
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md no-print"
            >
              Print
            </button>
            <button 
              onClick={() => setShowReceipt(false)} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md no-print"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}