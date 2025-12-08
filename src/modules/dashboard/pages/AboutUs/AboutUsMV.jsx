import React, { useState, useEffect } from "react";
import {
  createAboutUs,
  fetchAboutUs,
  fetchAboutUsById,
  updateAboutUs,
  deleteAboutUs,
  uploadAboutUsImage
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
  Building2,
  Target,
  EyeIcon,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  Tag,
  Check,
  AlertCircle
} from "lucide-react";

const AboutUsMV = () => {
  // States
  const [aboutUsList, setAboutUsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentAboutUs, setCurrentAboutUs] = useState(null);
  const [formData, setFormData] = useState({
    introduction: "",
    history: "",
    image1: "",
    image2: "",
    mission: "",
    missiontags: [],
    missionimage: "",
    vision: "",
    visiontags: [],
    visionimage: "",
    directorname: "",
    directorimage: "",
    directormessage: ""
  });

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState({
    image1: false,
    image2: false,
    missionimage: false,
    visionimage: false,
    directorimage: false
  });
  const [tagInput, setTagInput] = useState({
    mission: "",
    vision: ""
  });
  const [errors, setErrors] = useState({});

  // Fetch all aboutus sections on component mount
  useEffect(() => {
    loadAboutUsSections();
  }, []);

  const loadAboutUsSections = async () => {
    setLoading(true);
    try {
      const data = await fetchAboutUs();
      setAboutUsList(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error loading aboutus sections:", error);
      alert("Error loading aboutus sections: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle textarea changes
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tag input
  const handleTagInputChange = (type, value) => {
    setTagInput(prev => ({ ...prev, [type]: value }));
  };

  const addTag = (type) => {
    const tag = tagInput[type].trim();
    if (tag && !formData[`${type}tags`].includes(tag)) {
      setFormData(prev => ({
        ...prev,
        [`${type}tags`]: [...prev[`${type}tags`], tag]
      }));
      setTagInput(prev => ({ ...prev, [type]: "" }));
    }
  };

  const removeTag = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [`${type}tags`]: prev[`${type}tags`].filter((_, i) => i !== index)
    }));
  };

  const handleTagKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(type);
    }
  };

  // Image Upload Functions
  const handleImageUpload = async (field, file) => {
    if (!file) return;

    setUploadingImage(prev => ({ ...prev, [field]: true }));

    try {
      const imageUrl = await uploadAboutUsImage(file);

      setFormData(prev => ({
        ...prev,
        [field]: imageUrl
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploadingImage(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleImageSelect = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(field, file);
    }
    e.target.value = "";
  };

  const removeImage = (field) => {
    setFormData(prev => ({ ...prev, [field]: "" }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.introduction.trim()) {
      newErrors.introduction = "Introduction is required";
    }

    if (!formData.history.trim()) {
      newErrors.history = "History is required";
    }

    if (!formData.mission.trim()) {
      newErrors.mission = "Mission is required";
    }

    if (!formData.vision.trim()) {
      newErrors.vision = "Vision is required";
    }

    if (!formData.directorname.trim()) {
      newErrors.directorname = "Director name is required";
    }

    if (!formData.directormessage.trim()) {
      newErrors.directormessage = "Director message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createAboutUs(formData);
      alert("AboutUs section created successfully!");
      resetForm();
      setMode("list");
      loadAboutUsSections();
    } catch (error) {
      alert("Error creating aboutus section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentAboutUs) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateAboutUs(currentAboutUs.id, formData);
      alert("AboutUs section updated successfully!");
      resetForm();
      setMode("list");
      loadAboutUsSections();
    } catch (error) {
      alert("Error updating aboutus section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this aboutus section?")) return;

    setLoading(true);
    try {
      await deleteAboutUs(id);
      alert("AboutUs section deleted successfully!");
      loadAboutUsSections();
    } catch (error) {
      alert("Error deleting aboutus section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const aboutUs = await fetchAboutUsById(id);
      setCurrentAboutUs(aboutUs);
      setFormData({
        introduction: aboutUs.introduction || "",
        history: aboutUs.history || "",
        image1: aboutUs.image1 || "",
        image2: aboutUs.image2 || "",
        mission: aboutUs.mission || "",
        missiontags: aboutUs.missiontags || [],
        missionimage: aboutUs.missionimage || "",
        vision: aboutUs.vision || "",
        visiontags: aboutUs.visiontags || [],
        visionimage: aboutUs.visionimage || "",
        directorname: aboutUs.directorname || "",
        directorimage: aboutUs.directorimage || "",
        directormessage: aboutUs.directormessage || ""
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching aboutus section: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aboutUs) => {
    setCurrentAboutUs(aboutUs);
    setFormData({
      introduction: aboutUs.introduction || "",
      history: aboutUs.history || "",
      image1: aboutUs.image1 || "",
      image2: aboutUs.image2 || "",
      mission: aboutUs.mission || "",
      missiontags: aboutUs.missiontags || [],
      missionimage: aboutUs.missionimage || "",
      vision: aboutUs.vision || "",
      visiontags: aboutUs.visiontags || [],
      visionimage: aboutUs.visionimage || "",
      directorname: aboutUs.directorname || "",
      directorimage: aboutUs.directorimage || "",
      directormessage: aboutUs.directormessage || ""
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      introduction: "",
      history: "",
      image1: "",
      image2: "",
      mission: "",
      missiontags: [],
      missionimage: "",
      vision: "",
      visiontags: [],
      visionimage: "",
      directorname: "",
      directorimage: "",
      directormessage: ""
    });
    setTagInput({ mission: "", vision: "" });
    setErrors({});
    setCurrentAboutUs(null);
  };

  // Image Upload Section Component
  const ImageUploadSection = ({ title, field, imageUrl }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          type="file"
          id={`upload-${field}`}
          accept="image/*"
          onChange={(e) => handleImageSelect(field, e)}
          className="hidden"
        />

        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(field)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label htmlFor={`upload-${field}`} className="cursor-pointer">
            <div className="py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          </label>
        )}

        {uploadingImage[field] && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );

  // Tag Input Component
  const TagInputSection = ({ type, title, tags }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(type, index)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput[type]}
          onChange={(e) => handleTagInputChange(type, e.target.value)}
          onKeyPress={(e) => handleTagKeyPress(e, type)}
          placeholder={`Add ${type} tag...`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => addTag(type)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );

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

  // Render AboutUs List
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">About Us Sections</h1>
          <p className="text-gray-600 mt-1">Manage your organization's about us content</p>
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
      ) : aboutUsList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No About Us Sections Found</h3>
          <p className="text-gray-500 mt-1">Create your first about us section to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aboutUsList.map((aboutUs) => (
            <div key={aboutUs.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-800">About Us Section</h3>
                    </div>

                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(aboutUs.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(aboutUs)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(aboutUs.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-6 space-y-4">
                {/* Introduction Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Introduction</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {aboutUs.introduction || "No introduction provided"}
                  </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-green-600" />
                      <h4 className="text-xs font-medium text-gray-700">Mission</h4>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {aboutUs.mission || "No mission provided"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <EyeIcon className="w-3 h-3 text-purple-600" />
                      <h4 className="text-xs font-medium text-gray-700">Vision</h4>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {aboutUs.vision || "No vision provided"}
                    </p>
                  </div>
                </div>

                {/* Director Info */}
                {aboutUs.directorname && (
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-3 h-3 text-orange-600" />
                      <h4 className="text-xs font-medium text-gray-700">Director</h4>
                    </div>
                    <p className="text-xs text-gray-600">{aboutUs.directorname}</p>
                  </div>
                )}

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Create/Edit Form
  const renderForm = () => (
    <div className="max-w-6xl mx-auto">
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
          {mode === "edit" ? `Edit About Us Section #${currentAboutUs?.id}` : "Create About Us Section"}
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
                <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
              </div>
              <ul className="text-red-600 text-sm list-disc pl-5 space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Introduction & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Introduction *
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleTextareaChange}
                  rows="9"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.introduction ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter organization introduction..."
                />
                {errors.introduction && (
                  <p className="text-red-500 text-sm mt-1">{errors.introduction}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  History *
                </label>
                <textarea
                  name="history"
                  value={formData.history}
                  onChange={handleTextareaChange}
                  rows="9"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.history ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter organization history..."
                />
                {errors.history && (
                  <p className="text-red-500 text-sm mt-1">{errors.history}</p>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <ImageUploadSection
                title="Image 1"
                field="image1"
                imageUrl={formData.image1}
              />

              <ImageUploadSection
                title="Image 2"
                field="image2"
                imageUrl={formData.image2}
              />
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission *
                </label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleTextareaChange}
                  rows="9"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mission ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter organization mission..."
                />
                {errors.mission && (
                  <p className="text-red-500 text-sm mt-1">{errors.mission}</p>
                )}
              </div>

              {/* <TagInputSection 
                type="mission"
                title="Mission Tags"
                tags={formData.missiontags}
              /> */}
            </div>

            <div>
              <ImageUploadSection
                title="Mission Image"
                field="missionimage"
                imageUrl={formData.missionimage}
              />
            </div>
          </div>

          {/* Vision Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision *
                </label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleTextareaChange}
                  rows="9"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vision ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter organization vision..."
                />
                {errors.vision && (
                  <p className="text-red-500 text-sm mt-1">{errors.vision}</p>
                )}
              </div>

              {/* <TagInputSection 
                type="vision"
                title="Vision Tags"
                tags={formData.visiontags}
              /> */}
            </div>

            <div>
              <ImageUploadSection
                title="Vision Image"
                field="visionimage"
                imageUrl={formData.visionimage}
              />
            </div>
          </div>

          {/* Director Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director Name *
                </label>
                <input
                  type="text"
                  name="directorname"
                  value={formData.directorname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.directorname ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter director name..."
                />
                {errors.directorname && (
                  <p className="text-red-500 text-sm mt-1">{errors.directorname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director Message *
                </label>
                <textarea
                  name="directormessage"
                  value={formData.directormessage}
                  onChange={handleTextareaChange}
                  rows="5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.directormessage ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter director message..."
                />
                {errors.directormessage && (
                  <p className="text-red-500 text-sm mt-1">{errors.directormessage}</p>
                )}
              </div>
            </div>

            <div>
              <ImageUploadSection
                title="Director Image"
                field="directorimage"
                imageUrl={formData.directorimage}
              />
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === "edit" ? "Update Section" : "Create Section"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render View Mode
  const renderView = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMode("list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">About Us Section Details</h1>
        <button
          onClick={() => setMode("edit")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">About Us Section</h1>
                <div className="flex items-center gap-4 mt-1">

                  {currentAboutUs?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentAboutUs.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Introduction & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Introduction
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{formData.introduction}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Our History
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{formData.history}</p>
                </div>
              </div>
            </div>

            {/* Images Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.image1 && (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={formData.image1}
                      alt="Image 1"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                      Image 1
                    </div>
                  </div>
                )}
                {formData.image2 && (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={formData.image2}
                      alt="Image 2"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                      Image 2
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mission & Vision Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t">
            {/* Mission Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">{formData.mission}</p>

                {formData.missionimage && (
                  <div className="mt-4">
                    <img
                      src={formData.missionimage}
                      alt="Mission"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* {formData.missiontags && formData.missiontags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Mission Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.missiontags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* Vision Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Our Vision</h2>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">{formData.vision}</p>

                {formData.visionimage && (
                  <div className="mt-4">
                    <img
                      src={formData.visionimage}
                      alt="Vision"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* {formData.visiontags && formData.visiontags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Vision Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.visiontags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* Director Section */}
          <div className="pt-8 border-t">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">Director's Message</h2>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Director Image */}
                <div className="lg:col-span-1">
                  {formData.directorimage ? (
                    <div className="relative">
                      <img
                        src={formData.directorimage}
                        alt={formData.directorname}
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md">
                        <p className="font-bold text-gray-800">{formData.directorname}</p>
                        <p className="text-sm text-gray-600">Director</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Director Message */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Message from Director</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">
                      "{formData.directormessage}"
                    </p>
                    <div className="mt-6 pt-4 border-t">
                      <p className="font-bold text-gray-900">{formData.directorname}</p>
                      <p className="text-sm text-gray-600">Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
};

export default AboutUsMV;