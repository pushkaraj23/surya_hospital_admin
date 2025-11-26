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
//           <h2 className="text-2xl font-semibold flex items-center gap-2">
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


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus,
} from "../../../api/userApi";
import { fetchDepartments } from "../../../api/userApi"; 
import {
  Person,
  LocalHospital,
  CheckCircle,
  Pending,
  Delete,
  Search,
  ToggleOn,
  ToggleOff,
  Add,
  Close,
  Edit,
  RefreshRounded,
  Star,
  StarBorder,
} from "@mui/icons-material";

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const Doctors = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    departmentid: null,
    photo: "",
    bio: "",
    schedule: {},
    isactive: true,
    isexpert: false,
  });
  const [error, setError] = useState("");

  // ✅ Fetch doctors
  const {
    data: doctors = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    retry: 2,
  });

  // ✅ Fetch departments
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    retry: 2,
  });

  // ✅ Add mutation
  const addMutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setError("");
      handleCloseModal();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // ✅ Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setError("");
      handleCloseModal();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // ✅ Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isactive }) => toggleDoctorStatus(id, isactive),
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // ✅ Toggle expert mutation
  const toggleExpertMutation = useMutation({
    mutationFn: async ({ id, isexpert }) => {
      // Get current doctor data to preserve all fields
      const currentDoctors = queryClient.getQueryData(["doctors"]);
      const currentDoctor = currentDoctors?.find(d => d.id === id);
      
      if (!currentDoctor) {
        throw new Error("Doctor not found");
      }

      // Update only the expert status while preserving all other data
      const updateData = {
        fullname: currentDoctor.fullname || "",
        qualification: currentDoctor.qualification || "",
        specialization: currentDoctor.specialization || "",
        experience_years: currentDoctor.experience_years || 0,
        departmentid: currentDoctor.departmentid,
        photo: currentDoctor.photo || "",
        bio: currentDoctor.bio || "",
        schedule: currentDoctor.schedule || {},
        isactive: currentDoctor.isactive,
        isexpert: isexpert
      };

      return await updateDoctor(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Get unique specializations
  const allSpecializations = [
    "all",
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && doctor.isactive) ||
      (filter === "inactive" && !doctor.isactive);

    const matchesSearch =
      doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "all" ||
      doctor.specialization === specializationFilter;

    return matchesFilter && matchesSearch && matchesSpecialization;
  });

  const handleToggleStatus = (doctor) => {
    toggleStatusMutation.mutate({
      id: doctor.id,
      isactive: !doctor.isactive,
    });
  };

  const handleToggleExpert = (doctor) => {
    toggleExpertMutation.mutate({
      id: doctor.id,
      isexpert: !doctor.isexpert,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setFormData({
      fullname: "",
      qualification: "",
      specialization: "",
      experience_years: "",
      departmentid: null,
      photo: "",
      bio: "",
      schedule: {},
      isactive: true,
      isexpert: false,
    });
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    console.log("✏️ Editing doctor:", doctor);
    setEditingDoctor(doctor);
    setFormData({
      fullname: doctor.fullname || "",
      qualification: doctor.qualification || "",
      specialization: doctor.specialization || "",
      experience_years: doctor.experience_years || "",
      departmentid: doctor.departmentid || null,
      photo: doctor.photo || "",
      bio: doctor.bio || "",
      schedule: doctor.schedule || {},
      isactive: doctor.isactive !== undefined ? doctor.isactive : true,
      isexpert: doctor.isexpert !== undefined ? doctor.isexpert : false,
    });
    setIsModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setFormData({
      fullname: "",
      qualification: "",
      specialization: "",
      experience_years: "",
      departmentid: null,
      photo: "",
      bio: "",
      schedule: {},
      isactive: true,
      isexpert: false,
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleScheduleChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.specialization) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");

    const submitData = {
      ...formData,
      experience_years: parseInt(formData.experience_years) || 0,
      departmentid: formData.departmentid ? parseInt(formData.departmentid) : null,
    };

    if (editingDoctor) {
      updateMutation.mutate({
        id: editingDoctor.id,
        data: submitData,
      });
    } else {
      addMutation.mutate(submitData);
    }
  };

  const handleRetry = () => {
    setError("");
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-700 font-primary">
        <div className="border-4 border-t-transparent border-blue-400 rounded-full h-12 w-12 animate-spin mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Loading Doctors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-2 space-y-8 font-primary">
      {/* Header */}
      <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-3 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            🩺 Doctors Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage doctor records, schedules, and details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
          >
            <RefreshRounded fontSize="small" />
            Refresh
          </button>
          <button
            onClick={handleAddDoctor}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300"
          >
            <Add fontSize="small" />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Error Display */}
      {(error || isError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <div>
            <strong>Error: </strong>
            {error || queryError?.message || "Failed to load doctors"}
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-900 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterButton>
          <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
            Active
          </FilterButton>
          <FilterButton active={filter === "inactive"} onClick={() => setFilter("inactive")}>
            Inactive
          </FilterButton>

          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {allSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec === "all" ? "All Specializations" : spec}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Doctors"
          value={doctors.length}
          icon={<LocalHospital className="text-blue-500" />}
          gradient="from-blue-100 to-blue-50"
        />
        <StatsCard
          title="Active Doctors"
          value={doctors.filter((d) => d.isactive).length}
          icon={<ToggleOn className="text-green-500" />}
          gradient="from-green-100 to-green-50"
        />
        <StatsCard
          title="Inactive Doctors"
          value={doctors.filter((d) => !d.isactive).length}
          icon={<ToggleOff className="text-yellow-500" />}
          gradient="from-yellow-100 to-yellow-50"
        />
        <StatsCard
          title="Expert Doctors"
          value={doctors.filter((d) => d.isexpert).length}
          icon={<Star className="text-purple-500" />}
          gradient="from-purple-100 to-purple-50"
        />
      </div>

      {/* Doctor List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          Doctor Directory ({filteredDoctors.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              departments={departments}
              onToggleStatus={handleToggleStatus}
              onToggleExpert={handleToggleExpert}
              onDelete={handleDelete}
              onEdit={handleEditDoctor}
              isToggling={
                toggleStatusMutation.isLoading &&
                toggleStatusMutation.variables?.id === doctor.id
              }
              isExpertToggling={
                toggleExpertMutation.isLoading &&
                toggleExpertMutation.variables?.id === doctor.id
              }
              isDeleting={
                deleteMutation.isLoading && deleteMutation.variables === doctor.id
              }
            />
          ))}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <LocalHospital className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No doctors found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DoctorModal
          formData={formData}
          departments={departments}
          isDepartmentsLoading={isDepartmentsLoading}
          onInputChange={handleInputChange}
          onScheduleChange={handleScheduleChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          isEditing={!!editingDoctor}
          isLoading={addMutation.isLoading || updateMutation.isLoading}
        />
      )}

      {/* Loading Toast */}
      {(addMutation.isLoading ||
        updateMutation.isLoading ||
        deleteMutation.isLoading ||
        toggleStatusMutation.isLoading ||
        toggleExpertMutation.isLoading) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">
            {addMutation.isLoading && "Adding doctor..."}
            {updateMutation.isLoading && "Updating doctor..."}
            {deleteMutation.isLoading && "Deleting doctor..."}
            {toggleStatusMutation.isLoading && "Updating status..."}
            {toggleExpertMutation.isLoading && "Updating expert status..."}
          </span>
        </div>
      )}
    </div>
  );
};

// --- Doctor Modal ---
const DoctorModal = ({
  formData,
  departments,
  isDepartmentsLoading,
  onInputChange,
  onScheduleChange,
  onSubmit,
  onClose,
  isEditing,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center py-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Doctor" : "Add New Doctor"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Close />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification *
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="MBBS, MD"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Cardiology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="10"
                min="0"
              />
            </div>

            {/* ✅ Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="departmentid"
                value={formData.departmentid || ""}
                onChange={onInputChange}
                disabled={isDepartmentsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name || dept.departmentname}
                  </option>
                ))}
              </select>
              {isDepartmentsLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading departments...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Brief bio about the doctor..."
              />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600 capitalize">{day}:</label>
                  <input
                    type="text"
                    value={formData.schedule[day] || ""}
                    onChange={(e) => onScheduleChange(day, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    placeholder="09:00-17:00"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isactive"
                checked={formData.isactive}
                onChange={onInputChange}
                className="rounded focus:ring-blue-400"
                id="isactive"
              />
              <label htmlFor="isactive" className="text-sm text-gray-700">
                Active Doctor
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isexpert"
                checked={formData.isexpert}
                onChange={onInputChange}
                className="rounded focus:ring-purple-400"
                id="isexpert"
              />
              <label htmlFor="isexpert" className="text-sm text-gray-700 flex items-center gap-1">
                <Star className="text-purple-500" fontSize="small" />
                Expert Doctor
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isEditing ? <Edit fontSize="small" /> : <Add fontSize="small" />}
                {isEditing ? "Update Doctor" : "Add Doctor"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Stats Card ---
const StatsCard = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all duration-300`}
    >
      <div>
        <h4 className="text-sm text-gray-500 uppercase tracking-wide">{title}</h4>
        <p className="text-3xl font-semibold mt-1">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
};

// --- Filter Button ---
const FilterButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
        active
          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
};

// --- Doctor Card ---
const DoctorCard = ({ 
  doctor, 
  departments, 
  onToggleStatus, 
  onToggleExpert, 
  onDelete, 
  onEdit, 
  isToggling, 
  isExpertToggling,
  isDeleting 
}) => {
  // Find department name
  const departmentName = departments.find(d => d.id === doctor.departmentid)?.name || 
                        departments.find(d => d.id === doctor.departmentid)?.departmentname || 
                        "Not Assigned";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:bg-gray-100 transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={doctor.fullname}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {doctor.fullname?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">{doctor.fullname}</h4>
                <p className="text-sm text-gray-600">{doctor.qualification}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    doctor.isactive
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {doctor.isactive ? "Active" : "Inactive"}
                </span>
                {doctor.isexpert && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                    <Star fontSize="small" />
                    Expert
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Experience:</strong> {doctor.experience_years} years
          </p>
          <p className="text-sm text-gray-600">
            <strong>Department:</strong> {departmentName}
          </p>
          {doctor.bio && (
            <p className="text-sm text-gray-500 line-clamp-2">{doctor.bio}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onEdit(doctor)}
          disabled={isToggling || isExpertToggling || isDeleting}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-blue-400 text-blue-600 hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
        >
          <Edit fontSize="small" />
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(doctor)}
          disabled={isToggling || isExpertToggling || isDeleting}
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 disabled:opacity-50 ${
            doctor.isactive
              ? "border-yellow-400 text-yellow-600 hover:bg-yellow-100"
              : "border-green-400 text-green-600 hover:bg-green-100"
          }`}
        >
          {isToggling ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : doctor.isactive ? (
            <Pending fontSize="small" />
          ) : (
            <CheckCircle fontSize="small" />
          )}
          {doctor.isactive ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => onToggleExpert(doctor)}
          disabled={isToggling || isExpertToggling || isDeleting}
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 disabled:opacity-50 ${
            doctor.isexpert
              ? "border-gray-400 text-gray-600 hover:bg-gray-100"
              : "border-purple-400 text-purple-600 hover:bg-purple-100"
          }`}
        >
          {isExpertToggling ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : doctor.isexpert ? (
            <StarBorder fontSize="small" />
          ) : (
            <Star fontSize="small" />
          )}
          {doctor.isexpert ? "Remove Expert" : "Make Expert"}
        </button>

        <button
          onClick={() => onDelete(doctor.id)}
          disabled={isToggling || isExpertToggling || isDeleting}
          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-red-400 text-red-600 hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Delete fontSize="small" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};

export default Doctors;