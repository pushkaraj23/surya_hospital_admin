import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./modules/layout/MainLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Doctors from "./modules/doctors/pages/Doctors";
import AppointmentBooking from "./modules/dashboard/pages/AppointmentBooking";
import AppointmentsAdmin from "./modules/dashboard/pages/AppointmentsAdmin";
import BlogAdmin from "./modules/dashboard/pages/BlogAdmin";
import GalleryManagement from "./modules/dashboard/pages/GalleryManagement";
import NewsEventsManagement from "./modules/dashboard/pages/NewsEventsManagement";
import DepartmentManagement from "./modules/dashboard/pages/DepartmentManagement";
import Inquiry from "./modules/dashboard/pages/Inquiry";
import Feedback from "./modules/dashboard/pages/Feedback";
import Contact from "./modules/doctors/pages/Contact";
import FacilitiesComponent from "./modules/dashboard/pages/FacilitiesComponent";
import LoginPage from "./modules/layout/LoginPage";
import HomePage from "./modules/dashboard/pages/HomePage";
import AboutUs from "./modules/dashboard/pages/AboutUs/AboutUs";
import PolicyPage from "./modules/dashboard/pages/PolicyPage";
import Newsletter from "./modules/dashboard/pages/Newsletter";

// function PrivateRoute({ children }) {
//   const isLoggedIn = localStorage.getItem("adminToken");
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// }

export default function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route
        path="/"
        element={
          // <PrivateRoute>
          <MainLayout />
          // </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="Hero" element={<HomePage />} />
        <Route path="aboutUs" element={<AboutUs />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="department" element={<DepartmentManagement />} />
        <Route path="appointment" element={<AppointmentsAdmin />} />
        <Route path="inquiries" element={<Inquiry />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="news" element={<NewsEventsManagement />} />
        <Route path="contact" element={<Contact />} />
        <Route path="facilities" element={<FacilitiesComponent />} />
        <Route path="/policies" element={<PolicyPage />} />
        <Route path="/newsletter" element={<Newsletter />} />
      </Route>
    </Routes>
  );
}
