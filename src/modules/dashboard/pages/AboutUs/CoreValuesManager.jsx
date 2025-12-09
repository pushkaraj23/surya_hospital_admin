import React, { useState, useEffect } from "react";
import {
  createCoreValue,
  fetchCoreValues,
  fetchCoreValueById,
  updateCoreValue,
  deleteCoreValue,
  uploadCoreValueImage,
} from "../../../../api/userApi";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Target,
  Heart,
  Shield,
  Users,
  Star,
  Award,
  Lightbulb,
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  AlertCircle,
  Copy,
  GripVertical,
  TrendingUp,
} from "lucide-react";

const CoreValuesManager = () => {
  // States
  const [coreValues, setCoreValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentValue, setCurrentValue] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
  });

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // Fetch all core values on component mount
  useEffect(() => {
    loadCoreValues();
  }, []);

  const loadCoreValues = async () => {
    setLoading(true);
    try {
      const data = await fetchCoreValues();
      setCoreValues(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error loading core values:", error);
      alert("Error loading core values: " + error.message);
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

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle textarea changes
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image Upload Functions
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploadingImage(true);

    try {
      // Create local preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload image
      const imageUrl = await uploadCoreValueImage(file);

      // Update form data with full URL
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      // Clean up preview
      URL.revokeObjectURL(previewUrl);
      setImagePreview("");
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      alert("Please drop an image file");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  };

  // Copy image URL to clipboard
  const copyImageUrl = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Image URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL"));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get value icon based on title
  const getValueIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("integrity") || titleLower.includes("honesty"))
      return <Shield className="w-5 h-5" />;
    if (titleLower.includes("quality") || titleLower.includes("excellence"))
      return <Star className="w-5 h-5" />;
    if (titleLower.includes("innovation") || titleLower.includes("creative"))
      return <Lightbulb className="w-5 h-5" />;
    if (titleLower.includes("team") || titleLower.includes("collaboration"))
      return <Users className="w-5 h-5" />;
    if (titleLower.includes("customer") || titleLower.includes("client"))
      return <Heart className="w-5 h-5" />;
    if (titleLower.includes("growth") || titleLower.includes("progress"))
      return <TrendingUp className="w-5 h-5" />;
    if (titleLower.includes("achievement") || titleLower.includes("success"))
      return <Award className="w-5 h-5" />;
    return <Target className="w-5 h-5" />;
  };

  // Get value color based on index
  const getValueColor = (index) => {
    const colors = [
      "bg-blue-50 text-blue-600 border-blue-200",
      "bg-green-50 text-green-600 border-green-200",
      "bg-purple-50 text-purple-600 border-purple-200",
      "bg-amber-50 text-amber-600 border-amber-200",
      "bg-rose-50 text-rose-600 border-rose-200",
      "bg-indigo-50 text-indigo-600 border-indigo-200",
      "bg-emerald-50 text-emerald-600 border-emerald-200",
      "bg-violet-50 text-violet-600 border-violet-200",
    ];
    return colors[index % colors.length];
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createCoreValue(formData);
      alert("Core value created successfully!");
      resetForm();
      setMode("list");
      loadCoreValues();
    } catch (error) {
      alert("Error creating core value: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentValue) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateCoreValue(currentValue.id, formData);
      alert("Core value updated successfully!");
      resetForm();
      setMode("list");
      loadCoreValues();
    } catch (error) {
      alert("Error updating core value: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this core value?"))
      return;

    setLoading(true);
    try {
      await deleteCoreValue(id);
      alert("Core value deleted successfully!");
      loadCoreValues();
    } catch (error) {
      alert("Error deleting core value: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const value = await fetchCoreValueById(id);
      setCurrentValue(value);
      setFormData({
        title: value.title || "",
        subtitle: value.subtitle || "",
        image: value.image || "",
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching core value: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (value) => {
    setCurrentValue(value);
    setFormData({
      title: value.title || "",
      subtitle: value.subtitle || "",
      image: value.image || "",
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
    });
    setErrors({});
    setCurrentValue(null);
    setImagePreview("");
  };

  // Drag and drop for reordering
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOverReorder = (e, index) => {
    e.preventDefault();
  };

  const handleDropReorder = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newCoreValues = [...coreValues];
    const draggedItem = newCoreValues[dragIndex];
    newCoreValues.splice(dragIndex, 1);
    newCoreValues.splice(dropIndex, 0, draggedItem);

    setCoreValues(newCoreValues);
    setDragIndex(null);
    // Here you would typically save the new order to backend
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

  // Render Core Values List
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Core Values</h1>
          <p className="text-gray-600 mt-1">
            Manage your organization's core values
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setMode("create");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : coreValues.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No Core Values Found
          </h3>
          <p className="text-gray-500 mt-1">
            Create your first core value to get started
          </p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {coreValues.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Values</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {coreValues.filter((v) => v.image).length}
                  </p>
                  <p className="text-sm text-gray-600">With Images</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {coreValues.length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={value.id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group"
                draggable={reordering}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOverReorder(e, index)}
                onDrop={(e) => handleDropReorder(e, index)}
              >
                {/* Reorder Handle */}
                {reordering && (
                  <div className="absolute top-3 left-3 p-1 bg-gray-100 rounded cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                {/* Value Icon Badge */}
                <div className="absolute top-3 right-3">
                  <div
                    className={`p-2 rounded-lg ${
                      getValueColor(index).split(" ")[0]
                    }`}
                  >
                    {getValueIcon(value.title)}
                  </div>
                </div>

                {/* Value Image */}
                <div className="h-48 overflow-hidden bg-gray-100">
                  {value.image ? (
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/cccccc/666666?text=${encodeURIComponent(
                          value.title
                        )}`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No Image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Value Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {value.title}
                    </h3>
                    <div className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      #{index + 1}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {value.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {value.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(value.created_at)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(value.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(value)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(value.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Reorder Controls */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-500">
              Showing {coreValues.length} core values
            </div>
            <button
              onClick={() => setReordering(!reordering)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                reordering
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <GripVertical className="w-4 h-4" />
              {reordering ? "Done Reordering" : "Reorder Values"}
            </button>
          </div>
        </>
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
            ? `Edit Core Value #${currentValue?.id}`
            : "Create Core Value"}
        </h1>
        <div className="w-20"></div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="space-y-8">
          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-medium text-red-800">
                  Please fix the following errors:
                </h3>
              </div>
              <ul className="text-red-600 text-sm list-disc pl-5 space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Fields */}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter core value title (e.g., Integrity, Excellence)"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle *
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleTextareaChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.subtitle ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe this core value..."
                />
                {errors.subtitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Image
                </label>

                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    dragging
                      ? "border-blue-400 bg-blue-50"
                      : uploadingImage
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={uploadingImage}
                  />

                  {imagePreview || formData.image ? (
                    <div className="relative group">
                      <img
                        src={imagePreview || formData.image}
                        alt="Core Value"
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/600x400/cccccc/666666?text=${encodeURIComponent(
                            formData.title || "Core Value"
                          )}`;
                        }}
                      />

                      {/* Image Overlay Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label htmlFor="imageUpload" className="cursor-pointer">
                          <div className="p-3 bg-white rounded-full hover:bg-gray-100">
                            <Upload className="w-5 h-5 text-gray-700" />
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyImageUrl(formData.image)}
                          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Uploading Indicator */}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                            <p className="text-white text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="imageUpload"
                      className={`cursor-pointer block ${
                        uploadingImage ? "opacity-50" : ""
                      }`}
                    >
                      <div className="py-8">
                        {uploadingImage ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            <p className="text-sm text-blue-600">
                              Uploading image...
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">
                              Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            <p className="text-xs text-blue-400 mt-2">
                              Optional
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>

                {/* Image URL Display */}
                {formData.image && !uploadingImage && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <p
                        className="text-xs text-gray-500 truncate"
                        title={formData.image}
                      >
                        URL:{" "}
                        {formData.image.length > 40
                          ? `${formData.image.substring(0, 40)}...`
                          : formData.image}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyImageUrl(formData.image)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy URL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Card */}
              {(formData.title || formData.subtitle) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Preview
                  </h3>
                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800">
                        {formData.title || "Title"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.subtitle || "Subtitle will appear here..."}
                    </p>
                    {formData.image && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Image Preview:
                        </div>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
              disabled={loading || uploadingImage}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === "edit" ? "Update Value" : "Create Value"}
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
        <h1 className="text-2xl font-bold text-gray-800">Core Value Details</h1>
        <button
          onClick={() => setMode("edit")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.title}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ID: {currentValue?.id}
                  </span>
                  {currentValue?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentValue.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Value Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Value Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Title
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <p className="text-gray-800 font-medium">
                        {formData.title}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">
                        {formData.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setMode("edit")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Value
                  </button>
                  <button
                    onClick={() => copyImageUrl(formData.image)}
                    disabled={!formData.image}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Image URL
                  </button>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  Value Image
                </h2>
                <div className="border rounded-lg overflow-hidden">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt={formData.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/600x400/cccccc/666666?text=${encodeURIComponent(
                            formData.title
                          )}`;
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <button
                          onClick={() => copyImageUrl(formData.image)}
                          className="text-white text-sm flex items-center gap-1 hover:text-blue-200"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Image URL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No image uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image URL */}
                {formData.image && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Image URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.image}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-600 truncate"
                      />
                      <button
                        onClick={() => copyImageUrl(formData.image)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              {currentValue && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentValue.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentValue.created_at)}
                        </p>
                      </div>
                    )}

                    {currentValue.updated_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">Updated</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentValue.updated_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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

export default CoreValuesManager;
