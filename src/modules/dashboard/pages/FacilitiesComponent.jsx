// import React, { useState, useEffect } from 'react';
// import {
//     getDepartments,
//     getFacilities,
//     getFacilitiesByDept,
//     createFacility,
//     updateFacility,
//     deleteFacility
// } from '../../../api/userApi';

// const FacilitiesComponent = () => {
//     const [departments, setDepartments] = useState([]);
//     const [facilities, setFacilities] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [deptLoading, setDeptLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [editingFacility, setEditingFacility] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedDepartment, setSelectedDepartment] = useState('all'); // NEW: Department filter

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         category: '',
//         description: '',
//         photos: [''],
//         isactive: true,
//         departmentId: ''
//     });

//     // Fetch departments and facilities on component mount
//     useEffect(() => {
//         fetchDepartments();
//         fetchFacilities();
//     }, []);

//     const fetchDepartments = async () => {
//         setDeptLoading(true);
//         setError('');
//         try {
//             const data = await getDepartments();
//             setDepartments(data);
//         } catch (err) {
//             setError('Failed to fetch departments: ' + err.message);
//         } finally {
//             setDeptLoading(false);
//         }
//     };

//     const fetchFacilities = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const data = await getFacilities();
//             setFacilities(data);
//             setSelectedDepartment('all'); // Reset filter
//         } catch (err) {
//             setError('Failed to fetch facilities: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // NEW: Handle department filter change
//     const handleDepartmentFilterChange = async (deptId) => {
//         setSelectedDepartment(deptId);

//         if (deptId === 'all') {
//             await fetchFacilities();
//         } else {
//             await fetchFacilitiesByDept(deptId);
//         }
//     };

