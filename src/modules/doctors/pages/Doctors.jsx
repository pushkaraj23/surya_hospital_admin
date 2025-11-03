import React, { useState, useEffect } from "react";
import DoctorService from "../services/DoctorService";
import { DOCTOR_COLUMNS } from "../../../constants/gridConstants";
import ReusableTable from "../../../components/ReusableTable";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoading(true);
        const data = await DoctorService.fetchDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load doctors");
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // ─── Loading UI ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] font-primary">
        <div className="bg-white/20 backdrop-blur-md rounded-full h-16 w-16 border-4 border-t-transparent border-white animate-spin mb-4"></div>
        <p className="text-lg text-white font-secondary opacity-90 animate-pulse">
          Loading Doctor Data...
        </p>
      </div>
    );
  }

  // ─── Error UI ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 font-primary">
          Error Loading Doctors
        </h2>
        <p className="text-gray-600 mt-2 font-secondary">{error}</p>
      </div>
    );
  }

  // ─── Main Page ────────────────────────────────────────────────
  return (
    <div className="font-primary min-h-screen text-white relative overflow-hidden animate-fadeIn">
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent px-6 py-5 rounded-xl shadow-xl backdrop-blur-md bg-opacity-80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2 drop-shadow-sm">
            🩺 Doctors Management
          </h2>
          <span className="text-sm opacity-90 font-secondary">
            Surya Hospital CMS
          </span>
        </div>

        {/* Info / Description */}
        <div className="text-white/90 font-secondary text-sm px-2">
          Manage and review doctor details, specializations, and active status
          in one place.
        </div>

        {/* Table Section (Glass Card) */}
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-accent drop-shadow-sm">
              Doctor Records
            </h3>
            <button className="bg-secondary hover:bg-accent text-white text-sm px-4 py-2 rounded-lg font-secondary transition-all duration-300 shadow-md hover:shadow-lg">
              + Add Doctor
            </button>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <ReusableTable data={doctors} columns={DOCTOR_COLUMNS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
