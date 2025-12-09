// src/pages/departments/DepartmentForm.jsx
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Save, X } from "lucide-react";

export default function DepartmentForm({
  formData,
  setFormData,
  editingId,
  onSubmit,
  onCancel,
  handleFileUpload,
  handleDescriptionChange,
  isSubmitting,
}) {
  return (
    <div className="space-y-6">
      {/* Basic info + banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Name + services */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Cardiology, Neurology, Orthopedics"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
              Services Offered
              <span className="ml-1 text-[11px] text-slate-400">
                (One per line or comma-separated)
              </span>
            </label>
            <textarea
              placeholder={
                "Cardiac Surgery\nHeart Consultation\nECG Testing\nAngioplasty"
              }
              rows={4}
              value={formData.services}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, services: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm resize-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>
        </div>

        {/* Banner */}
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Banner Image
          </label>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3 flex flex-col items-center justify-center text-center">
            <input
              type="file"
              accept="image/*"
              id="banner-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="banner-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200"
            >
              Upload Image
            </label>
            <p className="mt-1 text-[11px] text-slate-500">
              Recommended: 1200×400, JPG/PNG
            </p>
            {formData.bannerimage && (
              <div className="mt-3 w-full">
                <img
                  src={formData.bannerimage}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 mt-2 cursor-pointer">
            <div className="relative inline-flex h-5 w-9 items-center rounded-full border border-slate-300 bg-slate-100">
              <input
                type="checkbox"
                checked={formData.isactive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isactive: e.target.checked,
                  }))
                }
                className="peer sr-only"
              />
              <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-all peer-checked:translate-x-4 peer-checked:bg-emerald-500" />
            </div>
            <span>{formData.isactive ? "Active department" : "Inactive"}</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
          Department Description
        </label>
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="min-h-[140px]"
            theme="snow"
            placeholder="Describe the department, types of cases handled, technology used, specialist team, etc."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }],
                ["link"],
                ["clean"],
              ],
            }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          This text will appear on the website / patient-facing view of the
          department.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Success Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 95"
            value={formData.success_rate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                success_rate: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Patients Treated
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g., 1200"
            value={formData.patients}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                patients: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g., 15"
            value={formData.experience}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                experience: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white border-b-transparent animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>
                {editingId ? "Update Department" : "Create Department"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
