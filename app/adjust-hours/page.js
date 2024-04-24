"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

const db = getFirestore(firebaseApp);

const AdjustHoursPage = ({ userName }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [hoursAdjustment, setHoursAdjustment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleAdjustHours = async () => {
    if (!selectedWorker) {
      setError("Please select a worker.");
      return;
    }

    if (!hoursAdjustment) {
      setError("Please enter hours adjustment.");
      return;
    }

    try {
      const workerDocRef = doc(
        db,
        "users",
        getAuth(firebaseApp).currentUser.uid,
        "workers",
        selectedWorker.id
      );
      await updateDoc(workerDocRef, {
        hoursWorked: selectedWorker.hoursWorked + parseFloat(hoursAdjustment),
      });
      setHoursAdjustment("");
      setError("");
      // Update local state with the new hours worked
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.id === selectedWorker.id
            ? {
                ...worker,
                hoursWorked: worker.hoursWorked + parseFloat(hoursAdjustment),
              }
            : worker
        )
      );
    } catch (error) {
      setError("Error adjusting hours: " + error.message);
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
          <h1 className="text-2xl font-bold mb-4">Adjust Hours</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={selectedWorker ? selectedWorker.id : ""}
              onChange={(e) =>
                setSelectedWorker(
                  workers.find((worker) => worker.id === e.target.value)
                )
              }
              className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" // Added text-black class
            >
              <option value="">Select Worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={hoursAdjustment}
              onChange={(e) => setHoursAdjustment(e.target.value)}
              placeholder="Enter Hours Adjustment"
              className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdjustHours}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            >
              Adjust Hours
            </button>
          </div>
          {selectedWorker && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Selected Worker</h2>
              <p>Name: {selectedWorker.name}</p>
              <p>Hours Worked: {selectedWorker.hoursWorked}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdjustHoursPage;
