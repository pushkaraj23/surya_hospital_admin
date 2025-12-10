import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Delete,
  Person,
  Email,
  Phone,
  FilterList,
  MoreVert,
  Lock,
  LockOpen,
  Edit,
  PersonAdd,
  Refresh,
  VerifiedUser,
  AdminPanelSettings,
  PersonOutline,
  CheckCircle,
  Cancel,
  Add,
  Close,
  Warning
} from "@mui/icons-material";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  formatUserData
} from "../../../api/userApi";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form state
  const [showUserForm, setShowUserForm] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    passwordhash: "",
    role: "Admin",
    isactive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      const usersData = response.body || [];
      
      // Filter users to show only Admin users
      const adminUsers = usersData.filter(user => user.role === "Admin");
      
      setUsers(adminUsers);
      setFilteredUsers(adminUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users (only Admin users)
  useEffect(() => {
    let result = users.filter(user => user.role === "Admin"); // Only show Admin users

    if (searchTerm) {
      result = result.filter(
        user =>
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter - only show "Admin" option
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter(user => 
        statusFilter === "active" ? user.isactive : !user.isactive
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Always set role to Admin for admin-only management
    if (name === "role") {
      setIsAdminUser(true);
      setFormData({
        ...formData,
        [name]: "Admin"
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Open form to add new user - Only Admin
  const handleAddUser = () => {
    resetForm();
    setIsAdminUser(true);
    setFormData({
      fullname: "",
      email: "",
      passwordhash: "",
      role: "Admin",
      isactive: true
    });
    setShowUserForm(true);
  };

  // Open form to edit user
  const handleEdit = async (userId) => {
    try {
      const response = await getUserById(userId);
      const user = response.body;
      // Only allow editing if user is Admin
      if (user.role !== "Admin") {
        alert("You can only edit Admin users.");
        return;
      }
      setSelectedUser(user);
      setFormData({
        ...user,
        passwordhash: "" // Clear password for security
      });
      setIsAdminUser(user.role === "Admin");
      setShowUserForm(true);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to load user details");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formattedData = formatUserData({
        ...formData,
        role: "Admin" // Force Admin role
      });
      
      if (selectedUser) {
        await updateUser(selectedUser.id, formattedData);
        alert("Admin user updated successfully!");
      } else {
        await createUser(formattedData);
        alert("Admin user created successfully!");
      }
      
      resetForm();
      loadUsers();
      setShowUserForm(false);
    } catch (error) {
      console.error("Operation failed:", error);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      passwordhash: "",
      role: "Admin",
      isactive: true
    });
    setSelectedUser(null);
    setShowPassword(false);
    setIsAdminUser(true);
  };

  // Close form
  const closeForm = () => {
    setShowUserForm(false);
    resetForm();
  };

  // Delete user
  const handleDelete = async (userId) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;
    
    // Only allow deletion of Admin users
    if (userToDelete.role !== "Admin") {
      alert("You can only delete Admin users.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this admin user?")) return;

    try {
      await deleteUser(userId);
      alert("Admin user deleted successfully!");
      loadUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    }
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    // Only allow toggling Admin users
    if (user.role !== "Admin") {
      alert("You can only modify Admin users.");
      return;
    }

    try {
      await updateUser(user.id, { ...user, isactive: !user.isactive });
      alert(`Admin user ${!user.isactive ? "activated" : "deactivated"} successfully!`);
      loadUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update user status");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    // Only export Admin users
    const adminUsers = users.filter(user => user.role === "Admin");
    
    const headers = [
      "ID", "Name", "Email", "Role", "Status", "Created Date"
    ];

    const rows = adminUsers.map(user => [
      user.id,
      user.fullname,
      user.email,
      user.role,
      user.isactive ? "Active" : "Inactive",
      new Date(user.createdat).toLocaleDateString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "admin_users.csv";
    a.click();
  };

  // Get role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status badge color
  const getStatusColor = (isActive) => {
    return isActive 
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200";
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        <Refresh className="animate-spin mr-2" />
        Loading Admin Users...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div
        className="relative rounded-3xl py-6 px-8 shadow-xl overflow-hidden 
             bg-gradient-to-br from-primary/10 to-white border border-gray-200 mb-6"
      >
        {/* Decorative Blobs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col gap-2">
          {/* Accent Label */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-secondary"></div>
            <span className="uppercase tracking-wider text-xs font-semibold text-primary/70">
              Admin Management
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                <AdminPanelSettings className="text-secondary" />
                Admin Users Management
              </h1>
              <p className="text-primary/60 text-sm max-w-xl leading-relaxed mt-2">
                Manage system administrators only. Create, edit, or remove admin user accounts.
              </p>
            </div>
            
            {/* Add User Buttons */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={loadUsers}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Refresh fontSize="small" />
                Refresh
              </button>
              
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <AdminPanelSettings fontSize="small" />
                Add Admin User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Total Admins</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {users.filter(u => u.role === "Admin").length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Active Admins</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.isactive && u.role === "Admin").length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Inactive Admins</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {users.filter(u => !u.isactive && u.role === "Admin").length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Filtered</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {filteredUsers.filter(u => u.role === "Admin").length}
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedUser ? (
                  <Edit className="text-blue-600" />
                ) : (
                  <AdminPanelSettings className="text-purple-600" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedUser ? "Edit Admin User" : "Create Admin User"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <Close />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter full name"
                    required
                    disabled={formLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="admin@example.com"
                    required
                    disabled={formLoading}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password {!selectedUser && "*"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passwordhash"
                    value={formData.passwordhash}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder={selectedUser ? "Leave blank to keep current" : "Enter password"}
                    required={!selectedUser}
                    disabled={formLoading}
                  />
                </div>

                {/* Always show Admin role indicator */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-700">
                    <AdminPanelSettings fontSize="small" />
                    <span className="font-medium">Admin User</span>
                  </div>
                  <input type="hidden" name="role" value="Admin" />
                  <p className="text-sm text-purple-600 mt-1">
                    This user will have full administrative privileges.
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isactive"
                      checked={formData.isactive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      disabled={formLoading}
                    />
                    <span className="text-sm font-medium text-gray-700">Active Account</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Refresh className="animate-spin" fontSize="small" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle fontSize="small" />
                      {selectedUser ? "Update Admin" : "Create Admin"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search admin users..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Admins</option>
          <option value="Admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={exportToCSV}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <Download fontSize="small" /> Export CSV
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left">Admin User</th>
              <th className="py-3 px-5 text-left">Contact</th>
              <th className="py-3 px-5 text-left">Role</th>
              <th className="py-3 px-5 text-left">Status</th>
              <th className="py-3 px-5 text-left">Created</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.filter(user => user.role === "Admin").map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.fullname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.fullname}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-sm">
                        <Email fontSize="small" className="text-gray-400" />
                        {user.email}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      <AdminPanelSettings fontSize="small" className="mr-1" />
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 px-5">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isactive)}`}
                    >
                      {user.isactive ? (
                        <LockOpen fontSize="small" />
                      ) : (
                        <Lock fontSize="small" />
                      )}
                      {user.isactive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="py-3 px-5 text-sm text-gray-500">
                    {new Date(user.createdat).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                        title="Edit admin user"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        title="Delete admin user"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500 text-sm">
                  <AdminPanelSettings className="text-gray-300 mx-auto mb-2" style={{ fontSize: 48 }} />
                  <div>No admin users found</div>
                  <div className="text-xs mt-1">Try adjusting your search or filters</div>
                  <button
                    onClick={handleAddUser}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <AdminPanelSettings fontSize="small" />
                    Add Admin User
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;