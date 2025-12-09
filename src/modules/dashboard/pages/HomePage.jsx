import React, { useState, useEffect } from "react";
import {
  createHeroSection,
  fetchHeroSections,
  fetchHeroSectionById,
  updateHeroSection,
  deleteHeroSection,
  uploadMultipleFiles,
} from "../../../api/userApi";
import { BASE_URL } from "../../../api/apiConfig";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";

const HeroSectionManager = () => {
  // States
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentHero, setCurrentHero] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slogan: "",
    images: [],
  });

  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  // Fetch all hero sections on component mount
  useEffect(() => {
    loadHeroSections();
  }, []);

  const loadHeroSections = async () => {
    setLoading(true);
    try {
      const data = await fetchHeroSections();
      setHeroSections(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error loading hero sections:", error);
      alert("Error loading hero sections: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image Upload Functions
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      status: "pending",
    }));

    setSelectedImages((prev) => [...prev, ...imageFiles]);
    e.target.value = "";
  };

  const removeSelectedImage = (id) => {
    const image = selectedImages.find((img) => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview); // Clean up memory
    }
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Replace your uploadImages function with this:
  const uploadImages = async () => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);
    setImageUploadError("");

    try {
      const files = selectedImages.map((img) => img.file);
      const response = await uploadMultipleFiles(files);

      console.log("Upload response:", response); // Debug log

      // Handle your API response structure: { success: true, message: "...", files: [...] }
      let uploadedPaths = [];

      if (response.success && response.files && Array.isArray(response.files)) {
        // Your API returns: { success: true, files: ["uploads/default/block4_20251208.png"] }
        uploadedPaths = response.files;
      } else if (response.files && Array.isArray(response.files)) {
        uploadedPaths = response.files;
      } else if (Array.isArray(response)) {
        uploadedPaths = response;
      } else if (response.data && response.data.files) {
        uploadedPaths = response.data.files;
      }

      if (uploadedPaths.length === 0) {
        throw new Error("No files were uploaded successfully");
      }

      // Convert relative paths to full URLs
      const fullImageUrls = uploadedPaths.map((path) => {
        // If path already includes http/https, return as-is
        if (path.startsWith("http://") || path.startsWith("https://")) {
          return path;
        }
        // Remove leading slash if present
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        // Combine base URL with path
        return `${BASE_URL}/${cleanPath}`;
      });

      console.log("Full image URLs:", fullImageUrls); // Debug log

      // Update state with full URLs
      setUploadedImageUrls((prev) => [...prev, ...fullImageUrls]);

      // Update form data with full URLs
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fullImageUrls],
      }));

      // Clear selected images and their previews
      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setSelectedImages([]);

      console.log(`Successfully uploaded ${fullImageUrls.length} images`);
    } catch (error) {
      console.error("Upload error:", error);
      setImageUploadError(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload images"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  // Keep this helper function (already in your code)
  const removeUploadedImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));

    setUploadedImageUrls(newImages);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      alert("Title is required!");
      return;
    }

    setLoading(true);
    try {
      await createHeroSection(formData);
      alert("Hero section created successfully!");
      resetForm();
      setMode("list");
      loadHeroSections();
    } catch (error) {
      alert("Error creating hero section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentHero) return;

    setLoading(true);
    try {
      await updateHeroSection(currentHero.id, formData);
      alert("Hero section updated successfully!");
      resetForm();
      setMode("list");
      loadHeroSections();
    } catch (error) {
      alert("Error updating hero section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero section?"))
      return;

    setLoading(true);
    try {
      await deleteHeroSection(id);
      alert("Hero section deleted successfully!");
      loadHeroSections();
    } catch (error) {
      alert("Error deleting hero section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const hero = await fetchHeroSectionById(id);
      setCurrentHero(hero);
      setFormData({
        title: hero.title,
        subtitle: hero.subtitle,
        slogan: hero.slogan || "",
        images: hero.images || [],
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching hero section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setCurrentHero(hero);
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle,
      slogan: hero.slogan || "",
      images: hero.images || [],
    });
    setUploadedImageUrls(hero.images || []);
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      slogan: "",
      images: [],
    });
    setSelectedImages([]);
    setUploadedImageUrls([]);
    setCurrentHero(null);
    setImageUploadError("");

    // Clean up object URLs
    selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
  };

  // Render based on mode
  const renderContent = () => {
    switch (mode) {
      case "create":
      case "edit":
        return renderForm();
      case "view":
        return renderView();
      default:
        return renderList();
    }
  };

  // Render Hero Sections List
  const renderList = () => (
    <div className="space-y-6">
      {/* Top Header / Hero */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100  p-3 rounded-xl shadow-sm mb-6 border border-gray-200">
        {/* LEFT SIDE: Title + Description */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-500 text-lg font-semibold">👥</span>
            Hero Section
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Manage your hero section banners
          </p>
        </div>

        {/* RIGHT SIDE: Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setMode("create");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Hero
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : heroSections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No Hero Sections Found
          </h3>
          <p className="text-gray-500 mt-1">
            Create your first hero section to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroSections.map((hero) => (
            <div
              key={hero.id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hero Image Preview */}
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                {hero.images && hero.images.length > 0 ? (
                  <img
                    src={hero.images[0]}
                    alt={hero.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Hero Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  {hero.title}
                </h3>
                {hero.subtitle && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {hero.subtitle}
                  </p>
                )}
                {hero.slogan && (
                  <p className="text-xs text-blue-600 mt-1 italic truncate">
                    "{hero.slogan}"
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(hero.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(hero.updated_at)}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {hero.images?.length || 0} images
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(hero.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(hero)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hero.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Create/Edit Form
  const renderForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            resetForm();
            setMode("list");
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "edit"
            ? `Edit Hero Section #${currentHero?.id}`
            : "Create Hero Section"}
        </h1>
        <div className="w-20"></div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hero Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hero title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter slogan (optional)"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>

            {/* Image Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer mb-6">
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label htmlFor="imageUpload" className="cursor-pointer block">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Upload Images
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Click to browse or drag & drop
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      PNG, JPG, GIF, WEBP up to 10MB each
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">
                    Selected Images ({selectedImages.length})
                  </h3>
                  <button
                    type="button"
                    onClick={uploadImages}
                    disabled={uploadingImages}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploadingImages ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingImages
                      ? "Uploading..."
                      : `Upload ${selectedImages.length} Image${
                          selectedImages.length > 1 ? "s" : ""
                        }`}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-300">{image.size} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Images */}
            {formData.images.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-4">
                  Hero Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Hero ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white">Image {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Error */}
            {imageUploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-600 font-medium">Upload Failed</p>
                  <p className="text-red-500 text-sm mt-1">
                    {imageUploadError}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMode("list");
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={mode === "edit" ? handleUpdate : handleCreate}
              disabled={loading || uploadingImages}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === "edit" ? "Update Hero Section" : "Create Hero Section"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render View Mode
  const renderView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMode("list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Hero Section Details
        </h1>
        <button
          onClick={() => setMode("edit")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Hero Images Carousel */}
        {formData.images && formData.images.length > 0 ? (
          <div className="h-96 overflow-hidden relative">
            <img
              src={formData.images[0]}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
              {formData.images.length} images
            </div>
          </div>
        ) : (
          <div className="h-96 bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <div className="p-8">
          <div className="space-y-8">
            {/* ID Badge */}
            <div className="inline-block">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                ID: {currentHero?.id}
              </span>
            </div>

            {/* Hero Content */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData.title}
                </h1>
                {formData.subtitle && (
                  <p className="text-xl text-gray-600 mt-2">
                    {formData.subtitle}
                  </p>
                )}
                {formData.slogan && (
                  <p className="text-lg text-blue-600 mt-3 italic">
                    "{formData.slogan}"
                  </p>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-gray-800">
                  {formatDate(currentHero?.created_at)} at{" "}
                  {formatTime(currentHero?.created_at)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Last Updated</span>
                </div>
                <p className="text-gray-800">
                  {formatDate(currentHero?.updated_at)} at{" "}
                  {formatTime(currentHero?.updated_at)}
                </p>
              </div>
            </div>

            {/* All Images Gallery */}
            {formData.images && formData.images.length > 0 && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  All Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Hero image ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">
                          Image {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default HeroSectionManager;
