// login page.js
"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setLoginInProgress(true);

        await signIn('credentials', { email, password, callbackUrl: '/' });
        
        setLoginInProgress(false);
    }

    return (
        <section className="mt-8 flex justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-center text-green-500 text-4xl mb-4">
                    Login
                </h1>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        disabled={loginInProgress}
                        onChange={ev => setEmail(ev.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        disabled={loginInProgress}
                        onChange={ev => setPassword(ev.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    
                    <button
                        disabled={loginInProgress}
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Login
                    </button>
                    <div className="my-4 text-center text-gray-500">
                        or login with provider
                    </div>
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="flex items-center justify-center gap-4 w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                        <Image src={'/google-icon.png'} alt={'Google icon'} width={24} height={24} />
                        Login with Google
                    </button>
                </form>
            </div>
        </section>
    );
}
