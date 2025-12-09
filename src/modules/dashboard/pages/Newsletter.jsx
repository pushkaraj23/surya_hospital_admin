import React from "react";
import { useEffect, useState } from "react";
import {
  fetchNewsletterList,
  deleteNewsletterById,
} from "../../../api/userApi";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const Newsletter = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ---------------- Load Newsletter List ---------------- */
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsletterList();
      setList(data);
    } catch (err) {
      console.error("Error loading newsletters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- Delete Subscriber ---------------- */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this email?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteNewsletterById(id);
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting email:", err);
      alert("Failed to delete. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
             bg-gradient-to-br from-primary/10 to-white border border-gray-200"
      >
        {/* Decorative Blobs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* LEFT — Title & Description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-secondary"></div>
              <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                Marketing & Engagement
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
              Newsletter Subscriptions
            </h1>

            <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
              View, manage, and maintain all user newsletter subscriptions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500 py-10 text-lg">
            Loading subscriptions...
          </p>
        )}

        {/* Empty State */}
        {!loading && list.length === 0 && (
          <p className="text-center text-gray-600 py-10 text-lg">
            No newsletter subscriptions found.
          </p>
        )}

        {/* Table */}
        {!loading && list.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4">#ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Subscribed On</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{item.id}</td>

                    <td className="py-3 px-4">{item.email}</td>

                    <td className="py-3 px-4 text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className={`px-4 py-2 rounded-lg text-white transition flex items-center justify-center mx-auto ${
                          deletingId === item.id
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {deletingId === item.id ? (
                          "Deleting..."
                        ) : (
                          <FiTrash2 className="text-lg" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
