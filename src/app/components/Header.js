'use client';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
    const session = useSession();
    const status = session?.status;
    const userData = session.data?.user;
    let nname = userData?.nname || userData?.email || 'Guest'; // Provide a fallback name

    if (nname && nname.includes(' ')) {
        nname = nname.split(' ')[0]; // Take only the first part of the name
    }

    return (
        <header className="flex items-center justify-between">
            <Link className="text-black-600 gap-8 text-2xl" href="/"> 
                Tealerin Milktea
            </Link>
            <nav className="flex items-center gap-8 text-gray-500 font-semibold">
                <Link href={''}>Home</Link>
                <Link href={''}>Menu</Link>
                <Link href={''}>About</Link>
                <Link href={''}>Contact</Link>
            </nav>

            <nav className="flex items-center gap-4 text-gray-500">
                {status === 'authenticated' && (
                    <>
                        <Link href={'/profile'} className="whitespace-nowrap">Hello, {nname}</Link>
                        <button onClick={() => signOut()} className="bg-green-600 rounded-full text-white px-8 py-2">
                            Logout
                        </button>
                    </>
                )}

                {status === 'unauthenticated' && (
                    <>
                        <Link href={'/login'}>Login</Link>
                        <Link href={'/register'} className="bg-green-600 rounded-full text-white px-8 py-2">
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
