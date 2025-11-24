import { useState, useEffect } from "react";
import {
    Star,
    Person,
    CalendarToday,
    ThumbUp,
    ThumbDown,
    TrendingUp,
    FilterList,
    Analytics,
    SentimentSatisfied,
    SentimentDissatisfied,
    RateReview,
    CheckCircle,
    Delete,
    Edit,
    Visibility,
    Search,
    Refresh,
    Add,
} from "@mui/icons-material";

// Import all API functions
import {
    getAllFeedback,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    searchFeedback,
    getApprovedFeedback,
    getPendingFeedback,
    getFeedbackByRating,
    toggleFeedbackApproval,
    getFeedbackStats,
} from '../../../api/userApi';

const FeedbackManagement = () => {
    // State management
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [approvalFilter, setApprovalFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [addForm, setAddForm] = useState({
        fullname: "",
        mobilenumber: "",
        rating: 5,
        feedback: "",
        isapproved: false,
    });
    const [stats, setStats] = useState(null);

    // Load all feedback
    const loadFeedback = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllFeedback();
            setFeedback(data);

            // Load statistics
            const statistics = await getFeedbackStats();
            setStats(statistics);
        } catch (err) {
            setError(err.message);
            console.error("Failed to load feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search feedback
    const handleSearch = async (query = searchTerm) => {
        if (!query.trim()) {
            await loadFeedback();
            return;
        }

        try {
            setLoading(true);
            const results = await searchFeedback(query);
            setFeedback(results);
        } catch (err) {
            setError(err.message);
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter feedback based on current filters
    const filteredFeedback = feedback.filter((item) => {
        const matchesApproval =
            approvalFilter === "all" ||
            (approvalFilter === "approved" && item.isapproved) ||
            (approvalFilter === "pending" && !item.isapproved);

        const matchesRating =
            ratingFilter === "all" || item.rating === parseInt(ratingFilter);

        const matchesSearch =
            item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.mobilenumber?.includes(searchTerm);

        return matchesApproval && matchesRating && matchesSearch;
    });

    // Toggle approval status
    const handleApproveToggle = async (id, currentStatus) => {
        try {
            await toggleFeedbackApproval(id, currentStatus);
            await loadFeedback(); // Refresh data
        } catch (err) {
            setError(err.message);
            alert("Failed to update approval status");
        }
    };

    // Delete feedback
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await deleteFeedback(id);
                await loadFeedback(); // Refresh data
                alert("Feedback deleted successfully!");
            } catch (err) {
                setError(err.message);
                alert("Failed to delete feedback");
            }
        }
    };

    // Edit feedback
    const handleEdit = (feedbackItem) => {
        setEditForm(feedbackItem);
        setEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateFeedback(editForm.id, editForm);
            setEditModal(false);
            await loadFeedback(); // Refresh data
            alert("Feedback updated successfully!");
        } catch (err) {
            setError(err.message);
            alert("Failed to update feedback");
        }
    };

    // Add new feedback
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createFeedback(addForm);
            setAddModal(false);
            setAddForm({
                fullname: "",
                mobilenumber: "",
                rating: 5,
                feedback: "",
                isapproved: false,
            });
            await loadFeedback(); // Refresh data
            alert("Feedback added successfully!");
        } catch (err) {
            setError(err.message);
            alert("Failed to add feedback");
        }
    };

    // Utility functions for UI
    const getSentimentColor = (rating) => {
        if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
        if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    const getSentimentIcon = (rating) => {
        if (rating >= 4) return <ThumbUp fontSize="small" />;
        if (rating >= 3) return <SentimentSatisfied fontSize="small" />;
        return <ThumbDown fontSize="small" />;
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return "text-green-600";
        if (rating >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Load data on component mount
    useEffect(() => {
        loadFeedback();
    }, []);

    // Auto-search when search term changes
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    if (loading && feedback.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-blue-600 text-lg">Loading feedback...</div>
            </div>
        );
    }

    if (error && feedback.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-red-600 text-lg mb-4">Error: {error}</div>
                <button
                    onClick={loadFeedback}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Refresh className="mr-2" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-2">
            {/* Header */}
            <div className="max-w-7xl mx-auto px- sm:px-2 lg:px-1">
                <div className="mb-6 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Patient Feedback</h1>
                        <p className="text-gray-600 mt-2">
                            Manage and analyze patient satisfaction and feedback
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Add fontSize="small" />
                            Add Feedback
                        </button>
                        <button
                            onClick={loadFeedback}
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
                                    <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <RateReview className="text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.averageRating}
                                        </p>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    fontSize="small"
                                                    className={
                                                        star <= stats.averageRating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Star className="text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">
                                        {stats.approved}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                                        {stats.pending}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <SentimentDissatisfied className="text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rating Distribution */}
                {stats && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Rating Distribution
                        </h3>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 w-24">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    fontSize="small"
                                                    className={
                                                        star <= stars ? "text-yellow-400" : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">{stars}</span>
                                    </div>
                                    <div className="flex-1 mx-6">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{
                                                    width: `${stats.ratingDistribution[stars] > 0
                                                        ? (stats.ratingDistribution[stars] / stats.total) * 100
                                                        : 0
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-20 text-right">
                                        <span className="text-sm text-gray-600">
                                            {stats.ratingDistribution[stars]} (
                                            {stats.total > 0
                                                ? (
                                                    (stats.ratingDistribution[stars] / stats.total) *
                                                    100
                                                ).toFixed(1)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={approvalFilter}
                                onChange={(e) => setApprovalFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="all">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                            </select>

                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search feedback..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Patient Feedback ({filteredFeedback.length})
                        </h2>
                        {loading && (
                            <div className="text-sm text-blue-600">Updating...</div>
                        )}
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredFeedback.map((item) => (
                            <div
                                key={item.id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(
                                                    item.rating
                                                )}`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {getSentimentIcon(item.rating)}
                                                    {item.rating >= 4
                                                        ? "Positive"
                                                        : item.rating >= 3
                                                            ? "Neutral"
                                                            : "Negative"}
                                                </div>
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${item.isapproved
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                    }`}
                                            >
                                                {item.isapproved ? "Approved" : "Pending Approval"}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {item.fullname
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-lg">
                                                            {item.fullname}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {item.mobilenumber}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span
                                                            className={`text-lg font-bold ${getRatingColor(
                                                                item.rating
                                                            )}`}
                                                        >
                                                            {item.rating}
                                                        </span>
                                                        <Star className={getRatingColor(item.rating)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-3 line-clamp-2">
                                            {item.feedback}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <CalendarToday fontSize="small" />
                                                {formatDate(item.createdat)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        fontSize="small"
                                                        className={
                                                            star <= item.rating
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 lg:flex-col">
                                        <button
                                            onClick={() => {
                                                setSelectedFeedback(item);
                                                setViewModal(true);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                        >
                                            <Visibility fontSize="small" />
                                            View
                                        </button>

                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                                        >
                                            <Edit fontSize="small" />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleApproveToggle(item.id, item.isapproved)
                                            }
                                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${item.isapproved
                                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                                : "bg-green-100 hover:bg-green-200 text-green-700"
                                                }`}
                                        >
                                            <CheckCircle fontSize="small" />
                                            {item.isapproved ? "Unapprove" : "Approve"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                        >
                                            <Delete fontSize="small" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredFeedback.length === 0 && (
                        <div className="text-center py-12">
                            <RateReview className="mx-auto text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500 text-lg">No feedback found</p>
                            <p className="text-gray-400 text-sm">
                                {searchTerm || approvalFilter !== "all" || ratingFilter !== "all"
                                    ? "Try adjusting your filters or search terms"
                                    : "No feedback available yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {viewModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Feedback Details
                                    </h2>
                                    <p className="text-gray-600">From: {selectedFeedback.fullname}</p>
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
                                        Patient Name
                                    </label>
                                    <p className="mt-1 text-gray-900">{selectedFeedback.fullname}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Mobile Number
                                    </label>
                                    <p className="mt-1 text-gray-900">{selectedFeedback.mobilenumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <span
                                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${selectedFeedback.isapproved
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                            }`}
                                    >
                                        {selectedFeedback.isapproved ? "Approved" : "Pending Approval"}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <p className="mt-1 text-gray-900">
                                        {new Date(selectedFeedback.createdat).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Rating</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`text-xl font-bold ${getRatingColor(
                                            selectedFeedback.rating
                                        )}`}
                                    >
                                        {selectedFeedback.rating}/5
                                    </span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                fontSize="small"
                                                className={
                                                    star <= selectedFeedback.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Feedback Message
                                </label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {selectedFeedback.feedback}
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Edit Feedback</h2>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.fullname || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, fullname: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.mobilenumber || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, mobilenumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating
                                </label>
                                <select
                                    value={editForm.rating || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, rating: parseInt(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Rating</option>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} Star{rating !== 1 ? "s" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback
                                </label>
                                <textarea
                                    value={editForm.feedback || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, feedback: e.target.value })
                                    }
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editForm.isapproved || false}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, isapproved: e.target.checked })
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Approved</label>
                            </div>
                        </form>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModal(false)}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Feedback
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
                            <h2 className="text-xl font-bold text-gray-900">Add New Feedback</h2>
                        </div>

                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={addForm.fullname}
                                    onChange={(e) =>
                                        setAddForm({ ...addForm, fullname: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={addForm.mobilenumber}
                                    onChange={(e) =>
                                        setAddForm({ ...addForm, mobilenumber: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating
                                </label>
                                <select
                                    value={addForm.rating}
                                    onChange={(e) =>
                                        setAddForm({ ...addForm, rating: parseInt(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} Star{rating !== 1 ? "s" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback
                                </label>
                                <textarea
                                    value={addForm.feedback}
                                    onChange={(e) =>
                                        setAddForm({ ...addForm, feedback: e.target.value })
                                    }
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={addForm.isapproved}
                                    onChange={(e) =>
                                        setAddForm({ ...addForm, isapproved: e.target.checked })
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Approved</label>
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
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackManagement;