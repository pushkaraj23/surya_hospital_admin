// import React, { useState, useEffect } from "react";
// import {
//   getFacilities,
//   getFacilityById,
//   getFacilitiesByDept,
//   createFacility,
//   updateFacility,
//   deleteFacility,
//   toggleFacilityStatus,
//   getDepartments,
//   uploadSingleFile,
// } from "../../../api/userApi";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { BASE_URL } from "../../../api/apiConfig";

// export default function FacilitiesFullComponent() {
//   const [facilities, setFacilities] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDept, setSelectedDept] = useState("all");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [formLoading, setFormLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     description: "",
//     photos: [],
//     isactive: true,
//     departmentid: "",
//   });

//   // Quill modules and formats configuration
//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       ["blockquote", "code-block"],
//       [{ color: [] }, { background: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "code-block",
//     "color",
//     "background",
//     "list",
//     "bullet",
//     "align",
//     "link",
//   ];

//   // Add custom styles for Quill editor and facility content rendering
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.id = "quill-facility-styles";
//     style.textContent = `
//       /* Quill Editor Styles for Facilities */
//       .facility-editor-wrapper {
//         margin-bottom: 1rem;
//       }

//       .facility-editor-wrapper .ql-container {
//         min-height: 180px;
//         max-height: 300px;
//         overflow-y: auto;
//         font-size: 14px;
//         font-family: inherit;
//         background: white;
//       }

//       .facility-editor-wrapper .ql-editor {
//         min-height: 180px;
//         line-height: 1.6;
//         padding: 12px;
//       }

//       .facility-editor-wrapper .ql-editor.ql-blank::before {
//         font-style: normal;
//         color: #9ca3af;
//         left: 12px;
//       }

//       .facility-editor-wrapper .ql-toolbar {
//         background: #f9fafb;
//         border-top-left-radius: 0.5rem;
//         border-top-right-radius: 0.5rem;
//         border-color: #d1d5db;
//       }

//       .facility-editor-wrapper .ql-container {
//         border-bottom-left-radius: 0.5rem;
//         border-bottom-right-radius: 0.5rem;
//         border-color: #d1d5db;
//       }

//       /* Facility Content Display Styles */
//       .facility-content {
//         line-height: 1.6;
//         word-wrap: break-word;
//         color: #4b5563;
//       }

//       .facility-content p {
//         margin: 0.5rem 0;
//       }

//       .facility-content p:first-child {
//         margin-top: 0;
//       }

//       .facility-content p:last-child {
//         margin-bottom: 0;
//       }

//       .facility-content h1,
//       .facility-content h2,
//       .facility-content h3 {
//         font-weight: 600;
//         line-height: 1.3;
//         margin-top: 1rem;
//         margin-bottom: 0.5rem;
//         color: #111827;
//       }

//       .facility-content h1 {
//         font-size: 1.5rem;
//       }

//       .facility-content h2 {
//         font-size: 1.25rem;
//       }

//       .facility-content h3 {
//         font-size: 1.1rem;
//       }

//       .facility-content strong {
//         font-weight: 600;
//         color: #1f2937;
//       }

//       .facility-content em {
//         font-style: italic;
//       }

//       .facility-content u {
//         text-decoration: underline;
//       }

//       .facility-content s {
//         text-decoration: line-through;
//         opacity: 0.6;
//       }

//       .facility-content ul {
//         list-style-type: disc;
//         padding-left: 1.5rem;
//         margin: 0.5rem 0;
//       }

//       .facility-content ol {
//         list-style-type: decimal;
//         padding-left: 1.5rem;
//         margin: 0.5rem 0;
//       }

//       .facility-content li {
//         margin: 0.25rem 0;
//         line-height: 1.6;
//       }

//       .facility-content blockquote {
//         border-left: 4px solid #3b82f6;
//         padding-left: 1rem;
//         margin: 1rem 0;
//         background-color: #eff6ff;
//         padding: 0.75rem 1rem;
//         border-radius: 0.25rem;
//         font-style: italic;
//         color: #1e40af;
//       }

