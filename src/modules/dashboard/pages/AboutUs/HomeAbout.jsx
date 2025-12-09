import React, { useState, useEffect } from 'react';
import {
  getAllHomeAbout,
  getHomeAboutById,
  createHomeAbout,
  updateHomeAbout,
  deleteHomeAbout,
  uploadGalleryFile
} from '../../../../api/userApi';

const HomeAbout = () => {
  const [homeAboutList, setHomeAboutList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    image1: '',
    image2: '',
    years: '',
    specialists: '',
    patients: '',
    paragraph1: '',
    paragraph2: '',
    slogan: '',
    paragraph3: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch all home about data
  useEffect(() => {
    fetchHomeAboutData();
  }, []);

  const fetchHomeAboutData = async () => {
    setLoading(true);
    try {
      const data = await getAllHomeAbout();
      setHomeAboutList(data);
      setMessage({ type: 'success', text: 'Data loaded successfully!' });
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload for image1
  const handleImage1Upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage1(true);
    try {
      const filePath = await uploadGalleryFile(file);
      setFormData(prev => ({
        ...prev,
        image1: filePath
      }));
      setMessage({ type: 'success', text: 'Image 1 uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image 1' });
    } finally {
      setUploadingImage1(false);
    }
  };

  // Handle image upload for image2
  const handleImage2Upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage2(true);
    try {
      const filePath = await uploadGalleryFile(file);
      setFormData(prev => ({
        ...prev,
        image2: filePath
      }));
      setMessage({ type: 'success', text: 'Image 2 uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image 2' });
    } finally {
      setUploadingImage2(false);
    }
  };

  // Create new home about entry
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newItem = await createHomeAbout(formData);
      setHomeAboutList([...homeAboutList, newItem]);
      resetForm();
      setMessage({ type: 'success', text: 'Created successfully!' });
    } catch (error) {
      console.error('Error creating:', error);
      setMessage({ type: 'error', text: 'Failed to create' });
    } finally {
      setLoading(false);
    }
  };

  // Update existing entry
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setLoading(true);
    try {
      const updatedItem = await updateHomeAbout(selectedItem.id, formData);
      setHomeAboutList(homeAboutList.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      ));
      resetForm();
      setMessage({ type: 'success', text: 'Updated successfully!' });
    } catch (error) {
      console.error('Error updating:', error);
      setMessage({ type: 'error', text: 'Failed to update' });
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      await deleteHomeAbout(id);
      setHomeAboutList(homeAboutList.filter(item => item.id !== id));
      if (selectedItem?.id === id) resetForm();
      setMessage({ type: 'success', text: 'Deleted successfully!' });
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setLoading(false);
    }
  };

  // Load item for editing
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const item = await getHomeAboutById(id);
      setSelectedItem(item);
      setFormData({
        image1: item.image1 || '',
        image2: item.image2 || '',
        years: item.years || '',
        specialists: item.specialists || '',
        patients: item.patients || '',
        paragraph1: item.paragraph1 || '',
        paragraph2: item.paragraph2 || '',
        slogan: item.slogan || '',
        paragraph3: item.paragraph3 || ''
      });
      setMessage({ type: 'info', text: 'Item loaded for editing' });
    } catch (error) {
      console.error('Error fetching item:', error);
      setMessage({ type: 'error', text: 'Failed to load item' });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image1: '',
      image2: '',
      years: '',
      specialists: '',
      patients: '',
      paragraph1: '',
      paragraph2: '',
      slogan: '',
      paragraph3: ''
    });
    setSelectedItem(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Home About Manager</h1>
        <p className="text-gray-600">Manage your home page about section content and images</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                         message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
                         'bg-blue-50 text-blue-800 border border-blue-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {selectedItem ? `Edit Item #${selectedItem.id}` : 'Create New Home About'}
          </h2>

          <form onSubmit={selectedItem ? handleUpdate : handleCreate}>
            {/* Images Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Image 1 Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image 1
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage1Upload}
                    className="hidden"
                    id="image1-upload"
                  />
                  <label htmlFor="image1-upload" className="cursor-pointer">
                    {uploadingImage1 ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Uploading...</span>
                      </div>
                    ) : formData.image1 ? (
                      <div>
                        <img 
                          src={formData.image1} 
                          alt="Preview 1" 
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <span className="text-blue-600 text-sm">Click to change</span>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-600">Upload Image 1</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Image 2 Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image 2
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage2Upload}
                    className="hidden"
                    id="image2-upload"
                  />
                  <label htmlFor="image2-upload" className="cursor-pointer">
                    {uploadingImage2 ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">Uploading...</span>
                      </div>
                    ) : formData.image2 ? (
                      <div>
                        <img 
                          src={formData.image2} 
                          alt="Preview 2" 
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <span className="text-blue-600 text-sm">Click to change</span>
                      </div>
                    ) : (
                      <div>
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-600">Upload Image 2</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Stats Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years
                </label>
                <input
                  type="number"
                  name="years"
                  value={formData.years}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialists
                </label>
                <input
                  type="number"
                  name="specialists"
                  value={formData.specialists}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patients
                </label>
                <input
                  type="number"
                  name="patients"
                  value={formData.patients}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12000"
                  required
                />
              </div>
            </div>

            {/* Text Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paragraph 1
                </label>
                <textarea
                  name="paragraph1"
                  value={formData.paragraph1}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first paragraph..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paragraph 2
                </label>
                <textarea
                  name="paragraph2"
                  value={formData.paragraph2}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter second paragraph..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slogan
                </label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Health, Our Priority"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paragraph 3
                </label>
                <textarea
                  name="paragraph3"
                  value={formData.paragraph3}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter third paragraph..."
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : selectedItem ? (
                  'Update Item'
                ) : (
                  'Create Item'
                )}
              </button>

              {selectedItem && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column - List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Home About Items</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {homeAboutList.length} items
            </span>
          </div>

          {loading && !homeAboutList.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : homeAboutList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No home about items found. Create one!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {homeAboutList.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">Item #{item.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <img
                        src={item.image1}
                        alt="Image 1"
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                        }}
                      />
                    </div>
                    <div>
                      <img
                        src={item.image2}
                        alt="Image 2"
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-lg font-bold text-blue-600">{item.years}</div>
                      <div className="text-xs text-gray-500">Years</div>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-lg font-bold text-green-600">{item.specialists}</div>
                      <div className="text-xs text-gray-500">Specialists</div>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded">
                      <div className="text-lg font-bold text-purple-600">{item.patients}</div>
                      <div className="text-xs text-gray-500">Patients</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.paragraph1}</p>
                    <p className="text-sm font-medium text-gray-800">{item.slogan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;