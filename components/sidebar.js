"use client";
import React from "react";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

const Sidebar = () => {
  const router = useRouter(); // Initialize useRouter

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/signin"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-12 mt-4">ShiftEaze</h1>
        <ul className="flex-col justify-around ">
          <li className="mb-8">
            <Link href="/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>
          </li>
          <li className="mb-8">
            <Link href="/add-workers" className="hover:text-blue-500">
              Add Workers
            </Link>
          </li>
          <li className="mb-8">
            <Link href="/workers-dashboard" className="hover:text-blue-500">
              Workers Dashboard
            </Link>
          </li>
          <li className="mb-8">
            <Link href="/workers-information" className="hover:text-blue-500">
              Workers Information
            </Link>
          </li>

          <li className="mb-8">
            <button
              onClick={handleLogout}
              className="hover:text-blue-500 w-full text-left mt-24"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <p className="text-center text-sm">
          &copy; 2024 ShiftEaze. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
