// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../../../api/userApi";
// import { Plus, Edit2, Trash2, Save, X, Power, RefreshCw } from "lucide-react";
// import { CalendarToday } from "@mui/icons-material";

// export default function DepartmentManagement() {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     bannerimage: "",
//     isactive: true,
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");

//   // ✅ Fetch departments with retry
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
//     onError: undefined, // Removed deprecated onError
//   });

//   // Set error when query fails
//   React.useEffect(() => {
//     if (isError) {
//       setError(queryError?.message || "Failed to load departments");
//     }
//   }, [isError, queryError]);

//   // ✅ Create Department
//   const createMutation = useMutation({
//     mutationFn: createDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//       resetForm();
//     },
//     onError: (error) => {
//       setError(error.message);
//     }
//   });

//   // ✅ Update Department
//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => {
//       console.log("🔄 Update mutation called with:", { id, payload });
//       return updateDepartment({ id, payload });
//     },
//     onSuccess: (data) => {
//       console.log("✅ Update successful:", data);
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//       resetForm();
//     },
//     onError: (error) => {
//       console.error("❌ Update failed:", error);
//       setError(error.message);
//     }
//   });

//   // ✅ Delete Department
//   const deleteMutation = useMutation({
//     mutationFn: deleteDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     }
//   });

//   // ✅ Toggle Status
//   // ✅ Toggle Status
//   const toggleStatusMutation = useMutation({
//     mutationFn: ({ id, isactive }) => updateDepartment({ id, payload: { isactive } }),

//     // 🚀 Optimistic update before server confirms
//     onMutate: async ({ id, isactive }) => {
//       await queryClient.cancelQueries(["departments"]);

//       const previousData = queryClient.getQueryData(["departments"]);

//       // Optimistically update the department status
//       queryClient.setQueryData(["departments"], oldData =>
//         oldData.map(dept =>
//           dept.id === id ? { ...dept, isactive } : dept
//         )
//       );

//       return { previousData };
//     },

//     onError: (error, variables, context) => {
//       // Roll back on error
//       if (context?.previousData) {
//         queryClient.setQueryData(["departments"], context.previousData);
//       }
//       console.error("❌ Status toggle failed:", error);
//     },

//     onSettled: () => {
//       // Always refetch after mutation (to ensure data consistency)
//       queryClient.invalidateQueries(["departments"]);
//     }
//   });


//   // ✅ Handle Form Submit
//   const handleSubmit = () => {
//     if (!formData.name.trim()) {
//       setError("Name is required");
//       return;
//     }

//     setError("");

//     if (editingId) {
//       console.log("📝 Submitting update for ID:", editingId, "with data:", formData);
//       updateMutation.mutate({
//         id: editingId,
//         payload: {
//           name: formData.name.trim(),
//           description: formData.description.trim(),
//           bannerimage: formData.bannerimage.trim(),
//           isactive: formData.isactive
//         }
//       });
//     } else {
//       console.log("➕ Creating new department:", formData);
//       createMutation.mutate({
//         name: formData.name.trim(),
//         description: formData.description.trim(),
//         bannerimage: formData.bannerimage.trim(),
//         isactive: formData.isactive
//       });
//     }
//   };

//   const resetForm = () => {
//   setFormData({
//     name: "",
//     description: "",
//     bannerimage: "",
//     isactive: true,
//   });
//   setEditingId(null);
// };

//   // ✅ Handle Edit
//   const handleEdit = (dept) => {
//     console.log("✏️ Editing department:", dept);
//     setEditingId(dept.id);
//     setFormData({
//       name: dept.name || "",
//       description: dept.description || "",
//       bannerimage: dept.bannerimage || "",
//       isactive: dept.isactive,
//     });
//     setError("");
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // ✅ Handle Delete
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   // ✅ Toggle Status
//  const handleToggleStatus = (dept) => {
//   toggleStatusMutation.mutate({
//     id: dept.id,
//     isactive: !dept.isactive
//   });
// };


