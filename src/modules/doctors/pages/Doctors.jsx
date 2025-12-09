import React from "react";
import { useEffect, useState } from "react";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus,
  toggleDoctorExpert,
  uploadSingleFile,
  fetchDepartments,
} from "../../../api/userApi";
import {
  Add,
  Edit,
  Delete,
  Search,
  LocalHospital,
  Person,
  Star,
  StarBorder,
  ToggleOn,
  ToggleOff,
  Close,
  Refresh,
  Work,
  School,
  Schedule,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BASE_URL } from "../../../api/apiConfig";

const DoctorsComponent = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterDept, setFilterDept] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    qualification: "",
    specialization: "",
    experience_years: 0,
    departmentid: "",
    photo: "",
    bio: "",
    schedule: {},
    isactive: true,
    isexpert: false,
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Add custom styles for Quill and bio content
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .quill-editor-wrapper .ql-container {
        min-height: 180px;
        font-size: 14px;
      }
      .quill-editor-wrapper .ql-editor {
        min-height: 180px;
      }
      .bio-content p {
        margin: 0.25rem 0;
      }
      .bio-content strong {
        font-weight: 600;
        color: #1f2937;
      }
      .bio-content em {
        font-style: italic;
      }
      .bio-content u {
        text-decoration: underline;
      }
      .bio-content s {
        text-decoration: line-through;
      }
      .bio-content ul {
        list-style-type: disc;
        margin-left: 1.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .bio-content ol {
        list-style-type: decimal;
        margin-left: 1.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .bio-content li {
        margin: 0.25rem 0;
      }
      .bio-content blockquote {
        border-left: 3px solid #3b82f6;
        padding-left: 1rem;
        margin-left: 0;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        color: #4b5563;
        font-style: italic;
      }
      .bio-content a {
        color: #3b82f6;
        text-decoration: underline;
      }
      .bio-content a:hover {
        color: #2563eb;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  /* ======================================================
      LOAD DOCTORS + DEPARTMENTS
    ====================================================== */
  const loadData = async () => {
    try {
      setLoading(true);
      const [docs, deps] = await Promise.all([
        getDoctors(),
        fetchDepartments(),
      ]);
      setDoctors(docs);
      setDepartments(deps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================================================
      HANDLE FORM CHANGES
    ====================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* Schedule Handle Change - New Method */
  const handleScheduleChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  /* ======================================================
      ADD NEW DOCTOR
    ====================================================== */
  const handleAdd = () => {
    setSelectedDoctor(null);
    const emptySchedule = {};
    daysOfWeek.forEach((day) => {
      emptySchedule[day] = { start: "", end: "" };
    });

    setFormData({
      fullname: "",
      qualification: "",
      specialization: "",
      experience_years: 0,
      departmentid: "",
      photo: "",
      bio: "",
      schedule: emptySchedule,
      isactive: true,
      isexpert: false,
    });
    setShowModal(true);
  };

  /* ======================================================
      EDIT DOCTOR
    ====================================================== */
  const handleEdit = async (doctor) => {
    const fullDoc = await getDoctorById(doctor.id);

    // Build schedule structure with empty values
    const scheduleStructure = {};
    daysOfWeek.forEach((day) => {
      scheduleStructure[day] = { start: "", end: "" };
    });

    // If schedule exists in DB, convert "09:00-05:00" → {start:"09:00",end:"05:00"}
    if (fullDoc.schedule) {
      Object.entries(fullDoc.schedule).forEach(([day, value]) => {
        if (value && typeof value === "string" && value.includes("-")) {
          const [start, end] = value.split("-");
          scheduleStructure[day] = {
            start: start?.trim() || "",
            end: end?.trim() || "",
          };
        }
      });
    }

    setSelectedDoctor(fullDoc);

    setFormData({
      fullname: fullDoc.fullname,
      qualification: fullDoc.qualification,
      specialization: fullDoc.specialization,
      experience_years: fullDoc.experience_years,
      departmentid: fullDoc.departmentid || "",
      photo: fullDoc.photo || "",
      bio: fullDoc.bio || "",
      schedule: scheduleStructure, // <-- Correct structured schedule
      isactive: fullDoc.isactive,
      isexpert: fullDoc.isexpert,
    });

    setShowModal(true);
  };

  /* ======================================================
      SUBMIT FORM (CREATE / UPDATE)
    ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transform schedule for backend format
    const scheduleForSubmission = {};
    daysOfWeek.forEach((day) => {
      const dayData = formData.schedule[day];
      if (dayData.start && dayData.end) {
        scheduleForSubmission[day] = `${dayData.start}-${dayData.end}`;
      }
    });

    const submissionData = {
      ...formData,
      schedule: scheduleForSubmission,
    };

    try {
      if (selectedDoctor) {
        await updateDoctor(selectedDoctor.id, submissionData);
      } else {
        await createDoctor(submissionData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ======================================================
      DELETE DOCTOR
    ====================================================== */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    await deleteDoctor(id);
    loadData();
  };

  /* ======================================================
      ACTIVE / INACTIVE TOGGLE
    ====================================================== */
  const handleToggleActive = async (doctor) => {
    await toggleDoctorStatus(doctor.id, !doctor.isactive);
    loadData();
  };

  /* ======================================================
      EXPERT TOGGLE
    ====================================================== */
  const handleToggleExpert = async (doctor) => {
    await toggleDoctorExpert(doctor.id, !doctor.isexpert);
    loadData();
  };

  /* ======================================================
      FILTER DOCTORS
    ====================================================== */
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesDept =
      filterDept === "" || Number(doctor.departmentid) === Number(filterDept);
    const matchesSearch =
      doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Get department name
  const getDepartmentName = (departmentId) => {
    const dept = departments.find((d) => d.id === departmentId);
    return dept ? dept.name : "Not Assigned";
  };

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await uploadSingleFile(fd);

      // final image URL
      const imgURL =
        BASE_URL +
        (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);

      setFormData((prev) => ({
        ...prev,
        photo: imgURL,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Check if bio has actual content (not just empty HTML tags)
  const hasValidBio = (bio) => {
    if (!bio) return false;
    const textContent = bio.replace(/<[^>]*>/g, "").trim();
    return textContent.length > 0;
  };

  // Quill modules and formats for bio editor
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <div className="mb-7">
          <div className="rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden bg-gradient-to-br from-primary/10 to-white border border-gray-200">
            {/* Decorative Background Blobs */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* LEFT — Title Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-5 w-1 rounded-full bg-secondary"></div>
                  <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                    Doctors Overview
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-primary flex items-center gap-3">
                  Doctors Management
                </h1>

                <p className="text-primary/60 mt-1 text-sm max-w-xl">
                  Manage doctor profiles, schedules, availability, categories,
                  and more.
                </p>
              </div>

              {/* RIGHT — Action Buttons */}
              <div className="flex items-center gap-4">
                {/* ADD DOCTOR */}
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-br from-accent to-secondary shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  <Add fontSize="small" />
                  Add Doctor
                </button>

                {/* REFRESH */}
                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-primary bg-white/70 backdrop-blur-md border border-gray-300 shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
                >
                  <Refresh fontSize="small" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Total Doctors
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {doctors.length}
                </p>
              </div>
              <Person className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  Active Doctors
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {doctors.filter((d) => d.isactive).length}
                </p>
              </div>
              <ToggleOn className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
                  Expert Doctors
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {doctors.filter((d) => d.isexpert).length}
                </p>
              </div>
              <Star className="text-yellow-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                  Departments
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {departments.length}
                </p>
              </div>
              <LocalHospital className="text-purple-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Department Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
                </label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Cards Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Doctor Directory ({filteredDoctors.length})
                </h3>
              </div>

              {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {doctor.photo ? (
                              <img
                                src={doctor.photo}
                                alt={doctor.fullname}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold ${
                                doctor.photo ? "hidden" : "flex"
                              }`}
                            >
                              {doctor.fullname?.charAt(0)?.toUpperCase() || "D"}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {doctor.fullname}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {doctor.qualification}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doctor.isactive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {doctor.isactive ? "Active" : "Inactive"}
                            </span>
                            {doctor.isexpert && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Expert
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Work className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-700">
                            Specialization:
                          </span>
                          <span className="text-blue-600">
                            {doctor.specialization}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <School className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-700">
                            Experience:
                          </span>
                          <span>{doctor.experience_years} years</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LocalHospital className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-700">
                            Department:
                          </span>
                          <span className="text-purple-600">
                            {getDepartmentName(doctor.departmentid)}
                          </span>
                        </div>

                        {/* Bio Display - Fixed */}
                        {hasValidBio(doctor.bio) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Person className="w-4 h-4 text-indigo-500" />
                              <span className="font-medium text-gray-700">
                                Bio:
                              </span>
                            </div>
                            <div
                              className="text-sm text-gray-600 bio-content line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: doctor.bio }}
                            />
                          </div>
                        )}

                        {/* Schedule Display */}
                        {doctor.schedule &&
                          Object.keys(doctor.schedule).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Schedule className="w-4 h-4 text-orange-500" />
                                <span className="font-medium text-gray-700">
                                  Schedule:
                                </span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                {Object.entries(doctor.schedule).map(
                                  ([day, time]) =>
                                    time && (
                                      <div
                                        key={day}
                                        className="flex justify-between text-xs"
                                      >
                                        <span className="font-medium text-gray-700">
                                          {day}:
                                        </span>
                                        <span className="text-orange-600">
                                          {time}
                                        </span>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Card Footer - Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleExpert(doctor)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              doctor.isexpert
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {doctor.isexpert ? (
                              <Star className="w-4 h-4" />
                            ) : (
                              <StarBorder className="w-4 h-4" />
                            )}
                            {doctor.isexpert ? "Expert" : "Set Expert"}
                          </button>

                          <button
                            onClick={() => handleToggleActive(doctor)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              doctor.isactive
                                ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                            }`}
                          >
                            {doctor.isactive ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() => handleEdit(doctor)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(doctor.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200"
                          >
                            <Delete className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LocalHospital className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900">
                    No doctors found
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {doctors.length === 0
                      ? "Get started by adding your first doctor."
                      : "Try adjusting your search or filter."}
                  </p>
                  {doctors.length === 0 && (
                    <button
                      onClick={handleAdd}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add Your First Doctor
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbarHide">
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Close />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Dr. John Doe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      placeholder="MBBS, MD"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      placeholder="Cardiology"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      placeholder="10"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.experience_years}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="departmentid"
                      value={formData.departmentid}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.photo && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={formData.photo}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, photo: "" }))
                          }
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Editor - Fixed */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <div className="quill-editor-wrapper mb-16">
                    <ReactQuill
                      value={formData.bio}
                      onChange={(content) =>
                        setFormData((prev) => ({ ...prev, bio: content }))
                      }
                      modules={modules}
                      formats={formats}
                      className="bg-white rounded-lg"
                      theme="snow"
                      placeholder="Write a professional bio for the doctor..."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use rich text formatting for professional bio (bold, italic,
                    lists, etc.)
                  </p>
                </div>

                {/* Schedule Editor */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Weekly Schedule
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <span className="w-full sm:w-24 font-medium text-gray-700 text-sm">
                          {day}:
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={formData.schedule[day]?.start || ""}
                            onChange={(e) =>
                              handleScheduleChange(day, "start", e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Start"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="time"
                            value={formData.schedule[day]?.end || ""}
                            onChange={(e) =>
                              handleScheduleChange(day, "end", e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="End"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Set availability times for each day (24-hour format). Leave
                    blank for days off.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isactive"
                      checked={formData.isactive}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active Doctor
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isexpert"
                      checked={formData.isexpert}
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Star className="text-yellow-500 w-4 h-4" />
                      Expert Doctor
                    </span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    {selectedDoctor ? "Update Doctor" : "Add Doctor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsComponent;
