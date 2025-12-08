import React, { useState, useEffect } from "react";
import {
  createJourney,
  fetchJourney,
  fetchJourneyById,
  updateJourney,
  deleteJourney
} from "../../../../api/userApi";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Calendar,
  MapPin,
  Award,
  Users,
  Building2,
  TrendingUp,
  Target,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  GripVertical,
  Check,
  SortAsc,
  SortDesc,
  Filter
} from "lucide-react";

const JourneyManager = () => {
  // States
  const [journeyList, setJourneyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentJourney, setCurrentJourney] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: "",
    subtitle: ""
  });
  
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [filterYear, setFilterYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all journey entries on component mount
  useEffect(() => {
    loadJourneyEntries();
  }, []);

  const loadJourneyEntries = async () => {
    setLoading(true);
    try {
      const data = await fetchJourney();
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => a.year - b.year)
        : [data];
      setJourneyList(sortedData);
    } catch (error) {
      console.error("Error loading journey entries:", error);
      alert("Error loading journey entries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || "" : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!formData.year || formData.year.toString().trim() === "") {
      newErrors.year = "Year is required";
    } else if (formData.year < 1900 || formData.year > currentYear + 10) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 10}`;
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    } else if (formData.subtitle.length < 10) {
      newErrors.subtitle = "Subtitle must be at least 10 characters";
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

  // Get journey icon based on title
  const getJourneyIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('foundation') || titleLower.includes('establish')) return <Building2 className="w-5 h-5" />;
    if (titleLower.includes('award') || titleLower.includes('achievement')) return <Award className="w-5 h-5" />;
    if (titleLower.includes('expansion') || titleLower.includes('growth')) return <TrendingUp className="w-5 h-5" />;
    if (titleLower.includes('team') || titleLower.includes('staff')) return <Users className="w-5 h-5" />;
    if (titleLower.includes('milestone') || titleLower.includes('landmark')) return <Target className="w-5 h-5" />;
    if (titleLower.includes('certification') || titleLower.includes('accreditation')) return <Star className="w-5 h-5" />;
    return <Calendar className="w-5 h-5" />;
  };

  // Get journey color based on year
  const getJourneyColor = (year) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age <= 2) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (age <= 5) return 'bg-green-50 text-green-600 border-green-200';
    if (age <= 10) return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-purple-50 text-purple-600 border-purple-200';
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createJourney(formData);
      alert("Journey entry created successfully!");
      resetForm();
      setMode("list");
      loadJourneyEntries();
    } catch (error) {
      alert("Error creating journey entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentJourney) return;
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateJourney(currentJourney.id, formData);
      alert("Journey entry updated successfully!");
      resetForm();
      setMode("list");
      loadJourneyEntries();
    } catch (error) {
      alert("Error updating journey entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journey entry?")) return;

    setLoading(true);
    try {
      await deleteJourney(id);
      alert("Journey entry deleted successfully!");
      loadJourneyEntries();
    } catch (error) {
      alert("Error deleting journey entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const journey = await fetchJourneyById(id);
      setCurrentJourney(journey);
      setFormData({
        year: journey.year || new Date().getFullYear(),
        title: journey.title || "",
        subtitle: journey.subtitle || ""
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching journey entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (journey) => {
    setCurrentJourney(journey);
    setFormData({
      year: journey.year || new Date().getFullYear(),
      title: journey.title || "",
      subtitle: journey.subtitle || ""
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      title: "",
      subtitle: ""
    });
    setErrors({});
    setCurrentJourney(null);
  };

  // Sort journey entries
  const sortJourney = (order) => {
    const sorted = [...journeyList].sort((a, b) => {
      if (order === "asc") {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });
    setJourneyList(sorted);
    setSortOrder(order);
  };

  // Filter and search
  const getFilteredJourney = () => {
    let filtered = journeyList;
    
    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(item => item.year.toString() === filterYear);
    }
    
    // Search by title or subtitle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.subtitle.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // Get unique years for filter
  const getUniqueYears = () => {
    const years = journeyList.map(item => item.year);
    return [...new Set(years)].sort((a, b) => b - a);
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    
    const newJourneyList = [...journeyList];
    const draggedItem = newJourneyList[dragIndex];
    newJourneyList.splice(dragIndex, 1);
    newJourneyList.splice(dropIndex, 0, draggedItem);
    
    setJourneyList(newJourneyList);
    setDragIndex(null);
    // Note: You would need to save the new order to backend
    // This requires adding an "order" field to your API
  };

  // Timeline Item Component
  const TimelineItem = ({ journey, index, isDragging = false }) => {
    const isEven = index % 2 === 0;
    
    return (
      <div 
        className={`relative flex items-start gap-4 ${isDragging ? 'opacity-50' : ''}`}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
      >
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 -z-10"></div>
        
        {/* Year Circle */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getJourneyColor(journey.year)}`}>
            <span className="font-bold">{journey.year}</span>
          </div>
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          </div>
        </div>
        
        {/* Content Card */}
        <div className={`flex-1 bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
          isEven ? 'ml-4' : ''
        }`}>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getJourneyColor(journey.year).split(' ')[0]}`}>
                  {getJourneyIcon(journey.title)}
                </div>
                <h3 className="font-bold text-gray-800">{journey.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleView(journey.id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(journey)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(journey.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {journey.subtitle}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  #{index + 1}
                </span>
                {journey.created_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(journey.created_at)}
                  </span>
                )}
              </div>
              <div className={`px-2 py-1 rounded ${getJourneyColor(journey.year)}`}>
                {new Date().getFullYear() - journey.year} years ago
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

  // Render Journey List (Timeline View)
  const renderList = () => {
    const filteredJourney = getFilteredJourney();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Journey Timeline</h1>
            <p className="text-gray-600 mt-1">Track your organization's milestones and achievements</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setMode("create");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Milestone
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Milestones
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Year
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => sortJourney("asc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "asc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  Oldest First
                </button>
                <button
                  onClick={() => sortJourney("desc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "desc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  Newest First
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredJourney.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              {searchTerm || filterYear ? "No matching milestones found" : "No Journey Milestones Found"}
            </h3>
            <p className="text-gray-500 mt-1">
              {searchTerm || filterYear 
                ? "Try adjusting your search or filter criteria" 
                : "Add your first milestone to start building your journey timeline"}
            </p>
            {searchTerm || filterYear ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterYear("");
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{filteredJourney.length}</p>
                    <p className="text-sm text-gray-600">Total Milestones</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.min(...filteredJourney.map(j => j.year))}
                    </p>
                    <p className="text-sm text-gray-600">Earliest Year</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.max(...filteredJourney.map(j => j.year))}
                    </p>
                    <p className="text-sm text-gray-600">Latest Year</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Date().getFullYear() - Math.min(...filteredJourney.map(j => j.year))}
                    </p>
                    <p className="text-sm text-gray-600">Years of Journey</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Journey Timeline</h2>
                <div className="text-sm text-gray-500">
                  Showing {filteredJourney.length} milestone{filteredJourney.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-8">
                {filteredJourney.map((journey, index) => (
                  <TimelineItem 
                    key={journey.id} 
                    journey={journey} 
                    index={index}
                  />
                ))}
              </div>

              {/* Timeline Legend */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Timeline Legend</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Recent (0-2 years)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Recent (3-5 years)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-gray-600">Medium (6-10 years)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-600">Historical (10+ years)</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Create/Edit Form
  const renderForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            resetForm();
            setMode("list");
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Timeline
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "edit" ? `Edit Journey Entry #${currentJourney?.id}` : "Add Journey Milestone"}
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

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Year <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 10}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2023"
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter the year when this milestone occurred
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Title <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Foundation Year, Major Expansion"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                A brief title for this milestone (3+ characters)
              </p>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Description <span className="text-red-500">*</span>
                </span>
              </label>
              <textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.subtitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe this milestone in detail..."
              />
              {errors.subtitle && (
                <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Provide a detailed description of this milestone (10+ characters)
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-start gap-4">
                {/* Year Circle Preview */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getJourneyColor(formData.year)}`}>
                  <span className="font-bold">{formData.year || "Year"}</span>
                </div>
                
                {/* Content Preview */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${getJourneyColor(formData.year).split(' ')[0]}`}>
                      {getJourneyIcon(formData.title || "Title")}
                    </div>
                    <h4 className="font-bold text-gray-800">
                      {formData.title || "Milestone Title"}
                    </h4>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {formData.subtitle || "Milestone description will appear here..."}
                  </p>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded">#1</span>
                      <span>Preview • {formData.year ? `${new Date().getFullYear() - formData.year} years ago` : "Timeline"}</span>
                    </div>
                  </div>
                </div>
              </div>
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
              {mode === "edit" ? "Update Milestone" : "Add Milestone"}
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
          Back to Timeline
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Journey Milestone Details</h1>
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
              <div className={`p-3 rounded-lg ${getJourneyColor(formData.year).split(' ')[0]}`}>
                {getJourneyIcon(formData.title)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJourneyColor(formData.year)}`}>
                    {formData.year}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ID: {currentJourney?.id}
                  </span>
                  {currentJourney?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentJourney.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Milestone Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Year Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Milestone Year</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-gray-900">{formData.year}</span>
                      <span className="text-lg text-gray-600">
                        ({new Date().getFullYear() - formData.year} years ago)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Timeline Position</div>
                    <div className="text-2xl font-bold text-blue-600">
                      #{journeyList.findIndex(j => j.id === currentJourney?.id) + 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Milestone Description
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {formData.subtitle}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Years Since</p>
                      <p className="text-xl font-bold text-gray-800">
                        {new Date().getFullYear() - formData.year}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timeline Position</p>
                      <p className="text-xl font-bold text-gray-800">
                        #{journeyList.findIndex(j => j.id === currentJourney?.id) + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Context */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Timeline Context
                </h2>
                <div className="bg-white border rounded-lg overflow-hidden">
                  {/* Current Milestone in Context */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getJourneyColor(formData.year).split(' ')[1].split('-')[1]}`}></div>
                        <span className="font-medium">This Milestone</span>
                      </div>
                      <span className="font-bold">{formData.year}</span>
                    </div>
                  </div>
                  
                  {/* Nearby Milestones */}
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-3">Nearby Milestones</div>
                    <div className="space-y-3">
                      {journeyList
                        .filter(j => j.id !== currentJourney?.id)
                        .sort((a, b) => Math.abs(a.year - formData.year) - Math.abs(b.year - formData.year))
                        .slice(0, 3)
                        .map((journey) => (
                          <div 
                            key={journey.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleView(journey.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getJourneyColor(journey.year).split(' ')[1].split('-')[1]}`}></div>
                              <span className="text-sm truncate">{journey.title}</span>
                            </div>
                            <span className="text-sm text-gray-600">{journey.year}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {currentJourney && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Timestamps</h3>
                  <div className="space-y-3">
                    {currentJourney.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentJourney.created_at)}
                        </p>
                      </div>
                    )}
                    
                    {currentJourney.updated_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">Updated</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentJourney.updated_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMode("edit")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Milestone
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setMode("create");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Milestone
                  </button>
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

export default JourneyManager;