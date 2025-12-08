import { BASE_URL } from "./apiConfig";
import axiosInstance from "./axiosInstance";

// ✅ Fetch all departments
export const fetchDepartments = async () => {
  try {
    const res = await axiosInstance.get("/departments");
    console.log("✅ API response:", res.data);

    // Handle different response structures
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }

    console.warn("⚠️ Unexpected response structure:", res.data);
    return [];
  } catch (error) {
    console.error("❌ fetchDepartments error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch departments");
  }
};

// ✅ Create department
export const createDepartment = async (payload) => {
  try {
    const res = await axiosInstance.post("/departments", payload);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ createDepartment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create department");
  }
};

// ✅ Update department
export const updateDepartment = async ({ id, payload }) => {
  try {
    const res = await axiosInstance.put(`/departments/update/${id}`, payload);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ updateDepartment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update department");
  }
};

// ✅ Delete department
export const deleteDepartment = async (id) => {
  try {
    const res = await axiosInstance.delete(`/departments/${id}`);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ deleteDepartment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete department");
  }
};

// ✅ Fetch department by ID
export const fetchDepartmentById = async (id) => {
  try {
    const res = await axiosInstance.get(`/departments/${id}`);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ fetchDepartmentById error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch department");
  }
};



// ==================== DOCTORS ====================

// export const getDoctors = async () => {
//   try {
//     console.log("🔍 Fetching all doctors...");
//     const response = await axiosInstance.get("/doctors");
//     console.log("✅ Doctors fetched:", response.data);

//     // Handle different response structures
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }

//     console.warn("⚠️ Unexpected response structure:", response.data);
//     return [];
//   } catch (error) {
//     console.error("❌ Error fetching doctors:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to fetch doctors");
//   }
// };


// export const getDoctorById = async (id) => {
//   try {
//     console.log("🔍 Fetching doctor by ID:", id);
//     const response = await axiosInstance.get(`/doctors/${id}`);
//     console.log("✅ Doctor fetched:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching doctor by ID:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       throw new Error(`Doctor with ID ${id} not found`);
//     }
//     throw new Error(error.response?.data?.message || "Failed to fetch doctor");
//   }
// };


// export const addDoctor = async (doctorData) => {
//   try {
//     console.log("➕ Adding doctor:", doctorData);

//     // Format data to match backend expectations
//     const formattedData = {
//       fullname: doctorData.fullname,
//       qualification: doctorData.qualification,
//       specialization: doctorData.specialization,
//       experience_years: parseInt(doctorData.experience_years) || 0,
//       departmentid: doctorData.departmentid || null,
//       photo: doctorData.photo || "",
//       bio: doctorData.bio || "",
//       schedule: doctorData.schedule || {},
//       isactive: doctorData.isactive !== undefined ? doctorData.isactive : true,
//     };

//     console.log("📤 Formatted data:", formattedData);

//     const response = await axiosInstance.post("/doctors", formattedData);
//     console.log("✅ Doctor added:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error adding doctor:", error.response?.data || error.message);

//     if (error.response?.status === 400) {
//       throw new Error(error.response?.data?.message || "Invalid doctor data");
//     }
//     throw new Error(error.response?.data?.message || "Failed to add doctor");
//   }
// };


// export const updateDoctor = async (id, doctorData) => {
//   try {
//     console.log("🔄 Updating doctor:", { id, doctorData });

//     // Format data to match backend expectations
//     const formattedData = {
//       fullname: doctorData.fullname,
//       qualification: doctorData.qualification,
//       specialization: doctorData.specialization,
//       experience_years: parseInt(doctorData.experience_years) || 0,
//       departmentid: doctorData.departmentid || null,
//       photo: doctorData.photo || "",
//       bio: doctorData.bio || "",
//       schedule: doctorData.schedule || {},
//       isactive: doctorData.isactive !== undefined ? doctorData.isactive : true,
//     };

//     console.log("📤 Formatted data:", formattedData);

//     // Try PATCH first (more common for partial updates)
//     const response = await axiosInstance.put(`/doctors/update/${id}`, formattedData);
//     console.log("✅ Doctor updated:", response.data);
//     return response.data;
//   } catch (patchError) {
//     // If PATCH fails, try PUT
//     console.log("⚠️ PATCH failed, trying PUT...");
//     try {
//       const response = await axiosInstance.put(`/doctors/update${id}`, formattedData);
//       console.log("✅ Doctor updated with PUT:", response.data);
//       return response.data;
//     } catch (putError) {
//       console.error("❌ Error updating doctor:", putError.response?.data || putError.message);

//       if (putError.response?.status === 404) {
//         throw new Error(`Doctor with ID ${id} not found`);
//       } else if (putError.response?.status === 400) {
//         throw new Error(putError.response?.data?.message || "Invalid doctor data");
//       }
//       throw new Error(putError.response?.data?.message || "Failed to update doctor");
//     }
//   }
// };


// export const deleteDoctor = async (id) => {
//   try {
//     console.log("🗑️ Deleting doctor:", id);
//     const response = await axiosInstance.delete(`/doctors/${id}`);
//     console.log("✅ Doctor deleted:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error deleting doctor:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       throw new Error(`Doctor with ID ${id} not found`);
//     } else if (error.response?.status === 400) {
//       throw new Error(error.response?.data?.message || "Cannot delete doctor");
//     }
//     throw new Error(error.response?.data?.message || "Failed to delete doctor");
//   }
// };


// export const toggleDoctorStatus = async (id, isactive) => {
//   try {
//     console.log("🔄 Toggling doctor status:", { id, isactive });
//     const response = await axiosInstance.put(`/doctors/update/${id}`, { isactive });
//     console.log("✅ Doctor status toggled:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error toggling doctor status:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       throw new Error(`Doctor with ID ${id} not found`);
//     }
//     throw new Error(error.response?.data?.message || "Failed to toggle doctor status");
//   }
// };

// // ✅ Toggle expert mutation - Fixed version


// export const getDoctorsByDepartment = async (departmentId) => {
//   try {
//     console.log("🔍 Fetching doctors by department:", departmentId);
//     const response = await axiosInstance.get(`/doctors?departmentid=${departmentId}`);
//     console.log("✅ Doctors fetched for department:", response.data);

//     // Handle different response structures
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }

//     return [];
//   } catch (error) {
//     console.error("❌ Error fetching doctors by department:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to fetch doctors by department");
//   }
// };

// export const getDoctorsBySpecialization = async (specialization) => {
//   try {
//     console.log("🔍 Fetching doctors by specialization:", specialization);
//     const response = await axiosInstance.get(`/doctors?specialization=${specialization}`);
//     console.log("✅ Doctors fetched for specialization:", response.data);

//     // Handle different response structures
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }

//     return [];
//   } catch (error) {
//     console.error("❌ Error fetching doctors by specialization:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to fetch doctors by specialization");
//   }
// };

// /**
//  * Get active doctors only
//  * @returns {Promise<Array>} Array of active doctors
//  */
// export const getActiveDoctors = async () => {
//   try {
//     console.log("🔍 Fetching active doctors...");
//     const response = await axiosInstance.get("/doctors?isactive=true");
//     console.log("✅ Active doctors fetched:", response.data);

//     // Handle different response structures
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }

//     return [];
//   } catch (error) {
//     console.error("❌ Error fetching active doctors:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to fetch active doctors");
//   }
// };

// /**
//  * Search doctors by name or specialization
//  * @param {string} searchTerm - Search term
//  * @returns {Promise<Array>} Array of matching doctors
//  */
// export const searchDoctors = async (searchTerm) => {
//   try {
//     console.log("🔍 Searching doctors:", searchTerm);
//     const response = await axiosInstance.get(`/doctors?search=${encodeURIComponent(searchTerm)}`);
//     console.log("✅ Search results:", response.data);

//     // Handle different response structures
//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }

//     return [];
//   } catch (error) {
//     console.error("❌ Error searching doctors:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Failed to search doctors");
//   }
// };

// export const toggleDoctorExpert = async (id, isexpert, doctorData = null) => {
//   try {
//     console.log("⭐ Toggling doctor expert status:", { id, isexpert, doctorData });

//     // If we have full doctor data, use PUT to update the entire record
//     if (doctorData) {
//       const response = await axiosInstance.put(`/doctors/update/${id}`, {
//         ...doctorData,
//         isexpert: isexpert
//       });
//       console.log("✅ Doctor expert status updated via PUT:", response.data);
//       return response.data;
//     }

//     // Otherwise use PATCH for partial update
//     const response = await axiosInstance.patch(`/doctors/${id}/expert`, {
//       isexpert: isexpert
//     });

//     console.log("✅ Doctor expert status toggled:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error toggling doctor expert status:", error);

//     // Fallback to PUT if PATCH is not supported
//     try {
//       console.log("🔄 Trying PUT as fallback...");
//       const response = await axiosInstance.put(`/doctors/update/${id}`, {
//         isexpert: isexpert
//       });
//       return response.data;
//     } catch (putError) {
//       console.error("❌ PUT also failed:", putError);
//       throw new Error(putError.response?.data?.message || "Failed to update expert status");
//     }
//   }
// };


// export const updateDoctorSchedule = async (id, schedule) => {
//   try {
//     console.log("📅 Updating doctor schedule:", { id, schedule });
//     const response = await axiosInstance.patch(`/doctors/${id}`, { schedule });
//     console.log("✅ Doctor schedule updated:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error updating doctor schedule:", error.response?.data || error.message);

//     if (error.response?.status === 404) {
//       throw new Error(`Doctor with ID ${id} not found`);
//     }
//     throw new Error(error.response?.data?.message || "Failed to update doctor schedule");
//   }
// };


// export const bulkUpdateDoctors = async (doctorsData) => {
//   try {
//     console.log("📦 Bulk updating doctors:", doctorsData);

//     // Execute all updates in parallel
//     const updatePromises = doctorsData.map(({ id, data }) =>
//       updateDoctor(id, data)
//     );

//     const results = await Promise.allSettled(updatePromises);

//     const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
//     const failed = results.filter(r => r.status === 'rejected');

//     if (failed.length > 0) {
//       console.warn("⚠️ Some updates failed:", failed);
//     }

//     console.log("✅ Bulk update completed:", { successful: successful.length, failed: failed.length });
//     return successful;
//   } catch (error) {
//     console.error("❌ Error in bulk update:", error);
//     throw new Error("Failed to bulk update doctors");
//   }
// };


// export const getDoctorStats = async () => {
//   try {
//     console.log("📊 Fetching doctor statistics...");
//     const doctors = await getDoctors();

//     const stats = {
//       total: doctors.length,
//       active: doctors.filter(d => d.isactive).length,
//       inactive: doctors.filter(d => !d.isactive).length,
//       bySpecialization: {},
//       byDepartment: {},
//       averageExperience: 0,
//     };

//     // Count by specialization
//     doctors.forEach(doctor => {
//       if (doctor.specialization) {
//         stats.bySpecialization[doctor.specialization] =
//           (stats.bySpecialization[doctor.specialization] || 0) + 1;
//       }

//       if (doctor.departmentid) {
//         stats.byDepartment[doctor.departmentid] =
//           (stats.byDepartment[doctor.departmentid] || 0) + 1;
//       }
//     });

//     // Calculate average experience
//     const totalExperience = doctors.reduce((sum, d) => sum + (d.experience_years || 0), 0);
//     stats.averageExperience = doctors.length > 0
//       ? (totalExperience / doctors.length).toFixed(1)
//       : 0;

//     console.log("✅ Doctor statistics:", stats);
//     return stats;
//   } catch (error) {
//     console.error("❌ Error fetching doctor statistics:", error);
//     throw new Error("Failed to fetch doctor statistics");
//   }
// };
// 


/* ======================================================
   🔥 DOCTORS CRUD API
   ====================================================== */

// 👉 GET all doctors
export const getDoctors = async () => {
  try {
    const response = await axiosInstance.get("/doctors");

    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data) return response.data.data;

    return [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch doctors");
  }
};

// 👉 GET doctor by ID
export const getDoctorById = async (id) => {
  try {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404)
      throw new Error(`Doctor with ID ${id} not found`);

    throw new Error(error.response?.data?.message || "Failed to fetch doctor");
  }
};

