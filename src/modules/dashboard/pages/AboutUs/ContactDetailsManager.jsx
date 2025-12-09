import React, { useState, useEffect, useCallback } from "react";
import {
  createContactDetails,
  fetchContactDetails,
  fetchContactDetailsById,
  updateContactDetails,
  deleteContactDetails
} from "../../../../api/userApi";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Copy,
  Shield,
  ExternalLink,
  Building2,
  Users
} from "lucide-react";

// ✅ MOVED OUTSIDE - Input Field Component
const InputField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  icon: Icon, 
  isRequired = false,
  value,
  onChange,
  error
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon className="w-4 h-4" />}
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
  </div>
);

// ✅ MOVED OUTSIDE - Social Media Input Component
const SocialInput = ({ 
  platform, 
  icon: Icon, 
  placeholder,
  value,
  onChange,
  error
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" />
      {platform}
    </label>
    <div className="relative">
      <input
        type="url"
        name={platform.toLowerCase()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
  </div>
);

// ✅ MOVED OUTSIDE - Contact Card Component
const ContactCard = ({ contact, onView, onEdit, onDelete, formatDate }) => (
  <div className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    {/* Header */}
    <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Contact Details</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                ID: {contact.id}
              </span>
              {contact.created_at && (
                <span className="text-xs text-gray-500">
                  Created: {formatDate(contact.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(contact.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </div>
            <p className="font-medium text-gray-800 truncate">{contact.phone}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Emergency</span>
            </div>
            <p className="font-medium text-gray-800 truncate">{contact.emergencyno || "Not set"}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-3 h-3" />
            <span>Email</span>
          </div>
          <p className="font-medium text-gray-800 truncate">{contact.email}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>Address</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{contact.address}</p>
        </div>

        {/* Social Media Links */}
        {(contact.facebook || contact.instagram || contact.youtube) && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3">
              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ContactDetailsManager = () => {
  // States
  const [contactDetailsList, setContactDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list");
  const [currentContact, setCurrentContact] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    emergencyno: "",
    email: "",
    website: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    workinghours: ""
  });
  
  const [errors, setErrors] = useState({});
  const [copiedField, setCopiedField] = useState("");

  // Fetch all contact details on component mount
  useEffect(() => {
    loadContactDetails();
  }, []);

  const loadContactDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchContactDetails();
      setContactDetailsList(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error loading contact details:", error);
      alert("Error loading contact details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Memoized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+\d\s\-()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Enter a valid phone number";
    }
    
    if (formData.emergencyno && !/^[+\d\s\-()]{10,}$/.test(formData.emergencyno.replace(/\s/g, ''))) {
      newErrors.emergencyno = "Enter a valid emergency number";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.workinghours.trim()) {
      newErrors.workinghours = "Working hours are required";
    }
    
    if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      newErrors.website = "Enter a valid website URL";
    }
    
    if (formData.facebook && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.facebook)) {
      newErrors.facebook = "Enter a valid Facebook URL";
    }
    
    if (formData.instagram && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.instagram)) {
      newErrors.instagram = "Enter a valid Instagram URL";
    }
    
    if (formData.youtube && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.youtube)) {
      newErrors.youtube = "Enter a valid YouTube URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Copy to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
      })
      .catch(() => alert("Failed to copy to clipboard"));
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createContactDetails(formData);
      alert("Contact details created successfully!");
      resetForm();
      setMode("list");
      loadContactDetails();
    } catch (error) {
      alert("Error creating contact details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentContact) return;
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateContactDetails(currentContact.id, formData);
      alert("Contact details updated successfully!");
      resetForm();
      setMode("list");
      loadContactDetails();
    } catch (error) {
      alert("Error updating contact details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete these contact details?")) return;

    setLoading(true);
    try {
      await deleteContactDetails(id);
      alert("Contact details deleted successfully!");
      loadContactDetails();
    } catch (error) {
      alert("Error deleting contact details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const contact = await fetchContactDetailsById(id);
      setCurrentContact(contact);
      setFormData({
        phone: contact.phone || "",
        emergencyno: contact.emergencyno || "",
        email: contact.email || "",
        website: contact.website || "",
        address: contact.address || "",
        facebook: contact.facebook || "",
        instagram: contact.instagram || "",
        youtube: contact.youtube || "",
        workinghours: contact.workinghours || ""
      });
      setMode("view");
    } catch (error) {
      alert("Error fetching contact details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setFormData({
      phone: contact.phone || "",
      emergencyno: contact.emergencyno || "",
      email: contact.email || "",
      website: contact.website || "",
      address: contact.address || "",
      facebook: contact.facebook || "",
      instagram: contact.instagram || "",
      youtube: contact.youtube || "",
      workinghours: contact.workinghours || ""
    });
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({
      phone: "",
      emergencyno: "",
      email: "",
      website: "",
      address: "",
      facebook: "",
      instagram: "",
      youtube: "",
      workinghours: ""
    });
    setErrors({});
    setCurrentContact(null);
    setCopiedField("");
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

  // Render Contact Details List
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Details</h1>
          <p className="text-gray-600 mt-1">Manage your organization's contact information</p>
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
      ) : contactDetailsList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Contact Details Found</h3>
          <p className="text-gray-500 mt-1">Create your first contact details to get started</p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{contactDetailsList.length}</p>
                  <p className="text-sm text-gray-600">Contact Sets</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {contactDetailsList.filter(c => c.emergencyno).length}
                  </p>
                  <p className="text-sm text-gray-600">Emergency Numbers</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {contactDetailsList.filter(c => c.website).length}
                  </p>
                  <p className="text-sm text-gray-600">Websites</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Facebook className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {contactDetailsList.filter(c => c.facebook || c.instagram || c.youtube).length}
                  </p>
                  <p className="text-sm text-gray-600">Social Media</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contactDetailsList.map((contact) => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatDate={formatDate}
              />
            ))}
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
          {mode === "edit" ? `Edit Contact Details #${currentContact?.id}` : "Create Contact Details"}
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

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+91 9876543210"
                icon={Phone}
                isRequired
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
              
              <InputField
                label="Emergency Number"
                name="emergencyno"
                type="tel"
                placeholder="+91 9000000000"
                icon={Shield}
                value={formData.emergencyno}
                onChange={handleInputChange}
                error={errors.emergencyno}
              />
              
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="contact@example.com"
                icon={Mail}
                isRequired
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              
              <InputField
                label="Website"
                name="website"
                type="url"
                placeholder="https://www.example.com"
                icon={Globe}
                value={formData.website}
                onChange={handleInputChange}
                error={errors.website}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Address Information
            </h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4" />
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="123 Health Street, Chennai, India"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Working Hours
            </h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Working Hours <span className="text-red-500">*</span>
              </label>
              <textarea
                name="workinghours"
                value={formData.workinghours}
                onChange={handleInputChange}
                rows="2"
                placeholder="Mon - Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 4:00 PM"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.workinghours ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.workinghours && (
                <p className="text-red-500 text-sm">{errors.workinghours}</p>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-500" />
              Social Media Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SocialInput
                platform="Facebook"
                icon={Facebook}
                placeholder="https://facebook.com/yourpage"
                value={formData.facebook}
                onChange={handleInputChange}
                error={errors.facebook}
              />
              
              <SocialInput
                platform="Instagram"
                icon={Instagram}
                placeholder="https://instagram.com/yourprofile"
                value={formData.instagram}
                onChange={handleInputChange}
                error={errors.instagram}
              />
              
              <SocialInput
                platform="Youtube"
                icon={Youtube}
                placeholder="https://youtube.com/@yourchannel"
                value={formData.youtube}
                onChange={handleInputChange}
                error={errors.youtube}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-white p-6 rounded-lg border space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-800">Contact Information Preview</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone:</span>
                  </div>
                  <p className="font-medium">{formData.phone || "Not set"}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Emergency:</span>
                  </div>
                  <p className="font-medium">{formData.emergencyno || "Not set"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                </div>
                <p className="font-medium">{formData.email || "Not set"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Address:</span>
                </div>
                <p className="text-gray-700">{formData.address || "Not set"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Working Hours:</span>
                </div>
                <p className="text-gray-700">{formData.workinghours || "Not set"}</p>
              </div>
              
              {(formData.facebook || formData.instagram || formData.youtube) && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3">
                    {formData.facebook && (
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Facebook className="w-4 h-4" />
                      </div>
                    )}
                    {formData.instagram && (
                      <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                        <Instagram className="w-4 h-4" />
                      </div>
                    )}
                    {formData.youtube && (
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <Youtube className="w-4 h-4" />
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
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === "edit" ? "Update Details" : "Create Details"}
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
        <h1 className="text-2xl font-bold text-gray-800">Contact Details</h1>
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
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    ID: {currentContact?.id}
                  </span>
                  {currentContact?.created_at && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentContact.created_at)}
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
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">Phone Number</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(formData.phone, "phone")}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "phone" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-800">{formData.phone}</p>
                  </div>

                  {/* Emergency */}
                  {formData.emergencyno && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">Emergency Number</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(formData.emergencyno, "emergency")}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedField === "emergency" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-lg font-medium text-red-700">{formData.emergencyno}</p>
                    </div>
                  )}

                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email Address</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(formData.email, "email")}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "email" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-lg font-medium text-gray-800">{formData.email}</p>
                  </div>

                  {/* Website */}
                  {formData.website && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">Website</span>
                        </div>
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit
                        </a>
                      </div>
                      <p className="text-gray-800 truncate">{formData.website}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Working Hours
                </h2>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Operating Hours</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{formData.workinghours}</p>
                </div>
              </div>
            </div>

            {/* Address & Social Media */}
            <div className="space-y-6">
              {/* Address */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Address
                </h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Physical Address</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(formData.address, "address")}
                      className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedField === "address" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{formData.address}</p>
                </div>
              </div>

              {/* Social Media */}
              {(formData.facebook || formData.instagram || formData.youtube) && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-500" />
                    Social Media Links
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="space-y-3">
                      {formData.facebook && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700">Facebook</span>
                          </div>
                          <a
                            href={formData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit
                          </a>
                        </div>
                      )}
                      
                      {formData.instagram && (
                        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Instagram className="w-5 h-5 text-pink-600" />
                            <span className="font-medium text-gray-700">Instagram</span>
                          </div>
                          <a
                            href={formData.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit
                          </a>
                        </div>
                      )}
                      
                      {formData.youtube && (
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Youtube className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-gray-700">YouTube</span>
                          </div>
                          <a
                            href={formData.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Visit
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {currentContact && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Timestamps</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentContact.created_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-medium">Created</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentContact.created_at)}
                        </p>
                      </div>
                    )}
                    
                    {currentContact.updated_at && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs font-medium">Updated</span>
                        </div>
                        <p className="text-gray-800 text-sm">
                          {formatDate(currentContact.updated_at)}
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

export default ContactDetailsManager;