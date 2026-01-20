// import React from "react";
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { BASE_URL } from "../../../api/apiConfig";

// import {
//   fetchDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
//   uploadSingleFile,
// } from "../../../api/userApi";

// import { RefreshCw, Plus, AlertCircle } from "lucide-react";
// import DepartmentForm from "./DepartmentForm";
// import DepartmentTable from "./DepartmentTable";

// export default function DepartmentManagement() {
//   const queryClient = useQueryClient();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     bannerimage: "",
//     isactive: true,
//     services: "",
//     success_rate: "",
//     patients: "",
//     experience: "",
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");
//   const [showFormModal, setShowFormModal] = useState(false);

//   // ======= FETCH DEPARTMENTS =======
//   const {
//     data: departments = [],
//     isLoading,
//     isError,
//     error: queryError,
//     refetch,
//   } = useQuery({
//     queryKey: ["departments"],
//     queryFn: fetchDepartments,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (isError) setError(queryError?.message || "Failed to load data");
//   }, [isError, queryError]);

//   // Small helpers for header stats
//   const totalDepartments = departments.length;
//   const activeDepartments = departments.filter((d) => d.isactive).length;
//   const totalPatients = departments.reduce(
//     (sum, d) => sum + (d.patients || 0),
//     0
//   );

//   // ======= CREATE DEPARTMENT =======
//   const createMutation = useMutation({
//     mutationFn: createDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       resetForm();
//       setShowFormModal(false);
//     },
//     onError: (err) => setError(err.message),
//   });

//   // ======= UPDATE =======
//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => updateDepartment({ id, payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       resetForm();
//       setShowFormModal(false);
//     },
//     onError: (err) => setError(err.message),
//   });

//   // ======= DELETE =======
//   const deleteMutation = useMutation({
//     mutationFn: deleteDepartment,
//     onSuccess: () => queryClient.invalidateQueries(["departments"]),
//     onError: (err) => setError(err.message),
//   });

//   // ======= TOGGLE STATUS =======
//   const toggleStatusMutation = useMutation({
//     mutationFn: ({ id, isactive }) =>
//       updateDepartment({ id, payload: { isactive } }),
//     onSuccess: () => queryClient.invalidateQueries(["departments"]),
//     onError: (err) => setError(err.message),
//   });

//   // ======= FILE UPLOAD =======
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const fd = new FormData();
//     fd.append("file", file);

//     const res = await uploadSingleFile(fd);
//     const imgURL =
//       BASE_URL +
//       (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);

//     setFormData((prev) => ({ ...prev, bannerimage: imgURL }));
//   };

//   const handleDescriptionChange = (content) => {
//     setFormData((prev) => ({ ...prev, description: content }));
//   };

//   // ======= SUBMIT =======
//   const parseServices = (s) =>
//     s
//       .split(/[\n,]/)
//       .map((x) => x.trim())
//       .filter((x) => x);

//   const handleSubmit = () => {
//     if (!formData.name.trim()) {
//       setError("Department name is required");
//       return;
//     }

//     setError("");

//     const payload = {
//       ...formData,
//       services: parseServices(formData.services),
//       success_rate: formData.success_rate
//         ? parseInt(formData.success_rate)
//         : null,
//       patients: formData.patients ? parseInt(formData.patients) : null,
//       experience: formData.experience ? parseInt(formData.experience) : null,
//     };

//     if (editingId) {
//       updateMutation.mutate({ id: editingId, payload });
//     } else {
//       createMutation.mutate(payload);
//     }
//   };

//   const handleEdit = (dept) => {
//     setEditingId(dept.id);
//     setFormData({
//       name: dept.name || "",
//       description: dept.description || "",
//       bannerimage: dept.bannerimage || "",
//       isactive: dept.isactive,
//       services: Array.isArray(dept.services)
//         ? dept.services.join("\n")
//         : dept.services || "",
//       success_rate: dept.success_rate?.toString() || "",
//       patients: dept.patients?.toString() || "",
//       experience: dept.experience?.toString() || "",
//     });

