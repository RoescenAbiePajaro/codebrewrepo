'use client';
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price * cartProduct.quantity; // Multiply by quantity
}

export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
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
    setCartProducts(prevProducts => {
      // Check if the product is already in the cart, and update its quantity if it is
      const productIndex = prevProducts.findIndex(cartProduct => 
        cartProduct._id === product._id && 
        cartProduct.size?._id === size?._id &&
        JSON.stringify(cartProduct.extras) === JSON.stringify(extras)
      );

      if (productIndex !== -1) {
        // Product exists, update the quantity
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex].quantity += quantity;
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
