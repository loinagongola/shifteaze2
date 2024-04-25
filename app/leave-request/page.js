"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"; // Import Sidebar component
import { getAuth } from "firebase/auth"; // Import getAuth from firebase auth
import {
  getFirestore,
  doc,
  collection,
  query,
  updateDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Import Firestore utilities
import { firebaseApp } from "../../utils/firebase"; // Import firebaseApp from utils/firebase

// Initialize Firestore
const db = getFirestore(firebaseApp);

const LeaveRequestPage = ({ userName }) => {
  // State variables to hold form data and error/success messages
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(""); // Newly added state for selected worker
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]); // State variable to hold workers data

  // Fetch workers data from Firestore on component mount
  // Inside the useEffect hook that fetches worker data

  useEffect(() => {
    const fetchWorkers = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (!user) {
        setError("User not signed in.");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const workersCollectionRef = collection(userDocRef, "workers");
        const q = query(workersCollectionRef);

        const querySnapshot = await getDocs(q);
        const workersData = [];
        querySnapshot.forEach((doc) => {
          workersData.push({ id: doc.id, ...doc.data() });
        });
        setWorkers(workersData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching workers: " + error.message);
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if user is authenticated
    if (!user) {
      setError("User not signed in."); // Set error if user is not signed in
      return;
    }

    try {
      // Add leave request document to Firestore
      await addDoc(collection(db, "leaveRequests"), {
        startDate,
        endDate,
        reason,
        workerId: selectedWorker, // Save the selected worker's ID
        timestamp: serverTimestamp(),
      });

      // Clear form fields and error message after successful submission
      setStartDate("");
      setEndDate("");
      setReason("");
      setSelectedWorker("");
      setError("");
      setSuccess("Leave request submitted successfully."); // Set success message
    } catch (error) {
      setError("Error submitting leave request: " + error.message); // Set error message if submission fails
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName={userName} /> {/* Render Sidebar component */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Leave Request</h1>
          {/* Display success message if leave request submitted successfully */}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="max-w-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error message if exists */}
            {/* Form inputs for leave request information */}
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Worker
              </label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.firstName} {worker.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                End Date
              </label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Reason
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
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

export default LeaveRequestPage;
