import React, { useEffect, useState } from "react";
import {
  fetchInfra,
  fetchInfraById,
  createInfra,
  updateInfra,
  deleteInfra,
} from "../../../../api/userApi";

import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

const theme = {
  brand: "#ef790b",
  primary: "#263243",
  mute: "#e8e4de",
};

const InfraManager = () => {
  const [infra, setInfra] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    number: "",
    title: "",
  });

  // Load Infra Items
  const loadInfra = async () => {
    try {
      setLoading(true);
      const data = await fetchInfra();
      setInfra(data);
    } catch (err) {
      console.error("Error fetching infra:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfra();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setFormData({
      number: "",
      title: "",
    });
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    try {
      setEditMode(true);
      setSelectedId(id);
      const data = await fetchInfraById(id);

      setFormData({
        number: data.number,
        title: data.title,
      });

      setModalOpen(true);
    } catch (err) {
      console.error("Error loading infra for edit:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) await updateInfra(selectedId, formData);
      else await createInfra(formData);

      setModalOpen(false);
      loadInfra();
    } catch (err) {
      console.error("Error submitting infra:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this infrastructure item?")) return;

    try {
      await deleteInfra(id);
      loadInfra();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#263243]">
          Infrastructure Overview
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={loadInfra}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <RefreshCw size={16} className="text-[#263243]" />
            <span>Refresh</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-md"
            style={{ backgroundColor: theme.brand }}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Grid of Infra Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Add New Card */}
        <button
          onClick={openCreateModal}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 hover:bg-gray-100 transition cursor-pointer"
        >
          <Plus size={32} className="text-gray-500" />
          <p className="text-gray-600 mt-2">Add Infrastructure</p>
        </button>

        {/* Existing Items */}
        {infra.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white shadow-sm p-5 hover:shadow-md transition relative"
          >
            <div className="text-4xl font-bold text-[#263243]">
              {item.number}
            </div>

            <div className="mt-2 text-lg font-semibold text-gray-800">
              {item.title}
            </div>

            {/* Edit/Delete Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => openEditModal(item.id)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Pencil size={18} className="text-blue-600" />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-[#263243]">
              {editMode ? "Edit Infrastructure" : "Add Infrastructure"}
            </h3>

            <div className="space-y-4">
              {/* Number */}
              <div>
                <label className="font-medium text-gray-700">Number</label>
                <input
                  type="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#e8e4de] border border-gray-300 mt-1"
                />
              </div>

              {/* Title */}
              <div>
                <label className="font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-[#e8e4de] border border-gray-300 mt-1"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-[#263243] hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded text-white shadow-md"
                style={{ backgroundColor: theme.brand }}
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

export default InfraManager;
