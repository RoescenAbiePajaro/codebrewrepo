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
import { useSession } from "next-auth/react"; 

export default function CartPage() {
  const { cartProducts, removeCartProduct, setCartProducts, clearCart } = useContext(CartContext);
  const [customer, setCustomer] = useState({});
  const { data: profileData } = useProfile();
  const [showReceipt, setShowReceipt] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [change, setChange] = useState(null);
  const router = useRouter();
  const { status } = useSession(); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData && (profileData.staffname)) {
      const { staffname} = profileData;
      setCustomer({ staffname});
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
          change,
        }),
      }).then(async (response) => {
        if (response.ok) {
          const savedReceipt = await response.json();

          // After saving the receipt, update stock for each cart item
          await Promise.all(cartProducts.map(async (product) => {
            const updatedStock = product.stock - product.quantity;
            await fetch('/api/menu-items', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ _id: product._id, stock: updatedStock }),
            });
          }));

          clearCart();
          resolve(savedReceipt);
          toast.success('Receipt saved and stock updated!');
        } else {
          reject(new Error('Saving receipt failed'));
        }
      }).catch((error) => {
        reject(error);
      });
    });

    await toast.promise(promise, {
      loading: 'Saving your receipt...',
      success: 'Receipt saved and stock updated!',
      error: (err) => err.message || 'Something went wrong... Please try again later',
    });
  }

  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return; 

    const productStock = cartProducts[index].stock;

    // Check if the requested quantity exceeds available stock
    if (newQuantity > productStock) {
      toast(`You can only purchase up to ${productStock} of this product.`, {
        icon: '⚠️',
        style: {
          background: '#fff',
          color: '#000',
        },
      });
      return;
    }

    setCartProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity = newQuantity;
      return updatedProducts;
    });
  }

  if (status === 'unauthenticated') {
    router.push('/login'); 
    return null; 
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
    <section className="mt-8 px-4">
      <div className="text-center">
        <SectionHeaders mainHeader="Your Cart" />
      </div>
  
      {(!cartProducts || cartProducts.length === 0) ? (
        <section className="mt-8 text-center space-y-4">
          <p className="text-gray-500 text-lg">Your cart is currently empty 😔</p>
          <button 
            onClick={() => router.push('/menu')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Browse Menu
          </button>
        </section>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div>
            {cartProducts.map((product, index) => (
              <div key={index} className="mb-4 flex items-center justify-between border-b pb-4">
                <CartProduct product={product} index={index} onRemove={removeCartProduct} />
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                    onClick={() => updateQuantity(index, product.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{product.quantity}</span>
                  <button
                    className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                    onClick={() => updateQuantity(index, product.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
    
            <div className="mt-6 flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
          </div>
    
          {/* Checkout Form */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-bold">Checkout</h2>
            <form onSubmit={saveReceipt}>
              <CustomerInputs customerProps={customer} setCustomerProp={handleCustomerChange} />
              
              {/* Amount Input */}
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputAmount(value);
                  if (value && !isNaN(value)) {
                    const calculatedChange = parseFloat(value) - subtotal;
                    setChange(calculatedChange >= 0 ? calculatedChange : 0);
                  } else {
                    setChange(null);
                  }
                }}
                placeholder="Enter amount (e.g., 20 pesos)"
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              {/* Display Change */}
              {change !== null && (
                <div className="mt-2 text-lg font-semibold">
                  <span>Change: </span>
                  <span>₱{change.toFixed(2)}</span>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save Receipt
              </button>
            </form>
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    
      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <Receipt customer={customer} cartProducts={cartProducts} subtotal={subtotal} createdAt={new Date().toLocaleString()} />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  window.print();
                  setShowReceipt(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Print
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