//   // ✅ Retry fetching
//   const handleRetry = () => {
//     setError("");
//     refetch();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading departments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-2 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//               <CalendarToday className="text-amber-600" />
//               Department Management
//             </h1>
//             <p className="text-gray-500 mt-1">View, filter and manage patient Department</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
//               Total: <span className="font-semibold">{departments.length}</span> departments
//             </div>
//             <button
//               onClick={handleRetry}
//               className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <RefreshCw size={16} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
//             <div>
//               <strong>Error: </strong>
//               {error}
//             </div>
//             <button
//               onClick={() => setError("")}
//               className="text-red-700 hover:text-red-900 font-medium text-sm"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}
//       {/* Stats Summary */}
// {departments.length > 0 && (
//   <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//     {/* Total Departments */}
//     <div className="bg-white rounded-lg border border-gray-200 p-4">
//       <div className="text-sm text-gray-600">Total Departments</div>
//       <div className="text-2xl font-bold text-gray-900">
//         {departments.length}
//       </div>
//     </div>

//     {/* Active Departments */}
//     <div className="bg-white rounded-lg border border-gray-200 p-4">
//       <div className="text-sm text-gray-600">Active Departments</div>
//       <div className="text-2xl font-bold text-green-600">
//         {departments.filter(dept => dept.isactive).length}
//       </div>
//     </div>

//     {/* Inactive Departments */}
//     <div className="bg-white rounded-lg border border-gray-200 p-4">
//       <div className="text-sm text-gray-600">Inactive Departments</div>
//       <div className="text-2xl font-bold text-red-600">
//         {departments.filter(dept => !dept.isactive).length}
//       </div>
//     </div>
//   </div>
// )}


//         {/* Form Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">
//               {editingId ? "Edit Department" : "Add New Department"}
//             </h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Department Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter department name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Banner Image URL
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="https://example.com/image.jpg"
//                   value={formData.bannerimage}
//                   onChange={(e) => setFormData({ ...formData, bannerimage: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter department description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>