//     setShowFormModal(true);
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       description: "",
//       bannerimage: "",
//       isactive: true,
//       services: "",
//       success_rate: "",
//       patients: "",
//       experience: "",
//     });
//   };

//   const isMutating =
//     createMutation.isLoading ||
//     updateMutation.isLoading ||
//     deleteMutation.isLoading ||
//     toggleStatusMutation.isLoading;

//   return (
//     <div className="min-h-screen">
//       <div className=" ">
//         {/* Top Header / Hero */}
//         <div className="mb-7">
//           <div
//             className="rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
//                   bg-gradient-to-br from-primary/10 to-white border border-gray-200"
//           >
//             {/* Decorative Blurred Background Elements */}
//             <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
//             <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

//             <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//               {/* LEFT — Title & Description */}
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="h-5 w-1 rounded-full bg-secondary"></div>
//                   <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
//                     Department Overview
//                   </span>
//                 </div>

//                 <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
//                   Department Management
//                 </h1>

//                 <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
//                   Create, update, and manage all hospital departments
//                   efficiently.
//                 </p>
//               </div>

//               {/* RIGHT — Action Buttons */}
//               <div className="flex items-center gap-4">
//                 {/* Add Department Button */}
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setShowFormModal(true);
//                   }}
//                   className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
//                      bg-gradient-to-br from-accent to-secondary shadow-md 
//                      hover:shadow-lg active:scale-95 transition-all"
//                 >
//                   <Plus size={18} />
//                   Add Department
//                 </button>

//                 {/* Refresh Button */}
//                 <button
//                   onClick={() => refetch()}
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-primary 
//                      bg-white/70 backdrop-blur-md border border-gray-300 shadow-sm 
//                      hover:bg-gray-100 active:scale-95 transition-all"
//                 >
//                   <RefreshCw size={18} className="text-primary/70" />
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-slate-500 uppercase">
//                 Total Departments
//               </p>
//               <p className="mt-1 text-2xl font-bold text-slate-900">
//                 {totalDepartments}
//               </p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
//               <span className="text-blue-500 text-lg font-semibold">D</span>
//             </div>
//           </div>

//           <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-slate-500 uppercase">
//                 Active Departments
//               </p>
//               <p className="mt-1 text-2xl font-bold text-emerald-600">
//                 {activeDepartments}
//               </p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
//               <span className="text-emerald-500 text-lg font-semibold">✔</span>
//             </div>
//           </div>

//           <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium text-slate-500 uppercase">
//                 Total Patients (Reported)
//               </p>
//               <p className="mt-1 text-2xl font-bold text-indigo-600">
//                 {totalPatients.toLocaleString()}
//               </p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
//               <span className="text-indigo-500 text-lg font-semibold">👥</span>
//             </div>
//           </div>
//         </div>

//         {/* Error Banner */}
//         {error && (
//           <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//             <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="font-semibold">Something went wrong</p>
//               <p className="mt-0.5">{error}</p>
//             </div>
//             <button
//               onClick={() => setError("")}
//               className="text-xs font-medium underline hover:text-red-900"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {/* Table */}
//         <div className="bg-white rounded-2xl shadow-sm border mt-5 border-slate-100 overflow-hidden">
//           <DepartmentTable
//             departments={departments}
//             isLoading={isLoading}
//             onEdit={handleEdit}
//             onDelete={(id) => deleteMutation.mutate(id)}
//             onToggleStatus={(dept) =>
//               toggleStatusMutation.mutate({
//                 id: dept.id,
//                 isactive: !dept.isactive,
//               })
//             }
//           />
//         </div>
//       </div>

