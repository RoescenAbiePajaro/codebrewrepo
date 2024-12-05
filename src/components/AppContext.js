//AppContext.js
'use client';

import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice || 0; // Default basePrice to 0 if undefined
  
  if (cartProduct.size?.price) {
    price += cartProduct.size.price; // Add size price if it exists
  }

  if (Array.isArray(cartProduct.extras)) {
    for (const extra of cartProduct.extras) {
      price += extra.price || 0; // Add extra price, defaulting to 0 if undefined
    }
  }

  return price * (cartProduct.quantity || 1); // Multiply by quantity, defaulting to 1 if undefined
}


export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      try {
        const storedCart = JSON.parse(ls.getItem('cart'));
        if (Array.isArray(storedCart)) {
          setCartProducts(storedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        ls.removeItem('cart');
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
    const canAddToCart = (product.stock || 0) > 0; // Default stock check
    if (!canAddToCart) {
      toast.error('Cannot add item to cart');
      return;
    }

    setCartProducts((prevProducts) => {
      const productIndex = prevProducts.findIndex((cartProduct) =>
        cartProduct._id === product._id &&
        cartProduct.size?._id === size?._id &&
        JSON.stringify(cartProduct.extras) === JSON.stringify(extras) // Deep comparison for extras
      );

      if (productIndex !== -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex].quantity += quantity;
        saveCartProductsToLocalStorage(updatedProducts);
        return updatedProducts;
      } else {
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
