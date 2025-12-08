// import React from "react";
// import AboutUsMV from "./AboutUsMV";
// import CoreValuesManager from "./CoreValuesManager";
// import ContactDetailsManager from "./ContactDetailsManager";
// import JourneyManager from "./JourneyManager";
// import InfraManager from "./InfraManager";
// import PoliciesManager from "./Policiesmanager";



// export default function AboutUs() {
//     return (
//         <>
//             <AboutUsMV />
//             <CoreValuesManager/>
//             <ContactDetailsManager/>
//             <JourneyManager/>
//             <InfraManager/>
//             <PoliciesManager/>
//         </>
//     );
// }


import React, { useState } from "react";
import AboutUsMV from "./AboutUsMV";
import CoreValuesManager from "./CoreValuesManager";
import ContactDetailsManager from "./ContactDetailsManager";

import {
    Building2,
    Target,
    Phone,
    Calendar,
    BarChart3,
    FileText,
    ChevronRight,
    Home
} from "lucide-react";

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState("about");

    const tabs = [
        {
            id: "about",
            label: "About Us",
            icon: <Building2 className="w-5 h-5" />,
            component: <AboutUsMV />
        },
        {
            id: "corevalues",
            label: "Core Values",
            icon: <Target className="w-5 h-5" />,
            component: <CoreValuesManager />
        },
        {
            id: "contact",
            label: "Contact Details",
            icon: <Phone className="w-5 h-5" />,
            component: <ContactDetailsManager />
        },
        
    ];

    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mt-2 gap-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100  p-3 rounded-xl shadow-sm mb-6 border border-gray-200">
                <div className="container mx-auto px-4  ">
                    <h1 className="text-2xl font-bold"> About Us Management</h1>
                    <p className="text-black mt-1">
                        Manage all about us sections including core values, contact details, journey timeline, and more
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Desktop Tabs */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-xl border shadow-sm mb-6">
                        <div className="flex border-b">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-3 px-6 py-4 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }
                  `}
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
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {tabs.map((tab) => (
                                <option key={tab.id} value={tab.id}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Mobile Tab Buttons */}
                <div className="lg:hidden mb-6">
                    <div className="flex overflow-x-auto pb-2 space-x-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }
                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-600">
                        <button
                            onClick={() => setActiveTab("about")}
                            className="hover:text-blue-600"
                        >
                            About Section
                        </button>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-medium text-gray-900">
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </span>
                    </nav>
                </div>

                {/* Active Component */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeTab === "about" ? "bg-blue-100 text-blue-600" :
                                    activeTab === "corevalues" ? "bg-green-100 text-green-600" :
                                        activeTab === "contact" ? "bg-purple-100 text-purple-600" :
                                            activeTab === "journey" ? "bg-amber-100 text-amber-600" :
                                                activeTab === "infrastructure" ? "bg-indigo-100 text-indigo-600" :
                                                    "bg-gray-100 text-gray-600"
                                    }`}>
                                    {tabs.find(tab => tab.id === activeTab)?.icon}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {tabs.find(tab => tab.id === activeTab)?.label}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {activeTab === "about" && "Manage about us content, mission, vision, and director details"}
                                        {activeTab === "corevalues" && "Manage organization's core values and principles"}
                                        {activeTab === "contact" && "Manage contact information, addresses, and social media"}
                                        {activeTab === "journey" && "Manage timeline of milestones and achievements"}
                                        {activeTab === "infrastructure" && "Manage infrastructure statistics and numbers"}
                                        {activeTab === "policies" && "Manage policies, terms, and conditions"}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Navigation */}
                            <div className="hidden md:flex items-center gap-2">
                                {tabs
                                    .filter(tab => tab.id !== activeTab)
                                    .slice(0, 3)
                                    .map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            {tab.icon}
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-6">
                        {activeComponent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;