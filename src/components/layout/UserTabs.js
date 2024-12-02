'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs({ isAdmin }) {
  const path = usePathname();

  return (
    <>
      <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
        {/* Always accessible routes */}
        <Link className={path === '/profile' ? 'active' : ''} href={'/profile'}>
          Profile
        </Link>
        <Link className={path === '/menu' ? 'active' : ''} href={'/menu'}>
          Menu Here
        </Link>
        <Link className={path === '/receiptnotadmin' ? 'active' : ''} href={'/receiptnotadmin'}>
          Staff Receipt
        </Link>
      
        {isAdmin && (
          <>
            {/* Admin-only routes */}
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
              Admin Receipt
            </Link>
            <Link className={path.includes('/stocks') ? 'active' : ''} href={'/stocks'}>
              Stocks
            </Link>
          </>
        )}
      </div>
    </>
  );
}