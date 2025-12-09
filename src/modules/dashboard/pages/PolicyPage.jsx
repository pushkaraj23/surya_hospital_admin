import { useEffect, useState } from "react";
import {
  fetchPolicies,
  fetchPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../../../api/userApi";
import { Plus, RefreshCw } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    policy: "",
  });

  // Load Policies
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

  // Open Create Modal
  const openCreateModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      title: "",
      policy: "",
    });
    setModalOpen(true);
  };

  // Open Edit Modal
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

  // Submit Create / Update
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updatePolicy(selectedId, formData);
      } else {
        await createPolicy(formData); // no ID passed → auto-generated
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
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-3 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-500 text-lg font-semibold">📜</span>
            Policies Management
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Create, update, and manage all hospital policies with ease.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-md text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Add Policy</span>
          </button>

          <button
            onClick={loadPolicies}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-md font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={16} className="text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading policies...</p>
      ) : (
        <div className="bg-primary p-4 rounded-lg shadow-md">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/10 text-gray-300">
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
                  <td className="py-3">{item.title}</td>
                  <td className="py-3 flex gap-3">
                    <button
                      onClick={() => openEditModal(item.id)}
                      className="text-accent hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
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
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className="bg-primary-dark rounded-lg w-full max-w-2xl shadow-xl border border-white/10 
                    max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10">
              <h3 className="text-xl font-semibold">
                {editMode ? "Edit Policy" : "Add New Policy"}
              </h3>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-primary border border-white/10 mt-1"
                />
              </div>

              {/* Policy Quill Editor */}
              <div>
                <label className="text-sm text-gray-300">Policy</label>
                <div className="bg-white rounded text-black mt-1">
                  <ReactQuill
                    theme="snow"
                    value={formData.policy}
                    onChange={handleQuillChange}
                    className="h-48 overflow-y-auto"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Footer Buttons */}
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
    </div>
  );
};

export default PolicyPage;
