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
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  /* ================= SCROLL LISTENER ================= */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Panel", path: "/admin" });
  }

  const aiTools = [
    { name: "Learn (AI Tutor)", path: "/learning", icon: <Sparkles size={16} /> },
    { name: "Performance Analyzer", path: "/analyzer", icon: <ClipboardCheck size={16} /> },
  ];

  const isLoggedIn = !!user?._id;
  const displayName = user?.full_name || "User";

  const isHomePage = location.pathname === "/";
  const shouldShowSolid = !isHomePage || scrolled;

  return (
    <>
      <nav className={`fixed w-full top-0 left-0 z-[100] transition-all duration-500 ${shouldShowSolid ? "py-4" : "py-8"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`transition-all duration-500 border rounded-full px-8 py-4 flex justify-between items-center shadow-2xl ${
            shouldShowSolid 
              ? "bg-[#0b2b24] border-[#d1e8c4]/20" 
              : "bg-white/10 backdrop-blur-md border-white/10"
          }`}>
            
            {/* LEFT SIDE: LOGO */}
            <div 
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <img
                src="/image.png" 
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover border-2 border-[#d1e8c4]"
              />
              <span className="font-serif text-2xl text-white tracking-widest group-hover:text-[#d1e8c4] transition-colors">
                NexaLearn
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                    location.pathname === link.path
                      ? "text-[#d1e8c4]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-px bg-[#d1e8c4] transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                </button>
              ))}
            </div>

            {/* RIGHT SIDE: PROFILE & MENU */}
            <div className="flex items-center space-x-6">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-[#d1e8c4] text-[#0b2b24] rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Join Us
                </button>
              )}
              
              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
