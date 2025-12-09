// import { useState, useEffect, useCallback } from "react";
// import { fetchContacts, deleteContact, filterContacts, formatDate } from "../../../api/userApi";
// import { Trash2, Search, Loader2 } from "lucide-react";

// const Contact = () => {
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch Contacts
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       console.log("🔄 Fetching contacts...");
//       const data = await fetchContacts();
//       console.log("✅ Contacts fetched:", data);
//       setContacts(data);
//       setError("");
//     } catch (err) {
//       console.error("❌ Error in fetchData:", err);
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Debounce Search for smooth experience
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 300);

//     return () => clearTimeout(t);
//   }, [searchTerm]);

//   // Filter Contacts
//   useEffect(() => {
//     console.log("🔄 Filtering contacts...", {
//       totalContacts: contacts.length,
//       searchTerm: debouncedSearch
//     });
//     const filtered = filterContacts(contacts, debouncedSearch);
//     setFilteredContacts(filtered);
//     console.log("✅ Filtered contacts:", filtered.length);
//   }, [debouncedSearch, contacts]);

//   // Delete Contact
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this contact?")) return;

//     try {
//       console.log("🔄 Deleting contact ID:", id);
//       await deleteContact(id);
//       setContacts((prev) => prev.filter((c) => c.id !== id));
//       console.log("✅ Contact deleted successfully");
//     } catch (err) {
//       console.error("❌ Error deleting contact:", err);
//       alert(err.message);
//     }
//   };

//   // Debug logs
//   useEffect(() => {
//     console.log("📊 Current State:", {
//       contacts: contacts.length,
//       filteredContacts: filteredContacts.length,
//       loading,
//       error,
//       searchTerm,
//       debouncedSearch
//     });
//   }, [contacts, filteredContacts, loading, error, searchTerm, debouncedSearch]);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Messages</h1>

//       {/* Search */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//         <input
//           type="text"
//           className="w-full pl-12 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
//           placeholder="Search by name, email, phone, subject or message..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 border border-red-400 text-red-600 p-4 rounded-lg mb-4">
//           <strong>Error:</strong> {error}
//           <button
//             onClick={fetchData}
//             className="ml-4 underline text-blue-600 hover:text-blue-800"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Loader */}
//       {loading && (
//         <div className="flex items-center justify-center py-8">
//           <Loader2 className="animate-spin mr-2" size={24} />
//           <span>Loading contacts...</span>
//         </div>
//       )}

//       {/* Contacts Count */}
//       {!loading && (
//         <div className="mb-4 text-gray-600">
//           Showing {filteredContacts.length} of {contacts.length} contacts
//         </div>
//       )}

//       {/* No Contacts */}
//       {!loading && filteredContacts.length === 0 && contacts.length === 0 && !error && (
//         <div className="text-center py-10 text-gray-500">
//           <p>No contacts found</p>
//         </div>
//       )}

//       {/* No Search Results */}
//       {!loading && filteredContacts.length === 0 && contacts.length > 0 && (
//         <div className="text-center py-10 text-gray-500">
//           <p>No contacts match your search criteria</p>
//         </div>
//       )}

//       {/* Contacts List */}
//       <div className="space-y-4">
//         {filteredContacts.map((contact) => (
//           <div
//             key={contact.id}
//             className="bg-white p-5 border rounded-lg shadow-sm hover:shadow-md transition"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-lg font-bold text-gray-800">{contact.name}</h2>
//                 <p className="text-gray-600">{contact.email}</p>
//                 <p className="text-gray-600">{contact.phone}</p>
//               </div>

//               <button
//                 onClick={() => handleDelete(contact.id)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition"
//               >
//                 <Trash2 size={16} />
//                 Delete
//               </button>
//             </div>

//             <div className="mt-3">
//               <p>
//                 <strong className="text-gray-700">Subject:</strong>{" "}
//                 <span className="text-gray-600">{contact.subject}</span>
//               </p>

//               <div className="mt-2">
//                 <strong className="text-gray-700">Message:</strong>
//                 <p className="text-gray-600 mt-1">{contact.message}</p>
//               </div>
//             </div>

//             <p className="text-xs text-gray-500 mt-3">
//               Received: {formatDate(contact.created_at)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Contact;

