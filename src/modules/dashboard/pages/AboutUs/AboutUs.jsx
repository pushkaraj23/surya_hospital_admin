import { useState } from "react";
import AboutUsMV from "./AboutUsMV";
import CoreValuesManager from "./CoreValuesManager";
import ContactDetailsManager from "./ContactDetailsManager";
import InfraManager from "./InfraManager";

import { Building2, Target, Phone, Home, ChevronRight } from "lucide-react";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    {
      id: "about",
      label: "About Us",
      icon: <Building2 className="w-5 h-5" />,
      component: <AboutUsMV />,
    },
    {
      id: "corevalues",
      label: "Core Values",
      icon: <Target className="w-5 h-5" />,
      component: <CoreValuesManager />,
    },
    {
      id: "contact",
      label: "Contact Details",
      icon: <Phone className="w-5 h-5" />,
      component: <ContactDetailsManager />,
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      icon: <Home className="w-5 h-5" />,
      component: <InfraManager />,
    },
  ];

  const activeComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 mt-2 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="px-2">
          <h1 className="text-2xl font-bold text-gray-900">
            About Us Management
          </h1>
          <p className="text-gray-700">
            Manage all About Us sections including core values, contact details,
            and infrastructure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Desktop Tabs */}
        <div className="hidden lg:block mb-6">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="flex border-b overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors
                    ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="flex items-center text-sm text-gray-600">
            <span
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => setActiveTab("about")}
            >
              About Section
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
          </nav>
        </div>

        {/* Active Component */}
        <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[400px]">
          {activeComponent}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