//       .facility-content pre {
//         background-color: #1f2937;
//         color: #f9fafb;
//         padding: 1rem;
//         border-radius: 0.5rem;
//         overflow-x: auto;
//         margin: 0.5rem 0;
//         font-family: 'Courier New', monospace;
//         font-size: 0.875rem;
//       }

//       .facility-content code {
//         background-color: #fef3c7;
//         color: #92400e;
//         padding: 0.125rem 0.25rem;
//         border-radius: 0.25rem;
//         font-size: 0.875em;
//         font-family: 'Courier New', monospace;
//       }

//       .facility-content pre code {
//         background-color: transparent;
//         color: inherit;
//         padding: 0;
//       }

//       .facility-content a {
//         color: #3b82f6;
//         text-decoration: underline;
//         transition: color 0.2s;
//       }

//       .facility-content a:hover {
//         color: #2563eb;
//       }

//       .facility-content .ql-align-center {
//         text-align: center;
//       }

//       .facility-content .ql-align-right {
//         text-align: right;
//       }

//       .facility-content .ql-align-justify {
//         text-align: justify;
//       }

//       /* Preview styles for card display */
//       .facility-preview {
//         overflow: hidden;
//         display: -webkit-box;
//         -webkit-line-clamp: 3;
//         -webkit-box-orient: vertical;
//       }

//       .facility-preview * {
//         margin: 0;
//         padding: 0;
//         font-size: 0.875rem !important;
//         line-height: 1.4 !important;
//       }
//     `;

//     const existingStyle = document.getElementById("quill-facility-styles");
//     if (existingStyle) {
//       document.head.removeChild(existingStyle);
//     }

//     document.head.appendChild(style);

//     return () => {
//       const styleToRemove = document.getElementById("quill-facility-styles");
//       if (styleToRemove && document.head.contains(styleToRemove)) {
//         document.head.removeChild(styleToRemove);
//       }
//     };
//   }, []);

//   // ===============================
//   // Load Departments
//   // ===============================
//   const loadDepartments = async () => {
//     try {
//       const data = await getDepartments();
//       setDepartments(data);
//     } catch (error) {
//       console.error("Department load error:", error);
//     }
//   };

//   // ===============================
//   // Load Facilities
//   // ===============================
//   const loadFacilities = async () => {
//     try {
//       setLoading(true);
//       if (selectedDept === "all") {
//         const data = await getFacilities();
//         setFacilities(data);
//       } else {
//         const data = await getFacilitiesByDept(selectedDept);
//         setFacilities(data);
//       }
//     } catch (error) {
//       console.error("Load facilities error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   useEffect(() => {
//     loadFacilities();
//   }, [selectedDept]);

//   // ===============================
//   // Helper Functions
//   // ===============================
//   // Check if description has actual content
//   const hasValidDescription = (description) => {
//     if (!description) return false;
//     const textContent = description.replace(/<[^>]*>/g, "").trim();
//     return textContent.length > 0;
//   };

//   // Strip HTML tags for preview
//   const stripHtml = (html) => {
//     const tmp = document.createElement("DIV");
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || "";
//   };

//   // ===============================
//   // Open Modal (Add / Edit)
//   // ===============================
//   const openModal = (item = null) => {
//     if (item) {
//       setEditId(item.id);
//       setFormData({
//         name: item.name,
//         category: item.category,
//         description: item.description || "",
//         photos: Array.isArray(item.photos) ? item.photos.flat() : [],
//         isactive: item.isactive,
//         departmentid: item.departmentid || "",
//       });
//     } else {
//       setEditId(null);
//       setFormData({
//         name: "",
//         category: "",
//         description: "",
//         photos: [],
//         isactive: true,
//         departmentid: "",
//       });
//     }
//     setModalOpen(true);
//   };

//   // ===============================
//   // Form Change
//   // ===============================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle rich text editor change
//   const handleDescriptionChange = (content) => {
//     setFormData((prev) => ({ ...prev, description: content }));
//   };

