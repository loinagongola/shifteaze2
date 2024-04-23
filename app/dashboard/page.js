import React from "react";
import Sidebar from "../../components/sidebar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-cyan-900 to-blue-900">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl mb-8">Welcome to the Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-800 text-2xl mb-4">Dashboard Content</h2>
          <p className="text-gray-700 mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            dignissim justo nec ligula efficitur, sit amet scelerisque quam
            ultrices.
          </p>
          <p className="text-gray-700 mb-2">
            Morbi porta odio vitae arcu consequat aliquam. Sed nec libero
            volutpat, finibus nibh ac, ultricies nisl.
          </p>
          <p className="text-gray-700 mb-2">
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Integer efficitur pharetra metus, sit amet
            consectetur elit pellentesque in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
