import { useState, useEffect } from "react";
import {
    Email,
    Person,
    CalendarToday,
    CheckCircle,
    Pending,
    Reply,
    Delete,
    Visibility,
    Phone,
    Add,
    FilterList,
    Refresh,
    MarkEmailRead,
} from "@mui/icons-material";

// Import your contact service functions
import {
    getAllContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    updateContactStatus,
    getContactStats,
} from '../../../api/userApi';

const Inquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [stats, setStats] = useState(null);
    const [addForm, setAddForm] = useState({
        fullname: "",
        mobilenumber: "",
        email: "",
        subject: "",
        message: "",
        status: "New",
    });
    const [replyMessage, setReplyMessage] = useState("");

    // Load all inquiries
    const loadInquiries = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllContacts();
            setInquiries(data);

            const statistics = await getContactStats();
            setStats(statistics);
        } catch (err) {
            setError(err.message);
            console.error("Failed to load inquiries:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search inquiries
    const handleSearch = async (query = searchTerm) => {
        if (!query.trim()) {
            await loadInquiries();
            return;
        }

        try {
            setLoading(true);
            const results = await searchContacts(query);
            setInquiries(results);
        } catch (err) {
            setError(err.message);
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Update inquiry status
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateContactStatus(id, newStatus);
            await loadInquiries();
        } catch (err) {
            setError(err.message);
            alert("Failed to update status");
        }
    };

    // Delete inquiry
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await deleteContact(id);
                await loadInquiries();
                alert("Inquiry deleted successfully!");
            } catch (err) {
                setError(err.message);
                alert("Failed to delete inquiry");
            }
        }
    };

    // Add new inquiry
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createContact(addForm);
            setAddModal(false);
            setAddForm({
                fullname: "",
                mobilenumber: "",
                email: "",
                subject: "",
                message: "",
                status: "New",
            });
            await loadInquiries();
            alert("Inquiry added successfully!");
        } catch (err) {
            setError(err.message);
            alert("Failed to add inquiry");
        }
    };

    // Send reply
    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedInquiry) return;

        try {
            // Update status to "Replied"
            await updateContactStatus(selectedInquiry.id, "Replied");

            setReplyModal(false);
            setReplyMessage("");
            await loadInquiries();
            alert("Reply sent successfully!");
        } catch (err) {
            setError(err.message);
            alert("Failed to send reply");
        }
    };

    // Filter inquiries based on current filters
    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesStatus = filter === "all" || inquiry.status === filter;
        const matchesSearch =
            inquiry.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Utility functions for UI
    const getStatusColor = (status) => {
        switch (status) {
            case "Replied":
            case "Resolved":
                return "bg-green-100 text-green-800 border-green-200";
            case "In Progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "New":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "New":
                return <Pending fontSize="small" />;
            case "In Progress":
                return <Refresh fontSize="small" />;
            case "Replied":
                return <MarkEmailRead fontSize="small" />;
            case "Resolved":
                return <CheckCircle fontSize="small" />;
            default:
                return <Pending fontSize="small" />;
        }
    };

    const getCategoryFromSubject = (subject) => {
        if (!subject) return "General Inquiry";
        const subjectLower = subject.toLowerCase();
        if (subjectLower.includes('appointment')) return "Appointment";
        if (subjectLower.includes('insurance')) return "Insurance";
        if (subjectLower.includes('referral')) return "Referral";
        if (subjectLower.includes('medical record') || subjectLower.includes('records')) return "Medical Records";
        if (subjectLower.includes('billing') || subjectLower.includes('payment')) return "Billing";
        if (subjectLower.includes('emergency')) return "Emergency";
        return "General Inquiry";
    };

    const getCategoryColor = (category) => {
        const colors = {
            "General Inquiry": "bg-purple-100 text-purple-800 border-purple-200",
            "Appointment": "bg-indigo-100 text-indigo-800 border-indigo-200",
            "Insurance": "bg-teal-100 text-teal-800 border-teal-200",
            "Referral": "bg-pink-100 text-pink-800 border-pink-200",
            "Medical Records": "bg-cyan-100 text-cyan-800 border-cyan-200",
            "Billing": "bg-orange-100 text-orange-800 border-orange-200",
            "Emergency": "bg-red-100 text-red-800 border-red-200"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Load data on component mount
    useEffect(() => {
        loadInquiries();
    }, []);

    // Auto-search when search term changes
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    if (loading && inquiries.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-blue-600 text-lg">Loading inquiries...</div>
            </div>
        );
    }

    if (error && inquiries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-red-600 text-lg mb-4">Error: {error}</div>
                <button
                    onClick={loadInquiries}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Refresh fontSize="small" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-2">
            <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
                {/* Header */}
                <div className=" mb-8 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">📩 Patient Inquiries</h1>
                        <p className="text-gray-600 mt-2">Manage and respond to patient questions and requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <Add fontSize="small" />
                            New Inquiry
                        </button>
                        <button
                            onClick={loadInquiries}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg  transition-colors"
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
                                    <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Email className="text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">New</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.new}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Pending className="text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Refresh className="text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Replied">Replied</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by name, email, subject, or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-80"
                            />
                        </div>
                    </div>
                </div>

                {/* Inquiries List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Patient Inquiries ({filteredInquiries.length})
                        </h2>
                        {loading && (
                            <div className="text-sm text-blue-600 flex items-center gap-2">
                                <Refresh className="animate-spin" fontSize="small" />
                                Updating...
                            </div>
                        )}
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredInquiries.map((inquiry) => {
                            const category = getCategoryFromSubject(inquiry.subject);

                            return (
                                <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(inquiry.status)}
                                                        {inquiry.status}
                                                    </div>
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}>
                                                    {category}
                                                </span>
                                            </div>

                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {inquiry.fullname?.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{inquiry.fullname}</h3>
                                                    <p className="text-gray-600 text-sm">{inquiry.subject}</p>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-3 line-clamp-2">{inquiry.message}</p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Email fontSize="small" />
                                                    {inquiry.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone fontSize="small" />
                                                    {inquiry.mobilenumber}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CalendarToday fontSize="small" />
                                                    {formatDate(inquiry.createdat)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 lg:flex-col">
                                            <button
                                                onClick={() => {
                                                    setSelectedInquiry(inquiry);
                                                    setViewModal(true);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                            >
                                                <Visibility fontSize="small" />
                                                View
                                            </button>

                                            {inquiry.status === "New" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedInquiry(inquiry);
                                                        setReplyMessage(`Dear ${inquiry.fullname},\n\nThank you for your inquiry regarding "${inquiry.subject}".\n\n`);
                                                        setReplyModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                                                >
                                                    <Reply fontSize="small" />
                                                    Reply
                                                </button>
                                            )}

                                            {inquiry.status === "New" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry.id, "In Progress")}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
                                                >
                                                    <Refresh fontSize="small" />
                                                    Start Progress
                                                </button>
                                            )}

                                            {inquiry.status !== "Resolved" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry.id, "Resolved")}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle fontSize="small" />
                                                    Resolve
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(inquiry.id)}
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

                    {filteredInquiries.length === 0 && (
                        <div className="text-center py-12">
                            <Email className="mx-auto text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500 text-lg">No inquiries found</p>
                            <p className="text-gray-400 text-sm">
                                {searchTerm || filter !== "all"
                                    ? "Try adjusting your filters or search terms"
                                    : "No inquiries available yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {viewModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedInquiry.subject}</h2>
                                    <p className="text-gray-600">From: {selectedInquiry.fullname}</p>
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
                                    <label className="text-sm font-medium text-gray-700">Patient Name</label>
                                    <p className="mt-1 text-gray-900">{selectedInquiry.fullname}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-gray-900">{selectedInquiry.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <p className="mt-1 text-gray-900">{selectedInquiry.mobilenumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <p className="mt-1 text-gray-900">
                                        {formatDate(selectedInquiry.createdat)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(selectedInquiry.status)}
                                        {selectedInquiry.status}
                                    </div>
                                </span>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(getCategoryFromSubject(selectedInquiry.subject))}`}>
                                    {getCategoryFromSubject(selectedInquiry.subject)}
                                </span>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Message</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">{selectedInquiry.message}</p>
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
                                        setReplyModal(true);
                                        setViewModal(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Send Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {addModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Add New Inquiry</h2>
                        </div>

                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={addForm.fullname}
                                    onChange={(e) => setAddForm({ ...addForm, fullname: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    value={addForm.mobilenumber}
                                    onChange={(e) => setAddForm({ ...addForm, mobilenumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    value={addForm.subject}
                                    onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message *
                                </label>
                                <textarea
                                    value={addForm.message}
                                    onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </form>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAddModal(false)}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {replyModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Reply to {selectedInquiry.fullname}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To:
                                </label>
                                <p className="bg-gray-100 p-3 rounded-lg">{selectedInquiry.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject:
                                </label>
                                <p className="bg-gray-100 p-3 rounded-lg">
                                    Re: {selectedInquiry.subject}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Reply:
                                </label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows="6"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Type your reply here..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setReplyModal(false)}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default Inquiry;