// import React, { useState, useEffect } from "react";
// import {
//   Star,
//   Person,
//   CalendarToday,
//   ThumbUp,
//   ThumbDown,
//   TrendingUp,
//   FilterList,
//   Analytics,
//   SentimentSatisfied,
//   SentimentDissatisfied,
//   RateReview,
//   CheckCircle,
//   Delete,
//   Edit,
//   Visibility,
//   Search,
//   Refresh,
//   Add,
// } from "@mui/icons-material";

// // Import all API functions
// import {
//   getAllFeedback,
//   getFeedbackById,
//   createFeedback,
//   updateFeedback,
//   deleteFeedback,
//   searchFeedback,
//   getApprovedFeedback,
//   getPendingFeedback,
//   getFeedbackByRating,
//   toggleFeedbackApproval,
//   getFeedbackStats,
// } from "../../../api/userApi";

// const FeedbackManagement = () => {
//   // State management
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [ratingFilter, setRatingFilter] = useState("all");
//   const [approvalFilter, setApprovalFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [addModal, setAddModal] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [addForm, setAddForm] = useState({
//     fullname: "",
//     mobilenumber: "",
//     rating: 5,
//     feedback: "",
//     isapproved: false,
//   });
//   const [stats, setStats] = useState(null);

//   // Load all feedback
//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getAllFeedback();
//       setFeedback(data);

//       // Load statistics
//       const statistics = await getFeedbackStats();
//       setStats(statistics);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to load feedback:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search feedback
//   const handleSearch = async (query = searchTerm) => {
//     if (!query.trim()) {
//       await loadFeedback();
//       return;
//     }

//     try {
//       setLoading(true);
//       const results = await searchFeedback(query);
//       setFeedback(results);
//     } catch (err) {
//       setError(err.message);
//       console.error("Search failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter feedback based on current filters
//   const filteredFeedback = feedback.filter((item) => {
//     const matchesApproval =
//       approvalFilter === "all" ||
//       (approvalFilter === "approved" && item.isapproved) ||
//       (approvalFilter === "pending" && !item.isapproved);

//     const matchesRating =
//       ratingFilter === "all" || item.rating === parseInt(ratingFilter);

//     const matchesSearch =
//       item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.mobilenumber?.includes(searchTerm);

//     return matchesApproval && matchesRating && matchesSearch;
//   });

//   // Toggle approval status
//   const handleApproveToggle = async (id, currentStatus) => {
//     try {
//       await toggleFeedbackApproval(id, currentStatus);
//       await loadFeedback(); // Refresh data
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update approval status");
//     }
//   };

//   // Delete feedback
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this feedback?")) {
//       try {
//         await deleteFeedback(id);
//         await loadFeedback(); // Refresh data
//         alert("Feedback deleted successfully!");
//       } catch (err) {
//         setError(err.message);
//         alert("Failed to delete feedback");
//       }
//     }
//   };

//   // Edit feedback
//   const handleEdit = (feedbackItem) => {
//     setEditForm(feedbackItem);
//     setEditModal(true);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateFeedback(editForm.id, editForm);
//       setEditModal(false);
//       await loadFeedback(); // Refresh data
//       alert("Feedback updated successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update feedback");
//     }
//   };

//   // Add new feedback
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await createFeedback(addForm);
//       setAddModal(false);
//       setAddForm({
//         fullname: "",
//         mobilenumber: "",
//         rating: 5,
//         feedback: "",
//         isapproved: false,
//       });
//       await loadFeedback(); // Refresh data
//       alert("Feedback added successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to add feedback");
//     }
//   };

//   // Utility functions for UI
//   const getSentimentColor = (rating) => {
//     if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
//     if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     return "bg-red-100 text-red-800 border-red-200";
//   };

//   const getSentimentIcon = (rating) => {
//     if (rating >= 4) return <ThumbUp fontSize="small" />;
//     if (rating >= 3) return <SentimentSatisfied fontSize="small" />;
//     return <ThumbDown fontSize="small" />;
//   };

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return "text-green-600";
//     if (rating >= 3) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   // Auto-search when search term changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   if (loading && feedback.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-blue-600 text-lg">Loading feedback...</div>
//       </div>
//     );
//   }

//   if (error && feedback.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="text-red-600 text-lg mb-4">Error: {error}</div>
//         <button
//           onClick={loadFeedback}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Refresh className="mr-2" />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <div className=" mx-auto px- sm:px-2 lg:px-1">
//         <div
//           className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
//              bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
//         >
//           {/* Decorative Blobs */}
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

//           <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             {/* LEFT — Title Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="h-5 w-1 rounded-full bg-secondary"></div>
//                 <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
//                   Feedback Center
//                 </span>
//               </div>

//               <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
//                 Patient Feedback
//               </h1>

//               <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
//                 Manage and analyze patient satisfaction, reviews, and feedback
//                 insights.
//               </p>
//             </div>

//             {/* RIGHT — Buttons */}
//             <div className="flex items-center gap-4 flex-wrap">
//               {/* Add Feedback Button */}
//               <button
//                 onClick={() => setAddModal(true)}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
//                    bg-gradient-to-br from-accent to-secondary shadow-md 
//                    hover:shadow-lg active:scale-95 transition-all"
//               >
//                 <Add fontSize="small" />
//                 Add Feedback
//               </button>

//               {/* Refresh Button */}
//               <button
//                 onClick={loadFeedback}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold 
//                    bg-white text-primary shadow-md border border-gray-200
//                    hover:bg-mute active:scale-95 transition-all"
//               >
//                 <Refresh fontSize="small" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         {stats && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Total Feedback
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {stats.total}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-100 rounded-lg">
//                   <RateReview className="text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Average Rating
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stats.averageRating}
//                     </p>
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= stats.averageRating
//                               ? "text-yellow-400"
//                               : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <Star className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Approved</p>
//                   <p className="text-2xl font-bold text-green-600 mt-1">
//                     {stats.approved}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <CheckCircle className="text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600 mt-1">
//                     {stats.pending}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <SentimentDissatisfied className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rating Distribution */}
//         {stats && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Rating Distribution
//             </h3>
//             <div className="space-y-3">
//               {[5, 4, 3, 2, 1].map((stars) => (
//                 <div key={stars} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 w-24">
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= stars ? "text-yellow-400" : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600">{stars}</span>
//                   </div>
//                   <div className="flex-1 mx-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-yellow-400 h-2 rounded-full"
//                         style={{
//                           width: `${
//                             stats.ratingDistribution[stars] > 0
//                               ? (stats.ratingDistribution[stars] /
//                                   stats.total) *
//                                 100
//                               : 0
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="w-20 text-right">
//                     <span className="text-sm text-gray-600">
//                       {stats.ratingDistribution[stars]} (
//                       {stats.total > 0
//                         ? (
//                             (stats.ratingDistribution[stars] / stats.total) *
//                             100
//                           ).toFixed(1)
//                         : 0}
//                       %)
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 justify-between">
//             <div className="flex flex-wrap gap-2">
//               <select
//                 value={approvalFilter}
//                 onChange={(e) => setApprovalFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="approved">Approved</option>
//                 <option value="pending">Pending</option>
//               </select>

//               <select
//                 value={ratingFilter}
//                 onChange={(e) => setRatingFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Ratings</option>
//                 <option value="5">5 Stars</option>
//                 <option value="4">4 Stars</option>
//                 <option value="3">3 Stars</option>
//                 <option value="2">2 Stars</option>
//                 <option value="1">1 Star</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search feedback..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-80"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feedback List */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Patient Feedback ({filteredFeedback.length})
//             </h2>
//             {loading && (
//               <div className="text-sm text-blue-600">Updating...</div>
//             )}
//           </div>

//           <div className="divide-y divide-gray-200">
//             {filteredFeedback.map((item) => (
//               <div
//                 key={item.id}
//                 className="p-6 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-2 mb-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
//                           item.rating
//                         )}`}
//                       >
//                         <div className="flex items-center gap-1">
//                           {getSentimentIcon(item.rating)}
//                           {item.rating >= 4
//                             ? "Positive"
//                             : item.rating >= 3
//                             ? "Neutral"
//                             : "Negative"}
//                         </div>
//                       </span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${
//                           item.isapproved
//                             ? "bg-green-100 text-green-800 border-green-200"
//                             : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                         }`}
//                       >
//                         {item.isapproved ? "Approved" : "Pending Approval"}
//                       </span>
//                     </div>

//                     <div className="flex items-start gap-3 mb-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                         {item.fullname
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="font-semibold text-gray-900 text-lg">
//                               {item.fullname}
//                             </h3>
//                             <p className="text-gray-600 text-sm">
//                               {item.mobilenumber}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span
//                               className={`text-lg font-bold ${getRatingColor(
//                                 item.rating
//                               )}`}
//                             >
//                               {item.rating}
//                             </span>
//                             <Star className={getRatingColor(item.rating)} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="text-gray-700 mb-3 line-clamp-2">
//                       {item.feedback}
//                     </p>

//                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <CalendarToday fontSize="small" />
//                         {formatDate(item.createdat)}
//                       </span>
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             fontSize="small"
//                             className={
//                               star <= item.rating
//                                 ? "text-yellow-400"
//                                 : "text-gray-300"
//                             }
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 lg:flex-col">
//                     <button
//                       onClick={() => {
//                         setSelectedFeedback(item);
//                         setViewModal(true);
//                       }}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
//                     >
//                       <Visibility fontSize="small" />
//                       View
//                     </button>

