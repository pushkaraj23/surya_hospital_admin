import React, { useEffect, useState } from "react";
import {
  fetchPolicies,
  fetchPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../../../api/userApi";

import { Plus, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    policy: "",
  });

  // Load policies
  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await fetchPolicies();
      setPolicies(data);
    } catch (err) {
      console.error("Load policies error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Quill Change
  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, policy: value }));
  };

  // Open Create
  const openCreateModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      title: "",
      policy: "",
    });
    setModalOpen(true);
  };

  // Open Edit
  const openEditModal = async (id) => {
    try {
      setEditMode(true);
      setSelectedId(id);

      const data = await fetchPolicyById(id);

      setFormData({
        title: data.title,
        policy: data.policy,
      });

      setModalOpen(true);
    } catch (err) {
      console.error("Edit load error:", err);
    }
  };

  // VIEW POLICY
  const openViewModal = async (id) => {
    try {
      const data = await fetchPolicyById(id);
      setViewData(data);
      setViewModalOpen(true);
    } catch (err) {
      console.error("View load error:", err);
    }
  };

  // Submit Create / Update
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updatePolicy(selectedId, formData);
      } else {
        await createPolicy(formData);
      }

      setModalOpen(false);
      loadPolicies();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    try {
      await deletePolicy(id);
      loadPolicies();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="text-primary">
      {/* HEADER */}
      <div className="mb-7">
        <div
          className="rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
                        bg-gradient-to-br from-primary/10 to-white border border-gray-200"
        >
          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-secondary"></div>
                <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                  Policy Controls
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-primary">
                Policies Management
              </h1>

              <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
                Create, update, manage and review all hospital policies.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl 
                           bg-gradient-to-br from-accent to-secondary text-white font-semibold
                           shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                <Plus size={16} />
                Add Policy
              </button>

              <button
                onClick={loadPolicies}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl 
                           border border-gray-300 bg-white text-primary font-semibold
                           shadow-md hover:bg-gray-50 active:scale-95 transition-all"
              >
                <RefreshCw size={16} className="text-primary/60" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-primary/10 p-4 rounded-3xl shadow-md">
        <table className="w-full text-left text-primary">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3">ID</th>
              <th className="py-3">Title</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {policies?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="py-3">{item.id}</td>
                <td className="py-3 font-semibold">{item.title}</td>
                <td className="py-3 flex gap-4">
                  {/* View */}
                  <button
                    onClick={() => openViewModal(item.id)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {policies.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-400">
                  No policies available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-primary-dark rounded-lg w-full max-w-2xl shadow-xl border border-white/10 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-xl font-semibold">
                {editMode ? "Edit Policy" : "Add New Policy"}
              </h3>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="text-sm text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded bg-primary border border-white/10"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Policy</label>
                <div className="bg-white rounded text-black mt-1">
                  <ReactQuill
                    theme="snow"
                    value={formData.policy}
                    onChange={handleQuillChange}
                    className="h-48"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-primary-dark flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-secondary rounded hover:bg-secondary/80"
              >
                {editMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModalOpen && viewData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm p-4 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-xl scrollbarHide shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between h-fit">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {viewData.title}
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="font-bold text-2xl text-primary transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: viewData.policy }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyPage;
