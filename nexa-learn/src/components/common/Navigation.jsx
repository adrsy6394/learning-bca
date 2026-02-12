// src/components/layout/Navigation.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
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

  /* ================= AUTO CLOSE MOBILE MENU ON ROUTE CHANGE ================= */
  useEffect(() => {
    setIsOpen(false);
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
    { name: "Learn", path: "/learning" },
    { name: "Progress", path: "/progress" },
  ];

  const isLoggedIn = !!user?.id;

  // 🔥 FINAL DISPLAY LOGIC (NO EMAIL FALLBACK)
  const displayName =
    user?.full_name ||
    "User";

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl px-4 py-3 flex justify-between items-center fixed w-full top-0 z-50">
      
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-4">
        <img
          src="/ChatGPT_Image_Jul_20__2025__04_55_44_PM-removebg-preview.png"
          alt="App Logo"
          onClick={() => navigate("/")}
          className="cursor-pointer h-12 w-12 md:h-16 md:w-16 rounded-full shadow bg-gradient-to-r from-purple-500 to-pink-500 transition-transform hover:scale-110"
        />

        {/* Desktop links */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1 rounded transition ${
                location.pathname === link.path
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-3">
        
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode((m) => !m)}
          className="hidden md:block"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center md:hidden space-x-2">
          <button onClick={() => setDarkMode((m) => !m)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen((o) => !o)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-gray-900 flex flex-col space-y-2 p-4 shadow-md md:hidden items-center z-50">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full text-center px-3 py-2 rounded ${
                location.pathname === link.path
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.name}
            </button>
          ))}

          {isLoggedIn ? (
            <>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
