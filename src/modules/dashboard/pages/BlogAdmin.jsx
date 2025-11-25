import { useState, useEffect } from "react";
import {
    Search,
    Download,
    Edit,
    Delete,
    Add,
    Category,
} from "@mui/icons-material";
import {
    getBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    getBlogCategories
} from "../../../api/userApi";

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [error, setError] = useState('');

    // Load data from API
    useEffect(() => {
        loadBlogs();
    }, []);

    useEffect(() => {
        filterBlogs();
    }, [searchTerm, statusFilter, categoryFilter, blogs]);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const data = await getBlogs();
            setBlogs(data);

            // Extract categories from blogs
            const uniqueCategories = [...new Set(data.map(blog => blog.category).filter(Boolean))];
            setCategories(uniqueCategories);

            setError('');
        } catch (err) {
            setError('Failed to load blogs');
            console.error('Error loading blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterBlogs = () => {
        let filtered = blogs;

        if (searchTerm) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((blog) =>
                statusFilter === 'published' ? blog.isactive : !blog.isactive
            );
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter((blog) => blog.category === categoryFilter);
        }

        setFilteredBlogs(filtered);
    };

    const getStatusColor = (isActive) => {
        return isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
    };

    const handleDeleteBlog = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await deleteBlog(id);
                await loadBlogs();
                setError('');
            } catch (err) {
                setError('Failed to delete blog');
                console.error('Error deleting blog:', err);
            }
        }
    };

    const handleSaveBlog = async (blogData) => {
        try {
            // Transform data for API - exact match to your API structure
            const apiData = {
                title: blogData.title,
                slug: blogData.slug,
                image: blogData.image,
                category: blogData.category,
                content: blogData.content,
                author: blogData.author,
                isactive: blogData.isactive
            };

            if (editingBlog) {
                await updateBlog(editingBlog.id, apiData);
            } else {
                await addBlog(apiData);
            }

            await loadBlogs();
            setShowBlogModal(false);
            setEditingBlog(null);
            setError('');
        } catch (err) {
            setError('Failed to save blog');
            console.error('Error saving blog:', err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await toggleBlogStatus(id, !currentStatus);
            await loadBlogs();
            setError('');
        } catch (err) {
            setError('Failed to update blog status');
            console.error('Error toggling status:', err);
        }
    };

    const exportToCSV = () => {
        const headers = ["Title", "Category", "Author", "Status", "Created Date"];
        const csvData = filteredBlogs.map((blog) => [
            blog.title,
            blog.category || "Uncategorized",
            blog.author,
            blog.isactive ? 'Active' : 'Inactive',
            blog.createdat ? new Date(blog.createdat).toLocaleDateString() : "Not available",
        ]);

        const csv = [headers, ...csvData]
            .map((r) => r.map((f) => `"${f}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "blogs.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-blue-600 font-semibold">
                Loading Blogs...
            </div>
        );
    }

    return (
        <div className="py-2 min-h-screen">
            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-3 rounded-xl shadow-sm mb-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Edit className="text-blue-600" />
                    Blog & Article Management
                </h1>
                <p className="text-gray-500 mt-1">Create, edit and manage blog posts</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => {
                        setEditingBlog(null);
                        setShowBlogModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Add fontSize="small" /> New Blog Post
                </button>
                <button
                    onClick={exportToCSV}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Download fontSize="small" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-200 p-4 rounded-xl border border-gray-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                    <option value="all">All Status</option>
                    <option value="published">Active</option>
                    <option value="draft">Inactive</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                    <option value="all">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <div className="text-sm text-gray-600 flex items-center">
                    {filteredBlogs.length} blog(s) found
                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <table className="w-full">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-5 text-left font-semibold">Blog Post</th>
                            <th className="py-3 px-5 text-left font-semibold">Category</th>
                            <th className="py-3 px-5 text-left font-semibold">Author</th>
                            <th className="py-3 px-5 text-left font-semibold">Status</th>
                            <th className="py-3 px-5 text-left font-semibold">Created Date</th>
                            <th className="py-3 px-5 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map((blog) => (
                            <tr key={blog.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-5">
                                    <div className="flex items-center gap-3">
                                        {blog.image && (
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="font-semibold text-gray-800">{blog.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                {blog.content?.substring(0, 100)}...
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-5 text-gray-700">
                                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                                        {blog.category || "Uncategorized"}
                                    </span>
                                </td>
                                <td className="py-3 px-5 text-gray-700">
                                    {blog.author}
                                </td>
                                <td className="py-3 px-5">
                                    <button
                                        onClick={() => handleToggleStatus(blog.id, blog.isactive)}
                                        className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${getStatusColor(blog.isactive)}`}
                                    >
                                        {blog.isactive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="py-3 px-5 text-gray-700">
                                    {blog.createdat ? (
                                        <>
                                            {new Date(blog.createdat).toLocaleDateString()}
                                            <br />
                                            <span className="text-sm text-gray-500">
                                                {new Date(blog.createdat).toLocaleTimeString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Not available</span>
                                    )}
                                </td>
                                <td className="py-3 px-5 flex gap-2">
                                    <button
                                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg"
                                        onClick={() => {
                                            setEditingBlog(blog);
                                            setShowBlogModal(true);
                                        }}
                                    >
                                        <Edit fontSize="small" />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                                        onClick={() => handleDeleteBlog(blog.id)}
                                    >
                                        <Delete fontSize="small" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Categories Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-100 px-5 py-3 border-b">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Category className="text-blue-500" />
                        Blog Categories
                    </h3>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800">{category}</h4>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">/{category.toLowerCase().replace(/\s+/g, '-')}</div>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>{blogs.filter(blog => blog.category === category).length} posts</span>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-3 text-center py-8 text-gray-500">
                                No categories found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Blog Modal */}
            {showBlogModal && (
                <BlogModal
                    blog={editingBlog}
                    categories={categories}
                    onSave={handleSaveBlog}
                    onClose={() => {
                        setShowBlogModal(false);
                        setEditingBlog(null);
                    }}
                />
            )}
        </div>
    );
};

// Blog Modal Component - Updated to match API structure
const BlogModal = ({ blog, categories, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        image: "",
        category: "",
        content: "",
        author: "",
        isactive: true
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                slug: blog.slug || "",
                image: blog.image || "",
                category: blog.category || "",
                content: blog.content || "",
                author: blog.author || "",
                isactive: blog.isactive !== undefined ? blog.isactive : true
            });
        } else {
            // Set default category if available
            if (categories.length > 0) {
                setFormData(prev => ({ ...prev, category: categories[0] }));
            }
        }
    }, [blog, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="Enter URL slug"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="Enter category"
                                list="categories"
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                            <input
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.author}
                                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="Enter author name"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Image *
                                </label>

                                {!formData.image ? (
                                    // Upload area when no image is selected
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-10 h-10 mb-2 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                                                />
                                            </svg>
                                            <p className="text-sm">Click or drag to upload</p>
                                        </div>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const imageUrl = URL.createObjectURL(file);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        image: imageUrl,
                                                        imageFile: file,
                                                    }));
                                                }
                                            }}
                                        />
                                    </label>
                                ) : (
                                    // When image is uploaded
                                    <div className="relative group">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="h-40 w-full object-cover rounded-lg border border-gray-300"
                                        />

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 rounded-lg opacity-0 group-hover:opacity-100 transition">
                                            <label
                                                htmlFor="image-upload"
                                                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md cursor-pointer hover:bg-blue-700 transition"
                                            >
                                                Change
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        image: "",
                                                        imageFile: null,
                                                    }));
                                                }}
                                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const imageUrl = URL.createObjectURL(file);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        image: imageUrl,
                                                        imageFile: file,
                                                    }));
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Optional: Also allow URL manually */}
                            <div className="my-2 text-sm text-gray-500 text-center">or paste image URL</div>

                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image.startsWith("blob:") ? "" : formData.image}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        image: e.target.value,
                                        imageFile: null, // reset file if URL is entered
                                    }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                            {/* Image Preview */}
                            {formData.image && (
                                <div className="mt-3">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="h-32 w-auto rounded-lg object-cover shadow-sm border"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                        <textarea
                            rows="8"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Enter blog content"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isactive"
                            checked={formData.isactive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isactive: e.target.checked }))}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isactive" className="text-sm font-medium text-gray-700">
                            Active (Published)
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            {blog ? 'Update' : 'Create'} Blog Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogAdmin;