import React from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col justify-between">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-12 mt-4">ShiftEaze</h1>
        <ul className="flex-col justify-around ">
          <li className="mb-8">
            <Link href="/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/app/dashboard/add-workers.js"
              className="hover:text-blue-500"
            >
              Add Workers
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/dashboard/edit-workers"
              className="hover:text-blue-500"
            >
              Edit Workers
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/dashboard/adjust-hours"
              className="hover:text-blue-500"
            >
              Adjust Hours
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/dashboard/workers-dashboard"
              className="hover:text-blue-500"
            >
              Workers Dashboard
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/dashboard/request-leave"
              className="hover:text-blue-500"
            >
              Request Leave
            </Link>
          </li>
          <li className="mb-8">
            <Link
              href="/dashboard/work-history"
              className="hover:text-blue-500"
            >
              Work History
            </Link>
          </li>
          <li className="mb-8">
            <Link href="/dashboard/punch-in" className="hover:text-blue-500">
              Punch In
            </Link>
          </li>
          <li className="mb-8">
            <Link href="/dashboard/punch-out" className="hover:text-blue-500">
              Punch Out
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <p className="text-center text-sm">
          &copy; 2024 ShiftEaze. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
