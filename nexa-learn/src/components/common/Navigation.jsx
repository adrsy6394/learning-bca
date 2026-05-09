// src/components/layout/Navigation.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, Sparkles, ClipboardCheck, LogOut, User as UserIcon } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  /* ================= DARK MODE ================= */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= AUTO CLOSE MENUS ON ROUTE CHANGE ================= */
  useEffect(() => {
    setIsOpen(false);
    setIsAiOpen(false);
  }, [location.pathname]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Flashcards", path: "/flashcards" },
    { name: "Progress", path: "/progress" },
  ];

  const aiTools = [
    { name: "Learn (AI Tutor)", path: "/learning", icon: <Sparkles size={16} /> },
    { name: "Performance Analyzer", path: "/analyzer", icon: <ClipboardCheck size={16} /> },
  ];

  const isLoggedIn = !!user?._id;
  const displayName = user?.full_name || "User";

  return (
    <>
      <nav className="fixed w-full top-0 left-0 z-[100] transition-all duration-300">
        <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-lg px-6 py-4 flex justify-between items-center">
          
          {/* LEFT SIDE: LOGO & NAV */}
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => navigate("/")}
              className="group cursor-pointer flex items-center space-x-2"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/ChatGPT_Image_Jul_20__2025__04_55_44_PM-removebg-preview.png"
                  alt="Logo"
                  className="relative h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-white/50"
                />
              </div>
              <span className="hidden lg:block font-black text-xl tracking-tighter bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                NEXALEARN
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? "text-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {location.pathname === link.path && (
                    <div className="absolute inset-0 bg-gray-900 dark:bg-white rounded-xl shadow-lg z-0 animate-in fade-in zoom-in-95 duration-300"></div>
                  )}
                  <span className="relative z-10">{link.name}</span>
                </button>
              ))}

              {/* AI Tools Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsAiOpen(true)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    aiTools.some(t => t.path === location.pathname)
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  <Sparkles size={16} className="mr-1 animate-pulse" />
                  <span>AI Tools</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isAiOpen ? "rotate-180" : ""}`} />
                </button>

                {isAiOpen && (
                  <div 
                    onMouseLeave={() => setIsAiOpen(false)}
                    className="absolute top-full mt-2 left-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/10 p-2 animate-in fade-in slide-in-from-top-2 duration-300 z-50"
                  >
                    {aiTools.map((tool) => (
                      <button
                        key={tool.path}
                        onClick={() => navigate(tool.path)}
                        className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 group transition-all duration-300"
                      >
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-white/20 rounded-xl transition-colors">
                          {tool.icon}
                        </div>
                        <span className="font-bold text-sm">{tool.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: PROFILE & THEME */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Button (Uiverse Inspired) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                <div className="flex items-center bg-gray-100/50 dark:bg-white/5 pl-2 pr-1 py-1 rounded-2xl border border-white/10">
                  <div className="flex flex-col items-end mr-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">{displayName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-white dark:bg-gray-800 text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 p-6 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-5 duration-500">
            <div className="space-y-2 mb-6">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    location.pathname === link.path
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-xl"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-white/5 pt-6 mb-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block ml-2">AI Capabilities</span>
              <div className="grid grid-cols-1 gap-3">
                {aiTools.map((tool) => (
                  <button
                    key={tool.path}
                    onClick={() => navigate(tool.path)}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold"
                  >
                    {tool.icon}
                    <span>{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-3xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {displayName[0]}
                  </div>
                  <span className="font-black dark:text-white">{displayName}</span>
                </div>
                <button onClick={handleLogout} className="text-red-500 font-bold">Logout</button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xl shadow-xl"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .nav-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default Navigation;