// 👉 CREATE doctor
export const createDoctor = async (doctorData) => {
  try {
    const formattedData = {
      fullname: doctorData.fullname,
      qualification: doctorData.qualification,
      specialization: doctorData.specialization,
      experience_years: Number(doctorData.experience_years) || 0,
      departmentid: doctorData.departmentid || null,
      photo: doctorData.photo || "",
      bio: doctorData.bio || "",
      schedule: doctorData.schedule || {},
      isactive:
        doctorData.isactive !== undefined ? doctorData.isactive : true,
      isexpert: doctorData.isexpert || false,
    };

    const response = await axiosInstance.post("/doctors", formattedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add doctor");
  }
};

// 👉 UPDATE doctor
export const updateDoctor = async (id, doctorData) => {
  try {
    const formattedData = {
      fullname: doctorData.fullname,
      qualification: doctorData.qualification,
      specialization: doctorData.specialization,
      experience_years: Number(doctorData.experience_years) || 0,
      departmentid: doctorData.departmentid || null,
      photo: doctorData.photo || "",
      bio: doctorData.bio || "",
      schedule: doctorData.schedule || {},
      isactive: doctorData.isactive,
      isexpert: doctorData.isexpert,
    };

    const response = await axiosInstance.put(
      `/doctors/update/${id}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update doctor"
    );
  }
};

// 👉 DELETE doctor
export const deleteDoctor = async (id) => {
  try {
    const response = await axiosInstance.delete(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404)
      throw new Error(`Doctor with ID ${id} not found`);

    throw new Error(error.response?.data?.message || "Failed to delete doctor");
  }
};

/* ======================================================
   🔥 TOGGLES (Active + Expert)
   ====================================================== */

// 👉 Toggle active status
export const toggleDoctorStatus = async (id, isactive) => {
  try {
    const response = await axiosInstance.put(`/doctors/update/${id}`, {
      isactive,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle doctor status"
    );
  }
};

// 👉 Toggle expert doctor
export const toggleDoctorExpert = async (id, isexpert) => {
  try {
    const response = await axiosInstance.put(`/doctors/update/${id}`, {
      isexpert,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle expert status"
    );
  }
};

/* ======================================================
   🔥 FILTERS (By Dept, By Specialization, Active Only)
   ====================================================== */

// 👉 Get doctors by department
export const getDoctorsByDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.get(
      `/doctors?departmentid=${departmentId}`
    );

    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data) return response.data.data;

    return [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch doctors by department"
    );
  }
};

// 👉 Get doctors by specialization
export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const response = await axiosInstance.get(
      `/doctors?specialization=${specialization}`
    );

    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data) return response.data.data;

    return [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch doctors by specialization"
    );
  }
};

// 👉 Active doctors only
export const getActiveDoctors = async () => {
  try {
    const response = await axiosInstance.get("/doctors?isactive=true");

    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data) return response.data.data;

    return [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch active doctors"
    );
  }
};

// 👉 Search doctors
export const searchDoctors = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(
      `/doctors?search=${encodeURIComponent(searchTerm)}`
    );

    if (Array.isArray(response.data)) return response.data;
    if (response.data?.data) return response.data.data;

    return [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to search doctors"
    );
  }
};

/* ======================================================
   🔥 OTHER UTILITIES
   ====================================================== */

// 👉 Update schedule only
export const updateDoctorSchedule = async (id, schedule) => {
  try {
    const response = await axiosInstance.patch(`/doctors/${id}`, { schedule });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update schedule"
    );
  }
};

// 👉 Bulk update (multiple doctors at once)
export const bulkUpdateDoctors = async (doctorsData) => {
  try {
    const tasks = doctorsData.map(({ id, data }) =>
      updateDoctor(id, data)
    );
    const results = await Promise.allSettled(tasks);

    return results;
  } catch (error) {
    throw new Error("Failed to bulk update doctors");
  }
};

// 👉 Doctor stats
export const getDoctorStats = async () => {
  try {
    const doctors = await getDoctors();

    const stats = {
      total: doctors.length,
      active: doctors.filter((d) => d.isactive).length,
      inactive: doctors.filter((d) => !d.isactive).length,
      bySpecialization: {},
      byDepartment: {},
      averageExperience: 0,
    };

    doctors.forEach((d) => {
      if (d.specialization)
        stats.bySpecialization[d.specialization] =
          (stats.bySpecialization[d.specialization] || 0) + 1;

      if (d.departmentid)
        stats.byDepartment[d.departmentid] =
          (stats.byDepartment[d.departmentid] || 0) + 1;
    });

    const totalExp = doctors.reduce(
      (sum, d) => sum + (d.experience_years || 0),
      0
    );

    stats.averageExperience =
      doctors.length > 0 ? (totalExp / doctors.length).toFixed(1) : 0;

    return stats;
  } catch (error) {
    throw new Error("Failed to fetch doctor statistics");
  }
};

// ========================================



// ====================Appointments====================

// ✅ Fetch all appointments
export const fetchAppointments = async () => {
  try {
    const res = await axiosInstance.get("/appointments");
    console.log("✅ fetchAppointments response:", res.data);

    // Handle different response structures
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.appointments)) return res.data.appointments;

    console.warn("Unexpected response structure:", res.data);
    return [];
  } catch (error) {
    console.error("❌ fetchAppointments error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch appointments");
  }
};

// ✅ Create appointment
export const createAppointment = async (payload) => {
  try {
    console.log("🔄 createAppointment payload:", payload);
    const res = await axiosInstance.post("/appointments", payload);

    if (res.status >= 200 && res.status < 300) {
      console.log("✅ createAppointment success:", res.data);
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ createAppointment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create appointment");
  }
};

// ✅ Update appointment
export const updateAppointment = async ({ id, payload }) => {
  try {
    console.log("🔄 updateAppointment called with:", { id, payload });

    const res = await axiosInstance.put(`/appointments/update/${id}`, payload);

    console.log("✅ updateAppointment success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ updateAppointment error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || "Failed to update appointment");
  }
};

// ✅ Alternative update function using POST if needed
export const updateAppointmentAlt = async (id, payload) => {
  try {
    console.log("🔄 updateAppointmentAlt called with:", { id, payload });

    const res = await axiosInstance.post(`/appointments/update/${id}`, payload);

    console.log("✅ updateAppointmentAlt success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ updateAppointmentAlt error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update appointment");
  }
};

// ✅ Delete appointment
export const deleteAppointment = async (id) => {
  try {
    console.log("🔄 deleteAppointment called with id:", id);
    const res = await axiosInstance.delete(`/appointments/${id}`);

    if (res.status >= 200 && res.status < 300) {
      console.log("✅ deleteAppointment success");
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ deleteAppointment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete appointment");
  }
};

// ✅ Get appointment by ID
export const fetchAppointmentById = async (id) => {
  try {
    console.log("🔄 fetchAppointmentById called with id:", id);
    const res = await axiosInstance.get(`/appointments/${id}`);

    if (res.status >= 200 && res.status < 300) {
      console.log("✅ fetchAppointmentById success:", res.data);
      return res.data;
    }
    throw new Error(`Request failed with status ${res.status}`);
  } catch (error) {
    console.error("❌ fetchAppointmentById error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch appointment");
  }
};

// ✅ Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  try {
    console.log("🔄 updateAppointmentStatus called:", { id, status });

    const res = await axiosInstance.put(`/appointments/update/${id}`, { status });

    console.log("✅ updateAppointmentStatus success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ updateAppointmentStatus error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update appointment status");
  }
};

// ✅ Test all appointment endpoints
export const testAppointmentEndpoints = async () => {
  const tests = [
    { method: 'GET', url: '/appointments', description: 'Fetch all appointments' },
    { method: 'POST', url: '/appointments', description: 'Create appointment' },
    { method: 'PUT', url: '/appointments/update/1', description: 'Update appointment' },
    { method: 'DELETE', url: '/appointments/1', description: 'Delete appointment' },
    { method: 'GET', url: '/appointments/1', description: 'Get appointment by ID' },
  ];

  console.log("🧪 Testing Appointment Endpoints...");

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.description}`);
      const response = await axiosInstance({
        method: test.method,
        url: test.url,
        data: test.method !== 'GET' ? {
          fullname: "Test User",
          mobilenumber: "1234567890",
          email: "test@example.com",
          status: "Pending"
        } : undefined
      });
      console.log(`✅ ${test.description}: SUCCESS`, response.status);
    } catch (error) {
      console.log(`❌ ${test.description}: FAILED`, error.response?.status, error.response?.data);
    }
  }
};
// ========================================