//     const fetchFacilitiesByDept = async (deptId) => {
//         setLoading(true);
//         setError('');
//         try {
//             const data = await getFacilitiesByDept(deptId);
//             setFacilities(data);
//         } catch (err) {
//             setError(`Failed to fetch facilities for selected department: ` + err.message);
//             // If department fetch fails, fall back to all facilities
//             await fetchFacilities();
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handlePhotoChange = (index, value) => {
//         const newPhotos = [...formData.photos];
//         newPhotos[index] = value;
//         setFormData(prev => ({ ...prev, photos: newPhotos }));
//     };

//     const addPhotoField = () => {
//         setFormData(prev => ({
//             ...prev,
//             photos: [...prev.photos, '']
//         }));
//     };

//     const removePhotoField = (index) => {
//         if (formData.photos.length > 1) {
//             const newPhotos = formData.photos.filter((_, i) => i !== index);
//             setFormData(prev => ({ ...prev, photos: newPhotos }));
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             category: '',
//             description: '',
//             photos: [''],
//             isactive: true,
//             departmentId: ''
//         });
//         setEditingFacility(null);
//         setShowForm(false);
//         setError('');
//         setSuccess('');
//     };

//     // FIXED: Normalize photos array helper function
//     const normalizePhotos = (photos) => {
//         if (!photos || !Array.isArray(photos)) return [];

//         // Flatten nested arrays and filter out empty strings
//         return photos.flat(Infinity).filter(photo => photo && photo.trim() !== '');
//     };

//     const handleCreateFacility = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             // Filter out empty photo strings - use flat array format
//             const filteredPhotos = formData.photos.filter(photo => photo.trim() !== '');

//             const submitData = {
//                 name: formData.name,
//                 category: formData.category,
//                 description: formData.description,
//                 photos: filteredPhotos.length > 0 ? filteredPhotos : [], // Flat array format
//                 isactive: formData.isactive,
//                 departmentId: parseInt(formData.departmentId), // Ensure it's a number
//                 createdat: new Date().toISOString() // Add createdat timestamp
//             };

//             // Debug logging
//             console.log('Submitting facility data:', submitData);

//             const response = await createFacility(submitData);
//             console.log('Create facility response:', response);

//             setSuccess('Facility created successfully!');

//             // Refresh the facilities list based on current filter
//             if (selectedDepartment === 'all') {
//                 await fetchFacilities();
//             } else {
//                 await fetchFacilitiesByDept(selectedDepartment);
//             }

//             resetForm();
//         } catch (err) {
//             console.error('Create facility error:', err);
//             console.error('Error response:', err.response?.data);
//             setError('Failed to create facility: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateFacility = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             // Filter out empty photo strings - use flat array format
//             const filteredPhotos = formData.photos.filter(photo => photo.trim() !== '');

//             const submitData = {
//                 name: formData.name,
//                 category: formData.category,
//                 description: formData.description,
//                 photos: filteredPhotos.length > 0 ? filteredPhotos : [], // Flat array format
//                 isactive: formData.isactive,
//                 departmentId: parseInt(formData.departmentId) // Ensure it's a number
//             };

//             // Debug logging
//             console.log('Updating facility:', editingFacility.id);
//             console.log('Update data:', submitData);

//             const response = await updateFacility(editingFacility.id, submitData);
//             console.log('Update facility response:', response);

//             setSuccess('Facility updated successfully!');

//             // Refresh the facilities list based on current filter
//             if (selectedDepartment === 'all') {
//                 await fetchFacilities();
//             } else {
//                 await fetchFacilitiesByDept(selectedDepartment);
//             }

//             resetForm();
//         } catch (err) {
//             console.error('Update facility error:', err);
//             console.error('Error response:', err.response?.data);
//             setError('Failed to update facility: ' + (err.response?.data?.message || err.message));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteFacility = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this facility?')) {
//             return;
//         }

//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             await deleteFacility(id);
//             setSuccess('Facility deleted successfully!');

//             // Refresh the facilities list based on current filter
//             if (selectedDepartment === 'all') {
//                 await fetchFacilities();
//             } else {
//                 await fetchFacilitiesByDept(selectedDepartment);
//             }
//         } catch (err) {
//             setError('Failed to delete facility: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const startEdit = (facility) => {
//         setEditingFacility(facility);

//         // FIXED: Normalize photos and handle departmentId/departmentid
//         const normalizedPhotos = normalizePhotos(facility.photos);
//         const deptId = facility.departmentId || facility.departmentid;

//         setFormData({
//             name: facility.name,
//             category: facility.category,
//             description: facility.description,
//             photos: normalizedPhotos.length > 0 ? normalizedPhotos : [''],
//             isactive: facility.isactive,
//             departmentId: deptId ? deptId.toString() : ''
//         });
//         setShowForm(true);
//     };

//     // FIXED: Handle both departmentId and departmentid, compare as numbers
//     const getDepartmentName = (facility) => {
//         const deptId = facility.departmentId || facility.departmentid;

//         if (!deptId) return 'No Department';

//         // If department_name is already in the facility object, use it
//         if (facility.department_name) {
//             return facility.department_name;
//         }

//         // Otherwise, look it up from departments array
//         const dept = departments.find(d => parseInt(d.id) === parseInt(deptId));
//         return dept ? dept.name : 'Unknown Department';
//     };

//     return (
//         <div className="min-h-screen  ">
//             <div className=" mx-auto px-1 py-2 ">
//                 {/* Header */}
//                 {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//                     <div className="mb-4 sm:mb-0">
//                         <h1 className="text-3xl font-bold text-gray-900">Facilities Management</h1>
//                         <p className="text-gray-600 mt-2">Manage all hospital facilities</p>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={loading}
//                     >
//                         Add New Facility
//                     </button>
//                 </div> */}
//                 <div className=" mx-auto px- sm:px-2 lg:px-1">
//                     <div className="mb-6 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">📊 Facilities Management</h1>
//                             <p className="text-gray-600 mt-2">
//                                 Manage all hospital facilities
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setShowForm(true)}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={loading}
//                             >
//                                 Add New Facility
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 {/* Messages */}
//                 {error && (
//                     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <p className="text-sm text-red-700">{error}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {success && (
//                     <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                         <div className="flex items-center">
//                             <div className="flex-shrink-0">
//                                 <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <p className="text-sm text-green-700">{success}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Facility Form Modal */}
//                 {showForm && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                             <div className="flex justify-between items-center p-6 border-b border-gray-200">
//                                 <h3 className="text-xl font-semibold text-gray-900">
//                                     {editingFacility ? 'Edit Facility' : 'Create New Facility'}
//                                 </h3>
//                                 <button
//                                     onClick={resetForm}
//                                     disabled={loading}
//                                     className="text-gray-400 hover:text-gray-600 text-2xl font-light disabled:opacity-50"
//                                 >
//                                     ×
//                                 </button>
//                             </div>

//                             <form onSubmit={editingFacility ? handleUpdateFacility : handleCreateFacility} className="p-6">
//                                 <div className="space-y-6">
//                                     {/* Department Selection */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Department *
//                                         </label>
//                                         <select
//                                             name="departmentId"
//                                             value={formData.departmentId}
//                                             onChange={handleInputChange}
//                                             required
//                                             disabled={loading || deptLoading}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                                         >
//                                             <option value="">Select a department...</option>
//                                             {departments.map(dept => (
//                                                 <option key={dept.id} value={dept.id}>
//                                                     {dept.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {deptLoading && (
//                                             <p className="text-xs text-gray-500 mt-1">Loading departments...</p>
//                                         )}
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Facility Name *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={formData.name}
//                                             onChange={handleInputChange}
//                                             required
//                                             disabled={loading}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Category *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="category"
//                                             value={formData.category}
//                                             onChange={handleInputChange}
//                                             required
//                                             disabled={loading}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Description *
//                                         </label>
//                                         <textarea
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleInputChange}
//                                             required
//                                             disabled={loading}
//                                             rows="4"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-vertical"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-3">
//                                             Photo URLs
//                                         </label>
//                                         <div className="space-y-3">
//                                             {formData.photos.map((photo, index) => (
//                                                 <div key={index} className="flex gap-3">
//                                                     <input
//                                                         type="url"
//                                                         value={photo}
//                                                         onChange={(e) => handlePhotoChange(index, e.target.value)}
//                                                         placeholder="https://example.com/image.jpg"
//                                                         disabled={loading}
//                                                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removePhotoField(index)}
//                                                         disabled={formData.photos.length === 1 || loading}
//                                                         className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                     >
//                                                         Remove
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                             <button
//                                                 type="button"
//                                                 onClick={addPhotoField}
//                                                 disabled={loading}
//                                                 className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                             >
//                                                 Add Photo URL
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center">
//                                         <input
//                                             type="checkbox"
//                                             name="isactive"
//                                             checked={formData.isactive}
//                                             onChange={handleInputChange}
//                                             disabled={loading}
//                                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                         />
//                                         <label className="ml-2 block text-sm text-gray-700">
//                                             Active Facility
//                                         </label>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
//                                     <button
//                                         type="button"
//                                         onClick={resetForm}
//                                         disabled={loading}
//                                         className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={loading}
//                                         className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         {loading ? 'Saving...' : (editingFacility ? 'Update Facility' : 'Create Facility')}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 {/* Facilities List */}
//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                             <div className="flex items-center gap-4 flex-1">
//                                 <h3 className="text-lg font-semibold text-gray-900">
//                                     All Facilities ({facilities.length})
//                                 </h3>

