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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-primary mb-4"></div>
        <p className="text-primary font-medium font-secondary text-lg">
          Fetching Doctor Data...
        </p>
      </div>
    );
  }

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

  return (
    <div className="p-6 font-primary space-y-6">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold tracking-wide">
          🩺 Doctors Management
        </h2>
        <span className="text-sm opacity-90 font-secondary">
          Surya Hospital CMS
        </span>
      </div>

      {/* Description */}
      <div className="text-gray-700 font-secondary text-sm mb-2">
        Manage and review doctor details, specializations, and active status in
        one place.
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Doctor Records</h3>
          <button className="bg-secondary hover:bg-accent text-white text-sm px-4 py-2 rounded-lg font-secondary transition-all duration-200">
            + Add Doctor
          </button>
        </div>

        {/* Reusable Table */}
        <div className="overflow-x-auto">
          <ReusableTable data={doctors} columns={DOCTOR_COLUMNS} />
        </div>
      </div>
    </div>
  );
};

export default Doctors;
