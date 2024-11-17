'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs({ isAdmin }) {
  const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link className={path === '/profile' ? 'active' : ''} href={'/profile'}>
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link href={'/categories'} className={path === '/categories' ? 'active' : ''}>
            Categories
          </Link>
          <Link href={'/menu-items'} className={path.includes('menu-items') ? 'active' : ''}>
            Menu Items
          </Link>
          <Link className={path.includes('/users') ? 'active' : ''} href={'/users'}>
            Staff
          </Link>
          <Link className={path === '/sales' ? 'active' : ''} href={'/sales'}>
            Sales
          </Link>
          <Link className={path === '/receipt' ? 'active' : ''} href={'/receipt'}>
            Receipts
          </Link>
        </>
      )}
      
      <Link className={path === '/stocks' ? 'active' : ''} href={'/stocks'}>
        Stocks
      </Link>
    </div>
  );
}