//               <div className="flex items-center justify-between pt-2">
//                 <label className="flex items-center space-x-3 cursor-pointer">
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={formData.isactive}
//                       onChange={(e) => setFormData({ ...formData, isactive: e.target.checked })}
//                       className="sr-only"
//                     />
//                     <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isactive ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                     <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isactive ? 'transform translate-x-6' : ''
//                       }`}></div>
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     {formData.isactive ? "Active" : "Inactive"}
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//             <div className="text-sm text-gray-500">
//               {editingId ? `Editing department ID: ${editingId}` : "Create a new department"}
//             </div>
//             <div className="flex space-x-3">
//               {editingId && (
//                 <button
//                   onClick={resetForm}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
//                 >
//                   <X size={18} />
//                   <span>Cancel</span>
//                 </button>
//               )}
//               <button
//                 onClick={handleSubmit}
//                 disabled={!formData.name.trim() || createMutation.isLoading || updateMutation.isLoading}
//                 className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition"
//               >
//                 {(createMutation.isLoading || updateMutation.isLoading) ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Processing...</span>
//                   </>
//                 ) : (
//                   <>
//                     {editingId ? <Save size={18} /> : <Plus size={18} />}
//                     <span>{editingId ? "Update Department" : "Add Department"}</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Departments Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">All Departments</h2>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Department
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Array.isArray(departments) && departments.length > 0 ? (
//                   departments.map((dept) => (
//                     <tr key={dept.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {dept.bannerimage ? (
//                             <img
//                               src={dept.bannerimage}
//                               alt={dept.name}
//                               className="w-10 h-10 rounded-lg object-cover mr-3"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                                 e.target.nextSibling.style.display = 'flex';
//                               }}
//                             />
//                           ) : null}
//                           <div
//                             className={`w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 ${dept.bannerimage ? 'hidden' : 'flex'}`}
//                           >
//                             <span className="text-amber-600 font-semibold text-sm">
//                               {dept.name?.charAt(0)?.toUpperCase() || 'D'}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {dept.name}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               ID: {dept.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-600 max-w-xs truncate">
//                           {dept.description || "No description"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${dept.isactive
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                             }`}
//                         >
//                           <Power size={14} className="mr-1" />
//                           {dept.isactive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleEdit(dept)}
//                             disabled={updateMutation.isLoading || deleteMutation.isLoading}
//                             className="text-amber-600 hover:text-amber-900 p-2 rounded-lg hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Edit department"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(dept)}
//                             disabled={toggleStatusMutation.isLoading}
//                             className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title={dept.isactive ? "Deactivate" : "Activate"}
//                           >
//                             {toggleStatusMutation.isLoading && toggleStatusMutation.variables?.id === dept.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                             ) : (
//                               <Power size={18} />
//                             )}
//                           </button>
//                           <button
//                             onClick={() => handleDelete(dept.id)}
//                             disabled={deleteMutation.isLoading}
//                             className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Delete department"
//                           >
//                             {deleteMutation.isLoading && deleteMutation.variables === dept.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                             ) : (
//                               <Trash2 size={18} />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center">
//                       <div className="text-gray-500">
//                         <Plus size={48} className="mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg font-medium">No departments found</p>
//                         <p className="mt-2">Get started by creating your first department</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>



//         {/* Mutation Loading States */}
//         {(createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading || toggleStatusMutation.isLoading) && (
//           <div className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             <span className="text-sm">
//               {createMutation.isLoading && "Creating department..."}
//               {updateMutation.isLoading && "Updating department..."}
//               {deleteMutation.isLoading && "Deleting department..."}
//               {toggleStatusMutation.isLoading && "Updating status..."}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../../../api/userApi";
// import { Plus, Edit2, Trash2, Save, X, Power, RefreshCw } from "lucide-react";
// import { CalendarToday } from "@mui/icons-material";

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
//     experience: ""
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState("");

//   // ✅ Fetch departments with retry
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
//     onError: undefined,
//   });

//   // Set error when query fails
//   React.useEffect(() => {
//     if (isError) {
//       setError(queryError?.message || "Failed to load departments");
//     }
//   }, [isError, queryError]);

//   // ✅ Create Department
//   const createMutation = useMutation({
//     mutationFn: createDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//       resetForm();
//     },
//     onError: (error) => {
//       setError(error.message);
//     }
//   });

//   // ✅ Update Department
//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => {
//       console.log("🔄 Update mutation called with:", { id, payload });
//       return updateDepartment({ id, payload });
//     },
//     onSuccess: (data) => {
//       console.log("✅ Update successful:", data);
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//       resetForm();
//     },
//     onError: (error) => {
//       console.error("❌ Update failed:", error);
//       setError(error.message);
//     }
//   });

//   // ✅ Delete Department
//   const deleteMutation = useMutation({
//     mutationFn: deleteDepartment,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["departments"]);
//       setError("");
//     },
//     onError: (error) => {
//       setError(error.message);
//     }
//   });

//   // ✅ Toggle Status
//   const toggleStatusMutation = useMutation({
//     mutationFn: ({ id, isactive }) => updateDepartment({ id, payload: { isactive } }),
//     onMutate: async ({ id, isactive }) => {
//       await queryClient.cancelQueries(["departments"]);
//       const previousData = queryClient.getQueryData(["departments"]);
//       queryClient.setQueryData(["departments"], oldData =>
//         oldData.map(dept =>
//           dept.id === id ? { ...dept, isactive } : dept
//         )
//       );
//       return { previousData };
//     },
//     onError: (error, variables, context) => {
//       if (context?.previousData) {
//         queryClient.setQueryData(["departments"], context.previousData);
//       }
//       console.error("❌ Status toggle failed:", error);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries(["departments"]);
//     }
//   });

//   // ✅ Convert services string to array
//   const parseServices = (servicesString) => {
//     if (!servicesString.trim()) return null;

//     // Split by new lines or commas and clean up
//     return servicesString
//       .split(/[\n,]/)
//       .map(service => service.trim())
//       .filter(service => service.length > 0);
//   };

//   // ✅ Handle Form Submit
//   const handleSubmit = () => {
//     if (!formData.name.trim()) {
//       setError("Name is required");
//       return;
//     }

//     setError("");

//     // Prepare payload with services as array
//     const payload = {
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       bannerimage: formData.bannerimage.trim(),
//       isactive: formData.isactive,
//       services: parseServices(formData.services),
//       success_rate: formData.success_rate ? parseInt(formData.success_rate) : null,
//       patients: formData.patients ? parseInt(formData.patients) : null,
//       experience: formData.experience ? parseInt(formData.experience) : null
//     };

//     console.log("📤 Sending payload:", payload);

//     if (editingId) {
//       updateMutation.mutate({
//         id: editingId,
//         payload
//       });
//     } else {
//       createMutation.mutate(payload);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       bannerimage: "",
//       isactive: true,
//       services: "",
//       success_rate: "",
//       patients: "",
//       experience: ""
//     });
//     setEditingId(null);
//   };

//   // ✅ Handle Edit - Convert services array back to string for editing
//   const handleEdit = (dept) => {
//     console.log("✏️ Editing department:", dept);
//     setEditingId(dept.id);
//     setFormData({
//       name: dept.name || "",
//       description: dept.description || "",
//       bannerimage: dept.bannerimage || "",
//       isactive: dept.isactive,
//       services: Array.isArray(dept.services) ? dept.services.join('\n') : (dept.services || ""),
//       success_rate: dept.success_rate?.toString() || "",
//       patients: dept.patients?.toString() || "",
//       experience: dept.experience?.toString() || ""
//     });
//     setError("");
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // ✅ Handle Delete
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   // ✅ Toggle Status
//   const handleToggleStatus = (dept) => {
//     toggleStatusMutation.mutate({
//       id: dept.id,
//       isactive: !dept.isactive
//     });
//   };

//   // ✅ Retry fetching
//   const handleRetry = () => {
//     setError("");
//     refetch();
//   };

//   // ✅ Format services for display
//   const formatServicesForDisplay = (services) => {
//     if (!services) return "No services";
//     if (Array.isArray(services)) {
//       return services.join(', ');
//     }
//     return services;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading departments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-2 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//               <CalendarToday className="text-amber-600" />
//               Department Management
//             </h1>
//             <p className="text-gray-500 mt-1">View, filter and manage patient Department</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
//               Total: <span className="font-semibold">{departments.length}</span> departments
//             </div>
//             <button
//               onClick={handleRetry}
//               className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <RefreshCw size={16} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
//             <div>
//               <strong>Error: </strong>
//               {error}
//             </div>
//             <button
//               onClick={() => setError("")}
//               className="text-red-700 hover:text-red-900 font-medium text-sm"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {/* Stats Summary */}
//         {departments.length > 0 && (
//           <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Total Departments */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="text-sm text-gray-600">Total Departments</div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {departments.length}
//               </div>
//             </div>

//             {/* Active Departments */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="text-sm text-gray-600">Active Departments</div>
//               <div className="text-2xl font-bold text-green-600">
//                 {departments.filter(dept => dept.isactive).length}
//               </div>
//             </div>

//             {/* Total Patients */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="text-sm text-gray-600">Total Patients</div>
//               <div className="text-2xl font-bold text-amber-600">
//                 {departments.reduce((sum, dept) => sum + (dept.patients || 0), 0).toLocaleString()}
//               </div>
//             </div>

//             {/* Average Success Rate */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="text-sm text-gray-600">Avg. Success Rate</div>
//               <div className="text-2xl font-bold text-purple-600">
//                 {(() => {
//                   const deptsWithRate = departments.filter(dept => dept.success_rate);
//                   if (deptsWithRate.length === 0) return "0%";
//                   const avg = deptsWithRate.reduce((sum, dept) => sum + dept.success_rate, 0) / deptsWithRate.length;
//                   return `${Math.round(avg)}%`;
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Form Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">
//               {editingId ? "Edit Department" : "Add New Department"}
//             </h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Department Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter department name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Banner Image URL
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="https://example.com/image.jpg"
//                   value={formData.bannerimage}
//                   onChange={(e) => setFormData({ ...formData, bannerimage: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Services Offered *
//                   <span className="text-xs text-gray-500 ml-1">
//                     (Enter one service per line or separate with commas)
//                   </span>
//                 </label>
//                 <textarea
//                   placeholder="Cardiac Surgery&#10;Heart Consultation&#10;ECG Testing&#10;Angioplasty"
//                   value={formData.services}
//                   onChange={(e) => setFormData({ ...formData, services: e.target.value })}
//                   rows={4}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
//                 />
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   placeholder="Enter department description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows={3}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Success Rate (%)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     placeholder="95"
//                     value={formData.success_rate}
//                     onChange={(e) => setFormData({ ...formData, success_rate: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Patients Treated
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="1000"
//                     value={formData.patients}
//                     onChange={(e) => setFormData({ ...formData, patients: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Years of Experience
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   placeholder="15"
//                   value={formData.experience}
//                   onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>

//               <div className="flex items-center justify-between pt-2">
//                 <label className="flex items-center space-x-3 cursor-pointer">
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={formData.isactive}
//                       onChange={(e) => setFormData({ ...formData, isactive: e.target.checked })}
//                       className="sr-only"
//                     />
//                     <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isactive ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                     <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isactive ? 'transform translate-x-6' : ''
//                       }`}></div>
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     {formData.isactive ? "Active" : "Inactive"}
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
//             <div className="text-sm text-gray-500">
//               {editingId ? `Editing department ID: ${editingId}` : "Create a new department"}
//             </div>
//             <div className="flex space-x-3">
//               {editingId && (
//                 <button
//                   onClick={resetForm}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
//                 >
//                   <X size={18} />
//                   <span>Cancel</span>
//                 </button>
//               )}
//               <button
//                 onClick={handleSubmit}
//                 disabled={!formData.name.trim() || !formData.services.trim() || createMutation.isLoading || updateMutation.isLoading}
//                 className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition"
//               >
//                 {(createMutation.isLoading || updateMutation.isLoading) ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Processing...</span>
//                   </>
//                 ) : (
//                   <>
//                     {editingId ? <Save size={18} /> : <Plus size={18} />}
//                     <span>{editingId ? "Update Department" : "Add Department"}</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Departments Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">All Departments</h2>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Department
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Services
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statistics
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Array.isArray(departments) && departments.length > 0 ? (
//                   departments.map((dept) => (
//                     <tr key={dept.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {dept.bannerimage ? (
//                             <img
//                               src={dept.bannerimage}
//                               alt={dept.name}
//                               className="w-10 h-10 rounded-lg object-cover mr-3"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                                 e.target.nextSibling.style.display = 'flex';
//                               }}
//                             />
//                           ) : null}
//                           <div
//                             className={`w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 ${dept.bannerimage ? 'hidden' : 'flex'}`}
//                           >
//                             <span className="text-amber-600 font-semibold text-sm">
//                               {dept.name?.charAt(0)?.toUpperCase() || 'D'}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {dept.name}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               ID: {dept.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-600 max-w-xs">
//                           {dept.description || "No description"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-600 max-w-xs">
//                           {formatServicesForDisplay(dept.services)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1 text-xs">
//                           {dept.success_rate && (
//                             <div className="flex items-center">
//                               <span className="text-gray-600 w-20">Success:</span>
//                               <span className="font-medium text-green-600">{dept.success_rate}%</span>
//                             </div>
//                           )}
//                           {dept.patients && (
//                             <div className="flex items-center">
//                               <span className="text-gray-600 w-20">Patients:</span>
//                               <span className="font-medium text-amber-600">{dept.patients.toLocaleString()}</span>
//                             </div>
//                           )}
//                           {dept.experience && (
//                             <div className="flex items-center">
//                               <span className="text-gray-600 w-20">Experience:</span>
//                               <span className="font-medium text-purple-600">{dept.experience} years</span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${dept.isactive
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                             }`}
//                         >
//                           <Power size={14} className="mr-1" />
//                           {dept.isactive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleEdit(dept)}
//                             disabled={updateMutation.isLoading || deleteMutation.isLoading}
//                             className="text-amber-600 hover:text-amber-900 p-2 rounded-lg hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Edit department"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(dept)}
//                             disabled={toggleStatusMutation.isLoading}
//                             className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title={dept.isactive ? "Deactivate" : "Activate"}
//                           >
//                             {toggleStatusMutation.isLoading && toggleStatusMutation.variables?.id === dept.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                             ) : (
//                               <Power size={18} />
//                             )}
//                           </button>
//                           <button
//                             onClick={() => handleDelete(dept.id)}
//                             disabled={deleteMutation.isLoading}
//                             className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Delete department"
//                           >
//                             {deleteMutation.isLoading && deleteMutation.variables === dept.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                             ) : (
//                               <Trash2 size={18} />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="text-gray-500">
//                         <Plus size={48} className="mx-auto mb-4 text-gray-300" />
//                         <p className="text-lg font-medium">No departments found</p>
//                         <p className="mt-2">Get started by creating your first department</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Mutation Loading States */}
//         {(createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading || toggleStatusMutation.isLoading) && (
//           <div className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             <span className="text-sm">
//               {createMutation.isLoading && "Creating department..."}
//               {updateMutation.isLoading && "Updating department..."}
//               {deleteMutation.isLoading && "Deleting department..."}
//               {toggleStatusMutation.isLoading && "Updating status..."}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api/userApi";
import { Plus, Edit2, Trash2, Save, X, Power, RefreshCw, Eye } from "lucide-react";
import { CalendarToday } from "@mui/icons-material";

export default function DepartmentManagement() {
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bannerimage: "",
    isactive: true,
    services: "",
    success_rate: "",
    patients: "",
    experience: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ✅ Fetch departments with retry
  const {
    data: departments = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    retry: 2,
    onError: undefined,
  });

  // Set error when query fails
  React.useEffect(() => {
    if (isError) {
      setError(queryError?.message || "Failed to load departments");
    }
  }, [isError, queryError]);

  // ✅ Scroll to form when editing starts
  useEffect(() => {
    if (editingId && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [editingId]);

  // ✅ Create Department
  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setError("");
      resetForm();
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // ✅ Update Department
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => {
      console.log("🔄 Update mutation called with:", { id, payload });
      return updateDepartment({ id, payload });
    },
    onSuccess: (data) => {
      console.log("✅ Update successful:", data);
      queryClient.invalidateQueries(["departments"]);
      setError("");
      resetForm();
    },
    onError: (error) => {
      console.error("❌ Update failed:", error);
      setError(error.message);
    }
  });

  // ✅ Delete Department
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setError("");
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // ✅ Toggle Status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isactive }) => updateDepartment({ id, payload: { isactive } }),
    onMutate: async ({ id, isactive }) => {
      await queryClient.cancelQueries(["departments"]);
      const previousData = queryClient.getQueryData(["departments"]);
      queryClient.setQueryData(["departments"], oldData =>
        oldData.map(dept =>
          dept.id === id ? { ...dept, isactive } : dept
        )
      );
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["departments"], context.previousData);
      }
      console.error("❌ Status toggle failed:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["departments"]);
    }
  });

  // ✅ Convert services string to array
  const parseServices = (servicesString) => {
    if (!servicesString.trim()) return null;

    // Split by new lines or commas and clean up
    return servicesString
      .split(/[\n,]/)
      .map(service => service.trim())
      .filter(service => service.length > 0);
  };

  // ✅ Handle Form Submit
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setError("");

    // Prepare payload with services as array
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      bannerimage: formData.bannerimage.trim(),
      isactive: formData.isactive,
      services: parseServices(formData.services),
      success_rate: formData.success_rate ? parseInt(formData.success_rate) : null,
      patients: formData.patients ? parseInt(formData.patients) : null,
      experience: formData.experience ? parseInt(formData.experience) : null
    };

    console.log("📤 Sending payload:", payload);

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        payload
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      bannerimage: "",
      isactive: true,
      services: "",
      success_rate: "",
      patients: "",
      experience: ""
    });
    setEditingId(null);
  };

  // ✅ Handle Edit - Convert services array back to string for editing
  const handleEdit = (dept) => {
    console.log("✏️ Editing department:", dept);

    // Set editing state first
    setEditingId(dept.id);
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
      bannerimage: dept.bannerimage || "",
      isactive: dept.isactive,
      services: Array.isArray(dept.services) ? dept.services.join('\n') : (dept.services || ""),
      success_rate: dept.success_rate?.toString() || "",
      patients: dept.patients?.toString() || "",
      experience: dept.experience?.toString() || ""
    });
    setError("");

    // Scroll to form after a small delay to ensure state is updated
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // ✅ Handle View Details
  const handleViewDetails = (dept) => {
    setSelectedDepartment(dept);
    setShowDetailsModal(true);
  };

  // ✅ Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteMutation.mutate(id);
    }
  };

  // ✅ Toggle Status
  const handleToggleStatus = (dept) => {
    toggleStatusMutation.mutate({
      id: dept.id,
      isactive: !dept.isactive
    });
  };

  // ✅ Retry fetching
  const handleRetry = () => {
    setError("");
    refetch();
  };

  // ✅ Format services for display
  const formatServicesForDisplay = (services) => {
    if (!services) return "No services";
    if (Array.isArray(services)) {
      return services.join(', ');
    }
    return services;
  };

  // ✅ Format services as list for modal
  const formatServicesAsList = (services) => {
    if (!services) return [];
    if (Array.isArray(services)) {
      return services;
    }
    return services.split(',').map(s => s.trim()).filter(s => s);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 min-h-screen">
      <div className="mx-auto">
        <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarToday className="text-amber-600" />
              Department Management
            </h1>
            <p className="text-gray-500 mt-1">View, filter and manage patient Department</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
              Total: <span className="font-semibold">{departments.length}</span> departments
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <div>
              <strong>Error: </strong>
              {error}
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Summary */}
        {departments.length > 0 && (
          <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Departments */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Total Departments</div>
              <div className="text-2xl font-bold text-gray-900">
                {departments.length}
              </div>
            </div>

            {/* Active Departments */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Active Departments</div>
              <div className="text-2xl font-bold text-green-600">
                {departments.filter(dept => dept.isactive).length}
              </div>
            </div>

            {/* Total Patients */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Total Patients</div>
              <div className="text-2xl font-bold text-amber-600">
                {departments.reduce((sum, dept) => sum + (dept.patients || 0), 0).toLocaleString()}
              </div>
            </div>

            {/* Average Success Rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">Avg. Success Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {(() => {
                  const deptsWithRate = departments.filter(dept => dept.success_rate);
                  if (deptsWithRate.length === 0) return "0%";
                  const avg = deptsWithRate.reduce((sum, dept) => sum + dept.success_rate, 0) / deptsWithRate.length;
                  return `${Math.round(avg)}%`;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Form Card - Added ref here */}
        <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? `Edit Department (ID: ${editingId})` : "Add New Department"}
            </h2>
            {editingId && (
              <p className="text-sm text-amber-600 mt-1">
                ✏️ Editing mode active - Scroll down to see the form
              </p>
            )}
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.bannerimage}
                  onChange={(e) => setFormData({ ...formData, bannerimage: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services Offered *
                  <span className="text-xs text-gray-500 ml-1">
                    (Enter one service per line or separate with commas)
                  </span>
                </label>
                <textarea
                  placeholder="Cardiac Surgery&#10;Heart Consultation&#10;ECG Testing&#10;Angioplasty"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter department description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Success Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="95"
                    value={formData.success_rate}
                    onChange={(e) => setFormData({ ...formData, success_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patients Treated
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={formData.patients}
                    onChange={(e) => setFormData({ ...formData, patients: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="15"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isactive}
                      onChange={(e) => setFormData({ ...formData, isactive: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isactive ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isactive ? 'transform translate-x-6' : ''
                      }`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {formData.isactive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {editingId ? `Editing department ID: ${editingId}` : "Create a new department"}
            </div>
            <div className="flex space-x-3">
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  <X size={18} />
                  <span>Cancel Edit</span>
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.services.trim() || createMutation.isLoading || updateMutation.isLoading}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition"
              >
                {(createMutation.isLoading || updateMutation.isLoading) ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {editingId ? <Save size={18} /> : <Plus size={18} />}
                    <span>{editingId ? "Update Department" : "Add Department"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Departments</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(departments) && departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {dept.bannerimage ? (
                            <img
                              src={dept.bannerimage}
                              alt={dept.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 ${dept.bannerimage ? 'hidden' : 'flex'}`}
                          >
                            <span className="text-amber-600 font-semibold text-sm">
                              {dept.name?.charAt(0)?.toUpperCase() || 'D'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dept.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {dept.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {dept.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {formatServicesForDisplay(dept.services)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          {dept.success_rate && (
                            <div className="flex items-center">
                              <span className="text-gray-600 w-20">Success:</span>
                              <span className="font-medium text-green-600">{dept.success_rate}%</span>
                            </div>
                          )}
                          {dept.patients && (
                            <div className="flex items-center">
                              <span className="text-gray-600 w-20">Patients:</span>
                              <span className="font-medium text-amber-600">{dept.patients.toLocaleString()}</span>
                            </div>
                          )}
                          {dept.experience && (
                            <div className="flex items-center">
                              <span className="text-gray-600 w-20">Experience:</span>
                              <span className="font-medium text-purple-600">{dept.experience} years</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${dept.isactive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          <Power size={14} className="mr-1" />
                          {dept.isactive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(dept)}
                            className="text-green-600 hover:text-green-900 p-2 gap-1 rounded-lg flex hover:bg-green-50 transition"
                            title="View details"
                          >
                            <Eye size={18} />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(dept)}
                            disabled={updateMutation.isLoading || deleteMutation.isLoading}
                            className="text-amber-600 hover:text-amber-900 p-2 gap-1 rounded-lg flex hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit department"
                          >
                            <Edit2 size={18} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(dept)}
                            disabled={toggleStatusMutation.isLoading}
                            className="text-orange-600 hover:text-orange-900 p-2 gap-1 rounded-lg flex hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title={dept.isactive ? "Deactivate" : "Activate"}
                          >
                            {toggleStatusMutation.isLoading && toggleStatusMutation.variables?.id === dept.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (

                              <Power size={18} />

                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            disabled={deleteMutation.isLoading}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg gap-1 flex hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete department"
                          >
                            {deleteMutation.isLoading && deleteMutation.variables === dept.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (

                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No departments found</p>
                        <p className="mt-2">Get started by creating your first department</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Details Modal */}
        {showDetailsModal && selectedDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-amber-500 to-purple-600 text-white rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-bold">Department Details</h3>
                  <p className="text-amber-100">Complete information about {selectedDepartment.name}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      {selectedDepartment.bannerimage ? (
                        <img
                          src={selectedDepartment.bannerimage}
                          alt={selectedDepartment.name}
                          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg ${selectedDepartment.bannerimage ? 'hidden' : 'flex'}`}
                      >
                        <span className="text-amber-600 font-bold text-2xl">
                          {selectedDepartment.name?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">{selectedDepartment.name}</h4>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedDepartment.isactive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          <Power size={12} className="mr-1" />
                          {selectedDepartment.isactive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Statistics Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                      <h5 className="font-semibold text-gray-800 mb-3">Department Statistics</h5>
                      <div className="space-y-3">
                        {selectedDepartment.success_rate && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-bold text-green-600">{selectedDepartment.success_rate}%</span>
                          </div>
                        )}
                        {selectedDepartment.patients && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Patients Treated</span>
                            <span className="font-bold text-amber-600">{selectedDepartment.patients.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedDepartment.experience && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Years of Experience</span>
                            <span className="font-bold text-purple-600">{selectedDepartment.experience} years</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="w-2 h-4 bg-amber-500 rounded mr-2"></span>
                        Description
                      </h5>
                      <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                        {selectedDepartment.description || "No description available."}
                      </p>
                    </div>

                    {/* Services */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="w-2 h-4 bg-green-500 rounded mr-2"></span>
                        Services Offered
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {formatServicesAsList(selectedDepartment.services).length > 0 ? (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {formatServicesAsList(selectedDepartment.services).map((service, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                {service}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No services listed.</p>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 rounded-lg p-4">
                        <h6 className="font-semibold text-amber-800 mb-2">Department ID</h6>
                        <p className="text-amber-600 font-mono">{selectedDepartment.id}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h6 className="font-semibold text-green-800 mb-2">Status</h6>
                        <p className={`font-semibold ${selectedDepartment.isactive ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDepartment.isactive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 rounded-b-2xl">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedDepartment);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit Department</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mutation Loading States */}
        {(createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading || toggleStatusMutation.isLoading) && (
          <div className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">
              {createMutation.isLoading && "Creating department..."}
              {updateMutation.isLoading && "Updating department..."}
              {deleteMutation.isLoading && "Deleting department..."}
              {toggleStatusMutation.isLoading && "Updating status..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}