//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
//                     >
//                       <Edit fontSize="small" />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleApproveToggle(item.id, item.isapproved)
//                       }
//                       className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
//                         item.isapproved
//                           ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
//                           : "bg-green-100 hover:bg-green-200 text-green-700"
//                       }`}
//                     >
//                       <CheckCircle fontSize="small" />
//                       {item.isapproved ? "Unapprove" : "Approve"}
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
//                     >
//                       <Delete fontSize="small" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredFeedback.length === 0 && (
//             <div className="text-center py-12">
//               <RateReview className="mx-auto text-gray-400 text-4xl mb-3" />
//               <p className="text-gray-500 text-lg">No feedback found</p>
//               <p className="text-gray-400 text-sm">
//                 {searchTerm ||
//                 approvalFilter !== "all" ||
//                 ratingFilter !== "all"
//                   ? "Try adjusting your filters or search terms"
//                   : "No feedback available yet"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* View Modal */}
//       {viewModal && selectedFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Feedback Details
//                   </h2>
//                   <p className="text-gray-600">
//                     From: {selectedFeedback.fullname}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Patient Name
//                   </label>
//                   <p className="mt-1 text-gray-900">
//                     {selectedFeedback.fullname}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Mobile Number
//                   </label>
//                   <p className="mt-1 text-gray-900">
//                     {selectedFeedback.mobilenumber}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Status
//                   </label>
//                   <span
//                     className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
//                       selectedFeedback.isapproved
//                         ? "bg-green-100 text-green-800 border-green-200"
//                         : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                     }`}
//                   >
//                     {selectedFeedback.isapproved
//                       ? "Approved"
//                       : "Pending Approval"}
//                   </span>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Date
//                   </label>
//                   <p className="mt-1 text-gray-900">
//                     {new Date(selectedFeedback.createdat).toLocaleDateString(
//                       "en-US",
//                       {
//                         weekday: "long",
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       }
//                     )}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Rating
//                 </label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span
//                     className={`text-xl font-bold ${getRatingColor(
//                       selectedFeedback.rating
//                     )}`}
//                   >
//                     {selectedFeedback.rating}/5
//                   </span>
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         fontSize="small"
//                         className={
//                           star <= selectedFeedback.rating
//                             ? "text-yellow-400"
//                             : "text-gray-300"
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Feedback Message
//                 </label>
//                 <div className="mt-2 p-4 bg-gray-50 rounded-lg">
//                   <p className="text-gray-700 whitespace-pre-line">
//                     {selectedFeedback.feedback}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">Edit Feedback</h2>
//             </div>

//             <form onSubmit={handleUpdate} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.fullname || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, fullname: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={editForm.mobilenumber || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, mobilenumber: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Rating
//                 </label>
//                 <select
//                   value={editForm.rating || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       rating: parseInt(e.target.value),
//                     })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   <option value="">Select Rating</option>
//                   {[1, 2, 3, 4, 5].map((rating) => (
//                     <option key={rating} value={rating}>
//                       {rating} Star{rating !== 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Feedback
//                 </label>
//                 <textarea
//                   value={editForm.feedback || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, feedback: e.target.value })
//                   }
//                   rows="4"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={editForm.isapproved || false}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, isapproved: e.target.checked })
//                   }
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Approved</label>
//               </div>
//             </form>

//             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setEditModal(false)}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleUpdate}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Update Feedback
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Modal */}
//       {addModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Add New Feedback
//               </h2>
//             </div>

//             <form onSubmit={handleAdd} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={addForm.fullname}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, fullname: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={addForm.mobilenumber}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, mobilenumber: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Rating
//                 </label>
//                 <select
//                   value={addForm.rating}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, rating: parseInt(e.target.value) })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   {[5, 4, 3, 2, 1].map((rating) => (
//                     <option key={rating} value={rating}>
//                       {rating} Star{rating !== 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Feedback
//                 </label>
//                 <textarea
//                   value={addForm.feedback}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, feedback: e.target.value })
//                   }
//                   rows="4"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={addForm.isapproved}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, isapproved: e.target.checked })
//                   }
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Approved</label>
//               </div>
//             </form>

//             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setAddModal(false)}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleAdd}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Add Feedback
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackManagement;



// import React, { useState, useEffect } from "react";
// import {
//   Star,
//   Person,
//   CalendarToday,
//   ThumbUp,
//   ThumbDown,
//   TrendingUp,
//   FilterList,
//   Analytics,
//   SentimentSatisfied,
//   SentimentDissatisfied,
//   RateReview,
//   CheckCircle,
//   Delete,
//   Edit,
//   Visibility,
//   Search,
//   Refresh,
//   Add,
//   Phone,
//   Badge,
//   LocalHospital,
//   MedicalServices,
//   CleaningServices,
//   People,
//   Restaurant,
//   Security,
//   AccessTime,
//   Assignment,
// } from "@mui/icons-material";

// // Import all API functions
// import {
//   getAllFeedback,
//   getFeedbackById,
//   createFeedback,
//   updateFeedback,
//   deleteFeedback,
//   searchFeedback,
//   getApprovedFeedback,
//   getPendingFeedback,
//   getFeedbackByRating,
//   toggleFeedbackApproval,
//   getFeedbackStats,
// } from "../../../api/userApi";

// const FeedbackManagement = () => {
//   // State management
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [ratingFilter, setRatingFilter] = useState("all");
//   const [approvalFilter, setApprovalFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [addModal, setAddModal] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [addForm, setAddForm] = useState({
//     fullname: "",
//     mobilenumber: "",
//     rating: 5,
//     feedback: "",
//     isapproved: false,
//   });
//   const [stats, setStats] = useState(null);

//   // Load all feedback
//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getAllFeedback();
//       setFeedback(data);

//       // Load statistics
//       const statistics = await getFeedbackStats();
//       setStats(statistics);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to load feedback:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search feedback
//   const handleSearch = async (query = searchTerm) => {
//     if (!query.trim()) {
//       await loadFeedback();
//       return;
//     }

//     try {
//       setLoading(true);
//       const results = await searchFeedback(query);
//       setFeedback(results);
//     } catch (err) {
//       setError(err.message);
//       console.error("Search failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter feedback based on current filters
//   const filteredFeedback = feedback.filter((item) => {
//     const matchesApproval =
//       approvalFilter === "all" ||
//       (approvalFilter === "approved" && item.isapproved) ||
//       (approvalFilter === "pending" && !item.isapproved);

//     const matchesRating =
//       ratingFilter === "all" || item.rating === parseInt(ratingFilter);

//     const matchesSearch =
//       item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.mobilenumber?.includes(searchTerm);

//     return matchesApproval && matchesRating && matchesSearch;
//   });

//   // Toggle approval status
//   const handleApproveToggle = async (id, currentStatus) => {
//     try {
//       await toggleFeedbackApproval(id, currentStatus);
//       await loadFeedback(); // Refresh data
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update approval status");
//     }
//   };

//   // Delete feedback
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this feedback?")) {
//       try {
//         await deleteFeedback(id);
//         await loadFeedback(); // Refresh data
//         alert("Feedback deleted successfully!");
//       } catch (err) {
//         setError(err.message);
//         alert("Failed to delete feedback");
//       }
//     }
//   };

//   // Edit feedback
//   const handleEdit = (feedbackItem) => {
//     setEditForm(feedbackItem);
//     setEditModal(true);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await updateFeedback(editForm.id, editForm);
//       setEditModal(false);
//       await loadFeedback(); // Refresh data
//       alert("Feedback updated successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update feedback");
//     }
//   };

//   // Add new feedback
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await createFeedback(addForm);
//       setAddModal(false);
//       setAddForm({
//         fullname: "",
//         mobilenumber: "",
//         rating: 5,
//         feedback: "",
//         isapproved: false,
//       });
//       await loadFeedback(); // Refresh data
//       alert("Feedback added successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to add feedback");
//     }
//   };

//   // Utility functions for UI
//   const getSentimentColor = (rating) => {
//     if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
//     if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     return "bg-red-100 text-red-800 border-red-200";
//   };

//   const getSentimentIcon = (rating) => {
//     if (rating >= 4) return <ThumbUp fontSize="small" />;
//     if (rating >= 3) return <SentimentSatisfied fontSize="small" />;
//     return <ThumbDown fontSize="small" />;
//   };

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return "text-green-600";
//     if (rating >= 3) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getExperienceColor = (experience) => {
//     switch (experience?.toUpperCase()) {
//       case "EXCELLENT":
//         return "bg-green-100 text-green-800 border-green-300";
//       case "GOOD":
//         return "bg-blue-100 text-blue-800 border-blue-300";
//       case "AVERAGE":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300";
//       case "POOR":
//         return "bg-orange-100 text-orange-800 border-orange-300";
//       case "VERY POOR":
//         return "bg-red-100 text-red-800 border-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatLabel = (key) => {
//     return key
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   // Auto-search when search term changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Rating Badge Component
//   const RatingBadge = ({ label, value }) => {
//     if (!value) return null;
//     return (
//       <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
//         <span className="text-sm text-gray-600">{label}</span>
//         <span
//           className={`px-2 py-1 text-xs font-medium rounded-full border ${getExperienceColor(
//             value
//           )}`}
//         >
//           {value}
//         </span>
//       </div>
//     );
//   };

//   // Section Component for View Modal
//   const DetailSection = ({ title, icon: Icon, children }) => (
//     <div className="mb-6">
//       <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
//         {Icon && <Icon className="text-primary" fontSize="small" />}
//         <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//       </div>
//       <div className="space-y-2">{children}</div>
//     </div>
//   );

//   // Info Item Component
//   const InfoItem = ({ label, value, className = "" }) => {
//     if (!value && value !== 0) return null;
//     return (
//       <div className={`${className}`}>
//         <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//           {label}
//         </label>
//         <p className="mt-1 text-gray-900 font-medium">{value}</p>
//       </div>
//     );
//   };

//   if (loading && feedback.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-blue-600 text-lg">Loading feedback...</div>
//       </div>
//     );
//   }

//   if (error && feedback.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="text-red-600 text-lg mb-4">Error: {error}</div>
//         <button
//           onClick={loadFeedback}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Refresh className="mr-2" />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <div className=" mx-auto px- sm:px-2 lg:px-1">
//         <div
//           className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
//              bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
//         >
//           {/* Decorative Blobs */}
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

//           <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             {/* LEFT — Title Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="h-5 w-1 rounded-full bg-secondary"></div>
//                 <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
//                   Feedback Center
//                 </span>
//               </div>

//               <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
//                 Patient Feedback
//               </h1>

//               <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
//                 Manage and analyze patient satisfaction, reviews, and feedback
//                 insights.
//               </p>
//             </div>

//             {/* RIGHT — Buttons */}
//             <div className="flex items-center gap-4 flex-wrap">
//               {/* Add Feedback Button */}
//               <button
//                 onClick={() => setAddModal(true)}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
//                    bg-gradient-to-br from-accent to-secondary shadow-md 
//                    hover:shadow-lg active:scale-95 transition-all"
//               >
//                 <Add fontSize="small" />
//                 Add Feedback
//               </button>

