// AppContext.js
'use client';

import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice || 0; // Default basePrice to 0 if undefined

  if (cartProduct.size && typeof cartProduct.size.price === 'number' && !isNaN(cartProduct.size.price)) {
    price += cartProduct.size.price; // Add size price if it exists and is a valid number
  } else {
    console.log('No valid size price found', cartProduct.size); // Debugging log to check what's being passed
  }
  // Add extra prices if they exist
  if (Array.isArray(cartProduct.extras)) {
    for (const extra of cartProduct.extras) {
      price += extra.price || 0; // Add extra price, defaulting to 0 if undefined
    }
  }

  // Multiply by quantity
  return price * (cartProduct.quantity || 1); // Default quantity to 1 if undefined
}



export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      let storedCart = [];
      try {
        storedCart = JSON.parse(ls.getItem('cart')) || [];
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        ls.removeItem('cart');
      }
  
      if (Array.isArray(storedCart)) {
        // Defer the update to ensure it doesn't interfere with the render phase
        requestAnimationFrame(() => setCartProducts(storedCart));
      }
    }
  }, [ls]);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts((prevCartProducts) => {
      const newCartProducts = prevCartProducts.filter((_, index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }
  function addToCart(product, size = null, extras = [], quantity = 1) {
    // Check if the product can be added (e.g., based on stock or other conditions)
    const canAddToCart = product.stock > 0; // Example condition

    if (!canAddToCart) {
        toast.error('Cannot add item to cart'); // Notify user
        return; // Prevent adding to cart
    }

    setCartProducts((prevProducts) => {
        // Check if the product is already in the cart
        const productIndex = prevProducts.findIndex(
            (cartProduct) =>
                cartProduct._id === product._id &&
                cartProduct.size?._id === size?._id &&
                JSON.stringify(cartProduct.extras) === JSON.stringify(extras)
        );

        if (productIndex !== -1) {
            // Product exists, update the quantity
            const updatedProducts = prevProducts.map((cartProduct, index) => 
                index === productIndex
                    ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
                    : cartProduct
            );
            saveCartProductsToLocalStorage(updatedProducts);
            return updatedProducts;
        } else {
            // Product doesn't exist, add it to the cart
            const newProduct = { ...product, size, extras, quantity };
            const newProducts = [...prevProducts, newProduct];
            saveCartProductsToLocalStorage(newProducts);
            return newProducts;
        }
    });
}


  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
