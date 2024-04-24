"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"; // Import Sidebar component
import { getAuth } from "firebase/auth"; // Import getAuth from firebase auth
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import getFirestore, doc, and setDoc from firebase firestore
import { firebaseApp } from "../../utils/firebase"; // Import firebaseApp from utils/firebase

// Initialize Firestore
const db = getFirestore(firebaseApp);

const AddWorkersPage = ({ userName }) => {
  // State variables to hold worker information, errors, and success message
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  // Effect to check if user is authenticated
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser); // Set user if authenticated
      } else {
        setUser(null); // Set user to null if not authenticated
      }
    });
    return unsubscribe; // Cleanup function
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if user is authenticated
    if (!user) {
      setError("User not signed in."); // Set error if user is not signed in
      return;
    }

    // Worker data to be added to Firestore
    const workerData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      postalCode,
      position,
    };

    try {
      // Add worker document under authenticated user's document in Firestore
      await setDoc(
        doc(db, "users", user.uid, "workers", firstName),
        workerData
      );

      // Clear form fields and error message after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setPostalCode("");
      setPosition("");
      setError("");
      setSuccess("Worker added successfully."); // Set success message
    } catch (error) {
      setError("Error adding worker: " + error.message); // Set error message if adding worker fails
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName={userName} /> {/* Render Sidebar component */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Add Workers</h1>
          {/* Display success message if worker added successfully */}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="max-w-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
            {/* Display error message if exists */}
            {/* Form inputs for worker information */}
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Address
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Postal Code
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Position
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Worker
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkersPage;
