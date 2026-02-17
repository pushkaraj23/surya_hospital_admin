import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// MUI Icons
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  MedicalServices,
  Business,
  Article,
  PhotoLibrary,
  EventAvailable,
  RateReview,
  ContactMail,
  LocalHospital,
  Group,
  Menu as MenuIcon,
  Gavel,
  FlightTakeoff,
} from "@mui/icons-material";

// Lucide Icon
import React from "react";
import { Newspaper } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/Hero", label: "Home", icon: HomeIcon },
    { path: "/aboutUs", label: "About Us", icon: InfoIcon },
    { path: "/doctors", label: "Doctors", icon: MedicalServices },
    { path: "/department", label: "Department", icon: Business },
    { path: "/blog", label: "Blog", icon: Article },
    { path: "/gallery", label: "Gallery", icon: PhotoLibrary },
    // { path: "/news", label: "News", icon: Newspaper },
    { path: "/appointment", label: "Appointments", icon: EventAvailable },
    { path: "/feedback", label: "Feedbacks", icon: RateReview },
    { path: "/contact", label: "Contact", icon: ContactMail },
    { path: "/facilities", label: "Facilities", icon: LocalHospital },
    { path: "/users", label: "Users", icon: Group },
    { path: "/newsletter", label: "Newsletter", icon: Newspaper },
    { path: "/tourism-enquiry", label: "Tourism Enquiry", icon: FlightTakeoff },
    { path: "/policies", label: "Policies", icon: Gavel },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-primary text-white shadow-xl transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <h2 className="text-lg font-semibold tracking-wide uppercase">
            CMS Portal
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-white hover:text-accent ${
            collapsed ? "mx-auto" : ""
          } transition-colors`}
        >
          <MenuIcon className="text-[22px]" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar">
        <ul className="flex flex-col gap-1 pb-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 mx-3 px-4 py-3 rounded-md font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-secondary text-white shadow-md"
                        : "text-gray-100 hover:bg-primary-dark hover:text-accent"
                    }`}
                >
                  <Icon
                    className={`text-[22px] ${
                      isActive
                        ? "text-white"
                        : "text-accent group-hover:text-accent"
                    }`}
                  />

                  {!collapsed && (
                    <span
                      className={`text-sm ${
                        isActive ? "text-white" : "text-gray-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto mb-4 px-4 text-center border-t border-white/10 pt-4 text-[12px] text-white/60">
        {!collapsed ? (
          <p>© 2025 Surya Hospital</p>
        ) : (
          <p className="text-accent text-[10px]">©25</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
