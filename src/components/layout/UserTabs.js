'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function UserTabs({ isAdmin, isNewUser, isPermission }) {
  const path = usePathname();
  const [showWarning, setShowWarning] = useState(false);

  const handleClickUsersTab = () => {
    if (isNewUser || !isPermission) { // Show warning if the user is new or not permitted
      alert("Wait for admin approval.");
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000); // Display the warning for 5 seconds
    }
  };

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      {/* Always accessible route */}
      <Link className={path === '/profile' ? 'active' : ''} href={'/profile'}>
        Profile
      </Link>

      {/* Staff-only links */}
      {!isPermission && ( // Show these links only if isPermission is true
        <>
          <Link 
            className={path === '/menu-notadmin' ? 'active' : ''} 
            href={'/menu-notadmin'}
          >
            Staff Menu Here
          </Link>
          
          <Link 
            className={path === '/staffreceipt' ? 'active' : ''} 
            href={'/staffreceipt'}
          >
            Staff Receipt
          </Link>
        </>
      )}

      {/* Admin-only links */}
      {isAdmin && (
        <>
          <Link className={path === '/menu-list' ? 'active' : ''} href={'/menu-list'}>
            Menu Here
          </Link>
          <Link href={'/categories'} className={path === '/categories' ? 'active' : ''}>
            Categories
          </Link>
          <Link href={'/menu-items'} className={path.includes('menu-items') ? 'active' : ''}>
            Add Items
          </Link>
          <Link className={path.includes('/users') ? 'active' : ''} href={'/users'}>
            Staff
          </Link>
          <Link className={path.includes('/sales') ? 'active' : ''} href={'/sales'}>
            Sales
          </Link>
          <Link className={path.includes('/receipt') ? 'active' : ''} href={'/receipt'}>
            Receipt
          </Link>
          <Link className={path.includes('/stocks') ? 'active' : ''} href={'/stocks'}>
            Stocks
          </Link>
        </>
      )}
    </div>
  );
}