//                                 {/* NEW: Department Filter Dropdown */}
//                                 {/* <div className="flex items-center gap-2">
//                                     <label className="text-sm text-gray-600">Filter by:</label>
//                                     <select
//                                         value={selectedDepartment}
//                                         onChange={(e) => handleDepartmentFilterChange(e.target.value)}
//                                         disabled={loading || deptLoading}
//                                         className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                                     >
//                                         <option value="all">All Departments</option>
//                                         {departments.map(dept => (
//                                             <option key={dept.id} value={dept.id}>
//                                                 {dept.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div> */}
//                             </div>

//                             {loading && (
//                                 <div className="flex items-center text-gray-500">
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Loading facilities...
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {!loading && facilities.length === 0 ? (
//                         <div className="text-center py-12">
//                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                             </svg>
//                             <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 {selectedDepartment === 'all'
//                                     ? 'Get started by creating a new facility.'
//                                     : 'No facilities found for this department.'}
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//                             {facilities.map(facility => {
//                                 const normalizedPhotos = normalizePhotos(facility.photos);

//                                 return (
//                                     <div key={facility.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//                                         {/* Facility Images */}
//                                         <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
//                                             {normalizedPhotos.length > 0 ? (
//                                                 <img
//                                                     src={normalizedPhotos[0]}
//                                                     alt={facility.name}
//                                                     className="w-full h-full object-cover"
//                                                     onError={(e) => {
//                                                         e.target.style.display = 'none';
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                                     <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                     </svg>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Facility Info */}
//                                         <div className="p-4">
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <h4 className="text-lg font-semibold text-gray-900 truncate">{facility.name}</h4>
//                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${facility.isactive
//                                                     ? 'bg-green-100 text-green-800'
//                                                     : 'bg-red-100 text-red-800'
//                                                     }`}>
//                                                     {facility.isactive ? 'Active' : 'Inactive'}
//                                                 </span>
//                                             </div>

//                                             <p className="text-sm text-blue-600 font-medium mb-2">{facility.category}</p>
//                                             <p className="text-sm text-gray-600 line-clamp-2 mb-2">{facility.description}</p>

//                                             {/* Department Info */}
//                                             <div className="mb-4">
//                                                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
//                                                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
//                                                     </svg>
//                                                     {getDepartmentName(facility)}
//                                                 </span>
//                                             </div>

//                                             <div className="flex items-center justify-between text-xs text-gray-500">
//                                                 <span>ID: {facility.id}</span>
//                                                 <span>Created: {new Date(facility.createdat).toLocaleDateString()}</span>
//                                             </div>
//                                         </div>

//                                         {/* Actions */}
//                                         <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200 flex gap-2">
//                                             <button
//                                                 onClick={() => startEdit(facility)}
//                                                 disabled={loading}
//                                                 className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDeleteFacility(facility.id)}
//                                                 disabled={loading}
//                                                 className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FacilitiesComponent;


// import React, { useState, useEffect } from 'react';
// import { 
//   getDepartments, 
//   getFacilities, 
//   getFacilitiesByDept, 
//   createFacility, 
//   updateFacility, 
//   deleteFacility 
// } from '../../../api/userApi';

// const FacilitiesComponent = () => {
//   const [departments, setDepartments] = useState([]);
//   const [facilities, setFacilities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deptLoading, setDeptLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editingFacility, setEditingFacility] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedDepartment, setSelectedDepartment] = useState('all');

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     description: '',
//     isactive: true,
//     departmentId: ''
//   });

//   // Photo state - using URLs
//   const [photoUrl, setPhotoUrl] = useState('');
//   const [photoUrls, setPhotoUrls] = useState([]);

//   useEffect(() => {
//     fetchDepartments();
//     fetchFacilities();
//   }, []);

//   const fetchDepartments = async () => {
//     setDeptLoading(true);
//     setError('');
//     try {
//       const data = await getDepartments();
//       setDepartments(data);
//     } catch (err) {
//       setError('Failed to fetch departments: ' + err.message);
//     } finally {
//       setDeptLoading(false);
//     }
//   };

//   const fetchFacilities = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await getFacilities();
//       setFacilities(data);
//       setSelectedDepartment('all');
//     } catch (err) {
//       setError('Failed to fetch facilities: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDepartmentFilterChange = async (deptId) => {
//     setSelectedDepartment(deptId);
//     if (deptId === 'all') {
//       await fetchFacilities();
//     } else {
//       await fetchFacilitiesByDept(deptId);
//     }
//   };

//   const fetchFacilitiesByDept = async (deptId) => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await getFacilitiesByDept(deptId);
//       setFacilities(data);
//     } catch (err) {
//       setError(`Failed to fetch facilities for selected department: ` + err.message);
//       await fetchFacilities();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Add photo URL
//   const addPhotoUrl = () => {
//     if (!photoUrl.trim()) return;

//     // Basic URL validation
//     try {
//       new URL(photoUrl);
//       setPhotoUrls(prev => [...prev, photoUrl]);
//       setPhotoUrl('');
//       setError('');
//     } catch (e) {
//       setError('Please enter a valid URL');
//     }
//   };

//   // Remove photo URL
//   const removeUrl = (index) => {
//     setPhotoUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       category: '',
//       description: '',
//       isactive: true,
//       departmentId: ''
//     });
//     setPhotoUrl('');
//     setPhotoUrls([]);
//     setEditingFacility(null);
//     setShowForm(false);
//     setError('');
//     setSuccess('');
//   };

//   const normalizePhotos = (photos) => {
//     if (!photos || !Array.isArray(photos)) return [];
//     return photos.flat(Infinity).filter(photo => photo && photo.trim() !== '');
//   };

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.category || !formData.description) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     if (editingFacility) {
//       await handleUpdateFacility();
//     } else {
//       await handleCreateFacility();
//     }
//   };

//   const handleCreateFacility = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Create JSON payload matching your API format
//       const facilityData = {
//         name: formData.name,
//         category: formData.category,
//         description: formData.description,
//         photos: photoUrls, // Array of URLs
//         isactive: formData.isactive,
//         createdat: new Date().toISOString()
//       };

//       // Only add departmentId if it's selected
//       if (formData.departmentId) {
//         facilityData.departmentid = parseInt(formData.departmentId);
//       }

//       console.log('Creating facility with data:', facilityData);

//       const response = await createFacility(facilityData);
//       console.log('Create facility response:', response);

//       setSuccess('Facility created successfully!');

//       if (selectedDepartment === 'all') {
//         await fetchFacilities();
//       } else {
//         await fetchFacilitiesByDept(selectedDepartment);
//       }

//       resetForm();
//     } catch (err) {
//       console.error('Create facility error:', err);
//       console.error('Error response:', err.response?.data);
//       setError('Failed to create facility: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateFacility = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {

//       const facilityData = {
//         name: formData.name,
//         category: formData.category,
//         description: formData.description,
//         photos: photoUrls, 
//         isactive: formData.isactive
//       };


//       // Only add departmentId if it's selected
//       if (formData.departmentId) {
//         facilityData.departmentid = parseInt(formData.departmentId);
//       }

//       console.log('Updating facility:', editingFacility.id, facilityData);

//       const response = await updateFacility(editingFacility.id, facilityData);
//       console.log('Update facility response:', response);

//       setSuccess('Facility updated successfully!');

//       if (selectedDepartment === 'all') {
//         await fetchFacilities();
//       } else {
//         await fetchFacilitiesByDept(selectedDepartment);
//       }

//       resetForm();
//     } catch (err) {
//       console.error('Update facility error:', err);
//       console.error('Error response:', err.response?.data);
//       setError('Failed to update facility: ' + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteFacility = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this facility?')) {
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       await deleteFacility(id);
//       setSuccess('Facility deleted successfully!');

//       if (selectedDepartment === 'all') {
//         await fetchFacilities();
//       } else {
//         await fetchFacilitiesByDept(selectedDepartment);
//       }
//     } catch (err) {
//       setError('Failed to delete facility: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEdit = (facility) => {
//     setEditingFacility(facility);
//     const deptId = facility.departmentId || facility.departmentid;

//     setFormData({
//       name: facility.name,
//       category: facility.category,
//       description: facility.description,
//       isactive: facility.isactive,
//       departmentId: deptId ? deptId.toString() : ''
//     });

//     // Load existing photos
//     const existingPhotos = normalizePhotos(facility.photos);
//     setPhotoUrls(existingPhotos);
//     setPhotoUrl('');

//     setShowForm(true);
//   };

//   const getDepartmentName = (facility) => {
//     const deptId = facility.departmentId || facility.departmentid;
//     if (!deptId) return 'No Department';
//     if (facility.department_name) return facility.department_name;
//     const dept = departments.find(d => parseInt(d.id) === parseInt(deptId));
//     return dept ? dept.name : 'Unknown Department';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Facilities Management</h2>
//               <p className="text-gray-600">Manage all hospital facilities</p>
//             </div>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               Add New Facility
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
//             {success}
//           </div>
//         )}

//         {/* Facility Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editingFacility ? 'Edit Facility' : 'Create New Facility'}
//                 </h3>
//                 <button
//                   onClick={resetForm}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-6">
//                   {/* Department Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Department (Optional)
//                     </label>
//                     <select
//                       name="departmentId"
//                       value={formData.departmentId}
//                       onChange={handleInputChange}
//                       disabled={loading}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                     >
//                       <option value="">Select a department...</option>
//                       {departments.map(dept => (
//                         <option key={dept.id} value={dept.id}>
//                           {dept.name}
//                         </option>
//                       ))}
//                     </select>
//                     {deptLoading && (
//                       <p className="text-sm text-gray-500 mt-1">Loading departments...</p>
//                     )}
//                   </div>

//                   {/* Facility Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Facility Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       disabled={loading}
//                       placeholder="e.g., Advanced ICU"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <input
//                       type="text"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       disabled={loading}
//                       placeholder="e.g., Medical, Diagnostic, Healthcare"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description *
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="4"
//                       disabled={loading}
//                       placeholder="Enter facility description..."
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                     />
//                   </div>

//                   {/* Photo URLs */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Photo URLs
//                     </label>

//                     {/* URL Input */}
//                     <div className="flex gap-2 mb-4">
//                       <input
//                         type="text"
//                         placeholder="Enter image URL (https://example.com/image.jpg)"
//                         value={photoUrl}
//                         onChange={(e) => setPhotoUrl(e.target.value)}
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             addPhotoUrl();
//                           }
//                         }}
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={loading}
//                       />

//                       <button
//                         type="button"
//                         onClick={addPhotoUrl}
//                         disabled={loading || !photoUrl.trim()}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                       >
//                         Add
//                       </button>
//                     </div>

//                     {/* Photo Previews */}
//                     {photoUrls.length > 0 && (
//                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                         {photoUrls.map((url, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={url}
//                               alt={`Photo ${index + 1}`}
//                               className="w-full h-32 object-cover rounded-lg border border-gray-200"
//                               onError={(e) => {
//                                 e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12"%3EInvalid URL%3C/text%3E%3C/svg%3E';
//                               }}
//                             />

//                             {/* Remove Button */}
//                             <button
//                               type="button"
//                               onClick={() => removeUrl(index)}
//                               className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
//                               title="Remove photo"
//                             >
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth="2"
//                                   d="M6 18L18 6M6 6l12 12"
//                                 />
//                               </svg>
//                             </button>

//                             {/* Existing Photo Tag */}
//                             {editingFacility && index < (normalizePhotos(editingFacility.photos).length) && (
//                               <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
//                                 Existing
//                               </span>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {photoUrls.length === 0 && (
//                       <p className="text-sm text-gray-500 mt-2">No photos added yet. Add image URLs above.</p>
//                     )}
//                   </div>

//                   {/* Active Status */}
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="isactive"
//                       id="isactive"
//                       checked={formData.isactive}
//                       onChange={handleInputChange}
//                       disabled={loading}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="isactive" className="ml-2 block text-sm text-gray-700">
//                       Active Facility
//                     </label>
//                   </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
//                   <button
//                     onClick={resetForm}
//                     disabled={loading}
//                     className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Saving...' : (editingFacility ? 'Update Facility' : 'Create Facility')}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Facilities List */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div className="flex items-center gap-4 flex-1">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   All Facilities ({facilities.length})
//                 </h3>
//               </div>
//               {loading && (
//                 <div className="flex items-center text-gray-500">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Loading facilities...
//                 </div>
//               )}
//             </div>
//           </div>

//           {!loading && facilities.length === 0 ? (
//             <div className="text-center py-12">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Get started by creating a new facility.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//               {facilities.map(facility => {
//                 const normalizedPhotos = normalizePhotos(facility.photos);
//                 return (
//                   <div key={facility.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//                     {/* Facility Images */}
//                     <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
//                       {normalizedPhotos.length > 0 ? (
//                         <img
//                           src={normalizedPhotos[0]}
//                           alt={facility.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                       )}
//                     </div>

//                     {/* Facility Info */}
//                     <div className="p-4">
//                       <div className="flex items-start justify-between mb-3">
//                         <h4 className="text-lg font-semibold text-gray-900 truncate flex-1">{facility.name}</h4>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
//                           facility.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {facility.isactive ? 'Active' : 'Inactive'}
//                         </span>
//                       </div>

//                       <p className="text-sm text-blue-600 font-medium mb-2">{facility.category}</p>
//                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{facility.description}</p>

//                       {/* Department Info */}
//                       <div className="mb-4">
//                         <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
//                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
//                           </svg>
//                           {getDepartmentName(facility)}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between text-xs text-gray-500">
//                         <span>ID: {facility.id}</span>
//                         <span>Created: {new Date(facility.createdat).toLocaleDateString()}</span>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200 flex gap-2">
//                       <button
//                         onClick={() => startEdit(facility)}
//                         disabled={loading}
//                         className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteFacility(facility.id)}
//                         disabled={loading}
//                         className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FacilitiesComponent;


// import React, { useState, useEffect } from "react";
// import {
//   getFacilities,
//   getFacilityById,
//   getFacilitiesByDept,
//   createFacility,
//   updateFacility,
//   deleteFacility,
//   toggleFacilityStatus,
//   getDepartments
// } from "../../../api/userApi";

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
//   // Open Modal (Add / Edit)
//   // ===============================
//   const openModal = (item = null) => {
//     if (item) {
//       setEditId(item.id);
//       setFormData({
//         name: item.name,
//         category: item.category,
//         description: item.description,
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

//   const handlePhotosChange = (e) => {
//     const urls = e.target.value.split(",").map((x) => x.trim());
//     setFormData((prev) => ({ ...prev, photos: urls }));
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
//     if (!window.confirm("Are you sure?")) return;
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
//   // UI STARTS
//   // ===============================
//   return (
//     <div className="p-6">
//       <div className="flex justify-between pb-4 items-center">
//         <h2 className="text-2xl font-bold">Facilities Management</h2>

//         <button
//           onClick={() => openModal()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           + Add Facility
//         </button>
//       </div>

//       {/* Department Filter */}
//       <div className="mb-4 flex gap-4 items-center">
//         <label className="font-semibold">Filter by Department:</label>
//         <select
//           value={selectedDept}
//           onChange={(e) => setSelectedDept(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="all">All</option>

//           {departments.map((d) => (
//             <option key={d.id} value={d.id}>
//               {d.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <p className="text-center py-10">Loading...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
//             <thead className="bg-gray-200 text-left">
//               <tr>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Category</th>
//                 <th className="p-3">Dept</th>
//                 <th className="p-3">Photos</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {facilities.map((item) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="p-3">{item.name}</td>

//                   <td className="p-3">{item.category}</td>

//                   <td className="p-3">{item.name || "N/A"}</td>

//                   <td className="p-3">
//                     <div className="flex gap-2">
//                       {(item.photos?.flat() || []).map((photo, idx) => (
//                         <img
//                           key={idx}
//                           src={photo}
//                           className="w-12 h-12 rounded object-cover"
//                         />
//                       ))}
//                     </div>
//                   </td>

//                   <td className="p-3">
//                     <button
//                       onClick={() => handleToggleStatus(item.id, item.isactive)}
//                       className={`px-3 py-1 rounded text-white ${
//                         item.isactive ? "bg-green-600" : "bg-red-600"
//                       }`}
//                     >
//                       {item.isactive ? "Active" : "Inactive"}
//                     </button>
//                   </td>

//                   <td className="p-3 space-x-3">
//                     <button
//                       className="px-3 py-1 bg-yellow-500 text-white rounded"
//                       onClick={() => openModal(item)}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       className="px-3 py-1 bg-red-600 text-white rounded"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//           <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold mb-4">
//               {editId ? "Edit Facility" : "Add Facility"}
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="font-semibold">Department</label>
//                 <select
//                   name="departmentid"
//                   value={formData.departmentid}
//                   onChange={handleChange}
//                   className="w-full border p-2 rounded"
//                   required
//                 >
//                   <option value="">-- Select Department --</option>
//                   {departments.map((d) => (
//                     <option key={d.id} value={d.id}>
//                       {d.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="font-semibold">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   className="w-full border p-2 rounded"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold">Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   value={formData.category}
//                   className="w-full border p-2 rounded"
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   className="w-full border p-2 rounded"
//                   rows="3"
//                   onChange={handleChange}
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="font-semibold">Photos (comma separated URLs)</label>
//                 <input
//                   type="text"
//                   value={formData.photos.join(", ")}
//                   onChange={handlePhotosChange}
//                   className="w-full border p-2 rounded"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={formLoading}
//                 className="w-full bg-blue-600 text-white py-2 rounded mt-4"
//               >
//                 {formLoading ? "Saving..." : editId ? "Update" : "Create"}
//               </button>

//               <button
//                 type="button"
//                 className="w-full mt-2 border py-2 rounded"
//                 onClick={() => setModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
//   uploadSingleFile
// } from "../../../api/userApi";

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
//   // Open Modal (Add / Edit)
//   // ===============================
//   const openModal = (item = null) => {
//     if (item) {
//       setEditId(item.id);
//       setFormData({
//         name: item.name,
//         category: item.category,
//         description: item.description,
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

//   const handlePhotosChange = (e) => {
//     const urls = e.target.value.split(",").map((x) => x.trim());
//     setFormData((prev) => ({ ...prev, photos: urls }));
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
//     if (!window.confirm("Are you sure you want to delete this facility?")) return;
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
//     const dept = departments.find(d => d.id === departmentId);
//     return dept ? dept.name : "Unknown Department";
//   };



//   // Handle multiple file uploads
//   const handleMultipleFileUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     try {
//       setFormLoading(true);
//       const BASE_URL = "http://localhost:8654";
//       const uploadedUrls = [];

//       for (const file of files) {
//         const fd = new FormData();
//         fd.append("file", file);
//         const res = await uploadSingleFile(fd);
//         const imgURL = BASE_URL + (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);
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
//     <div className="min-h-screen bg-gray-50">
//       <div className="min-h-screen  py-2">
//         {/* Header */}
//         <div className=" mx-auto px- sm:px-2 lg:px-1">
//           <div className="mb-6 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//             <div>
//               {/* Header */}

//               <h2 className="text-2xl font-bold text-gray-900 mb-2">🏥 Facilities Management</h2>
//               <p className="text-gray-600">Manage all hospital facilities and departments</p>
//             </div>
//             <button
//               onClick={() => openModal()}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               Add Facility
//             </button>
//           </div>
//         </div>

//         {/* Department Filter */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Filter by Department:</label>
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
//                     <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
//                       {/* Header with Status */}
//                       <div className="p-4 border-b border-gray-100">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h3>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                             {item.isactive ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {item.category}
//                           </span>
//                           <span className="text-xs text-gray-500">ID: {item.id}</span>
//                         </div>
//                       </div>

//                       {/* Content */}
//                       <div className="p-4">
//                         {/* Department */}
//                         <div className="flex items-center text-sm text-gray-600 mb-3">
//                           <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                           </svg>
//                           {getDepartmentName(item.departmentid)}
//                         </div>

//                         {/* Description */}
//                         <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>

//                         {/* Photos */}
//                         <div className="mb-4">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Photos</label>
//                           <div className="flex gap-2 flex-wrap">
//                             {(item.photos?.flat() || []).slice(0, 4).map((photo, idx) => (
//                               <img
//                                 key={idx}
//                                 src={photo}
//                                 className="w-12 h-12 rounded-lg object-cover border border-gray-200"
//                                 alt={`Facility ${idx + 1}`}
//                                 onError={(e) => {
//                                   e.target.style.display = 'none';
//                                 }}
//                               />
//                             ))}
//                             {(item.photos?.flat() || []).length === 0 && (
//                               <span className="text-xs text-gray-400 italic">No photos</span>
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
//                           Created: {new Date(item.createdat).toLocaleDateString()}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
//                         {/* Activate/Deactivate Button */}
//                         <button
//                           onClick={() => handleToggleStatus(item.id, item.isactive)}
//                           className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${item.isactive
//                             ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
//                             : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
//                             }`}
//                         >
//                           <svg className={`w-4 h-4 mr-1 ${item.isactive ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             {item.isactive ? (
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             ) : (
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             )}
//                           </svg>
//                           {item.isactive ? "Deactivate" : "Activate"}
//                         </button>

