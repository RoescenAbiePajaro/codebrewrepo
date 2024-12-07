'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotAdminTabs({ isPermission }) {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      {isPermission && (
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
    </div>
  );
}
