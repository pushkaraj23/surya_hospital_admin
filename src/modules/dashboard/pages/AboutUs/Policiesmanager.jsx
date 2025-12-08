import React, { useState, useEffect } from "react";
import {
  createPolicy,
  fetchPolicies,
  fetchPolicyById,
  updatePolicy,
  deletePolicy
} from "../../../../api/userApi";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  FileText,
  Shield,
  Lock,
  Users,
  Heart,
  Building2,
  Calendar,
  Clock,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileCheck,
  Clipboard,
  EyeOff,
  Eye as EyeIcon,
  Printer,
  Download,
  Bookmark,
  Tag,
  Hash,
  Star,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";

const PoliciesManager = () => {
  // States
  const [policiesList, setPoliciesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // "list", "create", "edit", "view"
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    policy: ""
  });
  
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [filterType, setFilterType] = useState("all"); // "all", "privacy", "terms", "other"
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [copiedText, setCopiedText] = useState("");
  const [policyPreview, setPolicyPreview] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Fetch all policies on component mount
  useEffect(() => {
    loadPolicies();
  }, []);

  // Update word and character count when policy text changes
  useEffect(() => {
    if (formData.policy) {
      const words = formData.policy.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(formData.policy.length);
    } else {
      setWordCount(0);
      setCharacterCount(0);
    }
  }, [formData.policy]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await fetchPolicies();
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => a.title.localeCompare(b.title))
        : [data];
      setPoliciesList(sortedData);
    } catch (error) {
      console.error("Error loading policies:", error);
      alert("Error loading policies: " + error.message);
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

  // Handle textarea changes with auto-expand
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-expand textarea
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Policy title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (!formData.policy.trim()) {
      newErrors.policy = "Policy content is required";
    } else if (formData.policy.length < 10) {
      newErrors.policy = "Policy content must be at least 10 characters";
    } else if (formData.policy.length > 10000) {
      newErrors.policy = "Policy content is too long (max 10,000 characters)";
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

  // Get policy icon based on title
  const getPolicyIcon = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('privacy') || titleLower.includes('data')) return <Lock className="w-5 h-5" />;
    if (titleLower.includes('terms') || titleLower.includes('condition')) return <FileText className="w-5 h-5" />;
    if (titleLower.includes('security') || titleLower.includes('protection')) return <Shield className="w-5 h-5" />;
    if (titleLower.includes('patient') || titleLower.includes('care')) return <Heart className="w-5 h-5" />;
    if (titleLower.includes('staff') || titleLower.includes('employee')) return <Users className="w-5 h-5" />;
    if (titleLower.includes('hospital') || titleLower.includes('facility')) return <Building2 className="w-5 h-5" />;
    if (titleLower.includes('quality') || titleLower.includes('standard')) return <Award className="w-5 h-5" />;
    if (titleLower.includes('safety') || titleLower.includes('health')) return <Shield className="w-5 h-5" />;
    
    return <FileText className="w-5 h-5" />;
  };

  // Get policy color based on title
  const getPolicyColor = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('privacy') || titleLower.includes('data')) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (titleLower.includes('terms') || titleLower.includes('condition')) return 'bg-purple-50 text-purple-600 border-purple-200';
    if (titleLower.includes('security') || titleLower.includes('protection')) return 'bg-green-50 text-green-600 border-green-200';
    if (titleLower.includes('patient') || titleLower.includes('care')) return 'bg-pink-50 text-pink-600 border-pink-200';
    if (titleLower.includes('staff') || titleLower.includes('employee')) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (titleLower.includes('hospital') || titleLower.includes('facility')) return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    if (titleLower.includes('quality') || titleLower.includes('standard')) return 'bg-amber-50 text-amber-600 border-amber-200';
    if (titleLower.includes('safety') || titleLower.includes('health')) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  // Get policy type for filtering
  const getPolicyType = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('privacy') || titleLower.includes('data')) return 'privacy';
    if (titleLower.includes('terms') || titleLower.includes('condition')) return 'terms';
    if (titleLower.includes('security')) return 'security';
    if (titleLower.includes('patient')) return 'patient';
    if (titleLower.includes('staff')) return 'staff';
    if (titleLower.includes('hospital')) return 'hospital';
    if (titleLower.includes('quality')) return 'quality';
    if (titleLower.includes('safety')) return 'safety';
    
    return 'other';
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createPolicy(formData);
      alert("Policy created successfully!");
      resetForm();
      setMode("list");
      loadPolicies();
    } catch (error) {
      alert("Error creating policy: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentPolicy) return;
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updatePolicy(currentPolicy.id, formData);
      alert("Policy updated successfully!");
      resetForm();
      setMode("list");
      loadPolicies();
    } catch (error) {
      alert("Error updating policy: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;

    setLoading(true);
    try {
      await deletePolicy(id);
      alert("Policy deleted successfully!");
      loadPolicies();
    } catch (error) {
      alert("Error deleting policy: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const policy = await fetchPolicyById(id);
      setCurrentPolicy(policy);
      setFormData({
        title: policy.title || "",
        policy: policy.policy || ""
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching policy: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setCurrentPolicy(policy);
    setFormData({
      title: policy.title || "",
      policy: policy.policy || ""
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      policy: ""
    });
    setErrors({});
    setCurrentPolicy(null);
    setPolicyPreview(false);
    setWordCount(0);
    setCharacterCount(0);
  };

  // Copy to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(type);
        setTimeout(() => setCopiedText(""), 2000);
      })
      .catch(() => alert("Failed to copy to clipboard"));
  };

  // Bulk operations
  const handleSelectAll = () => {
    if (selectedPolicies.length === filteredPolicies.length) {
      setSelectedPolicies([]);
    } else {
      setSelectedPolicies(filteredPolicies.map(item => item.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPolicies.length === 0) {
      alert("Please select policies to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedPolicies.length} policies?`)) return;

    setLoading(true);
    try {
      // Delete all selected items
      await Promise.all(selectedPolicies.map(id => deletePolicy(id)));
      alert(`${selectedPolicies.length} policies deleted successfully!`);
      setSelectedPolicies([]);
      loadPolicies();
    } catch (error) {
      alert("Error deleting policies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort policies
  const sortPolicies = (order) => {
    const sorted = [...policiesList].sort((a, b) => {
      if (order === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setPoliciesList(sorted);
    setSortOrder(order);
  };

  // Filter and search policies
  const filteredPolicies = policiesList.filter(policy => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policy.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === "all" || getPolicyType(policy.title) === filterType;
    
    return matchesSearch && matchesType;
  });

  // Get unique policy types for filter
  const getPolicyTypes = () => {
    const types = policiesList.map(item => getPolicyType(item.title));
    return ["all", ...new Set(types)];
  };

  // Policy Card Component
  const PolicyCard = ({ policy, isSelected = false }) => {
    const isExpanded = expandedPolicy === policy.id;
    const policyType = getPolicyType(policy.title);
    const previewText = policy.policy.length > 150 ? policy.policy.substring(0, 150) + "..." : policy.policy;
    
    return (
      <div className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}>
        {/* Header */}
        <div className={`p-6 ${getPolicyColor(policy.title).split(' ')[0]} border-b`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getPolicyColor(policy.title).split(' ')[1]} bg-white/20`}>
                {getPolicyIcon(policy.title)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{policy.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPolicyColor(policy.title)}`}>
                    {policyType.charAt(0).toUpperCase() + policyType.slice(1)}
                  </span>
                  <span className="text-xs text-gray-600">
                    ID: {policy.id}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  if (selectedPolicies.includes(policy.id)) {
                    setSelectedPolicies(prev => prev.filter(id => id !== policy.id));
                  } else {
                    setSelectedPolicies(prev => [...prev, policy.id]);
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Policy Content</span>
              </div>
              <button
                onClick={() => copyToClipboard(policy.policy, `policy-${policy.id}`)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {copiedText === `policy-${policy.id}` ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-700 text-sm">
                {isExpanded ? policy.policy : previewText}
              </p>
              
              {policy.policy.length > 150 && (
                <button
                  onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Show Less
                    </>
                  ) : (
                    <>
                      <EyeIcon className="w-3 h-3" /> Read More
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Words</div>
              <div className="font-semibold">
                {policy.policy.trim().split(/\s+/).filter(w => w.length > 0).length}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Chars</div>
              <div className="font-semibold">{policy.policy.length}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Type</div>
              <div className="font-semibold text-xs">{policyType}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xs text-gray-500">
              {policy.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(policy.created_at)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(policy.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(policy)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(policy.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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

  // Render Policies List
  const renderList = () => {
    const policies = filteredPolicies;
    const totalWords = policies.reduce((sum, policy) => 
      sum + policy.policy.trim().split(/\s+/).filter(w => w.length > 0).length, 0
    );
    const totalChars = policies.reduce((sum, policy) => sum + policy.policy.length, 0);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Policies Management</h1>
            <p className="text-gray-600 mt-1">Manage your organization's policies and documents</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setMode("create");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Policy
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{policiesList.length}</p>
                <p className="text-sm text-gray-600">Total Policies</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalWords.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Words</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Clipboard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalChars.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Characters</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {policiesList.length > 0 ? Math.round(totalWords / policiesList.length) : 0}
                </p>
                <p className="text-sm text-gray-600">Avg Words/Policy</p>
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
                Search Policies
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or content..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="privacy">Privacy Policies</option>
                <option value="terms">Terms & Conditions</option>
                <option value="security">Security Policies</option>
                <option value="patient">Patient Policies</option>
                <option value="staff">Staff Policies</option>
                <option value="quality">Quality Policies</option>
                <option value="safety">Safety Policies</option>
                <option value="other">Other Policies</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Title
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => sortPolicies("asc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "asc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  A-Z
                </button>
                <button
                  onClick={() => sortPolicies("desc")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    sortOrder === "desc" 
                      ? 'bg-blue-100 text-blue-700 border-blue-300' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  Z-A
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPolicies.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">
                    {selectedPolicies.length} polic{selectedPolicies.length !== 1 ? 'ies' : 'y'} selected
                  </p>
                  <p className="text-sm text-blue-600">
                    Click on policies or use checkboxes to select
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                  {selectedPolicies.length === policies.length ? 'Deselect All' : 'Select All'}
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
        ) : policies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              {searchTerm || filterType !== "all" ? "No matching policies found" : "No Policies Found"}
            </h3>
            <p className="text-gray-500 mt-1">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first policy to get started"}
            </p>
            {(searchTerm || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {policies.length} polic{policies.length !== 1 ? 'ies' : 'y'}
                {searchTerm && ` for "${searchTerm}"`}
                {filterType !== "all" && ` of type "${filterType}"`}
              </div>
              <div className="text-sm text-gray-500">
                {totalWords.toLocaleString()} words across all policies
              </div>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {policies.map((policy) => (
                <PolicyCard 
                  key={policy.id} 
                  policy={policy}
                  isSelected={selectedPolicies.includes(policy.id)}
                />
              ))}
            </div>

            {/* Policy Types Summary */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Policy Types Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {getPolicyTypes().filter(type => type !== "all").map((type) => {
                  const count = policiesList.filter(p => getPolicyType(p.title) === type).length;
                  const color = getPolicyColor(type.charAt(0).toUpperCase() + type.slice(1) + " Policy");
                  
                  return (
                    <div 
                      key={type}
                      className={`p-3 rounded-lg border ${color.split(' ')[0]} ${filterType === type ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setFilterType(type)}
                    >
                      <div className="text-center">
                        <div className={`text-lg font-bold mb-1 ${color.split(' ')[1]}`}>{count}</div>
                        <div className="text-xs text-gray-600 capitalize">{type}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

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
          Back to Policies
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "edit" ? `Edit Policy #${currentPolicy?.id}` : "Create New Policy"}
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Policy Title <span className="text-red-500">*</span>
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
                placeholder="e.g., Privacy Policy, Terms of Service, Patient Care Policy"
                maxLength={100}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  A clear, descriptive title for the policy (3-100 characters)
                </p>
                <p className="text-xs text-gray-500">
                  {formData.title.length}/100
                </p>
              </div>
            </div>

            {/* Policy Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Policy Content <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>{characterCount}/10000 chars</span>
                </div>
              </div>
              
              <textarea
                name="policy"
                value={formData.policy}
                onChange={handleTextareaChange}
                rows={10}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                  errors.policy ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the full policy content here..."
                maxLength={10000}
              />
              {errors.policy && (
                <p className="text-red-500 text-sm mt-1">{errors.policy}</p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Detailed policy content. Use clear, concise language.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPolicyPreview(!policyPreview)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {policyPreview ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide Preview
                      </>
                    ) : (
                      <>
                        <EyeIcon className="w-3 h-3" /> Show Preview
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.policy, "draft")}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copiedText === "draft" ? (
                      <>
                        <Check className="w-3 h-3" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Preview */}
            {policyPreview && formData.policy && (
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Policy Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 text-gray-600 hover:text-gray-800"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([formData.policy], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `${formData.title || 'policy'}.txt`;
                        document.body.appendChild(element);
                        element.click();
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || "Policy Title"}</h2>
                  <div className="text-gray-700 whitespace-pre-line">
                    {formData.policy}
                  </div>
                  <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Words: {wordCount}</span>
                      <span>Characters: {characterCount}</span>
                      <span>Generated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Writing Tips */}
            <div className="border rounded-lg p-6 bg-blue-50">
              <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Writing Tips for Effective Policies
              </h3>
              <ul className="text-sm text-blue-700 space-y-2 list-disc pl-5">
                <li>Use clear, concise language that's easy to understand</li>
                <li>Organize content with headings and bullet points</li>
                <li>Define key terms and acronyms</li>
                <li>Include contact information for questions</li>
                <li>Specify effective dates and review schedules</li>
                <li>Make it actionable with clear do's and don'ts</li>
                <li>Keep paragraphs short (3-5 sentences)</li>
                <li>Use active voice for better clarity</li>
              </ul>
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
              {mode === "edit" ? "Update Policy" : "Create Policy"}
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
          Back to Policies
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Policy Details</h1>
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
        <div className={`p-6 ${getPolicyColor(formData.title).split(' ')[0]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                {getPolicyIcon(formData.title)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPolicyColor(formData.title)}`}>
                    {getPolicyType(formData.title).toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-gray-800 rounded-full text-sm font-medium">
                    ID: {currentPolicy?.id}
                  </span>
                  {currentPolicy?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentPolicy.created_at)}
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
            {/* Policy Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Policy Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{wordCount.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Words</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{characterCount.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Characters</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {Math.round(characterCount / (wordCount || 1))}
                    </div>
                    <p className="text-sm text-gray-600">Avg Word Length</p>
                  </div>
                </div>
              </div>

              {/* Policy Content Display */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Policy Content
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(formData.policy, "full-policy")}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800"
                    >
                      {copiedText === "full-policy" ? (
                        <>
                          <Check className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy All
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="prose max-w-none">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {formData.policy}
                    </div>
                  </div>
                </div>
              </div>

              {/* Readability Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Readability Score</p>
                      <p className="text-xl font-bold text-gray-800">
                        {Math.min(100, Math.round((wordCount / 10) + 70))}/100
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reading Time</p>
                      <p className="text-xl font-bold text-gray-800">
                        {Math.ceil(wordCount / 200)} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Policy Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Policy Information
                </h2>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">Policy Type</span>
                      </div>
                      <span className="font-bold capitalize">{getPolicyType(formData.title)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Policy ID</span>
                      <span className="font-medium">{currentPolicy?.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Title Length</span>
                      <span className="font-medium">{formData.title.length} chars</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Content Length</span>
                      <span className="font-medium">{characterCount.toLocaleString()} chars</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Word Count</span>
                      <span className="font-medium">{wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {currentPolicy && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Timestamps</h3>
                  <div className="space-y-3">
                    {currentPolicy.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentPolicy.created_at)}
                        </p>
                      </div>
                    )}
                    
                    {currentPolicy.updated_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">Updated</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentPolicy.updated_at)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMode("edit")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Policy
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      const file = new Blob([formData.policy], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${formData.title.replace(/\s+/g, '_')}.txt`;
                      document.body.appendChild(element);
                      element.click();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Download as Text
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setMode("create");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Policy
                  </button>
                </div>
              </div>

              {/* Similar Policies */}
              {policiesList.length > 1 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Similar Policies</h3>
                  <div className="space-y-2">
                    {policiesList
                      .filter(p => p.id !== currentPolicy?.id && getPolicyType(p.title) === getPolicyType(formData.title))
                      .slice(0, 3)
                      .map((policy) => (
                        <div 
                          key={policy.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleView(policy.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${getPolicyColor(policy.title).split(' ')[0]}`}>
                              {getPolicyIcon(policy.title)}
                            </div>
                            <span className="text-sm truncate">{policy.title}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
};

export default PoliciesManager;