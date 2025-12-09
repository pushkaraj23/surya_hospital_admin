import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Delete,
  CalendarToday,
  Person,
  Phone,
  Email,
} from "@mui/icons-material";

import {
  fetchAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getDepartments,
  getDoctors,
} from "../../../api/userApi";

const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // -------------------------------------
  // ✅ LOAD DEPARTMENTS + DOCTORS
  // -------------------------------------
  useEffect(() => {
    const loadDeptAndDoctors = async () => {
      try {
        const deptData = await getDepartments();
        setDepartments(deptData);

        const doctorData = await getDoctors();
        setDoctors(doctorData);

        console.log("Loaded Doctors → ", doctorData);
        console.log("Loaded Departments → ", deptData);
      } catch (error) {
        console.error("Failed to load dept/doctors:", error);
      }
    };

    loadDeptAndDoctors();
  }, []);

  // -------------------------------------
  // ✅ SIMPLIFIED ID AND NAME FUNCTIONS
  // -------------------------------------
  const getId = (obj) => {
    // For doctors: use 'id' field
    if (obj.id !== undefined) return String(obj.id);
    // For departments: use 'id' or 'departmentid'
    if (obj.departmentid !== undefined) return String(obj.departmentid);
    if (obj._id !== undefined) return String(obj._id);
    return "";
  };

  const getName = (obj) => {
    // For doctors: use 'fullname'
    if (obj.fullname) return obj.fullname;
    if (obj.doctorname) return obj.doctorname;
    if (obj.doctorName) return obj.doctorName;
    // For departments
    if (obj.departmentName) return obj.departmentName;
    if (obj.departmentname) return obj.departmentname;
    if (obj.name) return obj.name;
    return "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    if (!departmentId || departmentId === "null") return "Unknown";

    const dept = departments.find((d) => {
      const deptId = getId(d);
      return deptId === String(departmentId);
    });

    console.log("Looking for department:", departmentId, "Found:", dept);
    return dept ? getName(dept) : "Unknown";
  };

  const getDoctorName = (doctorId) => {
    if (!doctorId || doctorId === "null") return "Unknown";

    const doc = doctors.find((d) => {
      const docId = getId(d);
      return docId === String(doctorId);
    });

    console.log("Looking for doctor:", doctorId, "Found:", doc);
    return doc ? getName(doc) : "Unknown";
  };

  // -------------------------------------
  // LOAD APPOINTMENTS
  // -------------------------------------
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointments();

        const transformed = data.map((a) => ({
          id: a.id,
          fullName: a.fullname,
          mobileNumber: a.mobilenumber,
          email: a.email,
          department: String(a.departmentid),
          doctor: String(a.doctorid),
          preferredDate: a.preferreddate?.split("T")[0] || "",
          time: a.preferredtime,
          message: a.message,
          status: a.status?.toLowerCase(),
          createdAt: a.createdat,
        }));

        console.log("Appointments → ", transformed);
        console.log("Doctors available:", doctors);
        console.log("Departments available:", departments);

        setAppointments(transformed);
        setFilteredAppointments(transformed);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // -------------------------------------
  // FILTER APPOINTMENTS
  // -------------------------------------
  useEffect(() => {
    let result = appointments;

    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.mobileNumber.includes(searchTerm) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((a) => a.department === departmentFilter);
    }

    setFilteredAppointments(result);
  }, [searchTerm, statusFilter, departmentFilter, appointments]);

  // -------------------------------------
  // Status Color
  // -------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // -------------------------------------
  // UPDATE STATUS API
  // -------------------------------------
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus.toLowerCase() } : a
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // -------------------------------------
  // DELETE APPOINTMENT
  // -------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  // -------------------------------------
  // EXPORT CSV
  // -------------------------------------
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Mobile",
      "Email",
      "Department",
      "Doctor",
      "Date",
      "Time",
      "Status",
    ];

    const rows = filteredAppointments.map((a) => [
      a.fullName,
      a.mobileNumber,
      a.email,
      getDepartmentName(a.department),
      getDoctorName(a.doctor),
      a.preferredDate,
      a.time,
      a.status,
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((f) => `"${f}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "appointments.csv";
    a.click();
  };

  // -------------------------------------
  // LOADING UI
  // -------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        Loading Appointments...
      </div>
    );
  }

  // -------------------------------------
  // MAIN UI
  // -------------------------------------
  return (
    <div className="min-h-screen">
      <div
        className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
             bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
      >
        {/* Decorative Blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col gap-2">
          {/* Accent Label */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-secondary"></div>
            <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
              Appointment Center
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
            Appointments Management
          </h1>

          {/* Subtitle */}
          <p className="text-primary/60 text-sm max-w-xl leading-relaxed">
            Manage, monitor, and analyze appointments and scheduling activity.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-200 p-4 rounded-xl border shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Departments</option>

          {departments.map((dept) => (
            <option key={getId(dept)} value={getId(dept)}>
              {getName(dept)}
            </option>
          ))}
        </select>

        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download fontSize="small" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left">Patient</th>
              <th className="py-3 px-5 text-left">Contact</th>
              <th className="py-3 px-5 text-left">Department</th>
              <th className="py-3 px-5 text-left">Doctor</th>
              <th className="py-3 px-5 text-left">Date & Time</th>
              <th className="py-3 px-5 text-left">Status</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-5 flex items-center gap-2">
                    <Person className="text-blue-500" />
                    {a.fullName}
                  </td>

                  <td className="py-3 px-5 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone fontSize="small" /> {a.mobileNumber}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Email fontSize="small" /> {a.email}
                    </div>
                  </td>

                  <td className="py-3 px-5">
                    {getDepartmentName(a.department)}
                  </td>

                  <td className="py-3 px-5">{getDoctorName(a.doctor)}</td>

                  <td className="py-3 px-5">
                    {a.preferredDate} <br />
                    <span className="text-sm text-gray-500">{a.time}</span>
                  </td>

                  <td className="py-3 px-5">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusUpdate(a.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        a.status
                      )}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                    >
                      <Delete fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-gray-500 text-sm"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsAdmin;
