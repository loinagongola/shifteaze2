"use client";
import React from "react";
import Sidebar from "../../components/sidebar";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("../app"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-cyan-900 to-blue-900">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center text-white">
        <div className="w-full p-4 flex justify-end">
          <button
            onClick={handleSignOut}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            Sign Out
          </button>
        </div>
        <h1 className="text-4xl mb-8">Welcome to the Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg w-9/12">
          <h2 className="text-gray-800 text-2xl mb-4">Dashboard Content</h2>
          <p className="text-gray-700 mb-2">
            Welcome to the ShiftEaze dashboard. Here, you can manage your
            workforce, track work history, and adjust working hours.
          </p>
          <p className="text-gray-700 mb-2">
            Use the sidebar to navigate through different sections of the
            dashboard. You can add new workers, edit their information, search
            for specific workers, and more.
          </p>
          <p className="text-gray-700 mb-2">
            Stay organized and efficient with ShiftEaze, your ultimate workforce
            management solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
