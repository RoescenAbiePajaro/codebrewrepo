//cart page
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
import UserTabs from "@/components/layout/UserTabs";
import CircularProgress from "@mui/material/CircularProgress";

export default function CartPage() {
  const { cartProducts, removeCartProduct, setCartProducts, clearCart } = useContext(CartContext);
  const [customer, setCustomer] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [change, setChange] = useState(null);
  const router = useRouter();
  const { status } = useSession(); 
  const { loading: profileLoading, data: profileData } = useProfile();
  

  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('Payment failed 😔');
      }
    }
  }, []);

  useEffect(() => {
    if (profileData && profileData.staffname) {
      const { staffname } = profileData;
      setCustomer({ staffname });
    }
  }, [profileData]);

  useEffect(() => {
    if (cartProducts) {
      let subtotal = 0;
      cartProducts.forEach(p => {
        subtotal += cartProductPrice(p);
      });
      if (inputAmount) {
        const calculatedChange = inputAmount - subtotal;
        setChange(calculatedChange);
      }
    }
  }, [cartProducts, inputAmount]);

  const handleCustomerChange = (field, value) => {
    setCustomer(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };////////////////////////////////////////////////////////
async function saveReceipt(ev) {
  ev.preventDefault();

  const promise = new Promise((resolve, reject) => {
    fetch('/api/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        cartProducts: cartProducts.map(product => ({
          ...product, // Keep all product properties (including basePrice, sizes, and extraIngredients)
          basePrice: product.basePrice,
          sizes: product.sizes,
          extraIngredients: product.extras,
        })),
        // Fix the subtotal calculation by using cartProductPrice without multiplying by quantity
        subtotal: cartProducts.reduce((total, product) => total + cartProductPrice(product), 0), // Don't multiply by quantity here
        change,
      }),
    })
    .then(async (response) => {
      if (response.ok) {
        const savedReceipt = await response.json();

        // After saving the receipt, update stock for each cart item
        try {
          await Promise.all(cartProducts.map(async (product) => {
            const updatedStock = product.stock - product.quantity;
            const stockResponse = await fetch('/api/menu-items', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ _id: product._id, stock: updatedStock }),
            });

            if (!stockResponse.ok) {
              throw new Error(`Failed to update stock for product ${product.name}`);
            }
          }));

          clearCart();
          resolve(savedReceipt);
          toast.success('Cart Cleared');
        } catch (error) {
          reject(new Error('Stock update failed: ' + error.message));
        }
      } else {
        reject(new Error('Saving receipt failed'));
      }
    })
    .catch((error) => {
      reject(error);
    });
  });

  await toast.promise(promise, {
    loading: 'Saving your receipt...',
    success: 'Receipt saved and stock updated!',
    error: (err) => err.message || 'Something went wrong... Please try again later',
  });

  setShowReceipt(true);
}

////////////////////////////////////////////////////////////////// 
  
  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;

    const productStock = cartProducts[index].stock;

    if (newQuantity > productStock) {
      toast(`You can only purchase up to ${productStock} of this product.`, {
        icon: '⚠️',
        style: { background: '#fff', color: '#000' },
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
     <section className="mt-8 mx-auto p-4 sm:p-6 md:p-8 lg:p-10 max-w-4xl flex flex-col items-center justify-center text-center">
  <UserTabs isAdmin={true} />
  <SectionHeaders mainHeader="Cart" />
  <p className="mt-4">Cart is empty 😔</p>
</section>

    );
  }

  let subtotal = cartProducts.reduce((total, product) => total + cartProductPrice(product), 0);

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 px-2 sm:px-4 md:px-8">
      <UserTabs isAdmin={true} />
      <div className="text-center">
        <SectionHeaders mainHeader="Your Cart" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cart Items */}
        <div>
          {cartProducts.map((product, index) => (
            <div key={index} className="mb-4 flex flex-col md:flex-row items-center justify-between border-b pb-4">
              <CartProduct product={product} index={index} onRemove={removeCartProduct} quantity={product.quantity} />

              <div className="flex items-center space-x-2 mt-2 md:mt-0">
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
            <span>Total Items:</span>
            <span>{cartProducts.length}</span>
          </div>
        </div>


        {/* Checkout Form */}
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-bold">Checkout</h2>
          <form onSubmit={saveReceipt} className="space-y-4">
          <CustomerInputs 
        customerProps={customer}
        setCustomerProp={handleCustomerChange}
        userName={profileData?.staffname || ''}  // Pass the existing username as a prop
      />


            <input
  type="number"
  value={inputAmount}
  onChange={(e) => {
    const value = parseFloat(e.target.value);
    setInputAmount(value);
    if (value && !isNaN(value)) {
      const calculatedChange = value - subtotal;
      setChange(calculatedChange);
    } else {
      setChange(null);
    }
  }}
  placeholder="Enter amount"
  className="w-full p-2 border border-gray-300 rounded-md"
  required
/>


            
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Receipt
            </button>
          </form>

          {/* Moved Subtotal Display Below Print Button */}
          <div className="mt-6 flex justify-between items-center text-lg font-semibold">
            <span>Subtotal:</span>
            <span>₱{subtotal.toFixed(2)}</span>
            {change !== null && (
              <div className="mt-2 text-lg font-semibold">
                {change >= 0 ? (
                  <span>Change: ₱{change.toFixed(2)}</span>
                ) : (
                  <span className="text-red-500">Amount entered is insufficient!</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <Receipt 
              customer={customer} 
              cartProducts={cartProducts} 
              subtotal={subtotal} 
              change={change} 
              createdAt={new Date().toLocaleString()} 
            />

            <div className="mt-4 flex justify-between">
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