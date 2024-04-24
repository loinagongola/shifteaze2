"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../../utils/firebase";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [password, setPassword] = useState("");
  const [workerNames, setWorkerNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchWorkerNames = async () => {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          // Redirect to login page if not authenticated
          window.location.href = "/login";
          return;
        }
        const workersCollection = collection(db, "workers");
        const querySnapshot = await getDocs(workersCollection);
        const names = [];
        querySnapshot.forEach((doc) => {
          names.push(doc.data().name);
        });
        setWorkerNames(names);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching worker names:", error);
        setLoading(false);
      }
    };

    fetchWorkerNames();
  }, [db]);

  const handleSearch = () => {
    const filteredResults = workerNames.filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredResults;
  };

  const handleNameClick = (name) => {
    setSelectedName(name);
    setSearchQuery(name);
  };

  const handlePasswordInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === "") {
      setPassword(value);
    }
  };

  const handleEnter = () => {
    // Redirect to punch in/out page with selected worker's name
    window.location.href = `/punch/${selectedName}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-cyan-900 to-blue-900">
      <div className="w-full flex flex-col justify-center items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter name to search"
          className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white rounded-md py-2 px-4 mb-4 w-3/4 text-center"
        />
        {searchQuery && (
          <div className="flex flex-wrap justify-center">
            {handleSearch().map((name) => (
              <button
                key={name}
                className="bg-secondary text-main-color rounded-md py-2 px-4 mr-2 mb-2"
                onClick={() => handleNameClick(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedName && (
        <div className="w-full flex flex-col justify-center items-center">
          <input
            type="text"
            value={selectedName}
            readOnly
            className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white rounded-md py-2 px-4 mb-4 w-3/4 text-center"
          />
          <input
            type="password"
            value={password}
            onChange={handlePasswordInput}
            placeholder="Enter your numeric password"
            className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white rounded-md py-2 px-4 mb-4 w-3/4 text-center"
          />
          {password && (
            <button
              onClick={handleEnter}
              className="bg-secondary text-main-color rounded-md py-2 px-4"
            >
              Enter
            </button>
          )}
        </div>
      )}
    </main>
  );
}