// ==================== NEWS & EVENTS API FUNCTIONS ====================

// ✅ Get all news and events
export const getNewsEvents = async () => {
  try {
    const response = await axiosInstance.get("/news_events");
    console.log("✅ getNewsEvents response:", response.data);

    // Handle different response structures
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.news_events)) return response.data.news_events;

    console.warn("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("❌ Error fetching news/events:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch news and events");
  }
};

// ✅ Get single news/event by ID
export const getNewsEventById = async (id) => {
  try {
    const response = await axiosInstance.get(`/news_events/${id}`);
    console.log(`✅ getNewsEventById ${id} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching news/event with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch news/event");
  }
};

// ✅ Add new news/event
export const addNewsEvent = async (newsEventData) => {
  try {
    const formattedData = {
      title: newsEventData.title,
      type: newsEventData.type, // "news" or "event"
      description: newsEventData.description,
      eventdate: newsEventData.eventdate,
      image: newsEventData.image || "",
      isactive: newsEventData.isactive !== undefined ? newsEventData.isactive : true,
    };

    console.log("🔄 addNewsEvent payload:", formattedData);
    const response = await axiosInstance.post("/news_events", formattedData);
    console.log("✅ addNewsEvent success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding news/event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add news/event");
  }
};

// ✅ Update news/event by ID
export const updateNewsEvent = async (id, newsEventData) => {
  try {
    const formattedData = {
      title: newsEventData.title,
      type: newsEventData.type,
      description: newsEventData.description,
      eventdate: newsEventData.eventdate,
      image: newsEventData.image || "",
      isactive: newsEventData.isactive !== undefined ? newsEventData.isactive : true,
    };

    console.log("🔄 updateNewsEvent:", { id, formattedData });
    const response = await axiosInstance.put(`/news_events/update/${id}`, formattedData);
    console.log("✅ updateNewsEvent success:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating news/event with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update news/event");
  }
};

// ✅ Delete news/event by ID
export const deleteNewsEvent = async (id) => {
  try {
    console.log("🔄 deleteNewsEvent id:", id);
    const response = await axiosInstance.delete(`/news_events/${id}`);
    console.log("✅ deleteNewsEvent success");
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting news/event with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete news/event");
  }
};

// ✅ Toggle news/event active status
export const toggleNewsEventStatus = async (id, isActive) => {
  try {
    console.log("🔄 toggleNewsEventStatus:", { id, isActive });
    const response = await axiosInstance.put(`/news_events/update/${id}`, {
      isactive: isActive
    });
    console.log("✅ toggleNewsEventStatus success:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error toggling status for ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

// ✅ Get news only
export const getNews = async () => {
  try {
    const allItems = await getNewsEvents();
    return allItems.filter(item => item.type === 'news');
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    throw error;
  }
};

// ✅ Get events only
export const getEvents = async () => {
  try {
    const allItems = await getNewsEvents();
    return allItems.filter(item => item.type === 'event');
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    throw error;
  }
};

// ✅ Get active news and events
export const getActiveNewsEvents = async () => {
  try {
    const allItems = await getNewsEvents();
    return allItems.filter(item => item.isactive === true);
  } catch (error) {
    console.error("❌ Error fetching active news/events:", error);
    throw error;
  }
};
// ========================================



// ==================== BLOGS API FUNCTIONS ====================

// ✅ Get all blogs
export const getBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blogs");
    console.log("✅ getBlogs response:", response.data);

    // Handle different response structures
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.blogs)) return response.data.blogs;

    console.warn("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("❌ Error fetching blogs:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};

// ✅ Get single blog by ID
export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    console.log(`✅ getBlogById ${id} response:`, response.data);

    // Handle different response structures
    if (response.data?.data) return response.data.data;
    if (response.data?.blog) return response.data.blog;
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching blog with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
};

// ✅ Get blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/blogs/slug/${slug}`);
    console.log(`✅ getBlogBySlug ${slug} response:`, response.data);

    // Handle different response structures
    if (response.data?.data) return response.data.data;
    if (response.data?.blog) return response.data.blog;
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching blog with slug ${slug}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
};

// ✅ Add new blog
export const addBlog = async (blogData) => {
  try {
    const formattedData = {
      title: blogData.title,
      slug: blogData.slug || generateSlug(blogData.title),
      image: blogData.image || "",
      category: blogData.category || "General",
      content: blogData.content,
      author: blogData.author || "Admin",
      isactive: blogData.isactive !== undefined ? blogData.isactive : true,
    };

    console.log("🔄 addBlog payload:", formattedData);
    const response = await axiosInstance.post("/blogs", formattedData);
    console.log("✅ addBlog success:", response.data);

    // Return the created blog data
    if (response.data?.data) return response.data.data;
    if (response.data?.blog) return response.data.blog;
    return response.data;
  } catch (error) {
    console.error("❌ Error adding blog:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add blog");
  }
};

// ✅ Update blog by ID
export const updateBlog = async (id, blogData) => {
  try {
    const formattedData = {
      title: blogData.title,
      slug: blogData.slug || generateSlug(blogData.title),
      image: blogData.image || "",
      category: blogData.category || "General",
      content: blogData.content,
      author: blogData.author || "Admin",
      isactive: blogData.isactive !== undefined ? blogData.isactive : true,
    };

    console.log("🔄 updateBlog:", { id, formattedData });
    const response = await axiosInstance.put(`/blogs/update/${id}`, formattedData);
    console.log("✅ updateBlog success:", response.data);

    // Return the updated blog data
    if (response.data?.data) return response.data.data;
    if (response.data?.blog) return response.data.blog;
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating blog with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update blog");
  }
};

// ✅ Delete blog by ID
export const deleteBlog = async (id) => {
  try {
    console.log("🔄 deleteBlog id:", id);
    const response = await axiosInstance.delete(`/blogs/${id}`);
    console.log("✅ deleteBlog success");
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting blog with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete blog");
  }
};

// ✅ Toggle blog active status
export const toggleBlogStatus = async (id, isActive) => {
  try {
    console.log("🔄 toggleBlogStatus:", { id, isActive });
    const response = await axiosInstance.put(`/blogs/update/${id}`, {
      isactive: isActive
    });
    console.log("✅ toggleBlogStatus success:", response.data);

    // Return the updated blog data
    if (response.data?.data) return response.data.data;
    if (response.data?.blog) return response.data.blog;
    return response.data;
  } catch (error) {
    console.error(`❌ Error toggling status for ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update blog status");
  }
};

// ✅ Get active blogs only
export const getActiveBlogs = async () => {
  try {
    const allBlogs = await getBlogs();
    return allBlogs.filter(blog => blog.isactive === true);
  } catch (error) {
    console.error("❌ Error fetching active blogs:", error);
    throw error;
  }
};

// ✅ Get blogs by category
export const getBlogsByCategory = async (category) => {
  try {
    const allBlogs = await getBlogs();
    return allBlogs.filter(blog =>
      blog.category?.toLowerCase() === category.toLowerCase() && blog.isactive === true
    );
  } catch (error) {
    console.error(`❌ Error fetching blogs by category ${category}:`, error);
    throw error;
  }
};

// ✅ Get blog categories
export const getBlogCategories = async () => {
  try {
    const blogs = await getBlogs();
    const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error("❌ Error fetching blog categories:", error);
    throw error;
  }
};

// ✅ Search blogs
export const searchBlogs = async (query) => {
  try {
    const blogs = await getBlogs();
    const searchTerm = query.toLowerCase();
    return blogs.filter(blog =>
      blog.title?.toLowerCase().includes(searchTerm) ||
      blog.content?.toLowerCase().includes(searchTerm) ||
      blog.author?.toLowerCase().includes(searchTerm) ||
      blog.category?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error(`❌ Error searching blogs with query ${query}:`, error);
    throw error;
  }
};

// ✅ Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
// ========================================




// ==================== GALLERY API FUNCTIONS ====================

// ✅ Upload gallery file 
export const uploadGalleryFile = async (file) => {
  try {
    console.log("🔄 uploadGalleryFile:", file.name);

    const formData = new FormData();
    formData.append('file', file);

    // Using the correct upload endpoint
    const response = await axiosInstance.post('/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("✅ uploadGalleryFile success:", response.data);

    // Return the uploaded file path from the response
    if (response.data.success && response.data.filePath) {
      return response.data.filePath;
    }

    throw new Error(response.data.message || "Upload failed");
  } catch (error) {
    console.error("❌ Error uploading gallery file:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
};

// ✅ Get all gallery items
export const getGallery = async () => {
  try {
    const response = await axiosInstance.get("/gallery");
    console.log("✅ getGallery response:", response.data);

    // Handle different response structures
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.gallery)) return response.data.gallery;

    console.warn("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("❌ Error fetching gallery:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch gallery items");
  }
};

// ✅ Get single gallery item by ID
export const getGalleryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/gallery/${id}`);
    console.log(`✅ getGalleryById ${id} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching gallery item with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch gallery item");
  }
};

// ✅ Add new gallery item
export const addGalleryItem = async (galleryData) => {
  try {
    const formattedData = {
      title: galleryData.title,
      type: galleryData.type || "photo", // "photo" or "video"
      filepath: galleryData.filepath || "",
      category: galleryData.category || "General",
      isactive: galleryData.isactive !== undefined ? galleryData.isactive : true,
    };

    console.log("🔄 addGalleryItem payload:", formattedData);
    const response = await axiosInstance.post("/gallery", formattedData);
    console.log("✅ addGalleryItem success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding gallery item:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add gallery item");
  }
};

// ✅ Update gallery item by ID
export const updateGalleryItem = async (id, galleryData) => {
  try {
    const formattedData = {
      title: galleryData.title,
      type: galleryData.type,
      filepath: galleryData.filepath,
      category: galleryData.category,
      isactive: galleryData.isactive !== undefined ? galleryData.isactive : true,
    };

    console.log("🔄 updateGalleryItem:", { id, formattedData });
    const response = await axiosInstance.put(`/gallery/update/${id}`, formattedData);
    console.log("✅ updateGalleryItem success:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating gallery item with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update gallery item");
  }
};

// ✅ Delete gallery item by ID
export const deleteGalleryItem = async (id) => {
  try {
    console.log("🔄 deleteGalleryItem id:", id);
    const response = await axiosInstance.delete(`/gallery/${id}`);
    console.log("✅ deleteGalleryItem success");
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting gallery item with ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete gallery item");
  }
};

// ✅ Toggle gallery item active status
export const toggleGalleryStatus = async (id, isActive) => {
  try {
    console.log("🔄 toggleGalleryStatus:", { id, isActive });
    const response = await axiosInstance.put(`/gallery/update/${id}`, {
      isactive: isActive
    });
    console.log("✅ toggleGalleryStatus success:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error toggling status for ID ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update gallery status");
  }
};

// ✅ Get active gallery items only
export const getActiveGallery = async () => {
  try {
    const allItems = await getGallery();
    return allItems.filter(item => item.isactive === true);
  } catch (error) {
    console.error("❌ Error fetching active gallery items:", error);
    throw error;
  }
};

// ✅ Get gallery items by category
export const getGalleryByCategory = async (category) => {
  try {
    const allItems = await getGallery();
    return allItems.filter(item =>
      item.category?.toLowerCase() === category.toLowerCase() && item.isactive === true
    );
  } catch (error) {
    console.error(`❌ Error fetching gallery by category ${category}:`, error);
    throw error;
  }
};

// ✅ Get gallery items by type
export const getGalleryByType = async (type) => {
  try {
    const allItems = await getGallery();
    return allItems.filter(item =>
      item.type?.toLowerCase() === type.toLowerCase() && item.isactive === true
    );
  } catch (error) {
    console.error(`❌ Error fetching gallery by type ${type}:`, error);
    throw error;
  }
};

// ✅ Get gallery categories
export const getGalleryCategories = async () => {
  try {
    const gallery = await getGallery();
    const categories = [...new Set(gallery.map(item => item.category).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error("❌ Error fetching gallery categories:", error);
    throw error;
  }
};

// ✅ Search gallery items
export const searchGallery = async (query) => {
  try {
    const gallery = await getGallery();
    const searchTerm = query.toLowerCase();
    return gallery.filter(item =>
      item.title?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm) ||
      item.type?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error(`❌ Error searching gallery with query ${query}:`, error);
    throw error;
  }
};
// ========================================


// ====================Feedback====================


const FEEDBACK_BASE_URL = '/feedback'; // Relative path since baseURL is set

// ✅ Get all feedback
export const getAllFeedback = async () => {
  try {
    const response = await axiosInstance.get("/feedback");
    console.log('✅ Successfully fetched all feedback');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching all feedback:', error);
    throw error;
  }
};

// ✅ Get feedback by ID
export const getFeedbackById = async (id) => {
  try {
    const response = await axiosInstance.get(`/feedback/${id}`);
    console.log(`✅ Successfully fetched feedback with ID ${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching feedback with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Create new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post("/feedback", feedbackData);
    console.log('✅ Successfully created new feedback');
    return response.data;
  } catch (error) {
    console.error('❌ Error creating feedback:', error);
    throw error;
  }
};

// ✅ Update feedback
export const updateFeedback = async (id, feedbackData) => {
  try {
    const response = await axiosInstance.put(`/feedback/update/${id}`, feedbackData);
    console.log(`✅ Successfully updated feedback with ID ${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating feedback with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await axiosInstance.delete(`/feedback/${id}`);
    console.log(`✅ Successfully deleted feedback with ID ${id}`);
    return { success: true, message: 'Feedback deleted successfully', data: response.data };
  } catch (error) {
    console.error(`❌ Error deleting feedback with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Search feedback
export const searchFeedback = async (query) => {
  try {
    const feedback = await getAllFeedback();
    const searchTerm = query.toLowerCase();

    const results = feedback.filter(item =>
      item.fullname?.toLowerCase().includes(searchTerm) ||
      item.feedback?.toLowerCase().includes(searchTerm) ||
      item.mobilenumber?.includes(searchTerm) ||
      item.rating?.toString().includes(searchTerm)
    );

    console.log(`✅ Search for "${query}" returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error(`❌ Error searching feedback with query "${query}":`, error);
    throw error;
  }
};

// ✅ Get approved feedback
export const getApprovedFeedback = async () => {
  try {
    const feedback = await getAllFeedback();
    const approved = feedback.filter(item => item.isapproved);
    console.log(`✅ Found ${approved.length} approved feedback entries`);
    return approved;
  } catch (error) {
    console.error('❌ Error fetching approved feedback:', error);
    throw error;
  }
};

// ✅ Get pending feedback
export const getPendingFeedback = async () => {
  try {
    const feedback = await getAllFeedback();
    const pending = feedback.filter(item => !item.isapproved);
    console.log(`✅ Found ${pending.length} pending feedback entries`);
    return pending;
  } catch (error) {
    console.error('❌ Error fetching pending feedback:', error);
    throw error;
  }
};

// ✅ Get feedback by rating
export const getFeedbackByRating = async (minRating) => {
  try {
    const feedback = await getAllFeedback();
    const filtered = feedback.filter(item => item.rating >= minRating);
    console.log(`✅ Found ${filtered.length} feedback entries with rating >= ${minRating}`);
    return filtered;
  } catch (error) {
    console.error(`❌ Error fetching feedback with rating >= ${minRating}:`, error);
    throw error;
  }
};

// ✅ Toggle feedback approval status
export const toggleFeedbackApproval = async (id, currentStatus) => {
  try {
    const updatedFeedback = await updateFeedback(id, {
      isapproved: !currentStatus
    });
    console.log(`✅ Toggled approval status for feedback ID ${id} to ${!currentStatus}`);
    return updatedFeedback;
  } catch (error) {
    console.error(`❌ Error toggling approval status for feedback ID ${id}:`, error);
    throw error;
  }
};

// ✅ Get feedback statistics
export const getFeedbackStats = async () => {
  try {
    const feedback = await getAllFeedback();

    const stats = {
      total: feedback.length,
      approved: feedback.filter(item => item.isapproved).length,
      pending: feedback.filter(item => !item.isapproved).length,
      averageRating: feedback.length > 0
        ? (feedback.reduce((acc, item) => acc + item.rating, 0) / feedback.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: feedback.filter(item => item.rating === 5).length,
        4: feedback.filter(item => item.rating === 4).length,
        3: feedback.filter(item => item.rating === 3).length,
        2: feedback.filter(item => item.rating === 2).length,
        1: feedback.filter(item => item.rating === 1).length,
      }
    };

    console.log('✅ Successfully calculated feedback statistics');
    return stats;
  } catch (error) {
    console.error('❌ Error calculating feedback statistics:', error);
    throw error;
  }
};

// ========================================



// ====================Contacts/Inquiries====================

const CONTACT_BASE_URL = '/inquiries'; // Adjust based on your API endpoint

// ✅ Get all contacts/inquiries
export const getAllContacts = async () => {
  try {
    const response = await axiosInstance.get(CONTACT_BASE_URL);
    console.log('✅ Successfully fetched all contacts');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching all contacts:', error);
    throw error;
  }
};

// ✅ Get contact by ID
export const getContactById = async (id) => {
  try {
    const response = await axiosInstance.get(`${CONTACT_BASE_URL}/${id}`);
    console.log(`✅ Successfully fetched contact with ID ${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching contact with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Create new contact/inquiry
export const createContact = async (contactData) => {
  try {
    const response = await axiosInstance.post(CONTACT_BASE_URL, contactData);
    console.log('✅ Successfully created new contact');
    return response.data;
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    throw error;
  }
};

// ✅ Update contact
export const updateContact = async (id, contactData) => {
  try {
    const response = await axiosInstance.put(`${CONTACT_BASE_URL}/update/${id}`, contactData);
    console.log(`✅ Successfully updated contact with ID ${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Delete contact
export const deleteContact = async (id) => {
  try {
    const response = await axiosInstance.delete(`${CONTACT_BASE_URL}/${id}`);
    console.log(`✅ Successfully deleted contact with ID ${id}`);
    return { success: true, message: 'Contact deleted successfully', data: response.data };
  } catch (error) {
    console.error(`❌ Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};

// ✅ Search contacts
export const searchContacts = async (query) => {
  try {
    const contacts = await getAllContacts();
    const searchTerm = query.toLowerCase();

    const results = contacts.filter(contact =>
      contact.fullname?.toLowerCase().includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm) ||
      contact.subject?.toLowerCase().includes(searchTerm) ||
      contact.message?.toLowerCase().includes(searchTerm) ||
      contact.mobilenumber?.includes(searchTerm) ||
      contact.status?.toLowerCase().includes(searchTerm)
    );

    console.log(`✅ Search for "${query}" returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error(`❌ Error searching contacts with query "${query}":`, error);
    throw error;
  }
};

// ✅ Get contacts by status
export const getContactsByStatus = async (status) => {
  try {
    const contacts = await getAllContacts();
    const filtered = contacts.filter(contact => contact.status === status);
    console.log(`✅ Found ${filtered.length} contacts with status: ${status}`);
    return filtered;
  } catch (error) {
    console.error(`❌ Error fetching contacts with status ${status}:`, error);
    throw error;
  }
};

// ✅ Update contact status
export const updateContactStatus = async (id, newStatus) => {
  try {
    const updatedContact = await updateContact(id, { status: newStatus });
    console.log(`✅ Updated status for contact ID ${id} to ${newStatus}`);
    return updatedContact;
  } catch (error) {
    console.error(`❌ Error updating status for contact ID ${id}:`, error);
    throw error;
  }
};

// ✅ Get contact statistics
export const getContactStats = async () => {
  try {
    const contacts = await getAllContacts();

    const statusCounts = contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      total: contacts.length,
      new: contacts.filter(contact => contact.status === 'New').length,
      inProgress: contacts.filter(contact => contact.status === 'In Progress').length,
      resolved: contacts.filter(contact => contact.status === 'Resolved').length,
      statusDistribution: statusCounts,
      recentCount: contacts.filter(contact => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(contact.createdat) > sevenDaysAgo;
      }).length
    };

    console.log('✅ Successfully calculated contact statistics');
    return stats;
  } catch (error) {
    console.error('❌ Error calculating contact statistics:', error);
    throw error;
  }
};

// ✅ Get recent contacts (last 7 days)
export const getRecentContacts = async (days = 7) => {
  try {
    const contacts = await getAllContacts();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recent = contacts.filter(contact =>
      new Date(contact.createdat) > cutoffDate
    );

    console.log(`✅ Found ${recent.length} contacts from last ${days} days`);
    return recent;
  } catch (error) {
    console.error(`❌ Error fetching recent contacts:`, error);
    throw error;
  }
};



//CONTACT
// ✅ CONTACT API FUNCTIONS
export const fetchContacts = async () => {
  try {
    const response = await axiosInstance.get('/contact');
    console.log("✅ fetchContacts response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching contacts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch contacts");
  }
};

// ✅ UTILITY FUNCTIONS
export const filterContacts = (contacts, searchTerm) => {
  if (!searchTerm.trim()) {
    return contacts;
  }

  const term = searchTerm.toLowerCase();
  return contacts.filter(contact =>
    contact.name?.toLowerCase().includes(term) ||
    contact.phone?.includes(term) ||
    contact.email?.toLowerCase().includes(term) ||
    contact.subject?.toLowerCase().includes(term) ||
    contact.message?.toLowerCase().includes(term)
  );
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


export const getDepartmentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error);
    throw error;
  }
};

// ========================================



// ====================Facility====================

// // Facility functions
// export const getFacilities = async () => {
//   try {
//     const response = await axiosInstance.get('/facilities');
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching facilities:", error);
//     throw error;
//   }
// };

// export const getFacilitiesByDept = async (deptId) => {
//   try {
//     const response = await axiosInstance.get(`/facilities/dept/${deptId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching facilities for department ${deptId}:`, error);
//     throw error;
//   }
// };

// export const createFacility = async (facilityData) => {
//   try {
//     // When facilityData is FormData, axios automatically sets the correct Content-Type header
//     const response = await axiosInstance.post('/facilities', facilityData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating facility:", error);
//     throw error;
//   }
// };

// export const updateFacility = async (id, facilityData) => {
//   try {
//     const response = await axiosInstance.put(`/facilities/update/${id}`, facilityData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating facility ${id}:`, error);
//     throw error;
//   }
// };

// export const deleteFacility = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/facilities/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting facility ${id}:`, error);
//     throw error;
//   }
// };

// Department functions
export const getDepartments = async () => {
  try {
    const response = await axiosInstance.get('/departments');
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// ===============================
// 🚀 GET ALL FACILITIES
// ===============================
export const getFacilities = async () => {
  try {
    const res = await axiosInstance.get("/facilities");
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ===============================
// 🚀 GET FACILITY BY ID
// ===============================
export const getFacilityById = async (id) => {
  try {
    const res = await axiosInstance.get(`/facilities/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ===============================
// 🚀 CREATE FACILITY (POST)
// ===============================
export const createFacility = async (data) => {
  try {
    const res = await axiosInstance.post("/facilities", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ===============================
// 🚀 UPDATE FACILITY (PUT)
// ===============================
export const updateFacility = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/facilities/update/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ===============================
// 🚀 DELETE FACILITY (DELETE)
// ===============================
export const deleteFacility = async (id) => {
  try {
    const res = await axiosInstance.delete(`/facilities/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const toggleFacilityStatus = async (id, isactive) => {
  try {
    const res = await axiosInstance.put(`/facilities/update/${id}`, {
      isactive,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFacilitiesByDept = async (deptId) => {
  try {
    const res = await axiosInstance.get(`/facilities/dept/${deptId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const uploadSingleFile = async (fileData) => {
  try {
    const res = await axiosInstance.post("/uploads/single", fileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;   // { filePath: "/uploads/xxx.jpg" }
  } catch (err) {
    throw new Error(err.response?.data?.message || "File upload failed");
  }
};

// ----------------------------------------------
// 🔹 GET Monthly Appointments
// ----------------------------------------------
export const getMonthlyAppointments = async (year) => {
  try {
    const res = await axiosInstance.get(
      `/analytics/dashboard/monthly-appointments`,
      { params: { year } }
    );

    return res.data.body; // { months: [], totals: [] }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch monthly appointments"
    );
  }
};


// ----------------------------------------------
// 🔹 GET Monthly Inquiries
// ----------------------------------------------
export const getMonthlyInquiries = async (year) => {
  try {
    const res = await axiosInstance.get(
      `/analytics/dashboard/monthly-inquiries`,
      { params: { year } }
    );

    return res.data.body; // { months: [], totals: [] }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch monthly inquiries"
    );
  }
};


// ----------------------------------------------
// 🔹 GET Dashboard Count
// ----------------------------------------------
export const getDashboardCounts = async (year) => {
  try {
    const res = await axiosInstance.get(
      `/analytics/dashboard/counts`,
      { params: { year } }
    );

    return res.data.body; // { totaldoctors, totalappointments, ... }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard counts"
    );
  }
};

// api/authService.js or services/authService.js

export const loginAdmin = async (email, password) => {
  const payload = { email, password };

  const response = await axiosInstance.post("auth/login", payload);

  return response.data; // returns { code, body: { token }, message }
};





// Create Hero Section
export const createHeroSection = async (payload) => {
  try {
    const response = await axiosInstance.post("/hero_section", payload);
    return response.data;
  } catch (error) {
    console.error("Create Hero Error: ", error);
    throw error;
  }
};

// Get All Hero Sections
export const fetchHeroSections = async () => {
  try {
    const response = await axiosInstance.get("/hero_section");
    return response.data;
  } catch (error) {
    console.error("Fetch Heroes Error: ", error);
    throw error;
  }
};

// Get Single Hero Section by ID
export const fetchHeroSectionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/hero_section/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Hero By ID Error: ", error);
    throw error;
  }
};

// Update Hero Section
export const updateHeroSection = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/hero_section/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Hero Error: ", error);
    throw error;
  }
};

// Delete Hero Section
export const deleteHeroSection = async (id) => {
  try {
    const response = await axiosInstance.delete(`/hero_section/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Hero Error: ", error);
    throw error;
  }
};


// Upload Multiple Files
export const uploadMultipleFiles = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosInstance.post("/uploads/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return response.data;
  } catch (error) {
    console.error("Upload Multiple Files Error: ", error);
    throw error;
  }
};


// Create AboutUs Section
export const createAboutUs = async (payload) => {
  try {
    const response = await axiosInstance.post("/aboutus", payload);
    return response.data;
  } catch (error) {
    console.error("Create AboutUs Error: ", error);
    throw error;
  }
};

// Get All AboutUs Sections
export const fetchAboutUs = async () => {
  try {
    const response = await axiosInstance.get("/aboutus");
    return response.data;
  } catch (error) {
    console.error("Fetch AboutUs Error: ", error);
    throw error;
  }
};

// Get Single AboutUs by ID
export const fetchAboutUsById = async (id) => {
  try {
    const response = await axiosInstance.get(`/aboutus/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch AboutUs By ID Error: ", error);
    throw error;
  }
};

// Update AboutUs Section
export const updateAboutUs = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/aboutus/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update AboutUs Error: ", error);
    throw error;
  }
};

// Delete AboutUs Section
export const deleteAboutUs = async (id) => {
  try {
    const response = await axiosInstance.delete(`/aboutus/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete AboutUs Error: ", error);
    throw error;
  }
};

// Upload Image for AboutUs (using existing function)
export const uploadAboutUsImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadSingleFile(formData);
    
    // Construct full URL with base URL
    let imageUrl = result.filePath;
    
    // If filePath doesn't start with http, prepend BASE_URL
    if (!imageUrl.startsWith('http')) {
      // Remove leading slash if present
      imageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      imageUrl = `${BASE_URL}/${imageUrl}`;
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Upload AboutUs Image Error: ", error);
    throw error;
  }
};


// Create Core Value
export const createCoreValue = async (payload) => {
  try {
    const response = await axiosInstance.post("/corevalues", payload);
    return response.data;
  } catch (error) {
    console.error("Create Core Value Error: ", error);
    throw error;
  }
};

// Get All Core Values
export const fetchCoreValues = async () => {
  try {
    const response = await axiosInstance.get("/corevalues");
    return response.data;
  } catch (error) {
    console.error("Fetch Core Values Error: ", error);
    throw error;
  }
};

// Get Single Core Value by ID
export const fetchCoreValueById = async (id) => {
  try {
    const response = await axiosInstance.get(`/corevalues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Core Value By ID Error: ", error);
    throw error;
  }
};

// Update Core Value
export const updateCoreValue = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/corevalues/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Core Value Error: ", error);
    throw error;
  }
};

// Delete Core Value
export const deleteCoreValue = async (id) => {
  try {
    const response = await axiosInstance.delete(`/corevalues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Core Value Error: ", error);
    throw error;
  }
};

// Upload Image for Core Values
export const uploadCoreValueImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await uploadSingleFile(formData);
    
    // Construct full URL with base URL
    let imageUrl = result.filePath;
    
    // If filePath doesn't start with http, prepend BASE_URL
    if (!imageUrl.startsWith('http')) {
      // Remove leading slash if present
      imageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      imageUrl = `${BASE_URL}/${imageUrl}`;
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Upload Core Value Image Error: ", error);
    throw error;
  }
};


// Create Contact Details
export const createContactDetails = async (payload) => {
  try {
    const response = await axiosInstance.post("/contactdetails", payload);
    return response.data;
  } catch (error) {
    console.error("Create Contact Details Error: ", error);
    throw error;
  }
};

// Get All Contact Details
export const fetchContactDetails = async () => {
  try {
    const response = await axiosInstance.get("/contactdetails");
    return response.data;
  } catch (error) {
    console.error("Fetch Contact Details Error: ", error);
    throw error;
  }
};

// Get Single Contact Details by ID
export const fetchContactDetailsById = async (id) => {
  try {
    const response = await axiosInstance.get(`/contactdetails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Contact Details By ID Error: ", error);
    throw error;
  }
};

// Update Contact Details
export const updateContactDetails = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/contactdetails/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Contact Details Error: ", error);
    throw error;
  }
};

// Delete Contact Details
export const deleteContactDetails = async (id) => {
  try {
    const response = await axiosInstance.delete(`/contactdetails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Contact Details Error: ", error);
    throw error;
  }
};


// Create Journey Entry
export const createJourney = async (payload) => {
  try {
    const response = await axiosInstance.post("/journey", payload);
    return response.data;
  } catch (error) {
    console.error("Create Journey Error: ", error);
    throw error;
  }
};

// Get All Journey Entries
export const fetchJourney = async () => {
  try {
    const response = await axiosInstance.get("/journey");
    return response.data;
  } catch (error) {
    console.error("Fetch Journey Error: ", error);
    throw error;
  }
};

// Get Single Journey Entry by ID
export const fetchJourneyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/journey/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Journey By ID Error: ", error);
    throw error;
  }
};

// Update Journey Entry
export const updateJourney = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/journey/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Journey Error: ", error);
    throw error;
  }
};

// Delete Journey Entry
export const deleteJourney = async (id) => {
  try {
    const response = await axiosInstance.delete(`/journey/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Journey Error: ", error);
    throw error;
  }
};


// Create Infrastructure Entry
export const createInfra = async (payload) => {
  try {
    const response = await axiosInstance.post("/infra", payload);
    return response.data;
  } catch (error) {
    console.error("Create Infrastructure Error: ", error);
    throw error;
  }
};

// Get All Infrastructure Entries
export const fetchInfra = async () => {
  try {
    const response = await axiosInstance.get("/infra");
    return response.data;
  } catch (error) {
    console.error("Fetch Infrastructure Error: ", error);
    throw error;
  }
};

// Get Single Infrastructure Entry by ID
export const fetchInfraById = async (id) => {
  try {
    const response = await axiosInstance.get(`/infra/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Infrastructure By ID Error: ", error);
    throw error;
  }
};

// Update Infrastructure Entry
export const updateInfra = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/infra/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Infrastructure Error: ", error);
    throw error;
  }
};

// Delete Infrastructure Entry
export const deleteInfra = async (id) => {
  try {
    const response = await axiosInstance.delete(`/infra/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Infrastructure Error: ", error);
    throw error;
  }
};


// Create Policy
export const createPolicy = async (payload) => {
  try {
    const response = await axiosInstance.post("/policies", payload);
    return response.data;
  } catch (error) {
    console.error("Create Policy Error: ", error);
    throw error;
  }
};

// Get All Policies
export const fetchPolicies = async () => {
  try {
    const response = await axiosInstance.get("/policies");
    return response.data;
  } catch (error) {
    console.error("Fetch Policies Error: ", error);
    throw error;
  }
};

// Get Single Policy by ID
export const fetchPolicyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/policies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Policy By ID Error: ", error);
    throw error;
  }
};

// Update Policy
export const updatePolicy = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/policies/update/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update Policy Error: ", error);
    throw error;
  }
};

// Delete Policy
export const deletePolicy = async (id) => {
  try {
    const response = await axiosInstance.delete(`/policies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Policy Error: ", error);
    throw error;
  }
};