import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Image as ImageIcon,
    X,
    Save,
    Newspaper
} from 'lucide-react';
import {
    getNewsEvents,
    addNewsEvent,
    updateNewsEvent,
    deleteNewsEvent,
    toggleNewsEventStatus
} from "../../../api/userApi";

const NewsEventsManagement = () => {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'news',
        eventdate: '',
        endDate: '',
        location: '',
        image: '',
        isactive: true
    });

    // Load data from API
    useEffect(() => {
        loadNewsEvents();
    }, []);

    const loadNewsEvents = async () => {
        try {
            setLoading(true);
            const data = await getNewsEvents();
            setItems(data);
            setError('');
        } catch (err) {
            setError('Failed to load news and events');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    image: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: ''
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'news',
            eventdate: '',
            endDate: '',
            location: '',
            image: '',
            isactive: true
        });
        setEditingItem(null);
        setIsEditing(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingItem) {
                // Update existing item
                const updatedItem = await updateNewsEvent(editingItem.id, formData);
                setItems(prev => prev.map(item =>
                    item.id === editingItem.id ? updatedItem : item
                ));
            } else {
                // Create new item
                const newItem = await addNewsEvent(formData);
                setItems(prev => [...prev, newItem]);
            }
            
            resetForm();
            setShowForm(false);
            setError('');
        } catch (err) {
            setError('Failed to save item');
            console.error('Error saving data:', err);
        }
    };

    const editItem = (item) => {
        setFormData({
            title: item.title || '',
            description: item.description || '',
            type: item.type || 'news',
            eventdate: item.eventdate ? item.eventdate.split('T')[0] : '',
            endDate: item.endDate ? item.endDate.split('T')[0] : '',
            location: item.location || '',
            image: item.image || '',
            isactive: item.isactive !== undefined ? item.isactive : true
        });
        setEditingItem(item);
        setIsEditing(true);
        setShowForm(true);
    };

    const deleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteNewsEvent(id);
                setItems(prev => prev.filter(item => item.id !== id));
                setError('');
            } catch (err) {
                setError('Failed to delete item');
                console.error('Error deleting data:', err);
            }
        }
    };

    const toggleActiveStatus = async (id, currentStatus) => {
        try {
            await toggleNewsEventStatus(id, !currentStatus);
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, isactive: !currentStatus } : item
            ));
            setError('');
        } catch (err) {
            setError('Failed to update status');
            console.error('Error updating status:', err);
        }
    };

    const cancelEdit = () => {
        resetForm();
        setShowForm(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-2">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-blue-600 font-semibold">Loading News & Events...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-2">
            <div className="max-w-7xl mx-auto ">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Header */}
                <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-5 rounded-xl shadow-sm mb-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Newspaper className="text-blue-600" />
                        News & Events Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your news articles and event schedules</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Form */}
                    <div className={`lg:col-span-2 ${showForm ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {isEditing ? 'Edit Item' : 'Add New Item'}
                                </h2>
                                <button
                                    onClick={cancelEdit}
                                    className="lg:hidden text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="news"
                                                checked={formData.type === 'news'}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            News
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="event"
                                                checked={formData.type === 'event'}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Event
                                        </label>
                                    </div>
                                </div>

                                {/* Title */}
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter title"
                                    />
                                </div>

                                {/* Description & Image in 2-column grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            className="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter description"
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL
                                        </label>
                                        {formData.image ? (
                                            <div className="relative">
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    name="image"
                                                    value={formData.image}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                                                    placeholder="Enter image URL"
                                                />
                                                <p className="text-sm text-gray-500 text-center">OR</p>
                                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 mt-2">
                                                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                        <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                                        <p className="text-sm text-gray-500">Upload image</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Date Fields */}
                                <div className={`grid gap-6 ${formData.type === "event" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {formData.type === 'event' ? 'Start Date *' : 'Date *'}
                                        </label>
                                        <input
                                            type="date"
                                            name="eventdate"
                                            value={formData.eventdate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* End Date (for events) */}
                                    {/* {formData.type === 'event' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    )} */}

                                    {/* Location (for events) */}
                                    {formData.type === 'event' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter location"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isactive"
                                        checked={formData.isactive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isactive: e.target.checked }))}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Active
                                    </label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                                    >
                                        <Save size={18} className="mr-2" />
                                        {isEditing ? 'Update' : 'Create'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Action Bar */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setShowForm(true);
                                        }}
                                        className="lg:hidden bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add New
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Filter:</span>
                                        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="all">All</option>
                                            <option value="news">News</option>
                                            <option value="event">Events</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {items.length} {items.length === 1 ? 'item' : 'items'} total
                                </div>
                            </div>
                        </div>

                        {/* Items Grid */}
                        {items.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No items yet</h3>
                                <p className="mt-2 text-gray-500">Get started by creating your first news article or event.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        {item.image && (
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-3">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'news'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {item.type === 'news' ? 'News' : 'Event'}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isactive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {item.isactive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => editItem(item)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {item.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                                                {item.description}
                                            </p>

                                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar size={16} className="mr-2" />
                                                    {formatDate(item.eventdate)}
                                                    {item.endDate && ` - ${formatDate(item.endDate)}`}
                                                </div>

                                                {item.location && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin size={16} className="mr-2" />
                                                        {item.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsEventsManagement;