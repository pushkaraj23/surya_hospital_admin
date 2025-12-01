// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getDoctors,
//   addDoctor,
//   updateDoctor,
//   deleteDoctor,
//   toggleDoctorStatus,
// } from "../../../api/userApi";
// import { fetchDepartments } from "../../../api/userApi"; 
// import {
//   Person,
//   LocalHospital,
//   CheckCircle,
//   Pending,
//   Delete,
//   Search,
//   ToggleOn,
//   ToggleOff,
//   Add,
//   Close,
//   Edit,
//   RefreshRounded,
// } from "@mui/icons-material";

// const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// const Doctors = () => {
//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [specializationFilter, setSpecializationFilter] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDoctor, setEditingDoctor] = useState(null);
//   const [formData, setFormData] = useState({
//     fullname: "",
//     qualification: "",
//     specialization: "",
//     experience_years: "",
//     departmentid: null,
//     photo: "",
//     bio: "",
//     schedule: {},
//     isactive: true,
//   });
//   const [error, setError] = useState("");

//   // ✅ Fetch doctors
//   const {
//     data: doctors = [],
//     isLoading,
//     isError,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ["doctors"],
//     queryFn: getDoctors,
//     retry: 2,
//   });

//   // ✅ Fetch departments
//   const {
//     data: departments = [],
//     isLoading: isDepartmentsLoading,
//   } = useQuery({
//     queryKey: ["departments"],
//     queryFn: fetchDepartments,
//     retry: 2,
//   });

//   // ✅ Add mutation
//   const addMutation = useMutation({
//     mutationFn: addDoctor,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//       handleCloseModal();
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Update mutation
//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateDoctor(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//       handleCloseModal();
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: deleteDoctor,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Toggle status mutation
//   const toggleStatusMutation = useMutation({
//     mutationFn: ({ id, isactive }) => toggleDoctorStatus(id, isactive),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // Get unique specializations
//   const allSpecializations = [
//     "all",
//     ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
//   ];

//   // Filter doctors
//   const filteredDoctors = doctors.filter((doctor) => {
//     const matchesFilter =
//       filter === "all" ||
//       (filter === "active" && doctor.isactive) ||
//       (filter === "inactive" && !doctor.isactive);

//     const matchesSearch =
//       doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesSpecialization =
//       specializationFilter === "all" ||
//       doctor.specialization === specializationFilter;

//     return matchesFilter && matchesSearch && matchesSpecialization;
//   });

