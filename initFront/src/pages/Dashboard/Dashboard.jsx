import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../component/Header";
import Sidebar from "../../component/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setProfile, userProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--workspace-canvas)]">
      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userProfile={userProfile}
        setProfile={setProfile}
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-5 sm:p-7 lg:p-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
