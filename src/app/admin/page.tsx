"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserAdmin, getAdminStatus } from "@/utils/admin";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "processing" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [stats] = useState({
    totalUsers: 1250,
    activeToday: 342,
    videoProcessed: 4567,
    skillsVerified: 8945,
    jobsMatched: 2134,
    avgProcessingTime: "2.3s",
    successRate: "98.5%",
    usersThisWeek: 156,
  });

  useEffect(() => {
    const admin = isUserAdmin();
    setIsAdmin(admin);

    if (!admin) {
      router.push("/start");
      return;
    }

    const phone = localStorage.getItem("userPhone") || "";
    setUserPhone(phone);
  }, [router]);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (!isAdmin) {
    return null;
  }

  const tabs = ["overview", "users", "processing", "settings"];

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative">
      {/* Botanical background similar to marketing pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#A3B18A]/5 dark:bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 7s ease-in-out infinite 2s" }} />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.08) 25%, rgba(58, 125, 68, 0.08) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.08) 75%, rgba(58, 125, 68, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.08) 25%, rgba(58, 125, 68, 0.08) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.08) 75%, rgba(58, 125, 68, 0.08) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className={`border-b border-[#A3B18A]/40 dark:border-gray-700 bg-[#F7F9F4]/90 dark:bg-gray-900/90 backdrop-blur-sm sticky top-0 z-40 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Top row - Logo & Menu */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon name="business-svgrepo-com" size={32} color="#3A7D44" className="flex-shrink-0" />
                <h1 className="text-xl sm:text-3xl font-bold text-[#344E41] dark:text-gray-100">Admin</h1>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop buttons */}
              <div className="hidden md:flex gap-2 items-center">
                <ThemeToggle />
                <button
                  onClick={() => router.push("/start")}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#3A7D44] dark:text-gray-300 hover:bg-[#A3B18A]/20 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Subtitle and status - Stack on mobile */}
            <div className="mb-4 block md:hidden text-xs">
              <p className="font-semibold text-slate-900 dark:text-gray-100 truncate">{userPhone}</p>
              <p className="text-[#3A7D44] dark:text-blue-400 font-medium">{getAdminStatus()}</p>
            </div>

            {/* Desktop subtitle */}
            <div className="hidden md:flex items-center gap-4 mb-4 pb-4 border-b border-[#A3B18A]/40 dark:border-gray-700">
              <div>
                <p className="text-sm text-[#344E41]/7000 dark:text-gray-400">System administration & monitoring</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-semibold text-[#344E41] dark:text-gray-200">{userPhone}</p>
                <p className="text-xs text-[#3A7D44] dark:text-blue-400 font-medium">{getAdminStatus()}</p>
              </div>
            </div>

            {/* Tabs - Scrollable on mobile */}
            <div className="flex gap-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-[#A3B18A]/40 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "text-[#3A7D44] dark:text-blue-400 border-[#3A7D44] dark:border-blue-400"
                      : "text-[#344E41]/7000 dark:text-gray-400 border-transparent hover:text-[#344E41] dark:hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile action buttons */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 flex gap-2 pb-4">
                <button
                  onClick={() => {
                    router.push("/start");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-[#3A7D44] dark:text-gray-300 hover:bg-[#A3B18A]/20 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alert */}
              <div className="bg-[#A3B18A]/20 dark:bg-gray-800/50 border border-[#A3B18A]/60 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3">
                <Icon name="notify-svgrepo-com" size={20} color="#3A7D44" className="flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#344E41] dark:text-gray-100 text-sm sm:text-base">Full system access enabled</p>
                  <p className="text-xs sm:text-sm text-[#344E41]/8000 dark:text-gray-300 mt-1">You have complete administrative privileges. All actions are monitored and logged.</p>
                </div>
              </div>

              {/* Quick Stats - Responsive grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { 
                    label: "Total Users", 
                    value: stats.totalUsers, 
                    icon: "user-svgrepo-com",
                    color: "text-[#3A7D44]" 
                  },
                  { 
                    label: "Active Today", 
                    value: stats.activeToday, 
                    icon: "trending-up-svgrepo-com",
                    color: "text-green-600" 
                  },
                  { 
                    label: "Videos", 
                    value: stats.videoProcessed, 
                    icon: "screen-share-svgrepo-com",
                    color: "text-[#6B705C]" 
                  },
                  { 
                    label: "Skills", 
                    value: stats.skillsVerified, 
                    icon: "check-circle-svgrepo-com",
                    color: "text-amber-600" 
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name={stat.icon} size={32} className={stat.color} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-[#344E41] dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-[#344E41]/7000 dark:text-gray-400 mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Extended Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-[#344E41]/7000 dark:text-gray-400 mb-2">Avg Processing Time</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#344E41] dark:text-gray-100">{stats.avgProcessingTime}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2">↓ 12%</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-[#344E41]/7000 dark:text-gray-400 mb-2">Success Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#344E41] dark:text-gray-100">{stats.successRate}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2">↑ 0.3%</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-xs sm:text-sm font-semibold text-[#344E41]/7000 dark:text-gray-400 mb-2">New (7d)</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#344E41] dark:text-gray-100">{stats.usersThisWeek}</p>
                  <p className="text-xs text-[#3A7D44] dark:text-blue-400 font-semibold mt-2">↑ 23%</p>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#344E41] dark:text-gray-100 mb-4">System Status</h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "Video Processing Engine",
                    "Skill Verification AI",
                    "Job Matching Algorithm",
                    "Database Server",
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#A3B18A]/10 dark:bg-gray-700/50 rounded text-sm sm:text-base">
                      <span className="font-medium text-[#344E41] dark:text-gray-200 truncate">{service}</span>
                      <span className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">OK</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#344E41] dark:text-gray-100 mb-4">User Management</h3>
                <div className="space-y-3">
                  {[
                    { title: "View All Users", desc: "Browse and manage registered users", btn: "Open" },
                    { title: "Block/Unblock Users", desc: "Manage user access permissions", btn: "Manage" },
                    { title: "Export User Data", desc: "Download user statistics and reports", btn: "Export" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#A3B18A]/10 dark:bg-gray-700/50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#344E41] dark:text-gray-100 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-[#344E41]/7000 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "processing" && (
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#344E41] dark:text-gray-100 mb-4">Processing Queue</h3>
                <div className="space-y-3">
                  {[
                    { title: "Processing Status", desc: "View real-time video processing", btn: "Monitor" },
                    { title: "Failed Videos", desc: "Review and reprocess failed items", btn: "Review" },
                    { title: "Processing Settings", desc: "Configure video quality and output", btn: "Configure" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#A3B18A]/10 dark:bg-gray-700/50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#344E41] dark:text-gray-100 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-[#344E41]/7000 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 border border-[#A3B18A]/60 dark:border-gray-600 hover:bg-[#F7F9F4] dark:hover:bg-gray-600 text-[#344E41] dark:text-gray-100 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-gray-800/80 border border-[#A3B18A]/50 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-[#344E41] dark:text-gray-100 mb-4">System Settings</h3>
                <div className="space-y-3">
                  {[
                    { title: "Global Configuration", desc: "Manage system-wide settings", btn: "Edit" },
                    { title: "API Keys & Webhooks", desc: "Manage integrations and services", btn: "Manage" },
                    { title: "Admin Logs", desc: "View audit trail of all admin actions", btn: "View" },
                    { title: "Backup & Restore", desc: "Manage system backups and recovery", btn: "Configure" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#A3B18A]/10 dark:bg-gray-700/50 rounded-lg gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#344E41] dark:text-gray-100 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-[#344E41]/7000 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 border border-[#A3B18A]/60 dark:border-gray-600 hover:bg-[#F7F9F4] dark:hover:bg-gray-600 text-[#344E41] dark:text-gray-100 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 flex-shrink-0">
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
          }
        `}</style>
      </div>
    </div>
  );
}
