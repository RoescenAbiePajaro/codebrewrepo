'use client';
import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";

// AuthLinks component to handle login/logout and display user info
function AuthLinks({ status, userName }) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          Hello, {userName}
        </Link>
        <button
          onClick={() =>
            signOut({
              callbackUrl: '/login', // Redirect to login page after logging out
            })
          }
          className="bg-green-500 rounded-full text-white px-8 py-2"
        >
          Logout
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'}>Login</Link>
        <Link href={'/register'} className="bg-green-500 rounded-full text-white px-8 py-2">
          Register
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If the user has a full name, shorten it to just the first name
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  return (
    <header>
      {/* Mobile Navigation */}
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-green font-semibold text-2xl" href={'/'}>
          Tealerin Milktea
        </Link>
        <div className="flex gap-8 items-center">
          {status === 'authenticated' && (
            <Link href={'/cart'} className="relative">
              <ShoppingCart />
              {cartProducts?.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-green text-white text-xs py-1 px-1 rounded-full leading-3">
                  {cartProducts.length}
                </span>
              )}
            </Link>
          )}
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Home</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-green font-semibold text-2xl" href={'/'}>
            Tealerin Milktea
          </Link>
          <Link href={'/'}>Home</Link>
        </nav>

        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <AuthLinks status={status} userName={userName} />
          {status === 'authenticated' && (
            <Link href={'/cart'} className="relative">
              <ShoppingCart />
              {cartProducts?.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-green-500 text-white text-xs py-1 px-1 rounded-full leading-3">
                  {cartProducts.length}
                </span>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}