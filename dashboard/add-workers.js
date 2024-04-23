"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../../utils/firebase";

const db = getFirestore(firebaseApp);

const AddWorkersPage = ({ userName }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (!user) {
      setError("User not signed in.");
      return;
    }

    const workerData = {
      name,
      position,
    };

    try {
      await setDoc(doc(db, "users", user.uid, "workers", name), workerData);
      setName("");
      setPosition("");
      setError("");
    } catch (error) {
      setError("Error adding worker: " + error.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar userName={userName} />
      <div className="flex-1 bg-gray-200">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Add Workers</h1>
          <form onSubmit={handleSubmit} className="max-w-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
