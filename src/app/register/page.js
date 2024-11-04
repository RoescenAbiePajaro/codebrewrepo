//register page
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
        setError(false);
        setUserCreated(false);

        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
            setUserCreated(true);
        } else {
            setError(true);
        }
        
        setCreatingUser(false);
    }

    return (
        <section className="mt-8">
           
            
            {userCreated && (
                <div className="my-4 text-center">
                    User created.<br />
                    Now you can <Link className="underline" href={'/login'}>login &raquo;</Link>
                </div>
            )}
            
            {error && (
                <div className="my-4 text-center">
                    An error has occurred.<br />
                    Please try again later.
                </div>
            )}

            {/* Form Container with Shadow */}
            <div className="block max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-center text-green-500 text-4xl">
                Register
            </h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        disabled={creatingUser}
                        onChange={ev => setEmail(ev.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        disabled={creatingUser}
                        onChange={ev => setPassword(ev.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
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
                </form>
                
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>

                <button className="flex gap-4 justify-center items-center border border-gray-300 p-2 rounded w-full">
                    <Image src={'/google-icon.png'} alt={'Google Icon'} width={24} height={24} />
                    Login with Google
                </button>

                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Existing account?{' '}
                    <Link className="underline" href={'/login'}>Login here &raquo;</Link>
                </div>
            </div>
        </section>
    );
}
