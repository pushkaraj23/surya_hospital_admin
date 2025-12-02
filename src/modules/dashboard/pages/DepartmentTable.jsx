// src/pages/departments/DepartmentTable.jsx

import React, { useState } from "react";
import { Edit2, Trash2, Eye, Power, X } from "lucide-react";

export default function DepartmentTable({
  departments,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [viewDept, setViewDept] = useState(null);

  const closeModal = () => setViewDept(null);

  const formatServicesPreview = (services) => {
    if (!services) return "No services listed";
    if (Array.isArray(services)) {
      if (services.length === 0) return "No services listed";
      if (services.length <= 3) return services.join(", ");
      return services.slice(0, 3).join(", ") + ` +${services.length - 3} more`;
    }
    return services;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 rounded-full border-2 border-amber-500 border-b-transparent animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading departments…</p>
      </div>
    );
  }

  return (
    <>
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Services
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stats
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No departments found. Click{" "}
                  <span className="font-semibold text-amber-600">
                    “Add Department”
                  </span>{" "}
                  to create your first one.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Department */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-3">
                      {dept.bannerimage ? (
                        <img
                          src={dept.bannerimage}
                          alt={dept.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-amber-600">
                            {dept.name?.charAt(0)?.toUpperCase() || "D"}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {dept.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          ID: {dept.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Services */}
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs text-slate-600 max-w-xs">
                      {formatServicesPreview(dept.services)}
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="px-4 py-3 align-top">
                    <div className="space-y-1 text-xs text-slate-600">
                      {dept.success_rate != null && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>
                            Success rate:{" "}
                            <span className="font-semibold text-emerald-600">
                              {dept.success_rate}%
                            </span>
                          </span>
                        </div>
                      )}
                      {dept.patients != null && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>
                            Patients:{" "}
                            <span className="font-semibold text-amber-600">
                              {dept.patients.toLocaleString()}
                            </span>
                          </span>
                        </div>
                      )}
                      {dept.experience != null && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span>
                            Experience:{" "}
                            <span className="font-semibold text-indigo-600">
                              {dept.experience} yrs
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        dept.isactive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                      {dept.isactive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => setViewDept(dept)}
                        className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-100"
                        title="View department"
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </button>

                      {/* Toggle Active */}
                      <button
                        type="button"
                        onClick={() => onToggleStatus(dept)}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <Power size={14} className="mr-1" />
                        {dept.isactive ? "Disable" : "Enable"}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(dept)}
                        className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-100"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete department "${dept.name}"? This cannot be undone.`
                            )
                          )
                            onDelete(dept.id);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-amber-500 to-purple-600 text-white">
              <h3 className="text-lg font-bold">{viewDept.name}</h3>
              <button
                onClick={closeModal}
                className="hover:bg-white/20 px-2 py-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Banner */}
              {viewDept.bannerimage && (
                <img
                  src={viewDept.bannerimage}
                  alt={viewDept.name}
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              )}

              {/* Description */}
              <div>
                <h4 className="text-slate-700 font-semibold mb-2">
                  Description
                </h4>
                {viewDept.description ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-lg"
                    dangerouslySetInnerHTML={{
                      __html: viewDept.description,
                    }}
                  ></div>
                ) : (
                  <p className="text-slate-400">No description provided.</p>
                )}
              </div>

              {/* Services */}
              <div>
                <h4 className="text-slate-700 font-semibold mb-2">
                  Services Offered
                </h4>
                {Array.isArray(viewDept.services) &&
                viewDept.services.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {viewDept.services.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-600 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">No services listed.</p>
                )}
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-slate-700 font-semibold mb-2">
                  Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  {viewDept.success_rate != null && (
                    <p>
                      <strong>Success Rate:</strong>{" "}
                      <span className="text-green-600">
                        {viewDept.success_rate}%
                      </span>
                    </p>
                  )}
                  {viewDept.patients != null && (
                    <p>
                      <strong>Patients:</strong>{" "}
                      <span className="text-amber-600">
                        {viewDept.patients.toLocaleString()}
                      </span>
                    </p>
                  )}
                  {viewDept.experience != null && (
                    <p>
                      <strong>Experience:</strong>{" "}
                      <span className="text-purple-600">
                        {viewDept.experience} years
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-slate-700 font-semibold mb-2">Status</h4>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    viewDept.isactive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {viewDept.isactive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
