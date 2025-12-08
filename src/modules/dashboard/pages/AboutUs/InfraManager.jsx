import React, { useState, useEffect } from "react";
import {
  createInfra,
  fetchInfra,
  fetchInfraById,
  updateInfra,
  deleteInfra
} from "../../../../api/userApi";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Building2,
  BedDouble,
  Stethoscope,
  Users,
  Microscope,
  Ambulance,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Hash,
  Target,
  Award,
  Shield,
  Heart,
  Brain,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  BarChart3,
  PieChart,
  GripVertical,
  Copy,
  Maximize2,
  Minimize2
} from "lucide-react";

const InfraManager = () => {
  // States
  const [infraList, setInfraList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentInfra, setCurrentInfra] = useState(null);
  const [formData, setFormData] = useState({
    number: "",
    title: ""
  });
  
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedInfra, setSelectedInfra] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [totalStats, setTotalStats] = useState({
    totalItems: 0,
    totalNumbers: 0,
    averageNumber: 0
  });

  // Fetch all infrastructure entries on component mount
  useEffect(() => {
    loadInfraEntries();
  }, []);

  // Update total stats when infraList changes
  useEffect(() => {
    calculateTotalStats();
  }, [infraList]);

  const loadInfraEntries = async () => {
    setLoading(true);
    try {
      const data = await fetchInfra();
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => b.number - a.number)
        : [data];
      setInfraList(sortedData);
    } catch (error) {
      console.error("Error loading infrastructure entries:", error);
      alert("Error loading infrastructure entries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalStats = () => {
    if (infraList.length === 0) {
      setTotalStats({
        totalItems: 0,
        totalNumbers: 0,
        averageNumber: 0
      });
      return;
    }

    const totalNumbers = infraList.reduce((sum, item) => sum + (parseInt(item.number) || 0), 0);
    const averageNumber = Math.round(totalNumbers / infraList.length);

    setTotalStats({
      totalItems: infraList.length,
      totalNumbers: totalNumbers,
      averageNumber: averageNumber
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "number" ? (parseInt(value) || "") : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.number || formData.number.toString().trim() === "") {
      newErrors.number = "Number is required";
    } else if (formData.number < 0) {
      newErrors.number = "Number must be positive";
    } else if (formData.number > 1000000) {
      newErrors.number = "Number is too large";
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
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

  // Get icon based on title
  const getInfraIcon = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('bed') || titleLower.includes('ward')) return <BedDouble className="w-5 h-5" />;
    if (titleLower.includes('doctor') || titleLower.includes('physician')) return <Stethoscope className="w-5 h-5" />;
    if (titleLower.includes('nurse') || titleLower.includes('staff')) return <Users className="w-5 h-5" />;
    if (titleLower.includes('lab') || titleLower.includes('test')) return <Microscope className="w-5 h-5" />;
    if (titleLower.includes('ambulance') || titleLower.includes('emergency')) return <Ambulance className="w-5 h-5" />;
    if (titleLower.includes('operation') || titleLower.includes('surgery')) return <Heart className="w-5 h-5" />;
    if (titleLower.includes('icu') || titleLower.includes('critical')) return <Brain className="w-5 h-5" />;
    if (titleLower.includes('room') || titleLower.includes('chamber')) return <Building2 className="w-5 h-5" />;
    if (titleLower.includes('machine') || titleLower.includes('equipment')) return <Award className="w-5 h-5" />;
    if (titleLower.includes('security') || titleLower.includes('safety')) return <Shield className="w-5 h-5" />;
    
    return <Hash className="w-5 h-5" />;
  };

  // Get color based on number
  const getInfraColor = (number) => {
    if (number >= 1000) return 'bg-purple-50 text-purple-600 border-purple-200';
    if (number >= 500) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (number >= 100) return 'bg-green-50 text-green-600 border-green-200';
    if (number >= 50) return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-rose-50 text-rose-600 border-rose-200';
  };

  // Get size class based on number
  const getSizeClass = (number) => {
    if (number >= 1000) return 'text-3xl';
    if (number >= 500) return 'text-2xl';
    if (number >= 100) return 'text-xl';
    return 'text-lg';
  };

  // Get trending indicator
  const getTrendingIcon = (number, avg) => {
    if (number > avg) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (number < avg) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Target className="w-4 h-4 text-blue-500" />;
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createInfra(formData);
      alert("Infrastructure entry created successfully!");
      resetForm();
      setMode("list");
      loadInfraEntries();
    } catch (error) {
      alert("Error creating infrastructure entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentInfra) return;
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateInfra(currentInfra.id, formData);
      alert("Infrastructure entry updated successfully!");
      resetForm();
      setMode("list");
      loadInfraEntries();
    } catch (error) {
      alert("Error updating infrastructure entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this infrastructure entry?")) return;

    setLoading(true);
    try {
      await deleteInfra(id);
      alert("Infrastructure entry deleted successfully!");
      loadInfraEntries();
    } catch (error) {
      alert("Error deleting infrastructure entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const infra = await fetchInfraById(id);
      setCurrentInfra(infra);
      setFormData({
        number: infra.number || "",
        title: infra.title || ""
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching infrastructure entry: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (infra) => {
    setCurrentInfra(infra);
    setFormData({
      number: infra.number || "",
      title: infra.title || ""
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      number: "",
      title: ""
    });
    setErrors({});
    setCurrentInfra(null);
  };

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedInfra.length === infraList.length) {
      setSelectedInfra([]);
    } else {
      setSelectedInfra(infraList.map(item => item.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInfra.length === 0) {
      alert("Please select entries to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedInfra.length} entries?`)) return;

    setLoading(true);
    try {
      // Delete all selected items
      await Promise.all(selectedInfra.map(id => deleteInfra(id)));
      alert(`${selectedInfra.length} entries deleted successfully!`);
      setSelectedInfra([]);
      loadInfraEntries();
    } catch (error) {
      alert("Error deleting entries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort infrastructure entries
  const sortInfra = (order) => {
    const sorted = [...infraList].sort((a, b) => {
      if (order === "asc") {
        return a.number - b.number;
      } else {
        return b.number - a.number;
      }
    });
    setInfraList(sorted);
    setSortOrder(order);
  };

  // Filter infrastructure entries
  const getFilteredInfra = () => {
    if (!searchTerm) return infraList;
    
    const term = searchTerm.toLowerCase();
    return infraList.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.number.toString().includes(term)
    );
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
    
    const newInfraList = [...infraList];
    const draggedItem = newInfraList[dragIndex];
    newInfraList.splice(dragIndex, 1);
    newInfraList.splice(dropIndex, 0, draggedItem);
    
    setInfraList(newInfraList);
    setDragIndex(null);
  };

  // Infrastructure Card Component
  const InfraCard = ({ infra, index, isSelected = false }) => {
    const filteredInfra = getFilteredInfra();
    const actualIndex = filteredInfra.findIndex(item => item.id === infra.id);
    
    return (
      <div 
        className={`relative bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        } ${dragging && dragIndex === actualIndex ? 'opacity-50' : ''}`}
        draggable
        onDragStart={() => handleDragStart(actualIndex)}
        onDragOver={(e) => handleDragOver(e, actualIndex)}
        onDrop={(e) => handleDrop(e, actualIndex)}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {
              if (selectedInfra.includes(infra.id)) {
                setSelectedInfra(prev => prev.filter(id => id !== infra.id));
              } else {
                setSelectedInfra(prev => [...prev, infra.id]);
              }
            }}
            className="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </div>

        {/* Drag Handle */}
        <div className="absolute top-3 right-3">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
        </div>

        {/* Header with Icon */}
        <div className={`p-6 ${getInfraColor(infra.number).split(' ')[0]}`}>
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full bg-white/20 ${getInfraColor(infra.number).split(' ')[1]}`}>
              {getInfraIcon(infra.title)}
            </div>
          </div>
          
          {/* Number Display */}
          <div className="text-center">
            <div className={`font-bold ${getSizeClass(infra.number)} mb-1 ${getInfraColor(infra.number).split(' ')[1]}`}>
              {infra.number.toLocaleString()}
            </div>
            <div className="text-sm opacity-80">{infra.title}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">#{actualIndex + 1}</span>
              {getTrendingIcon(infra.number, totalStats.averageNumber)}
              <span>{infra.number > totalStats.averageNumber ? 'Above Avg' : 'Below Avg'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleView(infra.id)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(infra)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(infra.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-gray-600">Position</div>
              <div className="font-semibold">#{actualIndex + 1}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-gray-600">vs Avg</div>
              <div className={`font-semibold ${infra.number > totalStats.averageNumber ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(infra.number - totalStats.averageNumber)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Infrastructure List Item Component
  const InfraListItem = ({ infra, index, isSelected = false }) => {
    const filteredInfra = getFilteredInfra();
    const actualIndex = filteredInfra.findIndex(item => item.id === infra.id);
    
    return (
      <div 
        className={`flex items-center p-4 bg-white border rounded-lg hover:shadow transition-all ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        } ${dragging && dragIndex === actualIndex ? 'opacity-50' : ''}`}
        draggable
        onDragStart={() => handleDragStart(actualIndex)}
        onDragOver={(e) => handleDragOver(e, actualIndex)}
        onDrop={(e) => handleDrop(e, actualIndex)}
      >
        {/* Drag Handle */}
        <div className="mr-3">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
        </div>

        {/* Selection Checkbox */}
        <div className="mr-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {
              if (selectedInfra.includes(infra.id)) {
                setSelectedInfra(prev => prev.filter(id => id !== infra.id));
              } else {
                setSelectedInfra(prev => [...prev, infra.id]);
              }
            }}
            className="w-4 h-4 text-blue-600 rounded border-gray-300"
          />
        </div>

        {/* Icon */}
        <div className={`p-2 rounded-lg mr-4 ${getInfraColor(infra.number).split(' ')[0]}`}>
          {getInfraIcon(infra.title)}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{infra.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>ID: {infra.id}</span>
                {infra.created_at && (
                  <>
                    <span>•</span>
                    <span>{formatDate(infra.created_at)}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getInfraColor(infra.number).split(' ')[1]}`}>
                {infra.number.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                {getTrendingIcon(infra.number, totalStats.averageNumber)}
                {infra.number > totalStats.averageNumber ? 'Above average' : 'Below average'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => handleView(infra.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(infra)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(infra.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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

  // Render Infrastructure List
  const renderList = () => {
    const filteredInfra = getFilteredInfra();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Infrastructure Stats</h1>
            <p className="text-gray-600 mt-1">Manage your organization's infrastructure and statistics</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setMode("create");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Stat
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Hash className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.totalItems}</p>
                <p className="text-sm text-gray-600">Total Stats</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.totalNumbers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Count</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalStats.averageNumber.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Average</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <PieChart className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {infraList.length > 0 ? Math.max(...infraList.map(i => i.number)).toLocaleString() : 0}
                </p>
                <p className="text-sm text-gray-600">Highest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Stats
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or number..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Number
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => sortInfra("desc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "desc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  Highest
                </button>
                <button
                  onClick={() => sortInfra("asc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "asc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  Lowest
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Minimize2 className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedInfra.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded">
                  <Hash className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">
                    {selectedInfra.length} item{selectedInfra.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-blue-600">
                    Click on items or use the checkboxes to select
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                  {selectedInfra.length === infraList.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredInfra.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              {searchTerm ? "No matching stats found" : "No Infrastructure Stats Found"}
            </h3>
            <p className="text-gray-500 mt-1">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "Add your first infrastructure stat to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredInfra.length} stat{filteredInfra.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </div>
              <div className="text-sm text-gray-500">
                Total: {totalStats.totalNumbers.toLocaleString()} across all stats
              </div>
            </div>

            {/* Infrastructure Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInfra.map((infra, index) => (
                  <InfraCard 
                    key={infra.id} 
                    infra={infra} 
                    index={index}
                    isSelected={selectedInfra.includes(infra.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInfra.map((infra, index) => (
                  <InfraListItem 
                    key={infra.id} 
                    infra={infra} 
                    index={index}
                    isSelected={selectedInfra.includes(infra.id)}
                  />
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Stat Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs text-gray-600">Small (&lt; 50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-600">Medium (50-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Large (100-500)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Extra Large (500-1000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-gray-600">Mega (1000+)</span>
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
          Back to Stats
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "edit" ? `Edit Stat #${currentInfra?.id}` : "Add Infrastructure Stat"}
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
            {/* Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Number <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                min="0"
                max="1000000"
                step="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 50, 100, 500"
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter a positive number (0 to 1,000,000)
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
                placeholder="e.g., Modern Hospital Beds, Qualified Doctors"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                A descriptive title for this statistic (3+ characters)
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${getInfraColor(formData.number || 0).split(' ')[0]}`}>
                  <div className={`p-3 rounded-full ${getInfraColor(formData.number || 0).split(' ')[1]} bg-white/20`}>
                    {getInfraIcon(formData.title || "Title")}
                  </div>
                </div>
                
                <div className={`font-bold ${getSizeClass(formData.number || 0)} mb-2 ${getInfraColor(formData.number || 0).split(' ')[1]}`}>
                  {(formData.number || 0).toLocaleString()}
                </div>
                
                <p className="text-gray-700">
                  {formData.title || "Statistic Title"}
                </p>
                
                <div className="mt-4 text-sm text-gray-500">
                  {formData.number ? (
                    <div className="flex items-center justify-center gap-2">
                      {getTrendingIcon(formData.number, totalStats.averageNumber)}
                      <span>
                        {formData.number > totalStats.averageNumber 
                          ? `Above average (${formData.number - totalStats.averageNumber} above)` 
                          : `Below average (${totalStats.averageNumber - formData.number} below)`}
                      </span>
                    </div>
                  ) : (
                    "Enter a number to see comparison"
                  )}
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
              {mode === "edit" ? "Update Stat" : "Add Stat"}
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
          Back to Stats
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Statistic Details</h1>
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
        <div className={`p-6 ${getInfraColor(formData.number).split(' ')[0]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                {getInfraIcon(formData.title)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInfraColor(formData.number)}`}>
                    Statistic
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-gray-800 rounded-full text-sm font-medium">
                    ID: {currentInfra?.id}
                  </span>
                  {currentInfra?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentInfra.created_at)}
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
            {/* Statistic Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Number Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 ${getInfraColor(formData.number).split(' ')[1]}`}>
                    {formData.number.toLocaleString()}
                  </div>
                  <p className="text-lg text-gray-600">Total Count</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {getTrendingIcon(formData.number, totalStats.averageNumber)}
                    <span className="text-gray-700">
                      {formData.number > totalStats.averageNumber 
                        ? `Above average by ${(formData.number - totalStats.averageNumber).toLocaleString()}`
                        : `Below average by ${(totalStats.averageNumber - formData.number).toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average</p>
                      <p className="text-xl font-bold text-gray-800">
                        {totalStats.averageNumber.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="text-xl font-bold text-gray-800">
                        #{infraList.findIndex(i => i.id === currentInfra?.id) + 1} of {infraList.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Statistic Information
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Title
                      </label>
                      <p className="text-gray-800 font-medium">{formData.title}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Number Value
                      </label>
                      <p className="text-gray-800 font-medium">{formData.number.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Size Category
                      </label>
                      <span className={`px-3 py-1 rounded-full ${getInfraColor(formData.number)}`}>
                        {formData.number >= 1000 ? 'Mega' :
                         formData.number >= 500 ? 'Extra Large' :
                         formData.number >= 100 ? 'Large' :
                         formData.number >= 50 ? 'Medium' : 'Small'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Context and Actions */}
            <div className="space-y-6">
              {/* Comparison Chart */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-amber-600" />
                  Comparison
                </h2>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getInfraColor(formData.number).split(' ')[1].split('-')[1]}`}></div>
                        <span className="font-medium">This Stat</span>
                      </div>
                      <span className="font-bold">{formData.number.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Nearby Stats */}
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-3">Similar Stats</div>
                    <div className="space-y-3">
                      {infraList
                        .filter(i => i.id !== currentInfra?.id)
                        .sort((a, b) => Math.abs(a.number - formData.number) - Math.abs(b.number - formData.number))
                        .slice(0, 3)
                        .map((infra) => (
                          <div 
                            key={infra.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleView(infra.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getInfraColor(infra.number).split(' ')[1].split('-')[1]}`}></div>
                              <span className="text-sm truncate">{infra.title}</span>
                            </div>
                            <span className="text-sm text-gray-600">{infra.number.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {currentInfra && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Timestamps</h3>
                  <div className="space-y-3">
                    {currentInfra.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentInfra.created_at)}
                        </p>
                      </div>
                    )}
                    
                    {currentInfra.updated_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">Updated</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentInfra.updated_at)}
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
                    Edit Stat
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setMode("create");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Stat
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

export default InfraManager;