//       {/* FORM MODAL */}
//       {showFormModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
//           <div className="relative w-full max-w-4xl max-h-[90vh]">
//             <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
//               {/* Modal header */}
//               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
//                 <div>
//                   <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                     {editingId ? "Edit Department" : "Add New Department"}
//                     {editingId && (
//                       <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
//                         Editing
//                       </span>
//                     )}
//                   </h2>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Fill in department details, description, services and
//                     performance metrics.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     resetForm();
//                     setShowFormModal(false);
//                   }}
//                   className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Modal body */}
//               <div className="px-6 py-4 overflow-y-auto">
//                 <DepartmentForm
//                   formData={formData}
//                   setFormData={setFormData}
//                   editingId={editingId}
//                   onSubmit={handleSubmit}
//                   onCancel={() => {
//                     resetForm();
//                     setShowFormModal(false);
//                   }}
//                   handleFileUpload={handleFileUpload}
//                   handleDescriptionChange={handleDescriptionChange}
//                   isSubmitting={
//                     createMutation.isLoading || updateMutation.isLoading
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bottom right mutation indicator */}
//       {isMutating && (
//         <div className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-900 text-white px-4 py-2 text-xs shadow-lg flex items-center gap-2">
//           <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//           <span>Saving changes…</span>
//         </div>
//       )}
//     </div>
//   );
// }


import React from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  uploadSingleFile,
  getFullImageUrl,
  getRelativePath,
} from "../../../api/userApi";

// ✅ Import the helper functions

import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import DepartmentForm from "./DepartmentForm";
import DepartmentTable from "./DepartmentTable";

