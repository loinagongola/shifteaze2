"use client";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebaseApp from "../../utils/firebase";

const db = getFirestore(firebaseApp);

const WorkerDashboard = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // "Punched in", "On Break", "Punched out"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };

    const fetchWorkerStatus = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (!user) {
        setError("User not signed in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch worker status from Firestore
        // Update 'status' state accordingly
      } catch (error) {
        setError("Error fetching worker status: " + error.message);
      }
    };

    getCurrentTime();
    fetchWorkerStatus();
    const interval = setInterval(getCurrentTime, 1000); // Update current time every second

    return () => clearInterval(interval);
  }, []);

  const handlePunchIn = async () => {
    try {
      // Update worker status in Firestore to "Punched in"
    } catch (error) {
      setError("Error punching in: " + error.message);
    }
  };

  const handleStartBreak = async () => {
    try {
      // Update worker status in Firestore to "On Break"
    } catch (error) {
      setError("Error starting break: " + error.message);
    }
  };

  const handleStopBreak = async () => {
    try {
      // Update worker status in Firestore to "Punched in"
    } catch (error) {
      setError("Error stopping break: " + error.message);
    }
  };

  const handlePunchOut = async () => {
    try {
      // Update worker status in Firestore to "Punched out"
    } catch (error) {
      setError("Error punching out: " + error.message);
    }
  };

  const handleRequestLeave = async () => {
    // Redirect to the leave request page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="worker-dashboard"
      style={{ backgroundColor: "#0052cc", color: "white" }}
    >
      <h1>Welcome, {userName}!</h1>
      <p>Current Time: {currentTime}</p>
      <p>Status: {status}</p>
      {status === "Punched out" ? (
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            margin: "4px",
            cursor: "pointer",
          }}
          onClick={handlePunchIn}
        >
          Punch In
        </button>
      ) : (
        <>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}
            onClick={handlePunchOut}
          >
            Punch Out
          </button>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}
            onClick={handleStartBreak}
          >
            Start Break
          </button>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              margin: "4px",
              cursor: "pointer",
            }}
            onClick={handleStopBreak}
          >
            Stop Break
          </button>
        </>
      )}
      <button
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "8px 16px",
          margin: "4px",
          cursor: "pointer",
        }}
        onClick={handleRequestLeave}
      >
        Request Leave
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default WorkerDashboard;