//               {/* Refresh Button */}
//               <button
//                 onClick={loadFeedback}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold 
//                    bg-white text-primary shadow-md border border-gray-200
//                    hover:bg-mute active:scale-95 transition-all"
//               >
//                 <Refresh fontSize="small" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         {stats && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Total Feedback
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {stats.total}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-100 rounded-lg">
//                   <RateReview className="text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Average Rating
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stats.averageRating}
//                     </p>
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= stats.averageRating
//                               ? "text-yellow-400"
//                               : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <Star className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Approved</p>
//                   <p className="text-2xl font-bold text-green-600 mt-1">
//                     {stats.approved}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <CheckCircle className="text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600 mt-1">
//                     {stats.pending}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <SentimentDissatisfied className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rating Distribution */}
//         {stats && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Rating Distribution
//             </h3>
//             <div className="space-y-3">
//               {[5, 4, 3, 2, 1].map((stars) => (
//                 <div key={stars} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 w-24">
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= stars ? "text-yellow-400" : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600">{stars}</span>
//                   </div>
//                   <div className="flex-1 mx-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-yellow-400 h-2 rounded-full"
//                         style={{
//                           width: `${
//                             stats.ratingDistribution[stars] > 0
//                               ? (stats.ratingDistribution[stars] /
//                                   stats.total) *
//                                 100
//                               : 0
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="w-20 text-right">
//                     <span className="text-sm text-gray-600">
//                       {stats.ratingDistribution[stars]} (
//                       {stats.total > 0
//                         ? (
//                             (stats.ratingDistribution[stars] / stats.total) *
//                             100
//                           ).toFixed(1)
//                         : 0}
//                       %)
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 justify-between">
//             <div className="flex flex-wrap gap-2">
//               <select
//                 value={approvalFilter}
//                 onChange={(e) => setApprovalFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="approved">Approved</option>
//                 <option value="pending">Pending</option>
//               </select>

//               <select
//                 value={ratingFilter}
//                 onChange={(e) => setRatingFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Ratings</option>
//                 <option value="5">5 Stars</option>
//                 <option value="4">4 Stars</option>
//                 <option value="3">3 Stars</option>
//                 <option value="2">2 Stars</option>
//                 <option value="1">1 Star</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search feedback..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-80"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feedback List */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Patient Feedback ({filteredFeedback.length})
//             </h2>
//             {loading && (
//               <div className="text-sm text-blue-600">Updating...</div>
//             )}
//           </div>