//                         {/* Edit Button */}
//                         <button
//                           onClick={() => openModal(item)}
//                           className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                           Edit
//                         </button>

//                         {/* Delete Button */}
//                         <button
//                           onClick={() => handleDelete(item.id)}
//                           className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
//                         >
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
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

//         {/* Modal (Same as before) */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
//             <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editId ? "Edit Facility" : "Add New Facility"}
//                 </h3>
//                 <button
//                   onClick={() => setModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       rows="4"
//                       onChange={handleChange}
//                       placeholder="Enter facility description"
//                     ></textarea>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleMultipleFileUpload}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
//                     />

//                     {formData.photos.length > 0 && (
//                       <div className="mt-3 flex gap-2 flex-wrap">
//                         {formData.photos.map((photo, idx) => (
//                           <div key={idx} className="relative">
//                             <img
//                               src={photo}
//                               alt={`Preview ${idx + 1}`}
//                               className="w-20 h-20 rounded-full object-cover border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   photos: prev.photos.filter((_, i) => i !== idx),
//                                 }))
//                               }
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
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
//                       name="isactive"
//                       checked={formData.isactive}
//                       onChange={(e) => setFormData(prev => ({ ...prev, isactive: e.target.checked }))}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label className="ml-2 block text-sm text-gray-700">
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
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  uploadSingleFile
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
    photos: [],
    isactive: true,
    departmentid: "",
  });

  // Quill modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ];

  // Add custom styles for Quill editor and facility content rendering
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'quill-facility-styles';
    style.textContent = `
      /* Quill Editor Styles for Facilities */
      .facility-editor-wrapper {
        margin-bottom: 1rem;
      }
      
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

      /* Facility Content Display Styles */
      .facility-content {
        line-height: 1.6;
        word-wrap: break-word;
        color: #4b5563;
      }
      
      .facility-content p {
        margin: 0.5rem 0;
      }

      .facility-content p:first-child {
        margin-top: 0;
      }

      .facility-content p:last-child {
        margin-bottom: 0;
      }
      
      .facility-content h1,
      .facility-content h2,
      .facility-content h3 {
        font-weight: 600;
        line-height: 1.3;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: #111827;
      }
      
      .facility-content h1 {
        font-size: 1.5rem;
      }
      
      .facility-content h2 {
        font-size: 1.25rem;
      }
      
      .facility-content h3 {
        font-size: 1.1rem;
      }
      
      .facility-content strong {
        font-weight: 600;
        color: #1f2937;
      }
      
      .facility-content em {
        font-style: italic;
      }
      
      .facility-content u {
        text-decoration: underline;
      }
      
      .facility-content s {
        text-decoration: line-through;
        opacity: 0.6;
      }
      
      .facility-content ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin: 0.5rem 0;
      }
      
      .facility-content ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin: 0.5rem 0;
      }
      
      .facility-content li {
        margin: 0.25rem 0;
        line-height: 1.6;
      }
      
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
      
      .facility-content pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 0.5rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
      }
      
      .facility-content code {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
        font-family: 'Courier New', monospace;
      }

      .facility-content pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
      }
      
      .facility-content a {
        color: #3b82f6;
        text-decoration: underline;
        transition: color 0.2s;
      }
      
      .facility-content a:hover {
        color: #2563eb;
      }
      
      .facility-content .ql-align-center {
        text-align: center;
      }
      
      .facility-content .ql-align-right {
        text-align: right;
      }
      
      .facility-content .ql-align-justify {
        text-align: justify;
      }

      /* Preview styles for card display */
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
    
    const existingStyle = document.getElementById('quill-facility-styles');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById('quill-facility-styles');
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
      setDepartments(data);
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
      if (selectedDept === "all") {
        const data = await getFacilities();
        setFacilities(data);
      } else {
        const data = await getFacilitiesByDept(selectedDept);
        setFacilities(data);
      }
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
  // Check if description has actual content
  const hasValidDescription = (description) => {
    if (!description) return false;
    const textContent = description.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  // Strip HTML tags for preview
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
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description || "",
        photos: Array.isArray(item.photos) ? item.photos.flat() : [],
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

  // Handle rich text editor change
  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
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

      if (editId) {
        await updateFacility(editId, formData);
      } else {
        await createFacility({
          ...formData,
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
    if (!window.confirm("Are you sure you want to delete this facility?")) return;
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
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : "Unknown Department";
  };

  // Handle multiple file uploads
  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setFormLoading(true);
      const BASE_URL = "http://localhost:8654";
      const uploadedUrls = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadSingleFile(fd);
        const imgURL = BASE_URL + (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);
        uploadedUrls.push(imgURL);
      }

      // Add to existing photos
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls],
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload one or more images.");
    } finally {
      setFormLoading(false);
    }
  };

  // ===============================
  // UI STARTS
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen py-2">
        {/* Header */}
        <div className="mx-auto px- sm:px-2 lg:px-1">
          <div className="mb-6 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🏥 Facilities Management</h2>
              <p className="text-gray-600">Manage all hospital facilities and departments</p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
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
            <label className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Filter by Department:</label>
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
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {/* Cards Grid */}
              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Header with Status */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {item.isactive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">ID: {item.id}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Department */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {getDepartmentName(item.departmentid)}
                        </div>

                        {/* Description with HTML content */}
                        {hasValidDescription(item.description) ? (
                          <div className="text-sm text-gray-600 mb-4 facility-preview facility-content">
                            <div dangerouslySetInnerHTML={{ 
                              __html: item.description 
                            }} />
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 mb-4 italic">No description available</p>
                        )}

                        {/* Photos */}
                        <div className="mb-4">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Photos</label>
                          <div className="flex gap-2 flex-wrap">
                            {(item.photos?.flat() || []).slice(0, 4).map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                alt={`Facility ${idx + 1}`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ))}
                            {(item.photos?.flat() || []).length === 0 && (
                              <span className="text-xs text-gray-400 italic">No photos</span>
                            )}
                            {(item.photos?.flat() || []).length > 4 && (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                                +{(item.photos?.flat() || []).length - 4}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                          Created: {new Date(item.createdat).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                        {/* Activate/Deactivate Button */}
                        <button
                          onClick={() => handleToggleStatus(item.id, item.isactive)}
                          className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${item.isactive
                            ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                            }`}
                        >
                          <svg className={`w-4 h-4 mr-1 ${item.isactive ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {item.isactive ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                          {item.isactive ? "Deactivate" : "Activate"}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openModal(item)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No facilities found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new facility.
                  </p>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editId ? "Edit Facility" : "Add New Facility"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-6">
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleDescriptionChange}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white rounded-lg"
                        theme="snow"
                        placeholder="Describe the facility features, capabilities, and services..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the toolbar to format your description with headings, bold, italic, lists, and more.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFileUpload}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />

                    {formData.photos.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {formData.photos.map((photo, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={photo}
                              alt={`Preview ${idx + 1}`}
                              className="w-20 h-20 rounded-lg object-cover border-2 border-blue-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  photos: prev.photos.filter((_, i) => i !== idx),
                                }))
                              }
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
                      onChange={(e) => setFormData(prev => ({ ...prev, isactive: e.target.checked }))}
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
                    onClick={() => setModalOpen(false)}
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
        )}
      </div>
    </div>
  );
}