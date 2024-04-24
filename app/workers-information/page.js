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
} from "firebase/firestore";
import { firebaseApp } from "../../utils/firebase";

const db = getFirestore(firebaseApp);

const WorkHistoryPage = ({ userName }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
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

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="border p-4 rounded bg-blue cursor-pointer"
                onClick={() => handleSelectWorker(worker)}
              >
                <h2 className="font-bold text-lg">{worker.name}</h2>
                <p>Email: {worker.email}</p>
                <p>Phone Number: {worker.phoneNumber}</p>
                <p>Address: {worker.address}</p>
                <p>Position: {worker.position}</p>
              </div>
            ))}
          </div>
          {selectedWorker && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Selected Worker</h2>
              <p>Name: {selectedWorker.name}</p>
              <p>Email: {selectedWorker.email}</p>
              <p>Phone Number: {selectedWorker.phoneNumber}</p>
              <p>Address: {selectedWorker.address}</p>
              <p>Position: {selectedWorker.position}</p>
              <p>Hours Worked: {selectedWorker.hoursWorked}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkHistoryPage;
