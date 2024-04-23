"use client";
import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseApp from "../../utils/firebase"; // Import firebaseApp from utils
import Link from "next/link";

const Signup = () => {
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Redirect to dashboard or desired page after sign-up
      window.location.href = "/dashboard";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-cyan-900 to-blue-900 flex-row items-center justify-between">
      <div className="w-6/12 h-screen flex flex-col justify-center items-center">
        <h1 className="font-bold text-6xl text-white mb-12">ShiftEaze</h1>
      </div>
      <div className="w-6/12 h-screen flex flex-col justify-center items-center">
        <h2 className="text-white text-4xl mb-8">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleGoogleSignup}
          className="bg-blue-500 text-white rounded-md py-3 px-6 mb-4 w-64 transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Sign up with Google
        </button>
        <p className="mt-4 text-white text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </main>
  );
};
