import { useState, useEffect } from "react";
import {
    Person,
    Phone,
    Email,
    Business,
    LocalHospital,
    CalendarToday,
    AccessTime,
    Message,
} from "@mui/icons-material";
import AppointmentsAdmin from "./AppointmentsAdmin";

// Mock data for departments and doctors
const MOCK_DEPARTMENTS = [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Orthopedics" },
    { id: 4, name: "Pediatrics" },
    { id: 5, name: "Dermatology" },
];

const MOCK_DOCTORS = [
    { id: 1, name: "Dr. Sarah Johnson", departmentId: 1 },
    { id: 2, name: "Dr. Michael Chen", departmentId: 1 },
    { id: 3, name: "Dr. Emily Rodriguez", departmentId: 2 },
    { id: 4, name: "Dr. James Wilson", departmentId: 3 },
    { id: 5, name: "Dr. Lisa Thompson", departmentId: 4 },
    { id: 6, name: "Dr. Robert Brown", departmentId: 5 },
];

const AppointmentBooking = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
        department: "",
        doctor: "",
        preferredDate: "",
        time: "",
        message: "",
    });
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Simulate API loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Filter doctors based on selected department
        if (formData.department) {
            const filtered = MOCK_DOCTORS.filter(
                doctor => doctor.departmentId === parseInt(formData.department)
            );
            setFilteredDoctors(filtered);
            // Reset doctor selection when department changes
            setFormData(prev => ({ ...prev, doctor: "" }));
        } else {
            setFilteredDoctors([]);
        }
    }, [formData.department]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
            newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.department) {
            newErrors.department = "Please select a department";
        }

        if (!formData.doctor) {
            newErrors.doctor = "Please select a doctor";
        }

        if (!formData.preferredDate) {
            newErrors.preferredDate = "Please select a preferred date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Simulate form submission
            console.log("Appointment booked:", formData);
            alert("Appointment booked successfully!");

            // Reset form
            setFormData({
                fullName: "",
                mobileNumber: "",
                email: "",
                department: "",
                doctor: "",
                preferredDate: "",
                time: "",
                message: "",
            });
            setFilteredDoctors([]);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-white font-primary">
                <div className="bg-white/20 backdrop-blur-md rounded-full h-16 w-16 border-4 border-t-transparent border-white animate-spin mb-4"></div>
                <p className="text-lg font-secondary opacity-90 animate-pulse">
                    Loading Appointment Form...
                </p>
            </div>
        );
    }

    return (
        <div className="font-primary min-h-screen text-white relative overflow-hidden animate-fadeIn">
            <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="w-full bg-gradient-to-r from-primary via-secondary to-accent px-6 py-2 rounded-xl shadow-xl backdrop-blur-md bg-opacity-80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 drop-shadow-sm">
                        📅 Book Appointment
                    </h2>
                    <span className="text-sm opacity-90 font-secondary">
                        Surya Hospital - Quick & Easy Booking
                    </span>
                </div>

                {/* Appointment Form */}
                <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/30">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold">
                                <Person fontSize="small" />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${errors.fullName ? 'border-red-400' : 'border-white/30'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && (
                                <p className="text-red-300 text-sm">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold">
                                <Phone fontSize="small" />
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${errors.mobileNumber ? 'border-red-400' : 'border-white/30'
                                    }`}
                                placeholder="Enter your 10-digit mobile number"
                            />
                            {errors.mobileNumber && (
                                <p className="text-red-300 text-sm">{errors.mobileNumber}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold">
                                <Email fontSize="small" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${errors.email ? 'border-red-400' : 'border-white/30'
                                    }`}
                                placeholder="Enter your email address (optional)"
                            />
                            {errors.email && (
                                <p className="text-red-300 text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <Business fontSize="small" />
                                    Department *
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white ${errors.department ? 'border-red-400' : 'border-white/30'
                                        }`}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <option value="" className="text-gray-700">Select Department</option>
                                    {MOCK_DEPARTMENTS.map(dept => (
                                        <option key={dept.id} value={dept.id} className="text-gray-700">
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && (
                                    <p className="text-red-300 text-sm">{errors.department}</p>
                                )}
                            </div>

                            {/* Doctor */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <LocalHospital fontSize="small" />
                                    Doctor *
                                </label>
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    disabled={!formData.department}
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white ${errors.doctor ? 'border-red-400' : 'border-white/30'
                                        } ${!formData.department ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <option value="" className="text-gray-700">Select Doctor</option>
                                    {filteredDoctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id} className="text-gray-700">
                                            {doctor.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.doctor && (
                                    <p className="text-red-300 text-sm">{errors.doctor}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Preferred Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <CalendarToday fontSize="small" />
                                    Preferred Date *
                                </label>
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${errors.preferredDate ? 'border-red-400' : 'border-white/30'
                                        }`}
                                />
                                {errors.preferredDate && (
                                    <p className="text-red-300 text-sm">{errors.preferredDate}</p>
                                )}
                            </div>

                            {/* Time Slot */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    <AccessTime fontSize="small" />
                                    Preferred Time
                                </label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <option value="" className="text-gray-700">Select Time Slot</option>
                                    <option value="09:00-10:00" className="text-gray-700">09:00 AM - 10:00 AM</option>
                                    <option value="10:00-11:00" className="text-gray-700">10:00 AM - 11:00 AM</option>
                                    <option value="11:00-12:00" className="text-gray-700">11:00 AM - 12:00 PM</option>
                                    <option value="14:00-15:00" className="text-gray-700">02:00 PM - 03:00 PM</option>
                                    <option value="15:00-16:00" className="text-gray-700">03:00 PM - 04:00 PM</option>
                                    <option value="16:00-17:00" className="text-gray-700">04:00 PM - 05:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Message / Symptoms */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold">
                                <Message fontSize="small" />
                                Message / Symptoms
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                placeholder="Describe your symptoms or any additional information..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-md border border-white/20"
                            >
                                Book Appointment Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;

