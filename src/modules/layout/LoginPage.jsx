// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
// import { loginAdmin } from '../../api/userApi'; // Update path as needed

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loginError, setLoginError] = useState('');

//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoginError("");

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await loginAdmin(formData.email, formData.password);

//       // Check for successful response
//       if (res && res.code === 200 && res.body?.token) {
//         // Save token
//         localStorage.setItem("adminToken", res.body.token);

//         // Optional: store user info
//         localStorage.setItem("adminEmail", formData.email);

//         // Show success message (optional)
//         console.log("Login successful:", res.message);

//         // Redirect to dashboard
//         navigate("/"); // Update this path as needed
//       } else {
//         setLoginError(res.message || "Invalid response from server");
//       }
//     } catch (error) {
//       console.error("Login error:", error);

//       // Handle different error scenarios
//       if (error.response) {
//         // Server responded with error status
//         const msg = error.response.data?.message || 
//                    "Login failed. Please check your credentials.";
//         setLoginError(msg);
//       } else if (error.request) {
//         // Request made but no response received
//         setLoginError("Network error. Please check your connection.");
//       } else {
//         // Something else happened
//         setLoginError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//     if (loginError) {
//       setLoginError('');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="flex justify-center mb-5">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
//               <LogIn size={32} className="text-blue-900" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
//           <p className="text-blue-200 text-lg">
//             Sign in to your account to continue
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-blue-800/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-700/40 p-8">
//           {loginError && (
//             <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start">
//               <AlertCircle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
//               <span className="text-red-200">{loginError}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-blue-100 mb-2 font-medium text-lg">Email Address</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400">
//                   <Mail size={22} />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full pl-12 pr-4 py-4 bg-blue-900/30 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 transition text-lg ${
//                     errors.email
//                       ? 'border-red-500 focus:ring-red-500'
//                       : 'border-blue-600/50 focus:ring-amber-500 focus:border-transparent'
//                   }`}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-2 text-red-400 text-sm flex items-center">
//                   <AlertCircle size={14} className="mr-1" /> {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-blue-100 mb-2 font-medium text-lg">Password</label>
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400">
//                   <Lock size={22} />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full pl-12 pr-12 py-4 bg-blue-900/30 border rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 transition text-lg ${
//                     errors.password
//                       ? 'border-red-500 focus:ring-red-500'
//                       : 'border-blue-600/50 focus:ring-amber-500 focus:border-transparent'
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300 transition"
//                 >
//                   {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-2 text-red-400 text-sm flex items-center">
//                   <AlertCircle size={14} className="mr-1" /> {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center text-lg ${
//                 isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
//               }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 mr-3"></div>
//                   Signing In...
//                 </>
//               ) : (
//                 <>
//                   <LogIn size={22} className="mr-3" />
//                   Sign In
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Building2 } from 'lucide-react';
import { loginAdmin } from '../../api/userApi';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await loginAdmin(formData.email, formData.password);

      if (res && res.code === 200 && res.body?.token) {
        localStorage.setItem("adminToken", res.body.token);
        localStorage.setItem("adminEmail", formData.email);
        navigate("/");
      } else {
        setLoginError(res.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const msg = error.response.data?.message ||
          "Invalid email or password. Please try again.";
        setLoginError(msg);
      } else if (error.request) {
        setLoginError("Network error. Please check your connection.");
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleDemoCredentials = () => {
    setFormData({
      email: 'admin@gmail.com',
      password: 'Admin@123'
    });
    setErrors({});
    setLoginError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-950 flex-col justify-between p-12">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src='logo.svg'   
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">Surya Hospital</h1>
            <p className="text-blue-200">Established 1985</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Excellence in Healthcare
            <br />
            <span className="text-amber-400">Since 1985</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-md">
            Providing compassionate, high-quality healthcare services with state-of-the-art technology and experienced medical professionals.
          </p>
        </div>

        <div className="border-t border-blue-700 pt-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">500+</div>
              <div className="text-blue-300 text-sm">Medical Staff</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">50+</div>
              <div className="text-blue-300 text-sm">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">24/7</div>
              <div className="text-blue-300 text-sm">Emergency Care</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Building2 className="text-blue-900" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Surya Hospital</h1>
                <p className="text-blue-700 text-sm">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Shield className="text-amber-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
                  <p className="text-blue-200">Secure Access Required</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Shield className="text-red-500" size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{loginError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${errors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                      placeholder="Enter your email"

                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${errors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>


                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Authenticating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Shield className="mr-2" size={18} />
                        Sign In to Dashboard
                      </div>
                    )}
                  </button>
                </div>
              </form>



              {/* Footer Note */}
              <div className="mt-8 text-center">
                {/* <p className="text-sm text-gray-500">
                  For assistance, contact the system administrator or IT support.
                </p> */}
                <p className="mt-2 text-xs text-gray-400">
                  © 2024 Surya Hospital. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Classic Decorative Elements */}
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-900 to-transparent rounded-full"></div>
            <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-blue-900 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;