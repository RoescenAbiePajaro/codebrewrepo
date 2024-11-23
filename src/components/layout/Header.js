import { CartContext } from "@/components/AppContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";
import UserTabs from "@/components/UserTabs"; // Include UserTabs for admin

export default function Header() {
  const { status, data: userData } = useSession();
  const userName = userData?.name || userData?.email || "Guest";
  const isAdmin = userData?.role === 'admin'; // Check if the user is admin
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If user has a name, just show the first part (before space)
  const displayName = userName.includes(' ') ? userName.split(' ')[0] : userName;

  // Check if the cart is empty
  const isCartEmpty = cartProducts?.length === 0;

  return (
    <header>
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-green font-semibold text-2xl" href={'/'}>
          Tealerin Milktea
        </Link>
        <div className="flex gap-8 items-center">
          {status === 'authenticated' ? (
            <>
              <Link href={'/profile'} className="whitespace-nowrap">
                Hello, {displayName}
              </Link>
              <button onClick={() => signOut()} className="bg-green-500 rounded-full text-white px-8 py-2">
                Logout
              </button>
            </>
          ) : (
            <Link href={'/login'}>Login</Link>
          )}
          <Link href={'/cart'} className="relative">
            <span>Cart</span>
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-green text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
            {isCartEmpty && (
              <span className="absolute -top-6 -right-4 text-red-500 text-xs">
                Your cart is empty
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <span>☰</span>
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Home</Link>
          {status === 'authenticated' && (
            <>
              <Link href={'/profile'}>Profile</Link>
              {isAdmin && <UserTabs />}
              <button onClick={() => signOut()}>Logout</button>
            </>
          )}
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-green font-semibold text-2xl" href={'/'}>
            Tealerin Milktea
          </Link>
          <Link href={'/'}>Home</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          {status === 'authenticated' ? (
            <>
              <Link href={'/profile'} className="whitespace-nowrap">
                Hello, {displayName}
              </Link>
              <Link href={'/cart'} className="relative">
                Cart
                {cartProducts?.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-green-500 text-white text-xs py-1 px-1 rounded-full leading-3">
                    {cartProducts.length}
                  </span>
                )}
                {isCartEmpty && (
                  <span className="absolute -top-6 -right-4 text-red-500 text-xs">
                    Your cart is empty
                  </span>
                )}
              </Link>
              <button onClick={() => signOut()} className="bg-green-500 rounded-full text-white px-8 py-2">
                Logout
              </button>
            </>
          ) : (
            <Link href={'/login'}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
