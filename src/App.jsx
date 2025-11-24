import { Routes, Route } from "react-router-dom";
import MainLayout from "./modules/layout/MainLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Doctors from "./modules/doctors/pages/Doctors";
import Appointment from "./modules/dashboard/pages/AppointmentBooking";
import InquiryFeedbackManagement from "./modules/dashboard/pages/InquiryFeedbackManagement";
import AppointmentBooking from "./modules/dashboard/pages/AppointmentBooking";
import AppointmentsAdmin from "./modules/dashboard/pages/AppointmentsAdmin";
import BlogAdmin from "./modules/dashboard/pages/BlogAdmin";
import GalleryManagement from "./modules/dashboard/pages/GalleryManagement";
import NewsEventsManagement from "./modules/dashboard/pages/NewsEventsManagement";
import DepartmentManagement from "./modules/dashboard/pages/DepartmentManagement";
import Inquiry from "./modules/dashboard/pages/Inquiry";
import Feedback from "./modules/dashboard/pages/Feedback";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/department" element={<DepartmentManagement />} />
        <Route path="/appointment" element={<AppointmentsAdmin />} />
        <Route path="/inquiries" element={<Inquiry />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/blog" element={<BlogAdmin />} />
        <Route path="/gallery" element={<GalleryManagement />} />
        <Route path="/news" element={<NewsEventsManagement />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