export default function DepartmentManagement() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bannerimage: "",        // ✅ Relative path for saving
    bannerimagePreview: "", // ✅ Full URL for preview
    isactive: true,
    services: "",
    success_rate: "",
    patients: "",
    experience: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);

  // ======= FETCH DEPARTMENTS =======
  const {
    data: departmentsRaw = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    retry: 2,
  });

  // ✅ Transform departments to have full image URLs for display
  const departments = departmentsRaw.map((dept) => ({
    ...dept,
    bannerimage: getFullImageUrl(dept.bannerimage),
    // Keep original relative path for editing
    originalBannerPath: dept.bannerimage,
  }));

  useEffect(() => {
    if (isError) setError(queryError?.message || "Failed to load data");
  }, [isError, queryError]);

  // Small helpers for header stats
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter((d) => d.isactive).length;
  const totalPatients = departments.reduce(
    (sum, d) => sum + (d.patients || 0),
    0
  );

  // ======= CREATE DEPARTMENT =======
  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      resetForm();
      setShowFormModal(false);
    },
    onError: (err) => setError(err.message),
  });

  // ======= UPDATE =======
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDepartment({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      resetForm();
      setShowFormModal(false);
    },
    onError: (err) => setError(err.message),
  });

  // ======= DELETE =======
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
    onError: (err) => setError(err.message),
  });

  // ======= TOGGLE STATUS =======
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isactive }) =>
      updateDepartment({ id, payload: { isactive } }),
    onSuccess: () => queryClient.invalidateQueries(["departments"]),
    onError: (err) => setError(err.message),
  });

  // ======= FILE UPLOAD =======
  // ✅ Store relative path for API, full URL for preview
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await uploadSingleFile(fd);
      
      // ✅ Store relative path for API
      const relativePath = res.filePath.startsWith("/") 
        ? res.filePath 
        : `/${res.filePath}`;

      setFormData((prev) => ({ 
        ...prev, 
        bannerimage: relativePath,                      // ✅ Relative for saving
        bannerimagePreview: getFullImageUrl(relativePath) // ✅ Full URL for preview
      }));
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload image");
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // ======= SUBMIT =======
  const parseServices = (s) =>
    s
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter((x) => x);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Department name is required");
      return;
    }

    setError("");

    // ✅ Send relative path to API (extract if full URL)
    const relativeImagePath = getRelativePath(formData.bannerimage);

    const payload = {
      name: formData.name,
      description: formData.description,
      bannerimage: relativeImagePath, // ✅ Relative path for API
      isactive: formData.isactive,
      services: parseServices(formData.services),
      success_rate: formData.success_rate
        ? parseInt(formData.success_rate)
        : null,
      patients: formData.patients ? parseInt(formData.patients) : null,
      experience: formData.experience ? parseInt(formData.experience) : null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ✅ Handle edit - properly set up image paths
  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
      // ✅ Use original relative path for saving
      bannerimage: dept.originalBannerPath || getRelativePath(dept.bannerimage) || "",
      // ✅ Use full URL for preview (already transformed in departments array)
      bannerimagePreview: dept.bannerimage || "",
      isactive: dept.isactive,
      services: Array.isArray(dept.services)
        ? dept.services.join("\n")
        : dept.services || "",
      success_rate: dept.success_rate?.toString() || "",
      patients: dept.patients?.toString() || "",
      experience: dept.experience?.toString() || "",
    });

    setShowFormModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      bannerimage: "",
      bannerimagePreview: "",
      isactive: true,
      services: "",
      success_rate: "",
      patients: "",
      experience: "",
    });
  };

  // ✅ Helper to remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      bannerimage: "",
      bannerimagePreview: "",
    }));
  };

  const isMutating =
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading ||
    toggleStatusMutation.isLoading;

  return (
    <div className="min-h-screen">
      <div className=" ">
        {/* Top Header / Hero */}
        <div className="mb-7">
          <div
            className="rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
                  bg-gradient-to-br from-primary/10 to-white border border-gray-200"
          >
            {/* Decorative Blurred Background Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* LEFT — Title & Description */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-5 w-1 rounded-full bg-secondary"></div>
                  <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                    Department Overview
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                  Department Management
                </h1>

                <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
                  Create, update, and manage all hospital departments
                  efficiently.
                </p>
              </div>

              {/* RIGHT — Action Buttons */}
              <div className="flex items-center gap-4">
                {/* Add Department Button */}
                <button
                  onClick={() => {
                    resetForm();
                    setShowFormModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
                     bg-gradient-to-br from-accent to-secondary shadow-md 
                     hover:shadow-lg active:scale-95 transition-all"
                >
                  <Plus size={18} />
                  Add Department
                </button>

                {/* Refresh Button */}
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-primary 
                     bg-white/70 backdrop-blur-md border border-gray-300 shadow-sm 
                     hover:bg-gray-100 active:scale-95 transition-all"
                >
                  <RefreshCw size={18} className="text-primary/70" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">
                Total Departments
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalDepartments}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="text-blue-500 text-lg font-semibold">D</span>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">
                Active Departments
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {activeDepartments}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <span className="text-emerald-500 text-lg font-semibold">✔</span>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">
                Total Patients (Reported)
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">
                {totalPatients.toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <span className="text-indigo-500 text-lg font-semibold">👥</span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mt-4">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-xs font-medium underline hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border mt-5 border-slate-100 overflow-hidden">
          <DepartmentTable
            departments={departments}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onToggleStatus={(dept) =>
              toggleStatusMutation.mutate({
                id: dept.id,
                isactive: !dept.isactive,
              })
            }
          />
        </div>
      </div>

      {/* FORM MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    {editingId ? "Edit Department" : "Add New Department"}
                    {editingId && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        Editing
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in department details, description, services and
                    performance metrics.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowFormModal(false);
                  }}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-4 overflow-y-auto">
                <DepartmentForm
                  formData={formData}
                  setFormData={setFormData}
                  editingId={editingId}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    resetForm();
                    setShowFormModal(false);
                  }}
                  handleFileUpload={handleFileUpload}
                  handleDescriptionChange={handleDescriptionChange}
                  handleRemoveImage={handleRemoveImage} // ✅ Pass remove handler
                  isSubmitting={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom right mutation indicator */}
      {isMutating && (
        <div className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-900 text-white px-4 py-2 text-xs shadow-lg flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Saving changes…</span>
        </div>
      )}
    </div>
  );
}