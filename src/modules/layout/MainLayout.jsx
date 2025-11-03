import React from "react";
import Sidebar from "./Sidebar";
import { AccountCircle } from "@mui/icons-material";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ─── Top Bar ─────────────────────────────── */}
        <header className="flex items-center justify-between bg-primary text-white px-6 py-4 shadow-md">
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide font-primary">
            Surya Hospital Admin Dashboard
          </h1>

          {/* Right Section - Login/User */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-secondary hover:bg-accent text-white px-4 py-2 rounded-lg font-secondary font-medium text-sm transition-all duration-200">
              <AccountCircle fontSize="small" />
              <span>Login</span>
            </button>
          </div>
        </header>

        {/* ─── Main Content ─────────────────────────── */}
        <main className="flex-1 p-5 bg-gradient-to-br from-primary/50 via-primary-dark to-secondary-light overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