//   // ===============================
//   // Submit (Create / Update)
//   // ===============================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.departmentid) {
//       alert("Please select a department!");
//       return;
//     }

//     try {
//       setFormLoading(true);

//       if (editId) {
//         await updateFacility(editId, formData);
//       } else {
//         await createFacility({
//           ...formData,
//           createdat: new Date().toISOString(),
//         });
//       }

//       setModalOpen(false);
//       loadFacilities();
//     } catch (error) {
//       console.error("Submit error:", error);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ===============================
//   // Delete
//   // ===============================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this facility?"))
//       return;
//     try {
//       await deleteFacility(id);
//       loadFacilities();
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   // ===============================
//   // Toggle Status
//   // ===============================
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       await toggleFacilityStatus(id, !currentStatus);
//       loadFacilities();
//     } catch (error) {
//       console.error("Status toggle error:", error);
//     }
//   };

//   // ===============================
//   // Get Department Name
//   // ===============================
//   const getDepartmentName = (departmentId) => {
//     if (!departmentId) return "No Department";
//     const dept = departments.find((d) => d.id === departmentId);
//     return dept ? dept.name : "Unknown Department";
//   };

//   // Handle multiple file uploads
//   const handleMultipleFileUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     try {
//       setFormLoading(true);
//       const uploadedUrls = [];

//       for (const file of files) {
//         const fd = new FormData();
//         fd.append("file", file);
//         const res = await uploadSingleFile(fd);
//         const imgURL =
//           BASE_URL +
//           (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);
//         uploadedUrls.push(imgURL);
//       }

//       // Add to existing photos
//       setFormData((prev) => ({
//         ...prev,
//         photos: [...prev.photos, ...uploadedUrls],
//       }));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload one or more images.");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ===============================
//   // UI STARTS
//   // ===============================
//   return (
//     <div className="min-h-screen">
//       <div className="">
//         {/* Header */}
//         <div
//           className="mb-7 rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
//              bg-gradient-to-br from-primary/10 to-white border border-gray-200"
//         >
//           {/* Decorative Blobs */}
//           <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>

//           <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             {/* LEFT — Title + Description */}
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="h-5 w-1 rounded-full bg-secondary"></div>
//                 <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
//                   Infrastructure & Operations
//                 </span>
//               </div>

//               <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
//                 Facilities Management
//               </h2>

//               <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
//                 Manage all hospital facilities, infrastructure sections, and
//                 related onboarding details.
//               </p>
//             </div>

//             {/* RIGHT — Add Button */}
//             <button
//               onClick={() => openModal()}
//               className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
//                  bg-gradient-to-br from-accent to-secondary shadow-md 
//                  hover:shadow-lg active:scale-95 transition-all"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Add Facility
//             </button>
//           </div>
//         </div>

