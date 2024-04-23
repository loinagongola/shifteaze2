"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import firebaseApp from "../../utils/firebase";

const db = getFirestore(firebaseApp);

const RequestLeavePage = ({ userName }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (!user) {
      setError("User not signed in.");
      return;
    }

    const leaveRequestData = {
      reason,
      status: "pending",
      requestedAt: new Date(),
    };

    try {
      // Get the user's document
      const userDocRef = doc(db, "users", user.uid);

      // Check if the user has a workers collection, if not, create one
      const userDocSnap = await userDocRef.get();
      if (!userDocSnap.exists()) {
        throw new Error("User document not found.");
      }

      // Get the worker's collection for the specific user
      const workersCollectionRef = collection(userDocRef, "workers");

      // Add the leave request data to the worker's collection
      await addDoc(workersCollectionRef, leaveRequestData);

      setReason("");
      setError("");
      alert("Leave request submitted successfully!");
    } catch (error) {
      setError("Error submitting leave request: " + error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName={userName} />
      <div className="flex-1 bg-gray-200 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Request Leave</h1>
          <form onSubmit={handleSubmit} className="max-w-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Reason
              </label>
              <textarea
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestLeavePage;
