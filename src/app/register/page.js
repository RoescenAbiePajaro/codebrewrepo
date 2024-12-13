// app/register/page.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(false); // Fixed the variable name
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
  
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      setUserCreated(true);
    } else {
      const errorMessage = await response.json(); // Parse the JSON response
      setError(errorMessage.error || "An error occurred. Please try again.");
    }
  
    setIsLoading(false);
  };

  return (
    <section className="mt-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-green-500 text-4xl mb-4">Register</h1>

        {userCreated ? (
          <p className="text-center my-4">User  created! <Link href="/login">Wait for Admin Approval </Link></p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {error && <p className="text-center text-red-500 my-4">{error}</p>} {/* Display the error message */}
      </div>
    </section>
  );
}