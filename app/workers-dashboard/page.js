"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  updateDoc,
  getDocs,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Define the WorkHistoryPage component
const WorkHistoryPage = ({ userName }) => {
  // State variables
  const [workers, setWorkers] = useState([]); // Workers data from Firestore
  const [selectedWorker, setSelectedWorker] = useState(null); // Selected worker
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(true); // Loading state
  const [currentTime, setCurrentTime] = useState(new Date()); // Current time
  const [punchInTime, setPunchInTime] = useState(null); // Punch-in time
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time since punch-in

  // Fetch workers data from Firestore on component mount
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

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate elapsed time since punch-in every second
  useEffect(() => {
    if (punchInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = now - punchInTime;
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [punchInTime]);

  // Handle search query input
  const handleSearch = () => {
    return workers.filter(
      (worker) =>
        worker.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle selection of a worker
  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  // Handle punch-in action
  const handlePunchIn = async () => {
    try {
      const timestamp = serverTimestamp();
      const workerDocRef = doc(db, "users", selectedWorker.id);
      await addDoc(collection(workerDocRef, "attendance"), { timestamp });
      setPunchInTime(new Date());
    } catch (error) {
      setError("Error punching in: " + error.message);
    }
  };

  // Handle punch-out action
  const handlePunchOut = async () => {
    try {
      // Check if a worker is selected
      if (!selectedWorker) {
        setError("No worker selected.");
        return;
      }

      // Calculate the duration between punch-in and punch-out times
      const punchOutTime = new Date();
      const durationMs = punchOutTime - punchInTime;
      const hoursWorked = durationMs / (1000 * 60 * 60); // Convert milliseconds to hours

      // Update the worker document with the hours worked
      const workerDocRef = doc(
        db,
        "users",
        user.uid,
        "workers",
        selectedWorker.firstName
      );
      await updateDoc(workerDocRef, { hoursWorked });

      // Reset punch-in time and elapsed time
      setPunchInTime(null);
      setElapsedTime(0);
    } catch (error) {
      setError("Error punching out: " + error.message);
    }
  };

  // Handle start break action
  const handleStartBreak = async () => {
    try {
      // Add logic to record start break time in the database
      // Update the state variables accordingly
    } catch (error) {
      setError("Error starting break: " + error.message);
    }
  };

  // Handle end break action
  const handleEndBreak = async () => {
    try {
      // Add logic to record end break time in the database
      // Update the state variables accordingly
    } catch (error) {
      setError("Error ending break: " + error.message);
    }
  };

  // Handle leave request action
  const handleLeaveRequest = async () => {
    try {
      // Add logic to handle leave request
      // Save leave request information in the database under the selected worker's name
    } catch (error) {
      setError("Error handling leave request: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar userName={userName} />
      <div className="flex-1 overflow-y-auto bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Workers Information</h1>
          <div className="flex justify-between mb-4">
            <div>
              <p>Current Time: {currentTime.toLocaleTimeString()}</p>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="bg-gray-200 text-gray-800 rounded-md py-2 px-4"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {handleSearch().map((worker) => (
              <div
                key={worker.id}
                className="border p-4 rounded bg-blue cursor-pointer"
                onClick={() => handleSelectWorker(worker)}
              >
                <h2 className="font-bold text-lg">
                  {worker.firstName} {worker.lastName}
                </h2>
              </div>
            ))}
          </div>
          {selectedWorker && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Selected Worker</h2>
              <p>
                Name: {selectedWorker.firstName} {selectedWorker.lastName}
              </p>
              <div>
                <button
                  onClick={handlePunchIn}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-2 mr-2"
                >
                  Punch In
                </button>
                <button
                  onClick={handlePunchOut}
                  className="bg-red-500 text-white py-2 px-4 rounded mt-2 mr-2"
                >
                  Punch Out
                </button>
                <button
                  onClick={handleStartBreak}
                  className="bg-yellow-500 text-white py-2 px-4 rounded mt-2 mr-2"
                >
                  Start Break
                </button>
                <button
                  onClick={handleEndBreak}
                  className="bg-green-500 text-white py-2 px-4 rounded mt-2 mr-2"
                >
                  End Break
                </button>
                <button
                  onClick={handleLeaveRequest}
                  className="bg-purple-500 text-white py-2 px-4 rounded mt-2"
                >
                  Leave Request
                </button>
                {punchInTime && (
                  <p>Elapsed Time: {Math.floor(elapsedTime / 1000)} seconds</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryPage;
