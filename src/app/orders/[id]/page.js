'use client';
import { CartContext, cartProductPrice } from "@/components/AppContext";
import CustomerInputs from "@/components/layout/CustomerInputs";  // Renamed component
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function CustomerPage() {
  const { clearCart } = useContext(CartContext);
  const [customer, setCustomer] = useState();
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (typeof window.console !== "undefined") {
      if (window.location.href.includes('clear-cart=1')) {
        clearCart();
      }
    }
    if (id) {
      setLoadingCustomer(true);
      fetch('/api/customers?_id=' + id).then(res => {
        res.json().then(customerData => {
          setCustomer(customerData);
          setLoadingCustomer(false);
        });
      });
    }
  }, []);

  let subtotal = 0;
  if (customer?.cartProducts) {
    for (const product of customer.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Customer Details" />
        <div className="mt-4 mb-8">
          <p>Thank you for shopping with us!</p>
          <p>We will contact you for any updates regarding your order.</p>
        </div>
      </div>
      {loadingCustomer && (
        <div>Loading customer information...</div>
      )}
      {customer && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {customer.cartProducts.map(product => (
              <CartProduct key={product._id} product={product} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Subtotal:
              <span className="text-black font-bold inline-block w-8">₱{subtotal}</span>
              <br />
              Total:
              <span className="text-black font-bold inline-block w-8">
                ₱{subtotal}
              </span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <CustomerInputs
                disabled={true}
                customerProps={customer}  // Renamed prop to customerProps
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
