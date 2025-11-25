import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Visibility,
  Delete,
  CalendarToday,
  Person,
  LocalHospital,
  Business,
  Phone,
  Email,
} from "@mui/icons-material";
import { fetchAppointments, updateAppointmentStatus, deleteAppointment } from "../../../api/userApi";

const MOCK_DEPARTMENTS = [
  { id: 1, name: "Cardiology" },
  { id: 2, name: "Neurology" },
  { id: 3, name: "Orthopedics" },
];

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. Sarah Johnson", departmentId: 1 },
  { id: 2, name: "Dr. Michael Chen", departmentId: 1 },
  { id: 3, name: "Dr. Emily Rodriguez", departmentId: 2 },
];

const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ✅ Fetch appointments from API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointments();
        
        // Transform API data to match your component structure
        const transformedData = data.map(appointment => ({
          id: appointment.id,
          fullName: appointment.fullname,
          mobileNumber: appointment.mobilenumber,
          email: appointment.email,
          department: appointment.departmentid?.toString() || "1",
          doctor: appointment.doctorid?.toString() || "1",
          preferredDate: new Date(appointment.preferreddate).toISOString().split('T')[0],
          time: appointment.preferredtime,
          message: appointment.message,
          status: appointment.status?.toLowerCase() || "scheduled",
          createdAt: appointment.createdat
        }));
        
        setAppointments(transformedData);
        setFilteredAppointments(transformedData);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        // Fallback to mock data if API fails
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, departmentFilter, appointments]);

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.mobileNumber.includes(searchTerm) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((a) => a.department === departmentFilter);
    }

    setFilteredAppointments(filtered);
  };

  const getDepartmentName = (id) => {
    const dept = MOCK_DEPARTMENTS.find((d) => d.id === parseInt(id));
    return dept ? dept.name : "Unknown";
  };

  const getDoctorName = (id) => {
    const doctor = MOCK_DOCTORS.find((d) => d.id === parseInt(id));
    return doctor ? doctor.name : "Unknown";
  };

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

  // ✅ Update appointment status with API
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status: newStatus.toLowerCase() } : app
        )
      );
      
      console.log("✅ Status updated successfully");
    } catch (error) {
      console.error("❌ Failed to update status:", error);
      alert("Failed to update appointment status");
    }
  };

  // ✅ Delete appointment with API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        
        // Update local state
        setAppointments(prev => prev.filter((a) => a.id !== id));
        
        console.log("✅ Appointment deleted successfully");
      } catch (error) {
        console.error("❌ Failed to delete appointment:", error);
        alert("Failed to delete appointment");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Mobile", "Email", "Department", "Doctor", "Date", "Time", "Status"];
    const csvData = filteredAppointments.map((a) => [
      a.fullName,
      a.mobileNumber,
      a.email,
      getDepartmentName(a.department),
      getDoctorName(a.doctor),
      a.preferredDate,
      a.time,
      a.status,
    ]);

    const csv = [headers, ...csvData]
      .map((r) => r.map((f) => `"${f}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600 font-semibold">
        Loading Appointments...
      </div>
    );
  }

  return (
    <div className="py-2  min-h-screen">
      {/* Header */}
      <div className=" bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-3 rounded-xl shadow-sm mb-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarToday className="text-blue-600" />
          Appointments Management
        </h1>
        <p className="text-gray-500 mt-1">View, filter and manage patient appointments</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-200 p-4 rounded-xl border border-gray-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
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
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="all">All Departments</option>
          {MOCK_DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Download fontSize="small" /> Export CSV
        </button>
      </div>

      {/* Status Quick Actions */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Status Update</h3>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => filteredAppointments.forEach(apt => handleStatusUpdate(apt.id, "confirmed"))}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
          >
            Confirm All
          </button>
          <button 
            onClick={() => filteredAppointments.forEach(apt => handleStatusUpdate(apt.id, "completed"))}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Mark All Completed
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-5 text-left font-semibold">Patient</th>
              <th className="py-3 px-5 text-left font-semibold">Contact</th>
              <th className="py-3 px-5 text-left font-semibold">Department</th>
              <th className="py-3 px-5 text-left font-semibold">Doctor</th>
              <th className="py-3 px-5 text-left font-semibold">Date & Time</th>
              <th className="py-3 px-5 text-left font-semibold">Status</th>
              <th className="py-3 px-5 text-left font-semibold">Actions</th>
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
                    <div className="flex items-center gap-1 text-gray-700">
                      <Phone fontSize="small" /> {a.mobileNumber}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Email fontSize="small" /> {a.email}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-gray-700">{getDepartmentName(a.department)}</td>
                  <td className="py-3 px-5 text-gray-700">{getDoctorName(a.doctor)}</td>
                  <td className="py-3 px-5 text-gray-700">
                    {a.preferredDate} <br />
                    <span className="text-sm text-gray-500">{a.time}</span>
                  </td>
                  <td className="py-3 px-5">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusUpdate(a.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${getStatusColor(a.status)}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-5 flex gap-2">
                    <button
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                      // onClick={() => setSelectedAppointment(a)}
                    >
                      {/* <Visibility fontSize="small" /> */}
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                      onClick={() => handleDelete(a.id)}
                    >
                      <Delete fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
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