"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setCreatingUser(true);
        const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok){
                setError(true);
            }
            if(!response.ok){
            setCreatingUser(false);
    }
            setError(true);
    }
    
    return (
        <section className="mt-8">
            <h1 className="text-center text-green-500 text-4xl">
                Register
                </h1>
                {userCreated && (
                    <div className="my-4 text-center">
                        User created.<br/>
                        Now you can{''}
                        <Link className="underline" href={'/login'}>login &raquo;</Link>
                    </div>
                )}

                {error && (
                    <div className="my-4 text-center">
                    An error has occured.<br />
                    Please try again later
                </div>
                )}
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    disabled={creatingUser}
                    onChange={ev => setEmail(ev.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    disabled={creatingUser}
                    onChange={ev => setPassword(ev.target.value)}
                />
                <button
                    type="submit"
                    disabled={creatingUser}
                    className={`block w-full text-gray-700 font-semibold border border-gray-300 rounded-xl px-6 py-2 ${
                        creatingUser ? 'cursor-not-allowed bg-green-200' : 'bg-green-500 text-white'
                    }`}
                >
                    {creatingUser ? 'Registering...' : 'Register'}
                </button>
                <div className="my-4 text-center text-gray-500">or login with provider</div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google-icon.png'} alt={''} width={24} height={24} />
                    Login with Google
                </button>
            </form>
        </section>
    );
}