//         {/* Department Filter */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
//               Filter by Department:
//             </label>
//             <select
//               value={selectedDept}
//               onChange={(e) => setSelectedDept(e.target.value)}
//               className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
//             >
//               <option value="all">All Departments</option>
//               {departments.map((d) => (
//                 <option key={d.id} value={d.id}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Facilities Cards */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           {/* Loading State */}
//           {loading ? (
//             <div className="flex justify-center items-center py-16">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <div>
//               {/* Cards Grid */}
//               {facilities.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {facilities.map((item) => (
//                     <div
//                       key={item.id}
//                       className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
//                     >
//                       {/* Header with Status */}
//                       <div className="p-4 border-b border-gray-100">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-gray-900 text-lg truncate">
//                             {item.name}
//                           </h3>
//                           <span
//                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                               item.isactive
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {item.isactive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {item.category}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             ID: {item.id}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="p-4">
//                         {/* Department */}
//                         <div className="flex items-center text-sm text-gray-600 mb-3">
//                           <svg
//                             className="w-4 h-4 mr-2 text-purple-500"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                             />
//                           </svg>
//                           {getDepartmentName(item.departmentid)}
//                         </div>

//                         {/* Description with HTML content */}
//                         {hasValidDescription(item.description) ? (
//                           <div className="text-sm text-gray-600 mb-4 facility-preview facility-content">
//                             <div
//                               dangerouslySetInnerHTML={{
//                                 __html: item.description,
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 mb-4 italic">
//                             No description available
//                           </p>
//                         )}

//                         {/* Photos */}
//                         <div className="mb-4">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
//                             Photos
//                           </label>
//                           <div className="flex gap-2 flex-wrap">
//                             {(item.photos?.flat() || [])
//                               .slice(0, 4)
//                               .map((photo, idx) => (
//                                 <img
//                                   key={idx}
//                                   src={photo}
//                                   className="w-12 h-12 rounded-lg object-cover border border-gray-200"
//                                   alt={`Facility ${idx + 1}`}
//                                   onError={(e) => {
//                                     e.target.style.display = "none";
//                                   }}
//                                 />
//                               ))}
//                             {(item.photos?.flat() || []).length === 0 && (
//                               <span className="text-xs text-gray-400 italic">
//                                 No photos
//                               </span>
//                             )}
//                             {(item.photos?.flat() || []).length > 4 && (
//                               <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
//                                 +{(item.photos?.flat() || []).length - 4}
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Created Date */}
//                         <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
//                           Created:{" "}
//                           {new Date(item.createdat).toLocaleDateString()}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
//                         {/* Activate/Deactivate Button */}
//                         <button
//                           onClick={() =>
//                             handleToggleStatus(item.id, item.isactive)
//                           }
//                           className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
//                             item.isactive
//                               ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
//                               : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
//                           }`}
//                         >
//                           <svg
//                             className={`w-4 h-4 mr-1 ${
//                               item.isactive ? "text-red-600" : "text-green-600"
//                             }`}
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             {item.isactive ? (
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             ) : (
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             )}
//                           </svg>
//                           {item.isactive ? "Deactivate" : "Activate"}
//                         </button>

//                         {/* Edit Button */}
//                         <button
//                           onClick={() => openModal(item)}
//                           className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           <svg
//                             className="w-4 h-4 mr-1"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                             />
//                           </svg>
//                           Edit
//                         </button>

//                         {/* Delete Button */}
//                         <button
//                           onClick={() => handleDelete(item.id)}
//                           className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
//                         >
//                           <svg
//                             className="w-4 h-4 mr-1"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 /* Empty State */
//                 <div className="text-center py-12">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="1"
//                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                     />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">
//                     No facilities found
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Get started by creating a new facility.
//                   </p>
//                   <button
//                     onClick={() => openModal()}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//                   >
//                     Add Your First Facility
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Modal */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
//             <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editId ? "Edit Facility" : "Add New Facility"}
//                 </h3>
//                 <button
//                   onClick={() => setModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <form
//                 onSubmit={handleSubmit}
//                 className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
//               >
//                 <div className="grid grid-cols-1 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Department *
//                     </label>
//                     <select
//                       name="departmentid"
//                       value={formData.departmentid}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((d) => (
//                         <option key={d.id} value={d.id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Facility Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         onChange={handleChange}
//                         required
//                         placeholder="Enter facility name"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Category *
//                       </label>
//                       <input
//                         type="text"
//                         name="category"
//                         value={formData.category}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         onChange={handleChange}
//                         required
//                         placeholder="Enter category"
//                       />
//                     </div>
//                   </div>

//                   {/* Rich Text Description */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <div className="facility-editor-wrapper">
//                       <ReactQuill
//                         value={formData.description}
//                         onChange={handleDescriptionChange}
//                         modules={quillModules}
//                         formats={quillFormats}
//                         className="bg-white rounded-lg"
//                         theme="snow"
//                         placeholder="Describe the facility features, capabilities, and services..."
//                       />
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Use the toolbar to format your description with headings,
//                       bold, italic, lists, and more.
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Upload Photos
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleMultipleFileUpload}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                     />

//                     {formData.photos.length > 0 && (
//                       <div className="mt-3 flex gap-2 flex-wrap">
//                         {formData.photos.map((photo, idx) => (
//                           <div key={idx} className="relative">
//                             <img
//                               src={photo}
//                               alt={`Preview ${idx + 1}`}
//                               className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   photos: prev.photos.filter(
//                                     (_, i) => i !== idx
//                                   ),
//                                 }))
//                               }
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="isactive"
//                       name="isactive"
//                       checked={formData.isactive}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           isactive: e.target.checked,
//                         }))
//                       }
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="isactive"
//                       className="ml-2 block text-sm font-medium text-gray-700"
//                     >
//                       Active Facility
//                     </label>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
//                     onClick={() => setModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={formLoading}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {formLoading ? (
//                       <span className="flex items-center justify-center">
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Saving...
//                       </span>
//                     ) : editId ? (
//                       "Update Facility"
//                     ) : (
//                       "Create Facility"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  getFacilities,
  getFacilityById,
  getFacilitiesByDept,
  createFacility,
  updateFacility,
  deleteFacility,
  toggleFacilityStatus,
  getDepartments,
  uploadSingleFile,
  getFullImageUrl,
  getRelativePath,
  getFullImageUrlArray,
  getRelativePathArray
} from "../../../api/userApi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function FacilitiesFullComponent() {
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    photos: [],           // ✅ Relative paths for saving
    photosPreview: [],    // ✅ Full URLs for preview
    isactive: true,
    departmentid: "",
  });

  // Quill modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
  ];

  // Add custom styles for Quill editor
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "quill-facility-styles";
    style.textContent = `
      .facility-editor-wrapper { margin-bottom: 1rem; }
      .facility-editor-wrapper .ql-container {
        min-height: 180px;
        max-height: 300px;
        overflow-y: auto;
        font-size: 14px;
        font-family: inherit;
        background: white;
      }
      .facility-editor-wrapper .ql-editor {
        min-height: 180px;
        line-height: 1.6;
        padding: 12px;
      }
      .facility-editor-wrapper .ql-editor.ql-blank::before {
        font-style: normal;
        color: #9ca3af;
        left: 12px;
      }
      .facility-editor-wrapper .ql-toolbar {
        background: #f9fafb;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border-color: #d1d5db;
      }
      .facility-editor-wrapper .ql-container {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border-color: #d1d5db;
      }
      .facility-content { line-height: 1.6; word-wrap: break-word; color: #4b5563; }
      .facility-content p { margin: 0.5rem 0; }
      .facility-content p:first-child { margin-top: 0; }
      .facility-content p:last-child { margin-bottom: 0; }
      .facility-content h1, .facility-content h2, .facility-content h3 {
        font-weight: 600;
        line-height: 1.3;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: #111827;
      }
      .facility-content h1 { font-size: 1.5rem; }
      .facility-content h2 { font-size: 1.25rem; }
      .facility-content h3 { font-size: 1.1rem; }
      .facility-content strong { font-weight: 600; color: #1f2937; }
      .facility-content em { font-style: italic; }
      .facility-content u { text-decoration: underline; }
      .facility-content s { text-decoration: line-through; opacity: 0.6; }
      .facility-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
      .facility-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
      .facility-content li { margin: 0.25rem 0; line-height: 1.6; }
      .facility-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1rem 0;
        background-color: #eff6ff;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-style: italic;
        color: #1e40af;
      }
      .facility-content a { color: #3b82f6; text-decoration: underline; }
      .facility-content a:hover { color: #2563eb; }
      .facility-preview {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .facility-preview * {
        margin: 0;
        padding: 0;
        font-size: 0.875rem !important;
        line-height: 1.4 !important;
      }
    `;

    const existingStyle = document.getElementById("quill-facility-styles");
    if (existingStyle) document.head.removeChild(existingStyle);
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById("quill-facility-styles");
      if (styleToRemove && document.head.contains(styleToRemove)) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  // ===============================
  // Load Departments
  // ===============================
  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      // ✅ Transform department images
      const depsWithImages = data.map(dept => ({
        ...dept,
        bannerimage: getFullImageUrl(dept.bannerimage),
        originalBannerPath: dept.bannerimage,
      }));
      setDepartments(depsWithImages);
    } catch (error) {
      console.error("Department load error:", error);
    }
  };

  // ===============================
  // Load Facilities
  // ===============================
  const loadFacilities = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedDept === "all") {
        data = await getFacilities();
      } else {
        data = await getFacilitiesByDept(selectedDept);
      }

      // ✅ Transform facility photos to full URLs for display
      const facilitiesWithImages = data.map(facility => ({
        ...facility,
        photos: getFullImageUrlArray(facility.photos),
        // Keep original paths for editing
        originalPhotoPaths: facility.photos,
      }));

      setFacilities(facilitiesWithImages);
    } catch (error) {
      console.error("Load facilities error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadFacilities();
  }, [selectedDept]);

  // ===============================
  // Helper Functions
  // ===============================
  const hasValidDescription = (description) => {
    if (!description) return false;
    const textContent = description.replace(/<[^>]*>/g, "").trim();
    return textContent.length > 0;
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // ===============================
  // Open Modal (Add / Edit)
  // ===============================
  const openModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      // ✅ Properly set photo paths for editing
      const originalPhotos = item.originalPhotoPaths || [];
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description || "",
        photos: getRelativePathArray(originalPhotos), // ✅ Relative paths for saving
        photosPreview: item.photos || [], // ✅ Full URLs for preview (already transformed)
        isactive: item.isactive,
        departmentid: item.departmentid || "",
      });
    } else {
      setEditId(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        photos: [],
        photosPreview: [],
        isactive: true,
        departmentid: "",
      });
    }
    setModalOpen(true);
  };

  // ===============================
  // Form Change
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // ===============================
  // Submit (Create / Update)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departmentid) {
      alert("Please select a department!");
      return;
    }

    try {
      setFormLoading(true);

      // ✅ Send relative paths to API
      const submitData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        photos: formData.photos, // ✅ Relative paths
        isactive: formData.isactive,
        departmentid: formData.departmentid,
      };

      if (editId) {
        await updateFacility(editId, submitData);
      } else {
        await createFacility({
          ...submitData,
          createdat: new Date().toISOString(),
        });
      }

      setModalOpen(false);
      loadFacilities();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // ===============================
  // Delete
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?"))
      return;
    try {
      await deleteFacility(id);
      loadFacilities();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ===============================
  // Toggle Status
  // ===============================
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleFacilityStatus(id, !currentStatus);
      loadFacilities();
    } catch (error) {
      console.error("Status toggle error:", error);
    }
  };

  // ===============================
  // Get Department Name
  // ===============================
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return "No Department";
    const dept = departments.find((d) => d.id === departmentId);
    return dept ? dept.name : "Unknown Department";
  };

  // ===============================
  // Handle Multiple File Uploads
  // ===============================
  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setFormLoading(true);
      const uploadedRelativePaths = [];
      const uploadedFullUrls = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadSingleFile(fd);

        // ✅ Store relative path for API
        const relativePath = res.filePath.startsWith("/")
          ? res.filePath
          : `/${res.filePath}`;

        uploadedRelativePaths.push(relativePath);
        // ✅ Store full URL for preview
        uploadedFullUrls.push(getFullImageUrl(relativePath));
      }

      // Add to existing photos
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedRelativePaths],      // ✅ Relative for saving
        photosPreview: [...prev.photosPreview, ...uploadedFullUrls], // ✅ Full for preview
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload one or more images.");
    } finally {
      setFormLoading(false);
    }
  };

  // ===============================
  // Remove Photo
  // ===============================
  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photosPreview: prev.photosPreview.filter((_, i) => i !== index),
    }));
  };

  // ===============================
  // UI STARTS
  // ===============================
  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div
          className="mb-7 rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
             bg-gradient-to-br from-primary/10 to-white border border-gray-200"
        >
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-secondary"></div>
                <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                  Infrastructure & Operations
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                Facilities Management
              </h2>

              <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
                Manage all hospital facilities, infrastructure sections, and
                related onboarding details.
              </p>
            </div>

            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
                 bg-gradient-to-br from-accent to-secondary shadow-md 
                 hover:shadow-lg active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Facility
            </button>
          </div>
        </div>

        {/* Department Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Filter by Department:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Facilities Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.map((item) => (
                    <FacilityCard
                      key={item.id}
                      facility={item}
                      getDepartmentName={getDepartmentName}
                      hasValidDescription={hasValidDescription}
                      onEdit={() => openModal(item)}
                      onDelete={() => handleDelete(item.id)}
                      onToggleStatus={() => handleToggleStatus(item.id, item.isactive)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new facility.</p>
                  <button
                    onClick={() => openModal()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Your First Facility
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <FacilityModal
            editId={editId}
            formData={formData}
            formLoading={formLoading}
            departments={departments}
            quillModules={quillModules}
            quillFormats={quillFormats}
            onClose={() => setModalOpen(false)}
            onChange={handleChange}
            onDescriptionChange={handleDescriptionChange}
            onFileUpload={handleMultipleFileUpload}
            onRemovePhoto={handleRemovePhoto}
            onSubmit={handleSubmit}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Separate Facility Card Component
const FacilityCard = ({
  facility,
  getDepartmentName,
  hasValidDescription,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  // ✅ Photos already have full URLs from loadFacilities transform
  const photos = facility.photos || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with Status */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {facility.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${facility.isactive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {facility.isactive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {facility.category}
          </span>
          <span className="text-xs text-gray-500">ID: {facility.id}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Department */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {getDepartmentName(facility.departmentid)}
        </div>

        {/* Description with HTML content */}
        {hasValidDescription(facility.description) ? (
          <div className="text-sm text-gray-600 mb-4 facility-preview facility-content">
            <div dangerouslySetInnerHTML={{ __html: facility.description }} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4 italic">No description available</p>
        )}

        {/* Photos - ✅ Already have full URLs */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Photos
          </label>
          <div className="flex gap-2 flex-wrap">
            {photos.slice(0, 4).map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                alt={`Facility ${idx + 1}`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))}
            {photos.length === 0 && (
              <span className="text-xs text-gray-400 italic">No photos</span>
            )}
            {photos.length > 4 && (
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                +{photos.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
          Created: {new Date(facility.createdat).toLocaleDateString()}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={onToggleStatus}
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${facility.isactive
              ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
            }`}
        >
          {facility.isactive ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ✅ Separate Facility Modal Component
const FacilityModal = ({
  editId,
  formData,
  formLoading,
  departments,
  quillModules,
  quillFormats,
  onClose,
  onChange,
  onDescriptionChange,
  onFileUpload,
  onRemovePhoto,
  onSubmit,
  setFormData,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {editId ? "Edit Facility" : "Add New Facility"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="departmentid"
                value={formData.departmentid}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={onChange}
                  required
                  placeholder="Enter facility name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={onChange}
                  required
                  placeholder="Enter category"
                />
              </div>
            </div>

            {/* Rich Text Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="facility-editor-wrapper">
                <ReactQuill
                  value={formData.description}
                  onChange={onDescriptionChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white rounded-lg"
                  theme="snow"
                  placeholder="Describe the facility features, capabilities, and services..."
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use the toolbar to format your description.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onFileUpload}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />

              {/* ✅ Show preview using photosPreview (full URLs) */}
              {formData.photosPreview.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {formData.photosPreview.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={photo}
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => onRemovePhoto(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isactive"
                name="isactive"
                checked={formData.isactive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isactive: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isactive" className="ml-2 block text-sm font-medium text-gray-700">
                Active Facility
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : editId ? (
                "Update Facility"
              ) : (
                "Create Facility"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

