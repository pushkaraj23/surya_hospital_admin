// // src/pages/departments/DepartmentForm.jsx
// import React from "react";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { Save, X } from "lucide-react";

// export default function DepartmentForm({
//   formData,
//   setFormData,
//   editingId,
//   onSubmit,
//   onCancel,
//   handleFileUpload,
//   handleDescriptionChange,
//   isSubmitting,
// }) {
//   return (
//     <div className="space-y-6">
//       {/* Basic info + banner */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Name + services */}
//         <div className="lg:col-span-2 space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//               Department Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="e.g., Cardiology, Neurology, Orthopedics"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, name: e.target.value }))
//               }
//               className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//               Services Offered
//               <span className="ml-1 text-[11px] text-slate-400">
//                 (One per line or comma-separated)
//               </span>
//             </label>
//             <textarea
//               placeholder={
//                 "Cardiac Surgery\nHeart Consultation\nECG Testing\nAngioplasty"
//               }
//               rows={4}
//               value={formData.services}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, services: e.target.value }))
//               }
//               className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm resize-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
//             />
//           </div>
//         </div>

//         {/* Banner */}
//         <div className="space-y-3">
//           <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//             Banner Image
//           </label>
//           <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3 flex flex-col items-center justify-center text-center">
//             <input
//               type="file"
//               accept="image/*"
//               id="banner-upload"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <label
//               htmlFor="banner-upload"
//               className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200"
//             >
//               Upload Image
//             </label>
//             <p className="mt-1 text-[11px] text-slate-500">
//               Recommended: 1200×400, JPG/PNG
//             </p>
//             {formData.bannerimage && (
//               <div className="mt-3 w-full">
//                 <img
//                   src={formData.bannerimage}
//                   alt="Preview"
//                   className="w-full h-28 object-cover rounded-lg border border-slate-200"
//                 />
//               </div>
//             )}
//           </div>

//           <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 mt-2 cursor-pointer">
//             <div className="relative inline-flex h-5 w-9 items-center rounded-full border border-slate-300 bg-slate-100">
//               <input
//                 type="checkbox"
//                 checked={formData.isactive}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     isactive: e.target.checked,
//                   }))
//                 }
//                 className="peer sr-only"
//               />
//               <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all peer-checked:translate-x-4 peer-checked:bg-emerald-500" />
//             </div>
//             <span>{formData.isactive ? "Active department" : "Inactive"}</span>
//           </label>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
//           Department Description
//         </label>
//         <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
//           <ReactQuill
//             value={formData.description}
//             onChange={handleDescriptionChange}
//             className="min-h-[140px]"
//             theme="snow"
//             placeholder="Describe the department, types of cases handled, technology used, specialist team, etc."
//             modules={{
//               toolbar: [
//                 [{ header: [1, 2, 3, false] }],
//                 ["bold", "italic", "underline"],
//                 [{ list: "ordered" }, { list: "bullet" }],
//                 [{ color: [] }],
//                 ["link"],
//                 ["clean"],
//               ],
//             }}
//           />
//         </div>
//         <p className="text-[11px] text-slate-400">
//           This text will appear on the website / patient-facing view of the
//           department.
//         </p>
//       </div>

//       {/* Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//             Success Rate (%)
//           </label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             placeholder="e.g., 95"
//             value={formData.success_rate}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 success_rate: e.target.value,
//               }))
//             }
//             className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//             Patients Treated
//           </label>
//           <input
//             type="number"
//             min="0"
//             placeholder="e.g., 1200"
//             value={formData.patients}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 patients: e.target.value,
//               }))
//             }
//             className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
//             Years of Experience
//           </label>
//           <input
//             type="number"
//             min="0"
//             placeholder="e.g., 15"
//             value={formData.experience}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 experience: e.target.value,
//               }))
//             }
//             className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
//           />
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//         >
//           <X size={16} />
//           <span>Cancel</span>
//         </button>
//         <button
//           type="button"
//           disabled={isSubmitting}
//           onClick={onSubmit}
//           className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {isSubmitting ? (
//             <>
//               <span className="h-3 w-3 rounded-full border-2 border-white border-b-transparent animate-spin" />
//               <span>Saving…</span>
//             </>
//           ) : (
//             <>
//               <Save size={16} />
//               <span>
//                 {editingId ? "Update Department" : "Create Department"}
//               </span>
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }


import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getFullImageUrl } from "../../../api/userApi";

export default function DepartmentForm({
  formData,
  setFormData,
  editingId,
  onSubmit,
  onCancel,
  handleFileUpload,
  handleDescriptionChange,
  handleRemoveImage, // ✅ Add this prop
  isSubmitting,
}) {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department Name *
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter department name"
        />
      </div>

      {/* Banner Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        
        {/* ✅ Show preview using bannerimagePreview (full URL) or fallback */}
        {(formData.bannerimagePreview || formData.bannerimage) && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={formData.bannerimagePreview || getFullImageUrl(formData.bannerimage)}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border-2 border-blue-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <ReactQuill
          value={formData.description}
          onChange={handleDescriptionChange}
          modules={quillModules}
          className="bg-white rounded-lg"
          theme="snow"
          placeholder="Enter department description..."
        />
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services (one per line or comma-separated)
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={formData.services}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, services: e.target.value }))
          }
          placeholder="Service 1&#10;Service 2&#10;Service 3"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Success Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={formData.success_rate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, success_rate: e.target.value }))
            }
            placeholder="e.g. 95"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Patients
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={formData.patients}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, patients: e.target.value }))
            }
            placeholder="e.g. 5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={formData.experience}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, experience: e.target.value }))
            }
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isactive"
          checked={formData.isactive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isactive: e.target.checked }))
          }
          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isactive" className="text-sm font-medium text-gray-700">
          Active Department
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting && (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {editingId ? "Update" : "Create"} Department
        </button>
      </div>
    </div>
  );
}