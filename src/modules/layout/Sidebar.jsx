import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  People,
  CalendarToday,
  QuestionAnswer,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/doctors", label: "Doctors", icon: People },
    { path: "/appointments", label: "Appointments", icon: CalendarToday },
    { path: "/inquiries", label: "Inquiries", icon: QuestionAnswer },
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
      <nav className="flex-1 mt-6">
        <ul className="flex flex-col gap-1">
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
