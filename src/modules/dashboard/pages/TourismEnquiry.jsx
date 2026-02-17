import React, { useEffect, useState } from "react";
import {
  getTourismEnquiries,
  updateTourismEnquiry,
  deleteTourismEnquiry,
} from "../../../api/userApi";
import {
  Delete,
  Refresh,
  CheckCircle,
  RadioButtonUnchecked,
  Email,
  Phone,
  Public,
  CalendarToday,
  FlightTakeoff,
  Visibility,
  LocalHospital,
  ChatBubbleOutline,
  FilterList,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "all", label: "All", icon: FilterList },
  { id: "checked", label: "Checked", icon: CheckCircle },
  { id: "unchecked", label: "Unchecked", icon: RadioButtonUnchecked },
];

const TourismEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewEnquiry, setViewEnquiry] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getTourismEnquiries();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading tourism enquiries:", err);
      alert("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleChecked = async (enquiry) => {
    try {
      setUpdatingId(enquiry.id);
      const newChecked = !enquiry.checked;
      await updateTourismEnquiry(enquiry.id, {
        ...enquiry,
        checked: newChecked,
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, checked: newChecked } : e))
      );
      if (viewEnquiry?.id === enquiry.id) {
        setViewEnquiry((prev) => (prev ? { ...prev, checked: newChecked } : null));
      }
    } catch (err) {
      console.error("Error updating enquiry:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteTourismEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (viewEnquiry?.id === id) setViewEnquiry(null);
    } catch (err) {
      console.error("Error deleting enquiry:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (activeTab === "all") return true;
    if (activeTab === "checked") return e.checked === true;
    return e.checked !== true;
  });

  const counts = {
    all: enquiries.length,
    checked: enquiries.filter((e) => e.checked).length,
    unchecked: enquiries.filter((e) => !e.checked).length,
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/80">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-3xl py-6 px-6 md:px-8 shadow-xl relative overflow-hidden
             bg-gradient-to-br from-primary/10 to-white border border-gray-200"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-5 w-1 rounded-full bg-secondary" />
              <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                Medical Tourism
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary flex items-center gap-2">
              <FlightTakeoff className="text-secondary" />
              Tourism Enquiries
            </h1>
            <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
              Manage medical tourism enquiries. View, mark as handled, or remove.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 shadow-md hover:shadow-lg"
          >
            <Refresh className={loading ? "animate-spin" : ""} fontSize="small" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Tabs: All | Checked | Unchecked */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = counts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
                ${isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/40 hover:bg-primary/5"
                }
              `}
            >
              <Icon fontSize="small" />
              {tab.label}
              <span
                className={`
                  ml-1 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs flex items-center justify-center
                  ${isActive ? "bg-white/25" : "bg-gray-100 text-gray-600"}
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <div className="space-y-4">
        {loading && enquiries.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading enquiries...</p>
          </div>
        )}

        {!loading && enquiries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center"
          >
            <FlightTakeoff className="mx-auto text-gray-300 mb-4" style={{ fontSize: 48 }} />
            <p className="text-gray-600 text-lg">No tourism enquiries yet.</p>
            <p className="text-gray-500 text-sm mt-1">New enquiries will appear here.</p>
          </motion.div>
        )}

        {!loading && enquiries.length > 0 && filteredEnquiries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
          >
            <p className="text-gray-600">
              No {activeTab === "checked" ? "checked" : "unchecked"} enquiries in this view.
            </p>
            <button
              onClick={() => setActiveTab("all")}
              className="mt-3 text-primary hover:underline text-sm font-medium"
            >
              View all
            </button>
          </motion.div>
        )}

        {!loading && filteredEnquiries.length > 0 && (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredEnquiries.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                  className={`
                    rounded-2xl border-2 overflow-hidden shadow-sm transition-shadow hover:shadow-md
                    ${item.checked
                      ? "bg-gray-50/80 border-gray-200"
                      : "bg-white border-primary/20"
                    }
                  `}
                >
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
                    {/* Status toggle + main info */}
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                      <button
                        onClick={() => handleToggleChecked(item)}
                        disabled={updatingId === item.id}
                        className={`
                          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition
                          ${item.checked
                            ? "bg-primary/15 text-primary hover:bg-primary/25"
                            : "bg-gray-100 text-gray-400 hover:bg-primary/10 hover:text-primary"
                          }
                          disabled:opacity-50
                        `}
                        title={item.checked ? "Mark as unchecked" : "Mark as checked"}
                      >
                        {item.checked ? (
                          <CheckCircle fontSize="medium" />
                        ) : (
                          <RadioButtonUnchecked fontSize="medium" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`
                              font-semibold text-base
                              ${item.checked ? "text-gray-500 line-through" : "text-gray-900"}
                            `}
                          >
                            {item.full_name || "—"}
                          </span>
                          <span
                            className={`
                              text-xs px-2 py-0.5 rounded-full font-medium
                              ${item.checked
                                ? "bg-gray-200 text-gray-500"
                                : "bg-primary/15 text-primary"
                              }
                            `}
                          >
                            {item.enquiry_type || "Enquiry"}
                          </span>
                          {item.checked && (
                            <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                              <CheckCircle fontSize="small" /> Handled
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Email fontSize="small" className="text-gray-400" />
                            {item.email || "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone fontSize="small" className="text-gray-400" />
                            {item.phone || "—"}
                          </span>
                          {item.country && (
                            <span className="flex items-center gap-1">
                              <Public fontSize="small" className="text-gray-400" />
                              {item.country}
                            </span>
                          )}
                        </div>
                        {(item.treatment_interest || item.message) && (
                          <p
                            className={`
                              mt-1.5 text-sm truncate max-w-xl
                              ${item.checked ? "text-gray-400" : "text-gray-600"}
                            `}
                          >
                            {item.treatment_interest && (
                              <span className="flex items-center gap-1">
                                <LocalHospital fontSize="small" className="text-gray-400" />
                                {item.treatment_interest}
                              </span>
                            )}
                            {item.treatment_interest && item.message && " · "}
                            {item.message && (
                              <span className="flex items-center gap-1">
                                <ChatBubbleOutline fontSize="small" className="text-gray-400" />
                                {item.message}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta + actions */}
                    <div className="flex flex-shrink-0 items-center gap-3 md:gap-4 pl-12 sm:pl-14 md:pl-0">
                      {item.expected_travel_date && (
                        <span
                          className={`
                            flex items-center gap-1 text-sm
                            ${item.checked ? "text-gray-400" : "text-gray-600"}
                          `}
                        >
                          <CalendarToday fontSize="small" />
                          {formatDate(item.expected_travel_date)}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewEnquiry(item)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary transition"
                          title="View details"
                        >
                          <Visibility fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Delete fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* View Enquiry Modal */}
      <AnimatePresence>
        {viewEnquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setViewEnquiry(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div
                className={`
                  p-6 border-b flex justify-between items-center
                  ${viewEnquiry.checked ? "bg-gray-50 border-gray-200" : "bg-primary/5 border-primary/20"}
                `}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {viewEnquiry.full_name}
                  </h2>
                  {viewEnquiry.checked && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      Handled
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setViewEnquiry(null)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.email || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.phone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Country</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.country || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Contact</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.preferred_contact || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Interest</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.treatment_interest || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Enquiry Type</label>
                    <p className="text-gray-900 mt-0.5">{viewEnquiry.enquiry_type || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Travel Date</label>
                    <p className="text-gray-900 mt-0.5">
                      {formatDate(viewEnquiry.expected_travel_date)}
                    </p>
                  </div>
                </div>
                {viewEnquiry.message && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</label>
                    <div className="mt-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-700 whitespace-pre-line text-sm">{viewEnquiry.message}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setViewEnquiry(null)}
                  className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => handleToggleChecked(viewEnquiry)}
                  disabled={updatingId === viewEnquiry.id}
                  className={`
                    px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-60
                    ${viewEnquiry.checked
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-primary text-white hover:bg-primary-dark"
                    }
                  `}
                >
                  {viewEnquiry.checked ? "Mark unchecked" : "Mark as checked"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TourismEnquiry;
