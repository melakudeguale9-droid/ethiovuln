import React, { useState } from "react";

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [fullName, setFullName] = useState("melaku nttt777");
  const [username, setUsername] = useState("melaku@gmail.com");

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: fullName,
        username: username,
      }),
    });

    if (response.ok) {
      alert("Profile successfully updated!");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔑" },
    { id: "scans", label: "Scan Prefs", icon: "🔍" },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "apikeys", label: "API Keys", icon: "🌐" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header (Navbar) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d1322] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white shadow-md">
            E
          </div>
          <span className="font-semibold text-white tracking-wide">EthioVuln</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-gray-300 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar: Mobile Drawer + Desktop Permanent Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1322] border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col justify-between p-4 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div>
          {/* Logo on PC */}
          <div className="hidden md:flex items-center gap-2 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-950">
              E
            </div>
            <span className="text-lg font-bold text-white tracking-wide">EthioVuln</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-400 hover:text-white hover:bg-slate-800/60 transition">
              <span>📊</span> Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-400 hover:text-white hover:bg-slate-800/60 transition">
              <span>🎯</span> Scans
            </a>
            <a href="#" className="flex items-center gap-3 px-3 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-400 hover:text-white hover:bg-slate-800/60 transition">
              <span>➕</span> New Scan
            </a>
            <a href="#" className="flex items-center gap-3 px-3 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium text-gray-400 hover:text-white hover:bg-slate-800/60 transition">
              <span>📑</span> Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-3 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
              <span>⚙️</span> Settings
            </a>
          </nav>
        </div>

        {/* User Profile / Logout footer in sidebar */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">melaku nttt777</p>
              <p className="text-[11px] text-gray-400 truncate">melaku@gmail.com</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>⚙️</span> Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage your account, preferences, and security
            </p>
          </div>

          {/* Settings Tabs (Scrollable on mobile, wrapping on desktop) */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none md:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/40"
                    : "bg-[#0d1322] border border-slate-800 text-gray-400 hover:text-white hover:bg-slate-850"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Body Card */}
          <div className="w-full bg-[#0d1322] border border-slate-800/80 rounded-2xl p-5 sm:p-8 shadow-xl">
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <span>👤</span> Profile Information
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your display name, username, and email address
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-[#070b14] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-[#070b14] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="melaku@gmail.com"
                      className="w-full px-4 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-[#070b14] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Role
                    </label>
                    <div className="px-4 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-[#070b14]/50 border border-slate-800/60 text-xs text-gray-400 flex items-center gap-2">
                      <span>👤</span>
                      <span>User</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="w-full sm:w-auto px-6 h-11 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-md shadow-cyan-950 flex items-center justify-center gap-2"
                    >
                      <span>💾</span>
                      <span>Save Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "profile" && (
              <div className="py-16 text-center text-sm text-gray-500">
                {tabs.find((t) => t.id === activeTab)?.label} settings will be configured here.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
