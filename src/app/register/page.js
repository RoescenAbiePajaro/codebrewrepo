// app/register/page.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
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
      body: JSON.stringify({ email, password, firstName, lastName }),
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
    <section className="mt-24 flex justify-center px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 max-w-md w-full">
        <h1 className="text-center text-green-500 text-4xl mb-4">Register</h1>
  
        {userCreated ? (
          <p className="text-center my-4">
            User created!{" "}
            <Link href="/login" className="text-green-500">
              Wait for Admin Approval
            </Link>
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
             <input
              type="text"
              placeholder="First Name"
              value={firstName}
              disabled={isLoading}
              onChange={(e) => setfirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
             <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              disabled={isLoading}
              onChange={(e) => setlastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />

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