"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [nname, setName] = useState(''); // Capture nname from input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setLoginInProgress(true);

        // Pass nname along with email and password
        await signIn('credentials', { nname, email, password, callbackUrl: '/' });
        
        setLoginInProgress(false);
    }
    return (
        <section className="mt-8">
            <h1 className="text-center text-green-500 text-4xl mb-4">
                Login
            </h1>
            <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>

                <input
                    type="email" name="email"
                    placeholder="Email"
                    value={email}
                    disabled={loginInProgress}
                    onChange={ev => setEmail(ev.target.value)}
                />
                <input
                    type="password" name="password"
                    placeholder="Password"
                    value={password}
                    disabled={loginInProgress}
                    onChange={ev => setPassword(ev.target.value)}
                />
                
                <button disabled={loginInProgress} type="submit">Login</button>
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>
                <button onClick={() => signIn('google', { callbackUrl: '/' })} className="flex gap-4 justify-center">
                    <Image src={'/google-icon.png'} alt={''} width={24} height={24} />
                    Login with Google
                </button>
            </form>
        </section>
    );
}
