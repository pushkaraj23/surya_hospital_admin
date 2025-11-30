import { useState, useEffect } from "react";
import {
  Email,
  Person,
  CalendarToday,
  CheckCircle,
  Pending,
  Reply,
  Delete,
  Star,
  Visibility,
  Phone,
} from "@mui/icons-material";

const MOCK_INQUIRIES = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@email.com", phone: "+91 98765-43210", subject: "General Inquiry About Services", message: "I would like to know more about the cardiology services and the available treatment options.", date: "2024-01-15", status: "pending", type: "inquiry", rating: null },
  { id: 2, name: "Bob Smith", email: "bob.smith@email.com", phone: "+91 98765-43211", subject: "Appointment Rescheduling", message: "I need to reschedule my appointment from next Monday to Wednesday due to urgent work.", date: "2024-01-14", status: "responded", type: "inquiry", rating: null },
  { id: 3, name: "Carol Davis", email: "carol.davis@email.com", phone: "+91 98765-43212", subject: "Insurance Query", message: "Do you accept XYZ insurance provider for orthopedic treatments?", date: "2024-01-13", status: "pending", type: "inquiry", rating: null },
  { id: 4, name: "David Wilson", email: "david.wilson@email.com", phone: "+91 98765-43213", subject: "Excellent Service Experience", message: "The staff was very professional and caring during my recent visit. Thank you for the great service!", date: "2024-01-12", status: "responded", type: "feedback", rating: 5 },
  { id: 5, name: "Emma Brown", email: "emma.brown@email.com", phone: "+91 98765-43214", subject: "Waiting Time Feedback", message: "The waiting time was longer than expected. Please improve this aspect.", date: "2024-01-11", status: "pending", type: "feedback", rating: 3 },
];

const InquiryFeedbackManagement = () => {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setInquiries(MOCK_INQUIRIES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredInquiries = inquiries.filter(i => {
    const matchesFilter = filter === "all" || i.status === filter || i.type === filter;
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setInquiries(prev => prev.map(i => (i.id === id ? { ...i, status: newStatus } : i)));
  };

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const handleReply = i => {
    setSelectedInquiry(i);
    setReplyMessage(`Dear ${i.name},\n\nThank you for your ${i.type}. `);
    setReplyModal(true);
  };

  const sendReply = () => {
    if (replyMessage.trim() && selectedInquiry) {
      handleStatusChange(selectedInquiry.id, "responded");
      setReplyModal(false);
      alert("Reply sent successfully!");
    }
  };

  const getStatusColor = status =>
    status === "responded"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  const getTypeColor = type =>
    type === "feedback"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";

  if (loading)
    return (
      <div className="flex text-blue-600 items-center justify-center h-[80vh] text-gray-700 font-medium">
        Loading Inquiries & Feedback...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-2 space-y-8">
      {/* Header */}
      <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">📩 Inquiry & Feedback Management</h2>
          <p className="text-sm text-gray-500">
            Manage patient inquiries and feedback efficiently
          </p>
        </div>
        <div className="text-sm text-right text-gray-600">
          <p>+91 8888-6890-61</p>
          <p>contact@fibonce.com</p>
          <p>https://www.fibonce.com</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 rounded-xl p-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "responded", "inquiry", "feedback"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border ${filter === f
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name, subject, or email..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full lg:w-80 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Inquiries"
          value={inquiries.filter(i => i.type === "inquiry").length}
          icon={<Email className="text-blue-600" />}
        />
        <StatsCard
          title="Pending Responses"
          value={inquiries.filter(i => i.status === "pending").length}
          icon={<Pending className="text-yellow-600" />}
        />
        <StatsCard
          title="Feedback Received"
          value={inquiries.filter(i => i.type === "feedback").length}
          icon={<Star className="text-purple-600" />}
        />
        <StatsCard
          title="Response Rate"
          value={`${Math.round(
            (inquiries.filter(i => i.status === "responded").length /
              inquiries.length) *
            100
          )}%`}
          icon={<CheckCircle className="text-green-600" />}
        />
      </div>

      {/* Inquiry & Feedback List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">
          Inquiries & Feedback ({filteredInquiries.length})
        </h3>
        <div className="space-y-4">
          {filteredInquiries.length ? (
            filteredInquiries.map(i => (
              <div
                key={i.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                          i.type
                        )}`}
                      >
                        {i.type === "feedback" ? "📊 Feedback" : "📝 Inquiry"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          i.status
                        )}`}
                      >
                        {i.status}
                      </span>
                      {i.rating && (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              fontSize="small"
                              className={
                                idx < i.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Person fontSize="small" />
                      {i.name}
                    </h4>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1">
                        <Email fontSize="small" />
                        {i.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone fontSize="small" />
                        {i.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarToday fontSize="small" />
                        {new Date(i.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-blue-700">{i.subject}</p>
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {i.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    <button
                      onClick={() => setSelectedInquiry(i)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm"
                    >
                      <Visibility fontSize="small" />
                      View
                    </button>
                    {i.status === "pending" && (
                      <button
                        onClick={() => handleReply(i)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 text-sm"
                      >
                        <Reply fontSize="small" />
                        Reply
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleStatusChange(
                          i.id,
                          i.status === "pending" ? "responded" : "pending"
                        )
                      }
                      className={`flex items-center gap-1 px-3 py-2 rounded-md border text-sm ${i.status === "pending"
                          ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                        }`}
                    >
                      {i.status === "pending" ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <Pending fontSize="small" />
                      )}
                      {i.status === "pending"
                        ? "Mark Responded"
                        : "Mark Pending"}
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 text-sm"
                    >
                      <Delete fontSize="small" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No inquiries or feedback found
            </p>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">
              Reply to {selectedInquiry.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">To:</label>
                <p className="bg-gray-100 p-3 rounded-md">
                  {selectedInquiry.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Subject:
                </label>
                <p className="bg-gray-100 p-3 rounded-md">
                  Re: {selectedInquiry.subject}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Your Reply:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setReplyModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Card
const StatsCard = ({ title, value, icon }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 flex justify-between items-center transition-all duration-200">
    <div>
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
    {icon}
  </div>
);

export default InquiryFeedbackManagement;