//   const handleToggleStatus = (doctor) => {
//     toggleStatusMutation.mutate({
//       id: doctor.id,
//       isactive: !doctor.isactive,
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this doctor?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const handleAddDoctor = () => {
//     setEditingDoctor(null);
//     setFormData({
//       fullname: "",
//       qualification: "",
//       specialization: "",
//       experience_years: "",
//       departmentid: null,
//       photo: "",
//       bio: "",
//       schedule: {},
//       isactive: true,
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditDoctor = (doctor) => {
//     console.log("✏️ Editing doctor:", doctor);
//     setEditingDoctor(doctor);
//     setFormData({
//       fullname: doctor.fullname || "",
//       qualification: doctor.qualification || "",
//       specialization: doctor.specialization || "",
//       experience_years: doctor.experience_years || "",
//       departmentid: doctor.departmentid || null,
//       photo: doctor.photo || "",
//       bio: doctor.bio || "",
//       schedule: doctor.schedule || {},
//       isactive: doctor.isactive !== undefined ? doctor.isactive : true,
//     });
//     setIsModalOpen(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingDoctor(null);
//     setFormData({
//       fullname: "",
//       qualification: "",
//       specialization: "",
//       experience_years: "",
//       departmentid: null,
//       photo: "",
//       bio: "",
//       schedule: {},
//       isactive: true,
//     });
//     setError("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleScheduleChange = (day, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         [day]: value,
//       },
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.fullname || !formData.specialization) {
//       setError("Please fill in all required fields");
//       return;
//     }

//     setError("");

//     const submitData = {
//       ...formData,
//       experience_years: parseInt(formData.experience_years) || 0,
//       departmentid: formData.departmentid ? parseInt(formData.departmentid) : null,
//     };

//     if (editingDoctor) {
//       updateMutation.mutate({
//         id: editingDoctor.id,
//         data: submitData,
//       });
//     } else {
//       addMutation.mutate(submitData);
//     }
//   };

//   const handleRetry = () => {
//     setError("");
//     refetch();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[80vh] text-gray-700 font-primary">
//         <div className="border-4 border-t-transparent border-blue-400 rounded-full h-12 w-12 animate-spin mb-4"></div>
//         <p className="text-lg font-medium animate-pulse">Loading Doctors...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 py-2 space-y-8 font-primary">
//       {/* Header */}
//       <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-3 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100">
//         <div>
//           <h2 className="text-2xl font-bold flex items-center gap-2">
//             🩺 Doctors Management
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage doctor records, schedules, and details
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 items-center">
//           <button
//             onClick={handleRetry}
//             className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
//           >
//             <RefreshRounded fontSize="small" />
//             Refresh
//           </button>
//           <button
//             onClick={handleAddDoctor}
//             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
//           >
//             <Add fontSize="small" />
//             Add Doctor
//           </button>
//         </div>
//       </div>

//       {/* Error Display */}
//       {(error || isError) && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
//           <div>
//             <strong>Error: </strong>
//             {error || queryError?.message || "Failed to load doctors"}
//           </div>
//           <button
//             onClick={() => setError("")}
//             className="text-red-700 hover:text-red-900 font-medium text-sm"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
//         <div className="flex flex-wrap gap-2">
//           <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
//             All
//           </FilterButton>
//           <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
//             Active
//           </FilterButton>
//           <FilterButton active={filter === "inactive"} onClick={() => setFilter("inactive")}>
//             Inactive
//           </FilterButton>

//           <select
//             value={specializationFilter}
//             onChange={(e) => setSpecializationFilter(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           >
//             {allSpecializations.map((spec) => (
//               <option key={spec} value={spec}>
//                 {spec === "all" ? "All Specializations" : spec}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Search */}
//         <div className="relative w-full lg:w-80">
//           <Search className="absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, specialization..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Doctors"
//           value={doctors.length}
//           icon={<LocalHospital className="text-blue-500" />}
//           gradient="from-blue-100 to-blue-50"
//         />
//         <StatsCard
//           title="Active Doctors"
//           value={doctors.filter((d) => d.isactive).length}
//           icon={<ToggleOn className="text-green-500" />}
//           gradient="from-green-100 to-green-50"
//         />
//         <StatsCard
//           title="Inactive Doctors"
//           value={doctors.filter((d) => !d.isactive).length}
//           icon={<ToggleOff className="text-yellow-500" />}
//           gradient="from-yellow-100 to-yellow-50"
//         />
//         <StatsCard
//           title="Specializations"
//           value={new Set(doctors.map((d) => d.specialization).filter(Boolean)).size}
//           icon={<Person className="text-purple-500" />}
//           gradient="from-purple-100 to-purple-50"
//         />
//       </div>

//       {/* Doctor List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <h3 className="text-lg font-semibold mb-4 text-blue-600">
//           Doctor Directory ({filteredDoctors.length})
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredDoctors.map((doctor) => (
//             <DoctorCard
//               key={doctor.id}
//               doctor={doctor}
//               departments={departments}
//               onToggleStatus={handleToggleStatus}
//               onDelete={handleDelete}
//               onEdit={handleEditDoctor}
//               isToggling={
//                 toggleStatusMutation.isLoading &&
//                 toggleStatusMutation.variables?.id === doctor.id
//               }
//               isDeleting={
//                 deleteMutation.isLoading && deleteMutation.variables === doctor.id
//               }
//             />
//           ))}

//           {filteredDoctors.length === 0 && (
//             <div className="col-span-full text-center py-8 text-gray-500">
//               <LocalHospital className="text-4xl mx-auto mb-2 opacity-50" />
//               <p>No doctors found.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <DoctorModal
//           formData={formData}
//           departments={departments}
//           isDepartmentsLoading={isDepartmentsLoading}
//           onInputChange={handleInputChange}
//           onScheduleChange={handleScheduleChange}
//           onSubmit={handleSubmit}
//           onClose={handleCloseModal}
//           isEditing={!!editingDoctor}
//           isLoading={addMutation.isLoading || updateMutation.isLoading}
//         />
//       )}

//       {/* Loading Toast */}
//       {(addMutation.isLoading ||
//         updateMutation.isLoading ||
//         deleteMutation.isLoading ||
//         toggleStatusMutation.isLoading) && (
//         <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//           <span className="text-sm">
//             {addMutation.isLoading && "Adding doctor..."}
//             {updateMutation.isLoading && "Updating doctor..."}
//             {deleteMutation.isLoading && "Deleting doctor..."}
//             {toggleStatusMutation.isLoading && "Updating status..."}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Doctor Modal ---
// const DoctorModal = ({
//   formData,
//   departments,
//   isDepartmentsLoading,
//   onInputChange,
//   onScheduleChange,
//   onSubmit,
//   onClose,
//   isEditing,
//   isLoading,
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center py-4 z-50 overflow-y-auto">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl m-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h3 className="text-xl font-semibold text-gray-800">
//             {isEditing ? "Edit Doctor" : "Add New Doctor"}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <Close />
//           </button>
//         </div>

//         {/* Body */}
//         <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="fullname"
//                 value={formData.fullname}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Dr. John Doe"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Qualification *
//               </label>
//               <input
//                 type="text"
//                 name="qualification"
//                 value={formData.qualification}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="MBBS, MD"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Specialization *
//               </label>
//               <input
//                 type="text"
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Cardiology"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Experience (Years)
//               </label>
//               <input
//                 type="number"
//                 name="experience_years"
//                 value={formData.experience_years}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="10"
//                 min="0"
//               />
//             </div>

//             {/* ✅ Department Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <select
//                 name="departmentid"
//                 value={formData.departmentid || ""}
//                 onChange={onInputChange}
//                 disabled={isDepartmentsLoading}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name || dept.departmentname}
//                   </option>
//                 ))}
//               </select>
//               {isDepartmentsLoading && (
//                 <p className="text-xs text-gray-500 mt-1">Loading departments...</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Photo URL
//               </label>
//               <input
//                 type="url"
//                 name="photo"
//                 value={formData.photo}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="https://example.com/photo.jpg"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
//               <textarea
//                 name="bio"
//                 value={formData.bio}
//                 onChange={onInputChange}
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Brief bio about the doctor..."
//               />
//             </div>
//           </div>

//           {/* Schedule */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Schedule (Optional)
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {DAYS_OF_WEEK.map((day) => (
//                 <div key={day} className="flex items-center gap-2">
//                   <label className="w-24 text-sm text-gray-600 capitalize">{day}:</label>
//                   <input
//                     type="text"
//                     value={formData.schedule[day] || ""}
//                     onChange={(e) => onScheduleChange(day, e.target.value)}
//                     className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 focus:outline-none"
//                     placeholder="09:00-17:00"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="isactive"
//               checked={formData.isactive}
//               onChange={onInputChange}
//               className="rounded focus:ring-blue-400"
//               id="isactive"
//             />
//             <label htmlFor="isactive" className="text-sm text-gray-700">
//               Active Doctor
//             </label>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={isLoading}
//             className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 <span>Processing...</span>
//               </>
//             ) : (
//               <>
//                 {isEditing ? <Edit fontSize="small" /> : <Add fontSize="small" />}
//                 {isEditing ? "Update Doctor" : "Add Doctor"}
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Stats Card ---
// const StatsCard = ({ title, value, icon, gradient }) => {
//   return (
//     <div
//       className={`bg-gradient-to-br ${gradient} text-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all duration-300`}
//     >
//       <div>
//         <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
//         <p className="text-3xl font-semibold mt-1">{value}</p>
//       </div>
//       <div>{icon}</div>
//     </div>
//   );
// };

// // --- Filter Button ---
// const FilterButton = ({ active, onClick, children }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
//         active
//           ? "bg-blue-500 text-white border-blue-500 shadow-sm"
//           : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
//       }`}
//     >
//       {children}
//     </button>
//   );
// };

// // --- Doctor Card ---
// const DoctorCard = ({ doctor, departments, onToggleStatus, onDelete, onEdit, isToggling, isDeleting }) => {
//   // Find department name
//   const departmentName = departments.find(d => d.id === doctor.departmentid)?.name || 
//                         departments.find(d => d.id === doctor.departmentid)?.departmentname || 
//                         "Not Assigned";

//   return (
//     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:bg-gray-100 transition-all duration-300">
//       <div className="flex flex-col gap-2">
//         <div className="flex items-start gap-3">
//           {doctor.photo ? (
//             <img
//               src={doctor.photo}
//               alt={doctor.fullname}
//               className="w-16 h-16 rounded-full object-cover"
//               onError={(e) => {
//                 e.target.style.display = "none";
//               }}
//             />
//           ) : (
//             <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
//               <span className="text-blue-600 font-semibold text-xl">
//                 {doctor.fullname?.charAt(0)?.toUpperCase() || "D"}
//               </span>
//             </div>
//           )}
//           <div className="flex-1">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="text-lg font-semibold">{doctor.fullname}</h4>
//                 <p className="text-sm text-gray-600">{doctor.qualification}</p>
//               </div>
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                   doctor.isactive
//                     ? "bg-green-100 text-green-700"
//                     : "bg-yellow-100 text-yellow-700"
//                 }`}
//               >
//                 {doctor.isactive ? "Active" : "Inactive"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <p className="text-sm text-gray-700">
//             <strong>Specialization:</strong> {doctor.specialization}
//           </p>
//           <p className="text-sm text-gray-600">
//             <strong>Experience:</strong> {doctor.experience_years} years
//           </p>
//           <p className="text-sm text-gray-600">
//             <strong>Department:</strong> {departmentName}
//           </p>
//           {doctor.bio && (
//             <p className="text-sm text-gray-500 line-clamp-2">{doctor.bio}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 mt-4">
//         <button
//           onClick={() => onEdit(doctor)}
//           disabled={isToggling || isDeleting}
//           className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-blue-400 text-blue-600 hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
//         >
//           <Edit fontSize="small" />
//           Edit
//         </button>

//         <button
//           onClick={() => onToggleStatus(doctor)}
//           disabled={isToggling || isDeleting}
//           className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 disabled:opacity-50 ${
//             doctor.isactive
//               ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
//               : "border-green-400 text-green-600 hover:bg-green-100"
//           }`}
//         >
//           {isToggling ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//           ) : doctor.isactive ? (
//             <Pending fontSize="small" />
//           ) : (
//             <CheckCircle fontSize="small" />
//           )}
//           {doctor.isactive ? "Deactivate" : "Activate"}
//         </button>

//         <button
//           onClick={() => onDelete(doctor.id)}
//           disabled={isToggling || isDeleting}
//           className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-red-400 text-red-600 hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
//         >
//           {isDeleting ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//           ) : (
//             <Delete fontSize="small" />
//           )}
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Doctors;


// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getDoctors,
//   addDoctor,
//   updateDoctor,
//   deleteDoctor,
//   toggleDoctorStatus,
// } from "../../../api/userApi";
// import { fetchDepartments } from "../../../api/userApi"; 
// import {
//   Person,
//   LocalHospital,
//   CheckCircle,
//   Pending,
//   Delete,
//   Search,
//   ToggleOn,
//   ToggleOff,
//   Add,
//   Close,
//   Edit,
//   RefreshRounded,
//   Star,
//   StarBorder,
// } from "@mui/icons-material";

// const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// const Doctors = () => {
//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [specializationFilter, setSpecializationFilter] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDoctor, setEditingDoctor] = useState(null);
//   const [formData, setFormData] = useState({
//     fullname: "",
//     qualification: "",
//     specialization: "",
//     experience_years: "",
//     departmentid: null,
//     photo: "",
//     bio: "",
//     schedule: {},
//     isactive: true,
//     isexpert: false,
//   });
//   const [error, setError] = useState("");

//   // ✅ Fetch doctors
//   const {
//     data: doctors = [],
//     isLoading,
//     isError,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ["doctors"],
//     queryFn: getDoctors,
//     retry: 2,
//   });

//   // ✅ Fetch departments
//   const {
//     data: departments = [],
//     isLoading: isDepartmentsLoading,
//   } = useQuery({
//     queryKey: ["departments"],
//     queryFn: fetchDepartments,
//     retry: 2,
//   });

//   // ✅ Add mutation
//   const addMutation = useMutation({
//     mutationFn: addDoctor,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//       handleCloseModal();
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Update mutation
//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateDoctor(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//       handleCloseModal();
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: deleteDoctor,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Toggle status mutation
//   const toggleStatusMutation = useMutation({
//     mutationFn: ({ id, isactive }) => toggleDoctorStatus(id, isactive),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // ✅ Toggle expert status mutation
//   const toggleExpertMutation = useMutation({
//     mutationFn: ({ id, isexpert }) => updateDoctor(id, { isexpert }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["doctors"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     },
//   });

//   // Get unique specializations
//   const allSpecializations = [
//     "all",
//     ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
//   ];

//   // Filter doctors
//   const filteredDoctors = doctors.filter((doctor) => {
//     const matchesFilter =
//       filter === "all" ||
//       (filter === "active" && doctor.isactive) ||
//       (filter === "inactive" && !doctor.isactive);

//     const matchesSearch =
//       doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesSpecialization =
//       specializationFilter === "all" ||
//       doctor.specialization === specializationFilter;

//     return matchesFilter && matchesSearch && matchesSpecialization;
//   });

//   const handleToggleStatus = (doctor) => {
//     toggleStatusMutation.mutate({
//       id: doctor.id,
//       isactive: !doctor.isactive,
//     });
//   };

//   const handleToggleExpert = (doctor) => {
//     toggleExpertMutation.mutate({
//       id: doctor.id,
//       isexpert: !doctor.isexpert,
//     });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this doctor?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const handleAddDoctor = () => {
//     setEditingDoctor(null);
//     setFormData({
//       fullname: "",
//       qualification: "",
//       specialization: "",
//       experience_years: "",
//       departmentid: null,
//       photo: "",
//       bio: "",
//       schedule: {},
//       isactive: true,
//       isexpert: false,
//     });
//     setIsModalOpen(true);
//   };

//   const handleEditDoctor = (doctor) => {
//     console.log("✏️ Editing doctor:", doctor);
//     setEditingDoctor(doctor);
//     setFormData({
//       fullname: doctor.fullname || "",
//       qualification: doctor.qualification || "",
//       specialization: doctor.specialization || "",
//       experience_years: doctor.experience_years || "",
//       departmentid: doctor.departmentid || null,
//       photo: doctor.photo || "",
//       bio: doctor.bio || "",
//       schedule: doctor.schedule || {},
//       isactive: doctor.isactive !== undefined ? doctor.isactive : true,
//       isexpert: doctor.isexpert !== undefined ? doctor.isexpert : false,
//     });
//     setIsModalOpen(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingDoctor(null);
//     setFormData({
//       fullname: "",
//       qualification: "",
//       specialization: "",
//       experience_years: "",
//       departmentid: null,
//       photo: "",
//       bio: "",
//       schedule: {},
//       isactive: true,
//       isexpert: false,
//     });
//     setError("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleScheduleChange = (day, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         [day]: value,
//       },
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.fullname || !formData.specialization) {
//       setError("Please fill in all required fields");
//       return;
//     }

//     setError("");

//     const submitData = {
//       ...formData,
//       experience_years: parseInt(formData.experience_years) || 0,
//       departmentid: formData.departmentid ? parseInt(formData.departmentid) : null,
//     };

//     if (editingDoctor) {
//       updateMutation.mutate({
//         id: editingDoctor.id,
//         data: submitData,
//       });
//     } else {
//       addMutation.mutate(submitData);
//     }
//   };

//   const handleRetry = () => {
//     setError("");
//     refetch();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[80vh] text-gray-700 font-primary">
//         <div className="border-4 border-t-transparent border-blue-400 rounded-full h-12 w-12 animate-spin mb-4"></div>
//         <p className="text-lg font-medium animate-pulse">Loading Doctors...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800 py-2 space-y-8 font-primary">
//       {/* Header */}
//       <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-3 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100">
//         <div>
//           <h2 className="text-2xl font-bold flex items-center gap-2">
//             🩺 Doctors Management
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Manage doctor records, schedules, and details
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 items-center">
//           <button
//             onClick={handleRetry}
//             className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
//           >
//             <RefreshRounded fontSize="small" />
//             Refresh
//           </button>
//           <button
//             onClick={handleAddDoctor}
//             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
//           >
//             <Add fontSize="small" />
//             Add Doctor
//           </button>
//         </div>
//       </div>

//       {/* Error Display */}
//       {(error || isError) && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
//           <div>
//             <strong>Error: </strong>
//             {error || queryError?.message || "Failed to load doctors"}
//           </div>
//           <button
//             onClick={() => setError("")}
//             className="text-red-700 hover:text-red-900 font-medium text-sm"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
//         <div className="flex flex-wrap gap-2">
//           <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
//             All
//           </FilterButton>
//           <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
//             Active
//           </FilterButton>
//           <FilterButton active={filter === "inactive"} onClick={() => setFilter("inactive")}>
//             Inactive
//           </FilterButton>

//           <select
//             value={specializationFilter}
//             onChange={(e) => setSpecializationFilter(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           >
//             {allSpecializations.map((spec) => (
//               <option key={spec} value={spec}>
//                 {spec === "all" ? "All Specializations" : spec}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Search */}
//         <div className="relative w-full lg:w-80">
//           <Search className="absolute left-3 top-2.5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, specialization..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Doctors"
//           value={doctors.length}
//           icon={<LocalHospital className="text-blue-500" />}
//           gradient="from-blue-100 to-blue-50"
//         />
//         <StatsCard
//           title="Active Doctors"
//           value={doctors.filter((d) => d.isactive).length}
//           icon={<ToggleOn className="text-green-500" />}
//           gradient="from-green-100 to-green-50"
//         />
//         <StatsCard
//           title="Expert Doctors"
//           value={doctors.filter((d) => d.isexpert).length}
//           icon={<Star className="text-yellow-500" />}
//           gradient="from-yellow-100 to-yellow-50"
//         />
//         <StatsCard
//           title="Specializations"
//           value={new Set(doctors.map((d) => d.specialization).filter(Boolean)).size}
//           icon={<Person className="text-purple-500" />}
//           gradient="from-purple-100 to-purple-50"
//         />
//       </div>

//       {/* Doctor List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <h3 className="text-lg font-semibold mb-4 text-blue-600">
//           Doctor Directory ({filteredDoctors.length})
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredDoctors.map((doctor) => (
//             <DoctorCard
//               key={doctor.id}
//               doctor={doctor}
//               departments={departments}
//               onToggleStatus={handleToggleStatus}
//               onToggleExpert={handleToggleExpert}
//               onDelete={handleDelete}
//               onEdit={handleEditDoctor}
//               isToggling={
//                 toggleStatusMutation.isLoading &&
//                 toggleStatusMutation.variables?.id === doctor.id
//               }
//               isExpertToggling={
//                 toggleExpertMutation.isLoading &&
//                 toggleExpertMutation.variables?.id === doctor.id
//               }
//               isDeleting={
//                 deleteMutation.isLoading && deleteMutation.variables === doctor.id
//               }
//             />
//           ))}

//           {filteredDoctors.length === 0 && (
//             <div className="col-span-full text-center py-8 text-gray-500">
//               <LocalHospital className="text-4xl mx-auto mb-2 opacity-50" />
//               <p>No doctors found.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <DoctorModal
//           formData={formData}
//           departments={departments}
//           isDepartmentsLoading={isDepartmentsLoading}
//           onInputChange={handleInputChange}
//           onScheduleChange={handleScheduleChange}
//           onSubmit={handleSubmit}
//           onClose={handleCloseModal}
//           isEditing={!!editingDoctor}
//           isLoading={addMutation.isLoading || updateMutation.isLoading}
//         />
//       )}

//       {/* Loading Toast */}
//       {(addMutation.isLoading ||
//         updateMutation.isLoading ||
//         deleteMutation.isLoading ||
//         toggleStatusMutation.isLoading ||
//         toggleExpertMutation.isLoading) && (
//         <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//           <span className="text-sm">
//             {addMutation.isLoading && "Adding doctor..."}
//             {updateMutation.isLoading && "Updating doctor..."}
//             {deleteMutation.isLoading && "Deleting doctor..."}
//             {toggleStatusMutation.isLoading && "Updating status..."}
//             {toggleExpertMutation.isLoading && "Updating expert status..."}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Doctor Modal ---
// const DoctorModal = ({
//   formData,
//   departments,
//   isDepartmentsLoading,
//   onInputChange,
//   onScheduleChange,
//   onSubmit,
//   onClose,
//   isEditing,
//   isLoading,
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center py-4 z-50 overflow-y-auto">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl m-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h3 className="text-xl font-semibold text-gray-800">
//             {isEditing ? "Edit Doctor" : "Add New Doctor"}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <Close />
//           </button>
//         </div>

//         {/* Body */}
//         <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="fullname"
//                 value={formData.fullname}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Dr. John Doe"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Qualification *
//               </label>
//               <input
//                 type="text"
//                 name="qualification"
//                 value={formData.qualification}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="MBBS, MD"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Specialization *
//               </label>
//               <input
//                 type="text"
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Cardiology"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Experience (Years)
//               </label>
//               <input
//                 type="number"
//                 name="experience_years"
//                 value={formData.experience_years}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="10"
//                 min="0"
//               />
//             </div>

//             {/* ✅ Department Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <select
//                 name="departmentid"
//                 value={formData.departmentid || ""}
//                 onChange={onInputChange}
//                 disabled={isDepartmentsLoading}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name || dept.departmentname}
//                   </option>
//                 ))}
//               </select>
//               {isDepartmentsLoading && (
//                 <p className="text-xs text-gray-500 mt-1">Loading departments...</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Photo URL
//               </label>
//               <input
//                 type="url"
//                 name="photo"
//                 value={formData.photo}
//                 onChange={onInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="https://example.com/photo.jpg"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
//               <textarea
//                 name="bio"
//                 value={formData.bio}
//                 onChange={onInputChange}
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 placeholder="Brief bio about the doctor..."
//               />
//             </div>
//           </div>

//           {/* Schedule */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Schedule (Optional)
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {DAYS_OF_WEEK.map((day) => (
//                 <div key={day} className="flex items-center gap-2">
//                   <label className="w-24 text-sm text-gray-600 capitalize">{day}:</label>
//                   <input
//                     type="text"
//                     value={formData.schedule[day] || ""}
//                     onChange={(e) => onScheduleChange(day, e.target.value)}
//                     className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 focus:outline-none"
//                     placeholder="09:00-17:00"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="isactive"
//                 checked={formData.isactive}
//                 onChange={onInputChange}
//                 className="rounded focus:ring-blue-400"
//                 id="isactive"
//               />
//               <label htmlFor="isactive" className="text-sm text-gray-700">
//                 Active Doctor
//               </label>
//             </div>

//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="isexpert"
//                 checked={formData.isexpert}
//                 onChange={onInputChange}
//                 className="rounded focus:ring-yellow-400"
//                 id="isexpert"
//               />
//               <label htmlFor="isexpert" className="text-sm text-gray-700 flex items-center gap-1">
//                 <Star className="text-yellow-500" fontSize="small" />
//                 Set as Expert
//               </label>
//             </div>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={isLoading}
//             className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 <span>Processing...</span>
//               </>
//             ) : (
//               <>
//                 {isEditing ? <Edit fontSize="small" /> : <Add fontSize="small" />}
//                 {isEditing ? "Update Doctor" : "Add Doctor"}
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Stats Card ---
// const StatsCard = ({ title, value, icon, gradient }) => {
//   return (
//     <div
//       className={`bg-gradient-to-br ${gradient} text-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all duration-300`}
//     >
//       <div>
//         <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
//         <p className="text-3xl font-semibold mt-1">{value}</p>
//       </div>
//       <div>{icon}</div>
//     </div>
//   );
// };

// // --- Filter Button ---
// const FilterButton = ({ active, onClick, children }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
//         active
//           ? "bg-blue-500 text-white border-blue-500 shadow-sm"
//           : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
//       }`}
//     >
//       {children}
//     </button>
//   );
// };

// // --- Doctor Card ---
// const DoctorCard = ({ 
//   doctor, 
//   departments, 
//   onToggleStatus, 
//   onToggleExpert, 
//   onDelete, 
//   onEdit, 
//   isToggling, 
//   isExpertToggling, 
//   isDeleting 
// }) => {
//   // Find department name
//   const departmentName = departments.find(d => d.id === doctor.departmentid)?.name || 
//                         departments.find(d => d.id === doctor.departmentid)?.departmentname || 
//                         "Not Assigned";

//   return (
//     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:bg-gray-100 transition-all duration-300">
//       <div className="flex flex-col gap-2">
//         <div className="flex items-start gap-3">
//           {doctor.photo ? (
//             <img
//               src={doctor.photo}
//               alt={doctor.fullname}
//               className="w-16 h-16 rounded-full object-cover"
//               onError={(e) => {
//                 e.target.style.display = "none";
//               }}
//             />
//           ) : (
//             <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
//               <span className="text-blue-600 font-semibold text-xl">
//                 {doctor.fullname?.charAt(0)?.toUpperCase() || "D"}
//               </span>
//             </div>
//           )}
//           <div className="flex-1">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="text-lg font-semibold">{doctor.fullname}</h4>
//                 <p className="text-sm text-gray-600">{doctor.qualification}</p>
//               </div>
//               <div className="flex flex-col items-end gap-1">
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     doctor.isactive
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {doctor.isactive ? "Active" : "Inactive"}
//                 </span>
//                 {doctor.isexpert && (
//                   <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
//                     <Star fontSize="small" />
//                     Expert
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-1">
//           <p className="text-sm text-gray-700">
//             <strong>Specialization:</strong> {doctor.specialization}
//           </p>
//           <p className="text-sm text-gray-600">
//             <strong>Experience:</strong> {doctor.experience_years} years
//           </p>
//           <p className="text-sm text-gray-600">
//             <strong>Department:</strong> {departmentName}
//           </p>
//           {doctor.bio && (
//             <p className="text-sm text-gray-500 line-clamp-2">{doctor.bio}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 mt-4">
//         <button
//           onClick={() => onEdit(doctor)}
//           disabled={isToggling || isExpertToggling || isDeleting}
//           className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-blue-400 text-blue-600 hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
//         >
//           <Edit fontSize="small" />
//           Edit
//         </button>

//         <button
//           onClick={() => onToggleExpert(doctor)}
//           disabled={isToggling || isExpertToggling || isDeleting}
//           className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 disabled:opacity-50 ${
//             doctor.isexpert
//               ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
//               : "border-gray-400 text-gray-600 hover:bg-gray-100"
//           }`}
//         >
//           {isExpertToggling ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//           ) : doctor.isexpert ? (
//             <Star fontSize="small" />
//           ) : (
//             <StarBorder fontSize="small" />
//           )}
//           {doctor.isexpert ? "Remove Expert" : "Set Expert"}
//         </button>

//         <button
//           onClick={() => onToggleStatus(doctor)}
//           disabled={isToggling || isExpertToggling || isDeleting}
//           className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 disabled:opacity-50 ${
//             doctor.isactive
//               ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
//               : "border-green-400 text-green-600 hover:bg-green-100"
//           }`}
//         >
//           {isToggling ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//           ) : doctor.isactive ? (
//             <Pending fontSize="small" />
//           ) : (
//             <CheckCircle fontSize="small" />
//           )}
//           {doctor.isactive ? "Deactivate" : "Activate"}
//         </button>

//         <button
//           onClick={() => onDelete(doctor.id)}
//           disabled={isToggling || isExpertToggling || isDeleting}
//           className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-red-400 text-red-600 hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
//         >
//           {isDeleting ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//           ) : (
//             <Delete fontSize="small" />
//           )}
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Doctors;




import { useEffect, useState } from "react";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus,
  toggleDoctorExpert,
  uploadSingleFile
} from "../../../api/userApi";
import { fetchDepartments } from "../../../api/userApi";
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
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Add custom styles for Quill and bio content
  useEffect(() => {
    const style = document.createElement('style');
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
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* Schedule Handle Change - New Method */
  const handleScheduleChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
  };

  /* ======================================================
      ADD NEW DOCTOR
    ====================================================== */
  const handleAdd = () => {
    setSelectedDoctor(null);
    const emptySchedule = {};
    daysOfWeek.forEach(day => {
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
    
    // Initialize schedule structure for form
    const scheduleStructure = {};
    daysOfWeek.forEach(day => {
      scheduleStructure[day] = { start: "", end: "" };
    });
    
    // Merge existing schedule data
    const mergedSchedule = { ...scheduleStructure };
    if (fullDoc.schedule) {
      daysOfWeek.forEach(day => {
        if (fullDoc.schedule[day]) {
          mergedSchedule[day] = { 
            ...scheduleStructure[day], 
            ...fullDoc.schedule[day] 
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
      schedule: mergedSchedule,
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
    daysOfWeek.forEach(day => {
      const dayData = formData.schedule[day];
      if (dayData.start && dayData.end) {
        scheduleForSubmission[day] = `${dayData.start}-${dayData.end}`;
      }
    });
    
    const submissionData = {
      ...formData,
      schedule: scheduleForSubmission
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
  const filteredDoctors = doctors.filter(doctor => {
    const matchesDept = filterDept === "" || Number(doctor.departmentid) === Number(filterDept);
    const matchesSearch = doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Get department name
  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
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

      const BASE_URL = "http://localhost:8654";

      // final image URL
      const imgURL = BASE_URL + (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);

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
    const textContent = bio.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  // Quill modules and formats for bio editor
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'blockquote',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <LocalHospital className="text-blue-600" />
                Doctors Management
              </h1>
              <p className="text-gray-600">Manage doctor records, schedules, and professional details</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <Refresh fontSize="small" />
                Refresh
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Add fontSize="small" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{doctors.length}</p>
              </div>
              <Person className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Active Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {doctors.filter(d => d.isactive).length}
                </p>
              </div>
              <ToggleOn className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Expert Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {doctors.filter(d => d.isexpert).length}
                </p>
              </div>
              <Star className="text-yellow-500 text-2xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{departments.length}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Doctors</label>
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
                    <div key={doctor.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
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
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold ${doctor.photo ? 'hidden' : 'flex'}`}>
                              {doctor.fullname?.charAt(0)?.toUpperCase() || 'D'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{doctor.fullname}</h4>
                              <p className="text-sm text-gray-500">{doctor.qualification}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${doctor.isactive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}>
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
                          <span className="font-medium text-gray-700">Specialization:</span>
                          <span className="text-blue-600">{doctor.specialization}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <School className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-700">Experience:</span>
                          <span>{doctor.experience_years} years</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LocalHospital className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-700">Department:</span>
                          <span className="text-purple-600">{getDepartmentName(doctor.departmentid)}</span>
                        </div>

                        {/* Bio Display - Fixed */}
                        {hasValidBio(doctor.bio) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Person className="w-4 h-4 text-indigo-500" />
                              <span className="font-medium text-gray-700">Bio:</span>
                            </div>
                            <div 
                              className="text-sm text-gray-600 bio-content line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: doctor.bio }} 
                            />
                          </div>
                        )}

                        {/* Schedule Display */}
                        {doctor.schedule && Object.keys(doctor.schedule).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Schedule className="w-4 h-4 text-orange-500" />
                              <span className="font-medium text-gray-700">Schedule:</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                              {Object.entries(doctor.schedule).map(([day, time]) => (
                                time && (
                                  <div key={day} className="flex justify-between text-xs">
                                    <span className="font-medium text-gray-700">{day}:</span>
                                    <span className="text-orange-600">
                                      {time}
                                    </span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer - Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleExpert(doctor)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${doctor.isexpert
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                              }`}
                          >
                            {doctor.isexpert ? <Star className="w-4 h-4" /> : <StarBorder className="w-4 h-4" />}
                            {doctor.isexpert ? "Expert" : "Set Expert"}
                          </button>

                          <button
                            onClick={() => handleToggleActive(doctor)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${doctor.isactive
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
                  <h3 className="text-sm font-medium text-gray-900">No doctors found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {doctors.length === 0 ? "Get started by adding your first doctor." : "Try adjusting your search or filter."}
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
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
                          onClick={() => setFormData(prev => ({ ...prev, photo: "" }))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                  <div className="quill-editor-wrapper mb-16">
                    <ReactQuill 
                      value={formData.bio} 
                      onChange={(content) => setFormData(prev => ({ ...prev, bio: content }))}
                      modules={modules}
                      formats={formats}
                      className="bg-white rounded-lg"
                      theme="snow"
                      placeholder="Write a professional bio for the doctor..."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Use rich text formatting for professional bio (bold, italic, lists, etc.)</p>
                </div>

                {/* Schedule Editor */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Weekly Schedule</label>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <span className="w-full sm:w-24 font-medium text-gray-700 text-sm">{day}:</span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={formData.schedule[day]?.start || ''}
                            onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Start"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="time"
                            value={formData.schedule[day]?.end || ''}
                            onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="End"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Set availability times for each day (24-hour format). Leave blank for days off.</p>
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
                    <span className="text-sm font-medium text-gray-700">Active Doctor</span>
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