import { useState, useEffect } from "react";
import {
  Email,
  Person,
  CalendarToday,
  Delete,
  Visibility,
  Phone,
  Refresh,
  Subject as SubjectIcon,
  Message,
} from "@mui/icons-material";
import { Trash2, Search, Loader2 } from "lucide-react";

// Import your contact service functions
import {
  fetchContacts,
  deleteContact,
  filterContacts,
  formatDate,
} from "../../../api/userApi";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [stats, setStats] = useState(null);

  // Load all contacts
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching contacts...");
      const data = await fetchContacts();
      console.log("✅ Contacts fetched:", data);
      setContacts(data);
      calculateStats(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (contactsData) => {
    const stats = {
      total: contactsData.length,
      today: contactsData.filter((contact) => {
        const today = new Date().toDateString();
        const contactDate = new Date(contact.created_at).toDateString();
        return contactDate === today;
      }).length,
      thisWeek: contactsData.filter((contact) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(contact.created_at) > oneWeekAgo;
      }).length,
      thisMonth: contactsData.filter((contact) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(contact.created_at) > oneMonthAgo;
      }).length,
    };
    setStats(stats);
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this contact message?")
    ) {
      try {
        console.log("🔄 Deleting contact ID:", id);
        await deleteContact(id);
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        console.log("✅ Contact deleted successfully");
      } catch (err) {
        console.error("❌ Error deleting contact:", err);
        alert("Failed to delete contact message");
      }
    }
  };

  // Search contacts
  const handleSearch = (query = searchTerm) => {
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = filterContacts(contacts, query);
    setFilteredContacts(filtered);
  };

  // Utility functions for UI
  const getCategoryFromSubject = (subject) => {
    if (!subject) return "General Inquiry";
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes("appointment")) return "Appointment";
    if (subjectLower.includes("cardiology")) return "Cardiology";
    if (subjectLower.includes("service") || subjectLower.includes("services"))
      return "Services";
    if (subjectLower.includes("fracture")) return "Orthopedics";
    if (subjectLower.includes("checkup") || subjectLower.includes("package"))
      return "Health Checkup";
    if (subjectLower.includes("emergency")) return "Emergency";
    return "General Inquiry";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "General Inquiry": "bg-purple-100 text-purple-800 border-purple-200",
      Appointment: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Cardiology: "bg-red-100 text-red-800 border-red-200",
      Services: "bg-teal-100 text-teal-800 border-teal-200",
      Orthopedics: "bg-orange-100 text-orange-800 border-orange-200",
      "Health Checkup": "bg-green-100 text-green-800 border-green-200",
      Emergency: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Auto-search when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, contacts]);

  // Load data on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600 text-lg">Loading contact messages...</div>
      </div>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <button
          onClick={loadContacts}
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
      <div className=" mx-auto px-2 sm:px-1 lg:px-1">
        {/* Header */}
        <div className="mb-8 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">📞 Contact Messages</h1>
            <p className="text-gray-600 mt-2">
              Manage patient contact forms and inquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadContacts}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg transition-colors"
            >
              <Refresh fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Messages
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Email className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.today}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CalendarToday className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.thisWeek}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CalendarToday className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.thisMonth}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CalendarToday className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, subject or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Messages ({filteredContacts.length})
            </h2>
            {loading && (
              <div className="text-sm text-blue-600 flex items-center gap-2">
                <Refresh className="animate-spin" fontSize="small" />
                Updating...
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => {
              const category = getCategoryFromSubject(contact.subject);

              return (
                <div
                  key={contact.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                            category
                          )}`}
                        >
                          {category}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {contact.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {contact.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {contact.subject}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {contact.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Email fontSize="small" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone fontSize="small" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarToday fontSize="small" />
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setViewModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <Visibility fontSize="small" />
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      >
                        <Delete fontSize="small" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Email className="mx-auto text-gray-400 text-4xl mb-3" />
              <p className="text-gray-500 text-lg">No contact messages found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No contact messages available yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedContact.subject}
                  </h2>
                  <p className="text-gray-600">From: {selectedContact.name}</p>
                </div>
                <button
                  onClick={() => setViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-gray-900">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedContact.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    getCategoryFromSubject(selectedContact.subject)
                  )}`}
                >
                  {getCategoryFromSubject(selectedContact.subject)}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedContact.subject}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    setViewModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
