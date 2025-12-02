import { Add, PhotoLibrary } from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadGalleryFile,
} from "../../../api/userApi";
import { BASE_URL } from "../../../api/apiConfig";

const GalleryManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load albums from API
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await getGallery();
      console.log("📸 Gallery data loaded:", data);

      // Transform API data to match your component structure
      const transformedAlbums = transformApiDataToAlbums(data);
      setAlbums(transformedAlbums);
      setError("");
    } catch (err) {
      setError("Failed to load gallery");
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to album structure
  const transformApiDataToAlbums = (apiData) => {
    const albumsMap = {};

    apiData.forEach((item) => {
      const albumName = item.category || "Uncategorized";
      if (!albumsMap[albumName]) {
        albumsMap[albumName] = {
          id: albumName,
          name: albumName,
          coverImage: null,
          media: [],
          createdAt: item.createdat || new Date().toISOString(),
        };
      }

      // Only add items that have a filepath
      if (item.filepath) {
        const mediaItem = {
          id: item.id.toString(),
          name: item.title,
          type: item.type === "video" ? "video" : "image",
          url: item.filepath,
          uploadedAt: item.createdat,
          size: 0,
        };

        albumsMap[albumName].media.push(mediaItem);

        // Set first item as cover image
        if (!albumsMap[albumName].coverImage) {
          albumsMap[albumName].coverImage = mediaItem.id;
        }
      }
    });

    return Object.values(albumsMap);
  };

  // Create new album
  const createAlbum = async () => {
    if (newAlbumName.trim()) {
      try {
        const apiData = {
          title: newAlbumName.trim(),
          type: "photo",
          filepath: "",
          category: newAlbumName.trim(),
          isactive: true,
        };

        await addGalleryItem(apiData);

        // Reload gallery to get the updated data
        await loadGallery();

        setNewAlbumName("");
        setShowCreateAlbum(false);
        setError("");
      } catch (err) {
        setError("Failed to create album");
        console.error("Error creating album:", err);
      }
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = async (e, albumId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files, albumId);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files, albumId) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    setUploadingFiles(fileList.map((file) => file.name));

    try {
      for (const file of fileList) {
        try {
          // Upload file using your uploadGalleryFile function
          const filepath = await uploadGalleryFile(file);
          const fullUrl = `${BASE_URL}/${
            filepath.startsWith("/") ? filepath.slice(1) : filepath
          }`;

          console.log("📤 File uploaded successfully:", filepath);

          // Create gallery item in database
          const apiData = {
            title: file.name,
            type: file.type.startsWith("image/") ? "photo" : "video",
            filepath: fullUrl,
            category: album.name,
            isactive: true,
          };

          await addGalleryItem(apiData);
        } catch (error) {
          console.error("Error uploading file:", error);
          throw error;
        }
      }

      // Reload gallery to get updated data
      await loadGallery();
      setError("");
    } catch (err) {
      setError("Failed to upload files");
      console.error("Error uploading files:", err);
    } finally {
      setUploadingFiles([]);
    }
  };

  // Set cover image
  const setCoverImage = (albumId, mediaId) => {
    const updatedAlbums = albums.map((album) =>
      album.id === albumId ? { ...album, coverImage: mediaId } : album
    );
    setAlbums(updatedAlbums);
  };

  // Show delete confirmation popup
  const showDeleteConfirmation = (albumId, mediaId = null) => {
    setItemToDelete({ albumId, mediaId });
    setShowDeletePopup(true);
  };

  // Delete album
  const deleteAlbum = async (albumId) => {
    try {
      const album = albums.find((a) => a.id === albumId);
      if (!album) return;

      // Delete all media items in this album from API
      const deletePromises = album.media.map((media) =>
        deleteGalleryItem(parseInt(media.id))
      );

      await Promise.all(deletePromises);

      const updatedAlbums = albums.filter((album) => album.id !== albumId);
      setAlbums(updatedAlbums);

      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
      }
      setError("");
    } catch (err) {
      setError("Failed to delete album");
      console.error("Error deleting album:", err);
    } finally {
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  // Delete media from album
  const deleteMedia = async (albumId, mediaId) => {
    try {
      // Delete from API
      await deleteGalleryItem(parseInt(mediaId));

      // Reload gallery to get updated data
      await loadGallery();

      setError("");
    } catch (err) {
      setError("Failed to delete media");
      console.error("Error deleting media:", err);
    } finally {
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.mediaId) {
        deleteMedia(itemToDelete.albumId, itemToDelete.mediaId);
      } else {
        deleteAlbum(itemToDelete.albumId);
      }
    }
  };

  const getCoverImageUrl = (album) => {
    if (!album.coverImage) return null;
    const coverMedia = album.media.find(
      (media) => media.id === album.coverImage
    );
    return coverMedia ? coverMedia.url : null;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-2 flex items-center justify-center">
        <div className="text-blue-600 font-semibold">Loading Gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 md:py-2">
      <div className="mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-6">
                {itemToDelete?.mediaId
                  ? "Are you sure you want to delete this media item? This action cannot be undone."
                  : "Are you sure you want to delete this album? All media in this album will be lost."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] shadow-md rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PhotoLibrary /> Gallery Management
            </h1>
            <p className="text-gray-600 mt-2">
              Organize your photos and videos into albums
            </p>
          </div>
          <button
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            onClick={() => setShowCreateAlbum(true)}
          >
            + Create New Album
          </button>
        </div>

        {/* Create Album Modal */}
        {showCreateAlbum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Add fontSize="large" /> Create New Album
              </h2>
              <input
                type="text"
                placeholder="Enter album name (e.g., Health Camps, Hospital Events)"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createAlbum()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                autoFocus
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createAlbum}
                  disabled={!newAlbumName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Album
                </button>
                <button
                  onClick={() => setShowCreateAlbum(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Albums Grid */}
        {!selectedAlbum && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="relative aspect-video cursor-pointer group"
                  onClick={() => setSelectedAlbum(album)}
                >
                  {getCoverImageUrl(album) ? (
                    <img
                      src={getCoverImageUrl(album)}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">📁</div>
                        <p className="text-sm">No cover image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-end">
                    <div className="w-full bg-gradient-to-t from-black via-black to-transparent bg-opacity-50 p-4 text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {album.media.length} items
                        </span>
                        <span className="text-xs opacity-90">
                          {new Date(album.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 truncate">
                    {album.name}
                  </h3>
                  <div className="flex gap-2">
                    <label className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg cursor-pointer text-center transition-colors duration-200">
                      Upload
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) =>
                          handleFileUpload(e.target.files, album.id)
                        }
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => showDeleteConfirmation(album.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm py-2 px-3 rounded-lg transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Album Detail View */}
        {selectedAlbum && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-10">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedAlbum.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedAlbum.media.length} media items • Created{" "}
                    {new Date(selectedAlbum.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer">
                    Upload Files
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) =>
                        handleFileUpload(e.target.files, selectedAlbum.id)
                      }
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Back to Albums
                  </button>
                </div>
              </div>
            </div>

            {/* Uploading Files */}
            {uploadingFiles.length > 0 && (
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Uploading Files
                </h4>
                <div className="space-y-3">
                  {uploadingFiles.map((fileName, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-4">
                        {fileName}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Grid */}
            <div className="p-6">
              {selectedAlbum.media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {selectedAlbum.media.map((media) => (
                    <div
                      key={media.id}
                      className="group relative bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                    >
                      {media.type === "image" || media.type === "photo" ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full aspect-square object-cover"
                        />
                      ) : (
                        <video
                          className="w-full aspect-square object-cover"
                          controls
                        >
                          <source src={media.url} />
                        </video>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          {/* <button
                                                        onClick={() => setCoverImage(selectedAlbum.id, media.id)}
                                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                                            selectedAlbum.coverImage === media.id
                                                                ? 'bg-blue-600 text-white cursor-default'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {selectedAlbum.coverImage === media.id ? '✓ Cover' : 'Set Cover'}
                                                    </button> */}
                          <button
                            onClick={() =>
                              showDeleteConfirmation(selectedAlbum.id, media.id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Media Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent bg-opacity-60 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <p className="text-xs font-medium truncate mb-1">
                          {media.name}
                        </p>
                        <div className="flex justify-between text-xs opacity-90">
                          <span>{formatFileSize(media.size)}</span>
                          <span>
                            {new Date(media.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Cover Badge */}
                      {selectedAlbum.coverImage === media.id && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-gray-300">📷</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No media yet
                  </h3>
                  <p className="text-gray-600">
                    Upload some photos or videos to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {albums.length === 0 && !selectedAlbum && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6 text-gray-300">📁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Albums Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first album to start organizing your photos and videos
              into collections like Health Camps or Hospital Events.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={() => setShowCreateAlbum(true)}
            >
              Create Your First Album
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
