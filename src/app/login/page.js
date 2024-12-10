// src/app/login/page.js
'use client';

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Reset error message before attempting login

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Don't automatically redirect after login, handle it manually
    });

    if (result?.error) {
      setErrorMessage(result.error); // Display error message if login fails
    } else {
      // If login is successful, redirect to home page
      router.push("/"); // Adjust if you want to redirect elsewhere
    }

    setIsLoading(false); // Disable loading spinner after request
  };

  return (
    <section className="mt-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-green-500 text-4xl mb-4">Login</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={isLoading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Dont have an account?{" "}
          <a href="/register" className="text-green-500">
            Register here
          </a>
        </p>

        <div className="my-4 text-center text-gray-500"></div>
        {/* <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-4 w-full py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          <Image src="/google-icon.png" alt="Google icon" width={24} height={24} />
          Login with Google
        </button> */}
      </div>
    </section>
  );
}
