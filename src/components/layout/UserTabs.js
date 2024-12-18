//src\components\layout\UserTabs.js
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {FaReceipt, FaChartBar, FaBox } from 'react-icons/fa'; // Importing icons
import { VscAccount } from "react-icons/vsc";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { RiFunctionAddFill } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { TbReceipt } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

export default function UserTabs({ isAdmin, isNewUser }) {
  const path = usePathname();
  const [showWarning, setShowWarning] = useState(false);

  const handleClickUsersTab = () => {
    if (isNewUser) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000); // Display the warning for 5 seconds
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-10 flex justify-around py-2 flex-wrap">
      {/* Always accessible routes */}
      <Link className={`flex-1 text-center flex items-center justify-center ${path === '/profile' ? 'active' : ''}`} href={'/profile'}>
        <VscAccount />
      </Link>

      {/* Staff-only links */}
      {!isAdmin && (
        <>
          <Link className={`flex-1 text-center flex items-center justify-center ${path === '/menu-notadmin' ? 'active' : ''}`} href={'/menu-notadmin'}>
            <MdOutlineRestaurantMenu />
          </Link>
          
          <Link className={`flex-1 text-center flex items-center justify-center ${path === '/staffreceipt' ? 'active' : ''}`} href={'/staffreceipt'}>
            <TbReceipt  />
          </Link>
        </>
      )}

      {/* Admin-only routes */}
      {isAdmin && (
        <>
          <Link className={`flex-1 text-center flex items-center justify-center ${path === '/menu-list' ? 'active' : ''}`} href={'/menu-list'}>
            <MdOutlineRestaurantMenu />
          </Link>

          <Link className={`flex-1 text-center flex items-center justify-center ${path === '/categories' ? 'active' : ''}`} href={'/categories'}>
            <RiFunctionAddFill />
          </Link>
          <Link className={`flex-1 text-center flex items-center justify-center ${path.includes('menu-items') ? 'active' : ''}`} href={'/menu-items'}>
            <IoIosAddCircle />
          </Link>
          <Link className={`flex-1 text-center flex items-center justify-center ${path.includes('/users') ? 'active' : ''}`} href={'/users'} onClick={handleClickUsersTab}>
            <FaUserEdit />
          </Link>
          <Link className={`flex-1 text-center flex items-center justify-center ${path.includes('/sales') ? 'active' : ''}`} href={'/sales'}>
            <FaChartBar />
          </Link>
          <Link className={`flex-1 text-center flex items-center justify-center ${path.includes('/receipt') ? 'active' : ''}`} href={'/receipt'}>
            < TbReceipt  />
          </Link>
          <Link className={`flex-1 text-center flex items-center justify-center ${path.includes('/stocks') ? 'active' : ''}`} href={'/stocks'}>
            <FaBoxOpen  />
          </Link>
        </>
      )}

      {/* Warning message if the user is new */}
      {showWarning && (
        <div className="text-red-500 mt-2">
          Wait for admin permission on this account.
        </div>
      )}
    </div>
  );
}