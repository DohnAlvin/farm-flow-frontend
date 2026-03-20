// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Sprout,
  Bug,
  ClipboardList,
  Wallet,
  CloudSun,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Fields", icon: Sprout, path: "/fields" },
  { name: "Livestock", icon: Bug, path: "/livestock" },
  { name: "Tasks", icon: ClipboardList, path: "/tasks" },
  { name: "Finances", icon: Wallet, path: "/finances" },
  { name: "Weather", icon: CloudSun, path: "/weather" },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); // Use AuthContext for user state
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout(); // Calls your Django logout endpoint
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1B4332] text-white px-5 py-4 flex items-center justify-between shadow-md">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-[#D4A373]" />
          <span className="font-black text-xl tracking-tighter uppercase">FarmFlow</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-[#1B4332] text-white z-50 transform transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4A373] to-[#BC8A5F] rounded-2xl flex items-center justify-center shadow-inner">
                <Sprout className="w-7 h-7 text-[#1B4332]" />
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tighter leading-none">FarmFlow</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold mt-1">
                  Agri-Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
            <p className="px-4 text-[10px] font-bold text-emerald-100/30 uppercase tracking-[0.15em] mb-4">
              Main Menu
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-[#D4A373] text-[#1B4332] font-bold shadow-lg shadow-orange-950/20"
                      : "text-emerald-100/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-[#1B4332]" : "text-emerald-500/50")} />
                  <span className="text-sm tracking-tight">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile Section */}
          <div className="p-6 mt-auto">
            <div className="bg-emerald-950/40 rounded-3xl p-4 border border-white/5">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D6A4F] rounded-2xl flex items-center justify-center border border-emerald-400/20">
                      <User className="w-5 h-5 text-emerald-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-emerald-50">{user.full_name || "Manager"}</p>
                      <p className="text-[10px] text-emerald-400 font-medium truncate italic">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <Button 
                       variant="ghost" 
                       className="h-9 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-100 text-[11px] font-bold border-none"
                       onClick={() => navigate('/settings')}
                    >
                      <Settings className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <button 
                      className="h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center justify-center transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-3 h-3 mr-1" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-10 flex items-center justify-center">
                   <div className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen transition-all duration-300">
        <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-12 pt-24 lg:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}