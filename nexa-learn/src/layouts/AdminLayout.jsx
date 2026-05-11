import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LogOut, 
  Home,
  Menu,
  X
} from "lucide-react";

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Syllabus Manager", path: "/admin/syllabus", icon: BookOpen },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#fdf7e9] flex overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0b2b24]/60 z-40 lg:hidden backdrop-blur-md"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0b2b24] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-500 ease-in-out flex flex-col shadow-2xl`}
      >
        <div className="p-10 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-2xl text-white uppercase tracking-widest">
            ADMIN <span className="text-[#d1e8c4]">HUB</span>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-4 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center px-6 py-4 rounded-full transition-all text-xs font-black uppercase tracking-widest ${
                  isActive 
                    ? "bg-[#d1e8c4] text-[#0b2b24] shadow-xl" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 mr-4 ${isActive ? "text-[#0b2b24]" : "text-white/40"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
          <Link
            to="/"
            className="flex items-center px-6 py-4 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Home className="w-4 h-4 mr-4" />
            Live Platform
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center px-6 py-4 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4 mr-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#0b2b24] p-6 flex items-center shadow-lg">
          <button onClick={() => setSidebarOpen(true)} className="p-2 mr-4 text-white">
            <Menu size={24} />
          </button>
          <h1 className="text-white font-serif uppercase tracking-widest">Admin Hub</h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
