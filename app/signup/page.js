"use client";
import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Link from "next/link";

const db = getFirestore(firebaseApp);

const Signup = () => {
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          router.push("/login"); // Redirect to login if user exists
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignup = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        // Save user information to Firestore
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(error.message); // Handle sign-in errors
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

export default Signup;
