"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../../utils/firebase"; // Import firebaseApp from utils

const VerificationPending = () => {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(firebaseApp);

    // Check the user's email verification status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // Redirect the user to the login page if email is verified
        router.push("/login"); // Change "/login" to the desired route
      }
    });

    // Unsubscribe from the auth state listener to prevent memory leaks
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verification Required</h1>
        <p className="text-lg mb-4">
          Please check your email inbox and follow the instructions to verify
          your email address.
        </p>
        <p className="text-sm">
          If you haven't received the email, please check your spam folder or
          request another verification email.
        </p>
        <p className="text-sm mt-4">
          You will be redirected to the login page automatically once your email
          is verified.
        </p>
      </div>
    </div>
  );
};

export default VerificationPending;
