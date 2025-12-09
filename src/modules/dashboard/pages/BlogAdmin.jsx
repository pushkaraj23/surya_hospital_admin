import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Edit,
  Delete,
  Add,
  Category,
  Visibility,
  VisibilityOff,
  CalendarMonth,
  Person,
} from "@mui/icons-material";
import {
  getBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  uploadSingleFile,
} from "../../../api/userApi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BASE_URL } from "../../../api/apiConfig";

const BlogAdmin = () => {
  // States
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [error, setError] = useState("");

  // Add custom styles for Quill editor and blog content rendering
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "quill-blog-styles";
    style.textContent = `
            /* Quill Editor Styles */
            .blog-editor-wrapper {
                margin-bottom: 1rem;
            }
            
            .blog-editor-wrapper .ql-container {
                min-height: 300px;
                max-height: 500px;
                overflow-y: auto;
                font-size: 14px;
                font-family: inherit;
                background: white;
            }
            
            .blog-editor-wrapper .ql-editor {
                min-height: 300px;
                line-height: 1.8;
                padding: 15px;
            }
            
            .blog-editor-wrapper .ql-editor.ql-blank::before {
                font-style: normal;
                color: #9ca3af;
                left: 15px;
            }

            .blog-editor-wrapper .ql-toolbar {
                background: #f9fafb;
                border-top-left-radius: 0.5rem;
                border-top-right-radius: 0.5rem;
                border-color: #d1d5db;
            }

            .blog-editor-wrapper .ql-container {
                border-bottom-left-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                border-color: #d1d5db;
            }

            /* Blog Content Display Styles */
            .blog-content {
                line-height: 1.8;
                word-wrap: break-word;
                color: #374151;
            }
            
            .blog-content p {
                margin: 1rem 0;
            }

            .blog-content p:first-child {
                margin-top: 0;
            }

            .blog-content p:last-child {
                margin-bottom: 0;
            }
            
            .blog-content h1,
            .blog-content h2,
            .blog-content h3,
            .blog-content h4 {
                font-weight: 700;
                line-height: 1.3;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                color: #111827;
            }
            
            .blog-content h1 {
                font-size: 2rem;
            }
            
            .blog-content h2 {
                font-size: 1.5rem;
            }
            
            .blog-content h3 {
                font-size: 1.25rem;
            }

            .blog-content h4 {
                font-size: 1.1rem;
            }
            
            .blog-content strong {
                font-weight: 600;
                color: #111827;
            }
            
            .blog-content em {
                font-style: italic;
            }
            
            .blog-content u {
                text-decoration: underline;
            }
            
            .blog-content s {
                text-decoration: line-through;
                opacity: 0.7;
            }
            
            .blog-content ul {
                list-style-type: disc;
                padding-left: 2rem;
                margin: 1rem 0;
            }
            
            .blog-content ol {
                list-style-type: decimal;
                padding-left: 2rem;
                margin: 1rem 0;
            }
            
            .blog-content li {
                margin: 0.5rem 0;
                line-height: 1.7;
            }
            
            .blog-content blockquote {
                border-left: 4px solid #3b82f6;
                padding: 1rem 1.5rem;
                margin: 1.5rem 0;
                background-color: #eff6ff;
                border-radius: 0.25rem;
                font-style: italic;
                color: #1e40af;
            }
            
            .blog-content pre {
                background-color: #1f2937;
                color: #f9fafb;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1rem 0;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
            }
            
            .blog-content code {
                background-color: #fee2e2;
                color: #991b1b;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.875em;
                font-family: 'Courier New', monospace;
            }

            .blog-content pre code {
                background-color: transparent;
                color: inherit;
                padding: 0;
            }
            
            .blog-content a {
                color: #2563eb;
                text-decoration: underline;
                transition: color 0.2s;
            }
            
            .blog-content a:hover {
                color: #1d4ed8;
            }
            
            .blog-content .ql-align-center {
                text-align: center;
            }
            
            .blog-content .ql-align-right {
                text-align: right;
            }
            
            .blog-content .ql-align-justify {
                text-align: justify;
            }

            .blog-content .ql-indent-1 {
                padding-left: 3em;
            }

            .blog-content .ql-indent-2 {
                padding-left: 6em;
            }

            .blog-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem 0;
            }

            .blog-content hr {
                border: none;
                border-top: 2px solid #e5e7eb;
                margin: 2rem 0;
            }

            /* Line clamp for blog card preview */
            .blog-preview-content {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }

            .blog-preview-content * {
                margin: 0;
                padding: 0;
            }
        `;

    const existingStyle = document.getElementById("quill-blog-styles");
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById("quill-blog-styles");
      if (styleToRemove && document.head.contains(styleToRemove)) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  // Load blogs on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  // Filter blogs when dependencies change
  useEffect(() => {
    filterBlogs();
  }, [searchTerm, statusFilter, categoryFilter, blogs]);

  // API Functions
  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
      const uniqueCategories = [
        ...new Set(data.map((blog) => blog.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
      setError("");
    } catch (err) {
      setError("Failed to load blogs");
      console.error("Error loading blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((blog) =>
        statusFilter === "published" ? blog.isactive : !blog.isactive
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((blog) => blog.category === categoryFilter);
    }

    setFilteredBlogs(filtered);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
        await loadBlogs();
        setError("");
      } catch (err) {
        setError("Failed to delete blog");
        console.error("Error deleting blog:", err);
      }
    }
  };

  const handleSaveBlog = async (blogData) => {
    try {
      let imageUrl = blogData.image;
      if (imageUrl && imageUrl.startsWith("blob:")) {
        imageUrl = blogData.originalImage || "";
      }

      const apiData = {
        title: blogData.title,
        slug: blogData.slug,
        image: imageUrl,
        category: blogData.category,
        content: blogData.content, // This will now be HTML from ReactQuill
        author: blogData.author,
        isactive: blogData.isactive,
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, apiData);
      } else {
        await addBlog(apiData);
      }

      await loadBlogs();
      setShowBlogModal(false);
      setEditingBlog(null);
      setError("");
    } catch (err) {
      setError("Failed to save blog");
      console.error("Error saving blog:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleBlogStatus(id, !currentStatus);
      await loadBlogs();
      setError("");
    } catch (err) {
      setError("Failed to update blog status");
      console.error("Error toggling status:", err);
    }
  };

  const exportToCSV = () => {
    const headers = ["Title", "Category", "Author", "Status", "Created Date"];
    const csvData = filteredBlogs.map((blog) => [
      blog.title,
      blog.category || "Uncategorized",
      blog.author,
      blog.isactive ? "Active" : "Inactive",
      blog.createdat ? new Date(blog.createdat).toLocaleDateString() : "N/A",
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

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-7">
        <div
          className="rounded-3xl py-6 px-8 shadow-xl relative overflow-hidden 
                  bg-gradient-to-br from-primary/10 to-white border border-gray-200"
        >
          {/* Decorative Background Blobs */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* LEFT — Title & Description */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-secondary"></div>
                <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
                  Content Management
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                Blog & Article Management
              </h1>

              <p className="text-primary/60 mt-1 text-sm max-w-xl leading-relaxed">
                Create, edit, publish and manage all blogs and articles across
                the website.
              </p>
            </div>

            {/* RIGHT — Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* New Blog Button */}
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setShowBlogModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
                     bg-gradient-to-br from-accent to-secondary shadow-md 
                     hover:shadow-lg active:scale-95 transition-all"
              >
                <Add fontSize="small" />
                New
              </button>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold 
                     bg-gradient-to-br from-primary to-primary/40 shadow-md
                     hover:shadow-lg active:scale-95 transition-all"
              >
                <Download fontSize="small" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="published">Active</option>
          <option value="draft">Inactive</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center font-medium">
          📝 {filteredBlogs.length} blog(s) found
        </div>
      </div>

      {/* Blog Cards Grid - 3 Cards Per Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={() => {
              setEditingBlog(blog);
              setShowBlogModal(true);
            }}
            onDelete={() => handleDeleteBlog(blog.id)}
            onToggleStatus={() => handleToggleStatus(blog.id, blog.isactive)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setEditingBlog(null);
              setShowBlogModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Add fontSize="small" /> Create First Blog
          </button>
        </div>
      )}

      {/* Categories Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Category className="text-blue-500" />
            Blog Categories ({categories.length})
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
              >
                <h4 className="font-semibold text-gray-800">{category}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  /{category.toLowerCase().replace(/\s+/g, "-")}
                </p>
                <div className="mt-2 text-sm font-medium text-blue-600">
                  {blogs.filter((blog) => blog.category === category).length}{" "}
                  posts
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

// Blog Card Component with HTML content support
const BlogCard = ({ blog, onEdit, onDelete, onToggleStatus }) => {
  // Helper function to strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Helper function to check if content has actual text
  const hasValidContent = (content) => {
    if (!content) return false;
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    return textContent.length > 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-4xl">📝</span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              blog.isactive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {blog.isactive ? "Active" : "Inactive"}
          </span>
        </div>
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {blog.category || "Uncategorized"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Display content with HTML stripped for preview */}
        {hasValidContent(blog.content) ? (
          <div className="text-gray-600 text-sm mb-4 blog-preview-content blog-content">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  blog.content.length > 150
                    ? stripHtml(blog.content).substring(0, 150) + "..."
                    : blog.content,
              }}
            />
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-4 italic">
            No content available
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Person fontSize="small" />
            <span>{blog.author || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarMonth fontSize="small" />
            <span>
              {blog.createdat
                ? new Date(blog.createdat).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={onToggleStatus}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
              blog.isactive
                ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {blog.isactive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
          >
            <Edit fontSize="small" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="py-2 px-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Blog Modal Component with ReactQuill
const BlogModal = ({ blog, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    image: "",
    originalImage: "",
    category: "",
    content: "",
    author: "",
    isactive: true,
  });

  // Quill modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadSingleFile(fd);
      const imgURL =
        BASE_URL +
        (res.filePath.startsWith("/") ? res.filePath : `/${res.filePath}`);

      setFormData((prev) => ({
        ...prev,
        image: imgURL,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        image: blog.image || "",
        originalImage: blog.image || "",
        category: blog.category || "",
        content: blog.content || "",
        author: blog.author || "",
        isactive: blog.isactive !== undefined ? blog.isactive : true,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        image: "",
        originalImage: "",
        category: categories.length > 0 ? categories[0] : "",
        content: "",
        author: "",
        isactive: true,
      });
    }
  }, [blog, categories]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            {blog ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter blog title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="Enter category"
                  list="category-list"
                />
                <datalist id="category-list">
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {formData.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Rich Text Editor for Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="blog-editor-wrapper">
                <ReactQuill
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white rounded-lg"
                  theme="snow"
                  placeholder="Write your blog content here... Start with an engaging introduction!"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use the toolbar to format your content with headings, bold,
                italic, lists, blockquotes, links, and more.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isactive"
                checked={formData.isactive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isactive: e.target.checked,
                  }))
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isactive"
                className="text-sm font-medium text-gray-700"
              >
                Publish immediately (Active)
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {blog ? "Update" : "Create"} Blog Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;