//           <div className="divide-y divide-gray-200">
//             {filteredFeedback.map((item) => (
//               <div
//                 key={item.id}
//                 className="p-6 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-2 mb-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
//                           item.rating
//                         )}`}
//                       >
//                         <div className="flex items-center gap-1">
//                           {getSentimentIcon(item.rating)}
//                           {item.rating >= 4
//                             ? "Positive"
//                             : item.rating >= 3
//                             ? "Neutral"
//                             : "Negative"}
//                         </div>
//                       </span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${
//                           item.isapproved
//                             ? "bg-green-100 text-green-800 border-green-200"
//                             : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                         }`}
//                       >
//                         {item.isapproved ? "Approved" : "Pending Approval"}
//                       </span>
//                       {item.overall_experience && (
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium border ${getExperienceColor(
//                             item.overall_experience
//                           )}`}
//                         >
//                           {item.overall_experience}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-start gap-3 mb-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                         {item.fullname
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="font-semibold text-gray-900 text-lg">
//                               {item.fullname}
//                             </h3>
//                             <p className="text-gray-600 text-sm">
//                               {item.mobilenumber}
//                               {item.prn && ` • PRN: ${item.prn}`}
//                               {item.ipd_no && ` • IPD: ${item.ipd_no}`}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span
//                               className={`text-lg font-bold ${getRatingColor(
//                                 item.rating
//                               )}`}
//                             >
//                               {item.rating}
//                             </span>
//                             <Star className={getRatingColor(item.rating)} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="text-gray-700 mb-3 line-clamp-2">
//                       {item.feedback}
//                     </p>

//                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <CalendarToday fontSize="small" />
//                         {formatDate(item.createdat || item.visit_date)}
//                       </span>
//                       {item.doctor_name && (
//                         <span className="flex items-center gap-1">
//                           <MedicalServices fontSize="small" />
//                           Dr. {item.doctor_name}
//                         </span>
//                       )}
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             fontSize="small"
//                             className={
//                               star <= item.rating
//                                 ? "text-yellow-400"
//                                 : "text-gray-300"
//                             }
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 lg:flex-col">
//                     <button
//                       onClick={() => {
//                         setSelectedFeedback(item);
//                         setViewModal(true);
//                       }}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
//                     >
//                       <Visibility fontSize="small" />
//                       View
//                     </button>

//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
//                     >
//                       <Edit fontSize="small" />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleApproveToggle(item.id, item.isapproved)
//                       }
//                       className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
//                         item.isapproved
//                           ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
//                           : "bg-green-100 hover:bg-green-200 text-green-700"
//                       }`}
//                     >
//                       <CheckCircle fontSize="small" />
//                       {item.isapproved ? "Unapprove" : "Approve"}
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
//                     >
//                       <Delete fontSize="small" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredFeedback.length === 0 && (
//             <div className="text-center py-12">
//               <RateReview className="mx-auto text-gray-400 text-4xl mb-3" />
//               <p className="text-gray-500 text-lg">No feedback found</p>
//               <p className="text-gray-400 text-sm">
//                 {searchTerm ||
//                 approvalFilter !== "all" ||
//                 ratingFilter !== "all"
//                   ? "Try adjusting your filters or search terms"
//                   : "No feedback available yet"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* View Modal - UPDATED WITH ALL DETAILS */}
//       {viewModal && selectedFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     Complete Feedback Details
//                   </h2>
//                   <p className="text-gray-600 mt-1">
//                     Feedback from {selectedFeedback.fullname}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-3xl font-light"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Quick Stats Bar */}
//               <div className="flex flex-wrap gap-3 mt-4">
//                 <span
//                   className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
//                     selectedFeedback.isapproved
//                       ? "bg-green-100 text-green-800 border-green-200"
//                       : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                   }`}
//                 >
//                   {selectedFeedback.isapproved
//                     ? "✓ Approved"
//                     : "⏳ Pending Approval"}
//                 </span>
//                 <span
//                   className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getExperienceColor(
//                     selectedFeedback.overall_experience
//                   )}`}
//                 >
//                   Overall: {selectedFeedback.overall_experience || "N/A"}
//                 </span>
//                 <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
//                   Rating: {selectedFeedback.rating}/5 ⭐
//                 </span>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               {/* Patient Information Section */}
//               <DetailSection title="Patient Information" icon={Person}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
//                   <InfoItem label="Full Name" value={selectedFeedback.fullname} />
//                   <InfoItem
//                     label="Mobile Number"
//                     value={selectedFeedback.mobilenumber}
//                   />
//                   <InfoItem label="PRN" value={selectedFeedback.prn} />
//                   <InfoItem label="IPD No" value={selectedFeedback.ipd_no} />
//                   <InfoItem
//                     label="Ward Admission No"
//                     value={selectedFeedback.ward_admission_no}
//                   />
//                   <InfoItem label="Age" value={selectedFeedback.age} />
//                   <InfoItem label="Gender" value={selectedFeedback.gender} />
//                   <InfoItem
//                     label="Doctor Name"
//                     value={selectedFeedback.doctor_name}
//                   />
//                   <InfoItem
//                     label="Visit Date"
//                     value={formatDate(selectedFeedback.visit_date)}
//                   />
//                 </div>
//               </DetailSection>

//               {/* Rating & Overall Experience */}
//               <DetailSection title="Rating & Overall Experience" icon={Star}>
//                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
//                   <div className="flex flex-wrap items-center gap-6">
//                     <div>
//                       <label className="text-xs font-medium text-gray-500 uppercase">
//                         Star Rating
//                       </label>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span
//                           className={`text-3xl font-bold ${getRatingColor(
//                             selectedFeedback.rating
//                           )}`}
//                         >
//                           {selectedFeedback.rating}/5
//                         </span>
//                         <div className="flex">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               className={
//                                 star <= selectedFeedback.rating
//                                   ? "text-yellow-400"
//                                   : "text-gray-300"
//                               }
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="text-xs font-medium text-gray-500 uppercase">
//                         Overall Experience
//                       </label>
//                       <div className="mt-1">
//                         <span
//                           className={`px-4 py-2 text-lg font-semibold rounded-lg border ${getExperienceColor(
//                             selectedFeedback.overall_experience
//                           )}`}
//                         >
//                           {selectedFeedback.overall_experience || "N/A"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </DetailSection>

//               {/* Feedback Message */}
//               <DetailSection title="Feedback Message" icon={RateReview}>
//                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
//                   <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
//                     {selectedFeedback.feedback || "No feedback message provided"}
//                   </p>
//                 </div>
//                 {selectedFeedback.sign_name && (
//                   <div className="mt-3 text-right">
//                     <span className="text-sm text-gray-500">Signed by: </span>
//                     <span className="font-medium text-gray-700 italic">
//                       {selectedFeedback.sign_name}
//                     </span>
//                   </div>
//                 )}
//               </DetailSection>

//               {/* Staff Ratings */}
//               <DetailSection title="Staff Ratings" icon={People}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <RatingBadge label="Consultants" value={selectedFeedback.consultants} />
//                   <RatingBadge label="Junior Doctors" value={selectedFeedback.junior_doctors} />
//                   <RatingBadge label="Nursing Staff" value={selectedFeedback.nursing_staff} />
//                   <RatingBadge label="Support Staff" value={selectedFeedback.support_staff} />
//                   <RatingBadge label="Pharmacy Staff" value={selectedFeedback.pharmacy_staff} />
//                   <RatingBadge label="Physiotherapy Staff" value={selectedFeedback.physiotherapy_staff} />
//                   <RatingBadge label="Billing Staff" value={selectedFeedback.billing_staff} />
//                   <RatingBadge label="Mediclaim Staff" value={selectedFeedback.mediclaim_staff} />
//                   <RatingBadge label="Pantry Staff" value={selectedFeedback.pantry_staff} />
//                 </div>
//               </DetailSection>

//               {/* Process Ratings */}
//               <DetailSection title="Process Ratings" icon={Assignment}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <RatingBadge label="Admission Process" value={selectedFeedback.admission_process} />
//                   <RatingBadge label="Billing Process" value={selectedFeedback.billing_process} />
//                   <RatingBadge label="Discharge Process" value={selectedFeedback.discharge_process} />
//                   <RatingBadge label="Insurance Process" value={selectedFeedback.insurance_process} />
//                   <RatingBadge label="OT Process" value={selectedFeedback.ot_process} />
//                   <RatingBadge label="Medical Assessment" value={selectedFeedback.medical_assessment} />
//                 </div>
//               </DetailSection>

//               {/* Service Ratings */}
//               <DetailSection title="Service Ratings" icon={MedicalServices}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <RatingBadge label="Nursing Care" value={selectedFeedback.nursing_care} />
//                   <RatingBadge label="Diagnostics" value={selectedFeedback.diagnostics} />
//                   <RatingBadge label="Food & Dietetics" value={selectedFeedback.food_dietetics} />
//                   <RatingBadge label="Pharmacy Service" value={selectedFeedback.pharmacy_service} />
//                   <RatingBadge label="Physiotherapy" value={selectedFeedback.physiotherapy} />
//                   <RatingBadge label="Casualty Attendance" value={selectedFeedback.casualty_attendance} />
//                 </div>
//               </DetailSection>

//               {/* Facility & Cleanliness Ratings */}
//               <DetailSection title="Facility & Cleanliness" icon={CleaningServices}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <RatingBadge label="Room Cleanliness" value={selectedFeedback.room_cleanliness} />
//                   <RatingBadge label="Toilet Cleanliness" value={selectedFeedback.toilet_cleanliness} />
//                   <RatingBadge label="Common Area Cleanliness" value={selectedFeedback.common_area_cleanliness} />
//                   <RatingBadge label="Room Maintenance" value={selectedFeedback.room_maintenance} />
//                   <RatingBadge label="Ward IPC" value={selectedFeedback.ward_ipc} />
//                   <RatingBadge label="Allocation of Bed" value={selectedFeedback.allocation_of_bed} />
//                   <RatingBadge label="Patient Shifting" value={selectedFeedback.patient_shifting} />
//                 </div>
//               </DetailSection>

//               {/* Other Ratings */}
//               <DetailSection title="Other Ratings" icon={TrendingUp}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <RatingBadge label="Security" value={selectedFeedback.security} />
//                   <RatingBadge label="Staff Courtesy" value={selectedFeedback.staff_courtesy} />
//                   <RatingBadge label="Staff Efficiency" value={selectedFeedback.staff_efficiency} />
//                   <RatingBadge label="Time Taken" value={selectedFeedback.time_taken} />
//                 </div>
//               </DetailSection>

//               {/* Timestamps */}
//               <DetailSection title="Record Information" icon={CalendarToday}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
//                   <InfoItem
//                     label="Created At"
//                     value={
//                       selectedFeedback.createdat
//                         ? new Date(selectedFeedback.createdat).toLocaleString()
//                         : "N/A"
//                     }
//                   />
//                   <InfoItem
//                     label="Updated At"
//                     value={
//                       selectedFeedback.updatedat
//                         ? new Date(selectedFeedback.updatedat).toLocaleString()
//                         : "N/A"
//                     }
//                   />
//                 </div>
//               </DetailSection>
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-between items-center">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() =>
//                       handleApproveToggle(
//                         selectedFeedback.id,
//                         selectedFeedback.isapproved
//                       )
//                     }
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                       selectedFeedback.isapproved
//                         ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
//                         : "bg-green-100 hover:bg-green-200 text-green-700"
//                     }`}
//                   >
//                     {selectedFeedback.isapproved ? "Unapprove" : "Approve"}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setViewModal(false);
//                       handleEdit(selectedFeedback);
//                     }}
//                     className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
//                   >
//                     Edit
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">Edit Feedback</h2>
//             </div>

//             <form onSubmit={handleUpdate} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.fullname || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, fullname: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={editForm.mobilenumber || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, mobilenumber: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Rating
//                 </label>
//                 <select
//                   value={editForm.rating || ""}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       rating: parseInt(e.target.value),
//                     })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   <option value="">Select Rating</option>
//                   {[1, 2, 3, 4, 5].map((rating) => (
//                     <option key={rating} value={rating}>
//                       {rating} Star{rating !== 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Feedback
//                 </label>
//                 <textarea
//                   value={editForm.feedback || ""}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, feedback: e.target.value })
//                   }
//                   rows="4"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={editForm.isapproved || false}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, isapproved: e.target.checked })
//                   }
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Approved</label>
//               </div>
//             </form>

//             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setEditModal(false)}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleUpdate}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Update Feedback
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Modal */}
//       {addModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Add New Feedback
//               </h2>
//             </div>

//             <form onSubmit={handleAdd} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={addForm.fullname}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, fullname: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={addForm.mobilenumber}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, mobilenumber: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Rating
//                 </label>
//                 <select
//                   value={addForm.rating}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, rating: parseInt(e.target.value) })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 >
//                   {[5, 4, 3, 2, 1].map((rating) => (
//                     <option key={rating} value={rating}>
//                       {rating} Star{rating !== 1 ? "s" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Feedback
//                 </label>
//                 <textarea
//                   value={addForm.feedback}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, feedback: e.target.value })
//                   }
//                   rows="4"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={addForm.isapproved}
//                   onChange={(e) =>
//                     setAddForm({ ...addForm, isapproved: e.target.checked })
//                   }
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Approved</label>
//               </div>
//             </form>

//             <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setAddModal(false)}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleAdd}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Add Feedback
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackManagement;



// import React, { useState, useEffect } from "react";
// import {
//   Star,
//   Person,
//   CalendarToday,
//   ThumbUp,
//   ThumbDown,
//   TrendingUp,
//   FilterList,
//   Analytics,
//   SentimentSatisfied,
//   SentimentDissatisfied,
//   RateReview,
//   CheckCircle,
//   Delete,
//   Edit,
//   Visibility,
//   Search,
//   Refresh,
//   Add,
//   Phone,
//   Badge,
//   LocalHospital,
//   MedicalServices,
//   CleaningServices,
//   People,
//   Restaurant,
//   Security,
//   AccessTime,
//   Assignment,
// } from "@mui/icons-material";

// // Import all API functions
// import {
//   getAllFeedback,
//   getFeedbackById,
//   createFeedback,
//   updateFeedback,
//   deleteFeedback,
//   searchFeedback,
//   getApprovedFeedback,
//   getPendingFeedback,
//   getFeedbackByRating,
//   toggleFeedbackApproval,
//   getFeedbackStats,
// } from "../../../api/userApi";

// const FeedbackManagement = () => {
//   // State management
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [ratingFilter, setRatingFilter] = useState("all");
//   const [approvalFilter, setApprovalFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [viewModal, setViewModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [addModal, setAddModal] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [addForm, setAddForm] = useState({
//     fullname: "",
//     mobilenumber: "",
//     rating: 5,
//     feedback: "",
//     isapproved: false,
//   });
//   const [stats, setStats] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Load all feedback
//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getAllFeedback();
//       setFeedback(data);

//       // Load statistics
//       const statistics = await getFeedbackStats();
//       setStats(statistics);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to load feedback:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search feedback
//   const handleSearch = async (query = searchTerm) => {
//     if (!query.trim()) {
//       await loadFeedback();
//       return;
//     }

//     try {
//       setLoading(true);
//       const results = await searchFeedback(query);
//       setFeedback(results);
//     } catch (err) {
//       setError(err.message);
//       console.error("Search failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter feedback based on current filters
//   const filteredFeedback = feedback.filter((item) => {
//     const matchesApproval =
//       approvalFilter === "all" ||
//       (approvalFilter === "approved" && item.isapproved) ||
//       (approvalFilter === "pending" && !item.isapproved);

//     const matchesRating =
//       ratingFilter === "all" || item.rating === parseInt(ratingFilter);

//     const matchesSearch =
//       item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.mobilenumber?.includes(searchTerm);

//     return matchesApproval && matchesRating && matchesSearch;
//   });

//   // Toggle approval status
//   const handleApproveToggle = async (id, currentStatus) => {
//     try {
//       await toggleFeedbackApproval(id, currentStatus);
//       await loadFeedback();
//       // Update selected feedback if viewing
//       if (selectedFeedback && selectedFeedback.id === id) {
//         setSelectedFeedback({ ...selectedFeedback, isapproved: !currentStatus });
//       }
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update approval status");
//     }
//   };

//   // Delete feedback
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this feedback?")) {
//       try {
//         await deleteFeedback(id);
//         await loadFeedback();
//         alert("Feedback deleted successfully!");
//       } catch (err) {
//         setError(err.message);
//         alert("Failed to delete feedback");
//       }
//     }
//   };

//   // Edit feedback
//   const handleEdit = (feedbackItem) => {
//     setEditForm({ ...feedbackItem });
//     setEditModal(true);
//   };

//   // Update feedback - FIXED
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await updateFeedback(editForm.id, editForm);
//       setEditModal(false);
//       setEditForm({});
//       await loadFeedback();
//       alert("Feedback updated successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to update feedback: " + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Add new feedback - FIXED
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       await createFeedback(addForm);
//       setAddModal(false);
//       setAddForm({
//         fullname: "",
//         mobilenumber: "",
//         rating: 5,
//         feedback: "",
//         isapproved: false,
//       });
//       await loadFeedback();
//       alert("Feedback added successfully!");
//     } catch (err) {
//       setError(err.message);
//       alert("Failed to add feedback: " + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Utility functions for UI
//   const getSentimentColor = (rating) => {
//     if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
//     if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     return "bg-red-100 text-red-800 border-red-200";
//   };

//   const getSentimentIcon = (rating) => {
//     if (rating >= 4) return <ThumbUp fontSize="small" />;
//     if (rating >= 3) return <SentimentSatisfied fontSize="small" />;
//     return <ThumbDown fontSize="small" />;
//   };

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return "text-green-600";
//     if (rating >= 3) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getExperienceColor = (experience) => {
//     switch (experience?.toUpperCase()) {
//       case "EXCELLENT":
//         return "bg-green-100 text-green-800 border-green-300";
//       case "GOOD":
//         return "bg-blue-100 text-blue-800 border-blue-300";
//       case "AVERAGE":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300";
//       case "POOR":
//         return "bg-orange-100 text-orange-800 border-orange-300";
//       case "VERY POOR":
//         return "bg-red-100 text-red-800 border-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Rating Badge Component
//   const RatingBadge = ({ label, value }) => {
//     if (!value) return null;
//     return (
//       <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
//         <span className="text-sm text-gray-600">{label}</span>
//         <span
//           className={`px-2 py-1 text-xs font-medium rounded-full border ${getExperienceColor(
//             value
//           )}`}
//         >
//           {value}
//         </span>
//       </div>
//     );
//   };

//   // Section Component for View Modal
//   const DetailSection = ({ title, icon: Icon, children }) => (
//     <div className="mb-6">
//       <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
//         {Icon && <Icon className="text-purple-600" fontSize="small" />}
//         <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//       </div>
//       <div className="space-y-2">{children}</div>
//     </div>
//   );

//   // Info Item Component
//   const InfoItem = ({ label, value, className = "" }) => {
//     if (!value && value !== 0) return null;
//     return (
//       <div className={`${className}`}>
//         <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//           {label}
//         </label>
//         <p className="mt-1 text-gray-900 font-medium">{value}</p>
//       </div>
//     );
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   // Auto-search when search term changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm) {
//         handleSearch();
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   if (loading && feedback.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center gap-3">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//           <div className="text-purple-600 text-lg">Loading feedback...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error && feedback.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="text-red-600 text-lg mb-4">Error: {error}</div>
//         <button
//           onClick={loadFeedback}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Refresh fontSize="small" />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <div className="mx-auto px-2 sm:px-2 lg:px-1">
//         <div
//           className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
//              bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
//         >
//           {/* Decorative Blobs */}
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

//           <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             {/* LEFT — Title Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="h-5 w-1 rounded-full bg-secondary"></div>
//                 <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
//                   Feedback Center
//                 </span>
//               </div>

//               <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
//                 Patient Feedback
//               </h1>

//               <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
//                 Manage and analyze patient satisfaction, reviews, and feedback
//                 insights.
//               </p>
//             </div>

//             {/* RIGHT — Buttons */}
//             <div className="flex items-center gap-4 flex-wrap">
//               <button
//                 onClick={() => setAddModal(true)}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
//                    bg-gradient-to-br from-accent to-secondary shadow-md 
//                    hover:shadow-lg active:scale-95 transition-all"
//               >
//                 <Add fontSize="small" />
//                 Add Feedback
//               </button>

//               <button
//                 onClick={loadFeedback}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold 
//                    bg-white text-primary shadow-md border border-gray-200
//                    hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
//               >
//                 <Refresh fontSize="small" className={loading ? "animate-spin" : ""} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         {stats && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Total Feedback
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {stats.total}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-100 rounded-lg">
//                   <RateReview className="text-purple-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Average Rating
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stats.averageRating}
//                     </p>
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= Math.round(stats.averageRating)
//                               ? "text-yellow-400"
//                               : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <Star className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Approved</p>
//                   <p className="text-2xl font-bold text-green-600 mt-1">
//                     {stats.approved}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <CheckCircle className="text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600 mt-1">
//                     {stats.pending}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <SentimentDissatisfied className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rating Distribution */}
//         {stats && stats.ratingDistribution && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Rating Distribution
//             </h3>
//             <div className="space-y-3">
//               {[5, 4, 3, 2, 1].map((stars) => (
//                 <div key={stars} className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 w-24">
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           fontSize="small"
//                           className={
//                             star <= stars ? "text-yellow-400" : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-600">{stars}</span>
//                   </div>
//                   <div className="flex-1 mx-6">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
//                         style={{
//                           width: `${
//                             stats.ratingDistribution[stars] > 0 && stats.total > 0
//                               ? (stats.ratingDistribution[stars] / stats.total) * 100
//                               : 0
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="w-24 text-right">
//                     <span className="text-sm text-gray-600">
//                       {stats.ratingDistribution[stars] || 0} (
//                       {stats.total > 0
//                         ? ((stats.ratingDistribution[stars] || 0) / stats.total * 100).toFixed(1)
//                         : 0}
//                       %)
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 justify-between">
//             <div className="flex flex-wrap gap-2">
//               <select
//                 value={approvalFilter}
//                 onChange={(e) => setApprovalFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="approved">Approved</option>
//                 <option value="pending">Pending</option>
//               </select>

//               <select
//                 value={ratingFilter}
//                 onChange={(e) => setRatingFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="all">All Ratings</option>
//                 <option value="5">5 Stars</option>
//                 <option value="4">4 Stars</option>
//                 <option value="3">3 Stars</option>
//                 <option value="2">2 Stars</option>
//                 <option value="1">1 Star</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search feedback..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-80"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feedback List */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Patient Feedback ({filteredFeedback.length})
//             </h2>
//             {loading && (
//               <div className="flex items-center gap-2 text-sm text-blue-600">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                 Updating...
//               </div>
//             )}
//           </div>

//           <div className="divide-y divide-gray-200">
//             {filteredFeedback.map((item) => (
//               <div
//                 key={item.id}
//                 className="p-6 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex flex-wrap items-center gap-2 mb-3">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
//                           item.rating
//                         )}`}
//                       >
//                         <div className="flex items-center gap-1">
//                           {getSentimentIcon(item.rating)}
//                           {item.rating >= 4
//                             ? "Positive"
//                             : item.rating >= 3
//                             ? "Neutral"
//                             : "Negative"}
//                         </div>
//                       </span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium border ${
//                           item.isapproved
//                             ? "bg-green-100 text-green-800 border-green-200"
//                             : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                         }`}
//                       >
//                         {item.isapproved ? "Approved" : "Pending Approval"}
//                       </span>
//                       {item.overall_experience && (
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium border ${getExperienceColor(
//                             item.overall_experience
//                           )}`}
//                         >
//                           {item.overall_experience}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-start gap-3 mb-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
//                         {item.fullname
//                           ?.split(" ")
//                           .map((n) => n[0])
//                           .join("")
//                           .toUpperCase()
//                           .slice(0, 2)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="font-semibold text-gray-900 text-lg">
//                               {item.fullname}
//                             </h3>
//                             <p className="text-gray-600 text-sm">
//                               {item.mobilenumber}
//                               {item.prn && ` • PRN: ${item.prn}`}
//                               {item.ipd_no && ` • IPD: ${item.ipd_no}`}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-1 flex-shrink-0">
//                             <span
//                               className={`text-lg font-bold ${getRatingColor(
//                                 item.rating
//                               )}`}
//                             >
//                               {item.rating}
//                             </span>
//                             <Star className={getRatingColor(item.rating)} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="text-gray-700 mb-3 line-clamp-2">
//                       {item.feedback}
//                     </p>

//                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <CalendarToday fontSize="small" />
//                         {formatDate(item.createdat || item.visit_date)}
//                       </span>
//                       {item.doctor_name && (
//                         <span className="flex items-center gap-1">
//                           <MedicalServices fontSize="small" />
//                           Dr. {item.doctor_name}
//                         </span>
//                       )}
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             fontSize="small"
//                             className={
//                               star <= item.rating
//                                 ? "text-yellow-400"
//                                 : "text-gray-300"
//                             }
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2 lg:flex-col">
//                     <button
//                       onClick={() => {
//                         setSelectedFeedback(item);
//                         setViewModal(true);
//                       }}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
//                     >
//                       <Visibility fontSize="small" />
//                       View
//                     </button>

//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
//                     >
//                       <Edit fontSize="small" />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleApproveToggle(item.id, item.isapproved)}
//                       className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
//                         item.isapproved
//                           ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
//                           : "bg-green-100 hover:bg-green-200 text-green-700"
//                       }`}
//                     >
//                       <CheckCircle fontSize="small" />
//                       {item.isapproved ? "Unapprove" : "Approve"}
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
//                     >
//                       <Delete fontSize="small" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredFeedback.length === 0 && (
//             <div className="text-center py-12">
//               <RateReview className="mx-auto text-gray-400 text-5xl mb-3" />
//               <p className="text-gray-500 text-lg">No feedback found</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 {searchTerm || approvalFilter !== "all" || ratingFilter !== "all"
//                   ? "Try adjusting your filters or search terms"
//                   : "No feedback available yet"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ==================== VIEW MODAL ==================== */}
//       {viewModal && selectedFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     Complete Feedback Details
//                   </h2>
//                   <p className="text-gray-600 mt-1">
//                     Feedback from {selectedFeedback.fullname}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Quick Stats Bar */}
//               <div className="flex flex-wrap gap-3 mt-4">
//                 <span
//                   className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
//                     selectedFeedback.isapproved
//                       ? "bg-green-100 text-green-800 border-green-200"
//                       : "bg-yellow-100 text-yellow-800 border-yellow-200"
//                   }`}
//                 >
//                   {selectedFeedback.isapproved ? "✓ Approved" : "⏳ Pending Approval"}
//                 </span>
//                 {selectedFeedback.overall_experience && (
//                   <span
//                     className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getExperienceColor(
//                       selectedFeedback.overall_experience
//                     )}`}
//                   >
//                     Overall: {selectedFeedback.overall_experience}
//                   </span>
//                 )}
//                 <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
//                   Rating: {selectedFeedback.rating}/5 ⭐
//                 </span>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               {/* Patient Information Section */}
//               <DetailSection title="Patient Information" icon={Person}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
//                   <InfoItem label="Full Name" value={selectedFeedback.fullname} />
//                   <InfoItem label="Mobile Number" value={selectedFeedback.mobilenumber} />
//                   <InfoItem label="PRN" value={selectedFeedback.prn} />
//                   <InfoItem label="IPD No" value={selectedFeedback.ipd_no} />
//                   <InfoItem label="Ward Admission No" value={selectedFeedback.ward_admission_no} />
//                   <InfoItem label="Age" value={selectedFeedback.age} />
//                   <InfoItem label="Gender" value={selectedFeedback.gender} />
//                   <InfoItem label="Doctor Name" value={selectedFeedback.doctor_name} />
//                   <InfoItem label="Visit Date" value={formatDate(selectedFeedback.visit_date)} />
//                 </div>
//               </DetailSection>

//               {/* Rating & Overall Experience */}
//               <DetailSection title="Rating & Overall Experience" icon={Star}>
//                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
//                   <div className="flex flex-wrap items-center gap-6">
//                     <div>
//                       <label className="text-xs font-medium text-gray-500 uppercase">
//                         Star Rating
//                       </label>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span
//                           className={`text-3xl font-bold ${getRatingColor(
//                             selectedFeedback.rating
//                           )}`}
//                         >
//                           {selectedFeedback.rating}/5
//                         </span>
//                         <div className="flex">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               className={
//                                 star <= selectedFeedback.rating
//                                   ? "text-yellow-400"
//                                   : "text-gray-300"
//                               }
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     {selectedFeedback.overall_experience && (
//                       <div>
//                         <label className="text-xs font-medium text-gray-500 uppercase">
//                           Overall Experience
//                         </label>
//                         <div className="mt-1">
//                           <span
//                             className={`inline-block px-4 py-2 text-lg font-semibold rounded-lg border ${getExperienceColor(
//                               selectedFeedback.overall_experience
//                             )}`}
//                           >
//                             {selectedFeedback.overall_experience}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </DetailSection>

//               {/* Feedback Message */}
//               <DetailSection title="Feedback Message" icon={RateReview}>
//                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
//                   <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
//                     {selectedFeedback.feedback || "No feedback message provided"}
//                   </p>
//                 </div>
//                 {selectedFeedback.sign_name && (
//                   <div className="mt-3 text-right">
//                     <span className="text-sm text-gray-500">Signed by: </span>
//                     <span className="font-medium text-gray-700 italic">
//                       {selectedFeedback.sign_name}
//                     </span>
//                   </div>
//                 )}
//               </DetailSection>

//               {/* Staff Ratings */}
//               {(selectedFeedback.consultants ||
//                 selectedFeedback.junior_doctors ||
//                 selectedFeedback.nursing_staff ||
//                 selectedFeedback.support_staff ||
//                 selectedFeedback.pharmacy_staff ||
//                 selectedFeedback.physiotherapy_staff ||
//                 selectedFeedback.billing_staff ||
//                 selectedFeedback.mediclaim_staff ||
//                 selectedFeedback.pantry_staff) && (
//                 <DetailSection title="Staff Ratings" icon={People}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     <RatingBadge label="Consultants" value={selectedFeedback.consultants} />
//                     <RatingBadge label="Junior Doctors" value={selectedFeedback.junior_doctors} />
//                     <RatingBadge label="Nursing Staff" value={selectedFeedback.nursing_staff} />
//                     <RatingBadge label="Support Staff" value={selectedFeedback.support_staff} />
//                     <RatingBadge label="Pharmacy Staff" value={selectedFeedback.pharmacy_staff} />
//                     <RatingBadge label="Physiotherapy Staff" value={selectedFeedback.physiotherapy_staff} />
//                     <RatingBadge label="Billing Staff" value={selectedFeedback.billing_staff} />
//                     <RatingBadge label="Mediclaim Staff" value={selectedFeedback.mediclaim_staff} />
//                     <RatingBadge label="Pantry Staff" value={selectedFeedback.pantry_staff} />
//                   </div>
//                 </DetailSection>
//               )}

//               {/* Process Ratings */}
//               {(selectedFeedback.admission_process ||
//                 selectedFeedback.billing_process ||
//                 selectedFeedback.discharge_process ||
//                 selectedFeedback.insurance_process ||
//                 selectedFeedback.ot_process ||
//                 selectedFeedback.medical_assessment) && (
//                 <DetailSection title="Process Ratings" icon={Assignment}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     <RatingBadge label="Admission Process" value={selectedFeedback.admission_process} />
//                     <RatingBadge label="Billing Process" value={selectedFeedback.billing_process} />
//                     <RatingBadge label="Discharge Process" value={selectedFeedback.discharge_process} />
//                     <RatingBadge label="Insurance Process" value={selectedFeedback.insurance_process} />
//                     <RatingBadge label="OT Process" value={selectedFeedback.ot_process} />
//                     <RatingBadge label="Medical Assessment" value={selectedFeedback.medical_assessment} />
//                   </div>
//                 </DetailSection>
//               )}

//               {/* Service Ratings */}
//               {(selectedFeedback.nursing_care ||
//                 selectedFeedback.diagnostics ||
//                 selectedFeedback.food_dietetics ||
//                 selectedFeedback.pharmacy_service ||
//                 selectedFeedback.physiotherapy ||
//                 selectedFeedback.casualty_attendance) && (
//                 <DetailSection title="Service Ratings" icon={MedicalServices}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     <RatingBadge label="Nursing Care" value={selectedFeedback.nursing_care} />
//                     <RatingBadge label="Diagnostics" value={selectedFeedback.diagnostics} />
//                     <RatingBadge label="Food & Dietetics" value={selectedFeedback.food_dietetics} />
//                     <RatingBadge label="Pharmacy Service" value={selectedFeedback.pharmacy_service} />
//                     <RatingBadge label="Physiotherapy" value={selectedFeedback.physiotherapy} />
//                     <RatingBadge label="Casualty Attendance" value={selectedFeedback.casualty_attendance} />
//                   </div>
//                 </DetailSection>
//               )}

//               {/* Facility & Cleanliness Ratings */}
//               {(selectedFeedback.room_cleanliness ||
//                 selectedFeedback.toilet_cleanliness ||
//                 selectedFeedback.common_area_cleanliness ||
//                 selectedFeedback.room_maintenance ||
//                 selectedFeedback.ward_ipc ||
//                 selectedFeedback.allocation_of_bed ||
//                 selectedFeedback.patient_shifting) && (
//                 <DetailSection title="Facility & Cleanliness" icon={CleaningServices}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     <RatingBadge label="Room Cleanliness" value={selectedFeedback.room_cleanliness} />
//                     <RatingBadge label="Toilet Cleanliness" value={selectedFeedback.toilet_cleanliness} />
//                     <RatingBadge label="Common Area Cleanliness" value={selectedFeedback.common_area_cleanliness} />
//                     <RatingBadge label="Room Maintenance" value={selectedFeedback.room_maintenance} />
//                     <RatingBadge label="Ward IPC" value={selectedFeedback.ward_ipc} />
//                     <RatingBadge label="Allocation of Bed" value={selectedFeedback.allocation_of_bed} />
//                     <RatingBadge label="Patient Shifting" value={selectedFeedback.patient_shifting} />
//                   </div>
//                 </DetailSection>
//               )}

//               {/* Other Ratings */}
//               {(selectedFeedback.security ||
//                 selectedFeedback.staff_courtesy ||
//                 selectedFeedback.staff_efficiency ||
//                 selectedFeedback.time_taken) && (
//                 <DetailSection title="Other Ratings" icon={TrendingUp}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     <RatingBadge label="Security" value={selectedFeedback.security} />
//                     <RatingBadge label="Staff Courtesy" value={selectedFeedback.staff_courtesy} />
//                     <RatingBadge label="Staff Efficiency" value={selectedFeedback.staff_efficiency} />
//                     <RatingBadge label="Time Taken" value={selectedFeedback.time_taken} />
//                   </div>
//                 </DetailSection>
//               )}

//               {/* Timestamps */}
//               <DetailSection title="Record Information" icon={CalendarToday}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
//                   <InfoItem label="Created At" value={formatDateTime(selectedFeedback.createdat)} />
//                   <InfoItem label="Updated At" value={formatDateTime(selectedFeedback.updatedat)} />
//                 </div>
//               </DetailSection>
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-between items-center">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleApproveToggle(selectedFeedback.id, selectedFeedback.isapproved)}
//                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                       selectedFeedback.isapproved
//                         ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
//                         : "bg-green-100 hover:bg-green-200 text-green-700"
//                     }`}
//                   >
//                     {selectedFeedback.isapproved ? "Unapprove" : "Approve"}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setViewModal(false);
//                       handleEdit(selectedFeedback);
//                     }}
//                     className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
//                   >
//                     Edit
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => setViewModal(false)}
//                   className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== EDIT MODAL - FIXED ==================== */}
//       {editModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-900">Edit Feedback</h2>
//                 <button
//                   type="button"
//                   onClick={() => setEditModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* Form wraps everything including buttons */}
//             <form onSubmit={handleUpdate}>
//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.fullname || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, fullname: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={editForm.mobilenumber || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, mobilenumber: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rating <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={editForm.rating || ""}
//                     onChange={(e) =>
//                       setEditForm({
//                         ...editForm,
//                         rating: parseInt(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     <option value="">Select Rating</option>
//                     {[5, 4, 3, 2, 1].map((rating) => (
//                       <option key={rating} value={rating}>
//                         {rating} Star{rating !== 1 ? "s" : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Feedback <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={editForm.feedback || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, feedback: e.target.value })
//                     }
//                     rows="4"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="editApproved"
//                     checked={editForm.isapproved || false}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, isapproved: e.target.checked })
//                     }
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                   <label htmlFor="editApproved" className="ml-2 text-sm text-gray-700">
//                     Approved
//                   </label>
//                 </div>
//               </div>

//               {/* Buttons inside form */}
//               <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//                 <div className="flex justify-end gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setEditModal(false)}
//                     className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
//                     disabled={submitting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   >
//                     {submitting && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     )}
//                     {submitting ? "Updating..." : "Update Feedback"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ==================== ADD MODAL - FIXED ==================== */}
//       {addModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-900">Add New Feedback</h2>
//                 <button
//                   type="button"
//                   onClick={() => setAddModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* Form wraps everything */}
//             <form onSubmit={handleAdd}>
//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={addForm.fullname}
//                     onChange={(e) =>
//                       setAddForm({ ...addForm, fullname: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter patient name"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={addForm.mobilenumber}
//                     onChange={(e) =>
//                       setAddForm({ ...addForm, mobilenumber: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter mobile number"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rating <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={addForm.rating}
//                     onChange={(e) =>
//                       setAddForm({ ...addForm, rating: parseInt(e.target.value) })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   >
//                     {[5, 4, 3, 2, 1].map((rating) => (
//                       <option key={rating} value={rating}>
//                         {rating} Star{rating !== 1 ? "s" : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Feedback <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={addForm.feedback}
//                     onChange={(e) =>
//                       setAddForm({ ...addForm, feedback: e.target.value })
//                     }
//                     rows="4"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter feedback message"
//                     required
//                   />
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="addApproved"
//                     checked={addForm.isapproved}
//                     onChange={(e) =>
//                       setAddForm({ ...addForm, isapproved: e.target.checked })
//                     }
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                   />
//                   <label htmlFor="addApproved" className="ml-2 text-sm text-gray-700">
//                     Approved
//                   </label>
//                 </div>
//               </div>

//               {/* Buttons inside form */}
//               <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//                 <div className="flex justify-end gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setAddModal(false)}
//                     className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
//                     disabled={submitting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   >
//                     {submitting && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     )}
//                     {submitting ? "Adding..." : "Add Feedback"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbackManagement;







import React, { useState, useEffect } from "react";
import {
  Star,
  Person,
  CalendarToday,
  ThumbUp,
  ThumbDown,
  TrendingUp,
  FilterList,
  Analytics,
  SentimentSatisfied,
  SentimentDissatisfied,
  RateReview,
  CheckCircle,
  Delete,
  Edit,
  Visibility,
  Search,
  Refresh,
  Add,
  Phone,
  Badge,
  LocalHospital,
  MedicalServices,
  CleaningServices,
  People,
  Restaurant,
  Security,
  AccessTime,
  Assignment,
  Close,
} from "@mui/icons-material";

// Import all API functions
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  searchFeedback,
  getApprovedFeedback,
  getPendingFeedback,
  getFeedbackByRating,
  toggleFeedbackApproval,
  getFeedbackStats,
} from "../../../api/userApi";

// Rating options for dropdowns
const RATING_OPTIONS = ["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY POOR"];

const FeedbackManagement = () => {
  // State management
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    fullname: "",
    mobilenumber: "",
    rating: 5,
    feedback: "",
    isapproved: false,
  });
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");

  // Load all feedback
  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllFeedback();
      setFeedback(data);

      const statistics = await getFeedbackStats();
      setStats(statistics);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search feedback
  const handleSearch = async (query = searchTerm) => {
    if (!query.trim()) {
      await loadFeedback();
      return;
    }

    try {
      setLoading(true);
      const results = await searchFeedback(query);
      setFeedback(results);
    } catch (err) {
      setError(err.message);
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter feedback based on current filters
  const filteredFeedback = feedback.filter((item) => {
    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "approved" && item.isapproved) ||
      (approvalFilter === "pending" && !item.isapproved);

    const matchesRating =
      ratingFilter === "all" || item.rating === parseInt(ratingFilter);

    const matchesSearch =
      item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobilenumber?.includes(searchTerm);

    return matchesApproval && matchesRating && matchesSearch;
  });

  // Toggle approval status
  const handleApproveToggle = async (id, currentStatus) => {
    try {
      await toggleFeedbackApproval(id, currentStatus);
      await loadFeedback();
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, isapproved: !currentStatus });
      }
    } catch (err) {
      setError(err.message);
      alert("Failed to update approval status");
    }
  };

  // Delete feedback
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(id);
        await loadFeedback();
        alert("Feedback deleted successfully!");
      } catch (err) {
        setError(err.message);
        alert("Failed to delete feedback");
      }
    }
  };

  // Edit feedback
  const handleEdit = (feedbackItem) => {
    setEditForm({ ...feedbackItem });
    setActiveTab("patient");
    setEditModal(true);
  };

  // Update feedback
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateFeedback(editForm.id, editForm);
      setEditModal(false);
      setEditForm({});
      await loadFeedback();
      alert("Feedback updated successfully!");
    } catch (err) {
      setError(err.message);
      alert("Failed to update feedback: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new feedback
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createFeedback(addForm);
      setAddModal(false);
      setAddForm({
        fullname: "",
        mobilenumber: "",
        rating: 5,
        feedback: "",
        isapproved: false,
      });
      await loadFeedback();
      alert("Feedback added successfully!");
    } catch (err) {
      setError(err.message);
      alert("Failed to add feedback: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update edit form field
  const updateEditField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Utility functions for UI
  const getSentimentColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getSentimentIcon = (rating) => {
    if (rating >= 4) return <ThumbUp fontSize="small" />;
    if (rating >= 3) return <SentimentSatisfied fontSize="small" />;
    return <ThumbDown fontSize="small" />;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getExperienceColor = (experience) => {
    switch (experience?.toUpperCase()) {
      case "EXCELLENT":
        return "bg-green-100 text-green-800 border-green-300";
      case "GOOD":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "AVERAGE":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "POOR":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "VERY POOR":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Rating Badge Component
  const RatingBadge = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">{label}</span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${getExperienceColor(
            value
          )}`}
        >
          {value}
        </span>
      </div>
    );
  };

  // Section Component for View Modal
  const DetailSection = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        {Icon && <Icon className="text-purple-600" fontSize="small" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  // Info Item Component
  const InfoItem = ({ label, value, className = "" }) => {
    if (!value && value !== 0) return null;
    return (
      <div className={`${className}`}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </label>
        <p className="mt-1 text-gray-900 font-medium">{value}</p>
      </div>
    );
  };

  // Form Input Component
  const FormInput = ({ label, field, type = "text", required = false, placeholder = "" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={editForm[field] || ""}
        onChange={(e) => updateEditField(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  // Form Select Component for Ratings
  const FormRatingSelect = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={editForm[field] || ""}
        onChange={(e) => updateEditField(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Rating</option>
        {RATING_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Tab Button Component
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {Icon && <Icon fontSize="small" />}
      {label}
    </button>
  );

  // Load data on component mount
  useEffect(() => {
    loadFeedback();
  }, []);

  // Auto-search when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading && feedback.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <div className="text-purple-600 text-lg">Loading feedback...</div>
        </div>
      </div>
    );
  }

  if (error && feedback.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <button
          onClick={loadFeedback}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Refresh fontSize="small" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mx-auto px-2 sm:px-2 lg:px-1">
        <div
          className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
             bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-secondary"></div>
                <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                  Feedback Center
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                Patient Feedback
              </h1>

              <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
                Manage and analyze patient satisfaction, reviews, and feedback insights.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
                   bg-gradient-to-br from-accent to-secondary shadow-md 
                   hover:shadow-lg active:scale-95 transition-all"
              >
                <Add fontSize="small" />
                Add Feedback
              </button>

              <button
                onClick={loadFeedback}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold 
                   bg-white text-primary shadow-md border border-gray-200
                   hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
              >
                <Refresh fontSize="small" className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <RateReview className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          fontSize="small"
                          className={
                            star <= Math.round(stats.averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <SentimentDissatisfied className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        {stats && stats.ratingDistribution && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 w-24">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          fontSize="small"
                          className={star <= stars ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{stars}</span>
                  </div>
                  <div className="flex-1 mx-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            stats.ratingDistribution[stars] > 0 && stats.total > 0
                              ? (stats.ratingDistribution[stars] / stats.total) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-sm text-gray-600">
                      {stats.ratingDistribution[stars] || 0} (
                      {stats.total > 0
                        ? (((stats.ratingDistribution[stars] || 0) / stats.total) * 100).toFixed(1)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient Feedback ({filteredFeedback.length})
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Updating...
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                          item.rating
                        )}`}
                      >
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(item.rating)}
                          {item.rating >= 4 ? "Positive" : item.rating >= 3 ? "Neutral" : "Negative"}
                        </div>
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          item.isapproved
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        {item.isapproved ? "Approved" : "Pending Approval"}
                      </span>
                      {item.overall_experience && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getExperienceColor(
                            item.overall_experience
                          )}`}
                        >
                          {item.overall_experience}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {item.fullname
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.fullname}</h3>
                            <p className="text-gray-600 text-sm">
                              {item.mobilenumber}
                              {item.prn && ` • PRN: ${item.prn}`}
                              {item.ipd_no && ` • IPD: ${item.ipd_no}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className={`text-lg font-bold ${getRatingColor(item.rating)}`}>
                              {item.rating}
                            </span>
                            <Star className={getRatingColor(item.rating)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{item.feedback}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarToday fontSize="small" />
                        {formatDate(item.createdat || item.visit_date)}
                      </span>
                      {item.doctor_name && (
                        <span className="flex items-center gap-1">
                          <MedicalServices fontSize="small" />
                          Dr. {item.doctor_name}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            fontSize="small"
                            className={star <= item.rating ? "text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    <button
                      onClick={() => {
                        setSelectedFeedback(item);
                        setViewModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Visibility fontSize="small" />
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Edit fontSize="small" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleApproveToggle(item.id, item.isapproved)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        item.isapproved
                          ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                          : "bg-green-100 hover:bg-green-200 text-green-700"
                      }`}
                    >
                      <CheckCircle fontSize="small" />
                      {item.isapproved ? "Unapprove" : "Approve"}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      <Delete fontSize="small" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFeedback.length === 0 && (
            <div className="text-center py-12">
              <RateReview className="mx-auto text-gray-400 text-5xl mb-3" />
              <p className="text-gray-500 text-lg">No feedback found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || approvalFilter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No feedback available yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== VIEW MODAL ==================== */}
      {viewModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Feedback Details</h2>
                  <p className="text-gray-600 mt-1">Feedback from {selectedFeedback.fullname}</p>
                </div>
                <button
                  onClick={() => setViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    selectedFeedback.isapproved
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}
                >
                  {selectedFeedback.isapproved ? "✓ Approved" : "⏳ Pending Approval"}
                </span>
                {selectedFeedback.overall_experience && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getExperienceColor(
                      selectedFeedback.overall_experience
                    )}`}
                  >
                    Overall: {selectedFeedback.overall_experience}
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Rating: {selectedFeedback.rating}/5 ⭐
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <DetailSection title="Patient Information" icon={Person}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                  <InfoItem label="Full Name" value={selectedFeedback.fullname} />
                  <InfoItem label="Mobile Number" value={selectedFeedback.mobilenumber} />
                  <InfoItem label="PRN" value={selectedFeedback.prn} />
                  <InfoItem label="IPD No" value={selectedFeedback.ipd_no} />
                  <InfoItem label="Ward Admission No" value={selectedFeedback.ward_admission_no} />
                  <InfoItem label="Age" value={selectedFeedback.age} />
                  <InfoItem label="Gender" value={selectedFeedback.gender} />
                  <InfoItem label="Doctor Name" value={selectedFeedback.doctor_name} />
                  <InfoItem label="Visit Date" value={formatDate(selectedFeedback.visit_date)} />
                </div>
              </DetailSection>

              <DetailSection title="Rating & Overall Experience" icon={Star}>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Star Rating</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-3xl font-bold ${getRatingColor(selectedFeedback.rating)}`}>
                          {selectedFeedback.rating}/5
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={
                                star <= selectedFeedback.rating ? "text-yellow-400" : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedFeedback.overall_experience && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">
                          Overall Experience
                        </label>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-4 py-2 text-lg font-semibold rounded-lg border ${getExperienceColor(
                              selectedFeedback.overall_experience
                            )}`}
                          >
                            {selectedFeedback.overall_experience}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DetailSection>

              <DetailSection title="Feedback Message" icon={RateReview}>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">
                    {selectedFeedback.feedback || "No feedback message provided"}
                  </p>
                </div>
                {selectedFeedback.sign_name && (
                  <div className="mt-3 text-right">
                    <span className="text-sm text-gray-500">Signed by: </span>
                    <span className="font-medium text-gray-700 italic">{selectedFeedback.sign_name}</span>
                  </div>
                )}
              </DetailSection>

              {/* Staff Ratings */}
              {(selectedFeedback.consultants ||
                selectedFeedback.junior_doctors ||
                selectedFeedback.nursing_staff ||
                selectedFeedback.support_staff ||
                selectedFeedback.pharmacy_staff ||
                selectedFeedback.physiotherapy_staff ||
                selectedFeedback.billing_staff ||
                selectedFeedback.mediclaim_staff ||
                selectedFeedback.pantry_staff) && (
                <DetailSection title="Staff Ratings" icon={People}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RatingBadge label="Consultants" value={selectedFeedback.consultants} />
                    <RatingBadge label="Junior Doctors" value={selectedFeedback.junior_doctors} />
                    <RatingBadge label="Nursing Staff" value={selectedFeedback.nursing_staff} />
                    <RatingBadge label="Support Staff" value={selectedFeedback.support_staff} />
                    <RatingBadge label="Pharmacy Staff" value={selectedFeedback.pharmacy_staff} />
                    <RatingBadge label="Physiotherapy Staff" value={selectedFeedback.physiotherapy_staff} />
                    <RatingBadge label="Billing Staff" value={selectedFeedback.billing_staff} />
                    <RatingBadge label="Mediclaim Staff" value={selectedFeedback.mediclaim_staff} />
                    <RatingBadge label="Pantry Staff" value={selectedFeedback.pantry_staff} />
                  </div>
                </DetailSection>
              )}

              {/* Process Ratings */}
              {(selectedFeedback.admission_process ||
                selectedFeedback.billing_process ||
                selectedFeedback.discharge_process ||
                selectedFeedback.insurance_process ||
                selectedFeedback.ot_process ||
                selectedFeedback.medical_assessment) && (
                <DetailSection title="Process Ratings" icon={Assignment}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RatingBadge label="Admission Process" value={selectedFeedback.admission_process} />
                    <RatingBadge label="Billing Process" value={selectedFeedback.billing_process} />
                    <RatingBadge label="Discharge Process" value={selectedFeedback.discharge_process} />
                    <RatingBadge label="Insurance Process" value={selectedFeedback.insurance_process} />
                    <RatingBadge label="OT Process" value={selectedFeedback.ot_process} />
                    <RatingBadge label="Medical Assessment" value={selectedFeedback.medical_assessment} />
                  </div>
                </DetailSection>
              )}

              {/* Service Ratings */}
              {(selectedFeedback.nursing_care ||
                selectedFeedback.diagnostics ||
                selectedFeedback.food_dietetics ||
                selectedFeedback.pharmacy_service ||
                selectedFeedback.physiotherapy ||
                selectedFeedback.casualty_attendance) && (
                <DetailSection title="Service Ratings" icon={MedicalServices}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RatingBadge label="Nursing Care" value={selectedFeedback.nursing_care} />
                    <RatingBadge label="Diagnostics" value={selectedFeedback.diagnostics} />
                    <RatingBadge label="Food & Dietetics" value={selectedFeedback.food_dietetics} />
                    <RatingBadge label="Pharmacy Service" value={selectedFeedback.pharmacy_service} />
                    <RatingBadge label="Physiotherapy" value={selectedFeedback.physiotherapy} />
                    <RatingBadge label="Casualty Attendance" value={selectedFeedback.casualty_attendance} />
                  </div>
                </DetailSection>
              )}

              {/* Facility & Cleanliness Ratings */}
              {(selectedFeedback.room_cleanliness ||
                selectedFeedback.toilet_cleanliness ||
                selectedFeedback.common_area_cleanliness ||
                selectedFeedback.room_maintenance ||
                selectedFeedback.ward_ipc ||
                selectedFeedback.allocation_of_bed ||
                selectedFeedback.patient_shifting) && (
                <DetailSection title="Facility & Cleanliness" icon={CleaningServices}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RatingBadge label="Room Cleanliness" value={selectedFeedback.room_cleanliness} />
                    <RatingBadge label="Toilet Cleanliness" value={selectedFeedback.toilet_cleanliness} />
                    <RatingBadge
                      label="Common Area Cleanliness"
                      value={selectedFeedback.common_area_cleanliness}
                    />
                    <RatingBadge label="Room Maintenance" value={selectedFeedback.room_maintenance} />
                    <RatingBadge label="Ward IPC" value={selectedFeedback.ward_ipc} />
                    <RatingBadge label="Allocation of Bed" value={selectedFeedback.allocation_of_bed} />
                    <RatingBadge label="Patient Shifting" value={selectedFeedback.patient_shifting} />
                  </div>
                </DetailSection>
              )}

              {/* Other Ratings */}
              {(selectedFeedback.security ||
                selectedFeedback.staff_courtesy ||
                selectedFeedback.staff_efficiency ||
                selectedFeedback.time_taken) && (
                <DetailSection title="Other Ratings" icon={TrendingUp}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RatingBadge label="Security" value={selectedFeedback.security} />
                    <RatingBadge label="Staff Courtesy" value={selectedFeedback.staff_courtesy} />
                    <RatingBadge label="Staff Efficiency" value={selectedFeedback.staff_efficiency} />
                    <RatingBadge label="Time Taken" value={selectedFeedback.time_taken} />
                  </div>
                </DetailSection>
              )}

              <DetailSection title="Record Information" icon={CalendarToday}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <InfoItem label="Created At" value={formatDateTime(selectedFeedback.createdat)} />
                  <InfoItem label="Updated At" value={formatDateTime(selectedFeedback.updatedat)} />
                </div>
              </DetailSection>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveToggle(selectedFeedback.id, selectedFeedback.isapproved)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFeedback.isapproved
                        ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                        : "bg-green-100 hover:bg-green-200 text-green-700"
                    }`}
                  >
                    {selectedFeedback.isapproved ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    onClick={() => {
                      setViewModal(false);
                      handleEdit(selectedFeedback);
                    }}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <button
                  onClick={() => setViewModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== COMPREHENSIVE EDIT MODAL ==================== */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Feedback</h2>
                  <p className="text-gray-600 mt-1">Update all feedback details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Close className="text-gray-500" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mt-4">
                <TabButton id="patient" label="Patient Info" icon={Person} />
                <TabButton id="staff" label="Staff Ratings" icon={People} />
                <TabButton id="process" label="Process Ratings" icon={Assignment} />
                <TabButton id="service" label="Service Ratings" icon={MedicalServices} />
                <TabButton id="facility" label="Facility" icon={CleaningServices} />
                <TabButton id="other" label="Other" icon={TrendingUp} />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {/* Patient Information Tab */}
                {activeTab === "patient" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormInput label="Full Name" field="fullname" required placeholder="Enter full name" />
                      <FormInput
                        label="Mobile Number"
                        field="mobilenumber"
                        type="tel"
                        required
                        placeholder="Enter mobile number"
                      />
                      <FormInput label="PRN" field="prn" placeholder="Enter PRN" />
                      <FormInput label="IPD No" field="ipd_no" placeholder="Enter IPD number" />
                      <FormInput
                        label="Ward Admission No"
                        field="ward_admission_no"
                        placeholder="Enter ward admission number"
                      />
                      <FormInput label="Age" field="age" type="number" placeholder="Enter age" />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          value={editForm.gender || ""}
                          onChange={(e) => updateEditField("gender", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <FormInput label="Doctor Name" field="doctor_name" placeholder="Enter doctor name" />
                      <FormInput label="Visit Date" field="visit_date" type="date" />
                      <FormInput label="Signature Name" field="sign_name" placeholder="Enter signature name" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mt-8">
                      Rating & Feedback
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Star Rating <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editForm.rating || ""}
                          onChange={(e) => updateEditField("rating", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Rating</option>
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                              {r} Star{r !== 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FormRatingSelect label="Overall Experience" field="overall_experience" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editForm.feedback || ""}
                        onChange={(e) => updateEditField("feedback", e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter feedback message"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editApproved"
                        checked={editForm.isapproved || false}
                        onChange={(e) => updateEditField("isapproved", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <label htmlFor="editApproved" className="ml-2 text-sm text-gray-700">
                        Approved
                      </label>
                    </div>
                  </div>
                )}

                {/* Staff Ratings Tab */}
                {activeTab === "staff" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Staff Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormRatingSelect label="Consultants" field="consultants" />
                      <FormRatingSelect label="Junior Doctors" field="junior_doctors" />
                      <FormRatingSelect label="Nursing Staff" field="nursing_staff" />
                      <FormRatingSelect label="Support Staff" field="support_staff" />
                      <FormRatingSelect label="Pharmacy Staff" field="pharmacy_staff" />
                      <FormRatingSelect label="Physiotherapy Staff" field="physiotherapy_staff" />
                      <FormRatingSelect label="Billing Staff" field="billing_staff" />
                      <FormRatingSelect label="Mediclaim Staff" field="mediclaim_staff" />
                      <FormRatingSelect label="Pantry Staff" field="pantry_staff" />
                    </div>
                  </div>
                )}

                {/* Process Ratings Tab */}
                {activeTab === "process" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Process Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormRatingSelect label="Admission Process" field="admission_process" />
                      <FormRatingSelect label="Billing Process" field="billing_process" />
                      <FormRatingSelect label="Discharge Process" field="discharge_process" />
                      <FormRatingSelect label="Insurance Process" field="insurance_process" />
                      <FormRatingSelect label="OT Process" field="ot_process" />
                      <FormRatingSelect label="Medical Assessment" field="medical_assessment" />
                    </div>
                  </div>
                )}

                {/* Service Ratings Tab */}
                {activeTab === "service" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Service Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormRatingSelect label="Nursing Care" field="nursing_care" />
                      <FormRatingSelect label="Diagnostics" field="diagnostics" />
                      <FormRatingSelect label="Food & Dietetics" field="food_dietetics" />
                      <FormRatingSelect label="Pharmacy Service" field="pharmacy_service" />
                      <FormRatingSelect label="Physiotherapy" field="physiotherapy" />
                      <FormRatingSelect label="Casualty Attendance" field="casualty_attendance" />
                    </div>
                  </div>
                )}

                {/* Facility Ratings Tab */}
                {activeTab === "facility" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Facility & Cleanliness Ratings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormRatingSelect label="Room Cleanliness" field="room_cleanliness" />
                      <FormRatingSelect label="Toilet Cleanliness" field="toilet_cleanliness" />
                      <FormRatingSelect label="Common Area Cleanliness" field="common_area_cleanliness" />
                      <FormRatingSelect label="Room Maintenance" field="room_maintenance" />
                      <FormRatingSelect label="Ward IPC" field="ward_ipc" />
                      <FormRatingSelect label="Allocation of Bed" field="allocation_of_bed" />
                      <FormRatingSelect label="Patient Shifting" field="patient_shifting" />
                    </div>
                  </div>
                )}

                {/* Other Ratings Tab */}
                {activeTab === "other" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Other Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormRatingSelect label="Security" field="security" />
                      <FormRatingSelect label="Staff Courtesy" field="staff_courtesy" />
                      <FormRatingSelect label="Staff Efficiency" field="staff_efficiency" />
                      <FormRatingSelect label="Time Taken" field="time_taken" />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  {/* Tab Navigation Buttons */}
                  <div className="flex gap-2">
                    {activeTab !== "patient" && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs = ["patient", "staff", "process", "service", "facility", "other"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        ← Previous
                      </button>
                    )}
                    {activeTab !== "other" && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs = ["patient", "staff", "process", "service", "facility", "other"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Next →
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {submitting ? "Updating..." : "Update Feedback"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD MODAL ==================== */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add New Feedback</h2>
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleAdd}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.fullname}
                    onChange={(e) => setAddForm({ ...addForm, fullname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addForm.mobilenumber}
                    onChange={(e) => setAddForm({ ...addForm, mobilenumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.rating}
                    onChange={(e) => setAddForm({ ...addForm, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={addForm.feedback}
                    onChange={(e) => setAddForm({ ...addForm, feedback: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter feedback message"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="addApproved"
                    checked={addForm.isapproved}
                    onChange={(e) => setAddForm({ ...addForm, isapproved: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="addApproved" className="ml-2 text-sm text-gray-700">
                    Approved
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {submitting ? "Adding..." : "Add Feedback"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;