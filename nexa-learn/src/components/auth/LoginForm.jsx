// src/components/auth/LoginForm.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "../../lib/supabase";

const LoginForm = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------- Redirect if already logged in -------- */
  useEffect(() => {
    if (user && user.id) {
      navigate("/");
    }
  }, [user, navigate]);

  /* -------- Login Submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { success, error } = await signIn({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (!success) {
      setError(error || "Invalid email or password");
      return;
    }

    navigate("/");
  };

  /* -------- Google OAuth (optional) -------- */
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin, // localhost / vercel auto handle
        },
      });
    } catch (err) {
      console.error("Google OAuth error:", err);
    }
  };

  return (
    <div className="min-h-screen text-red-500 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4 text-gray-800 dark:bg-gray-900 dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/ChatGPT_Image_Jul_20__2025__04_55_44_PM-removebg-preview.png"
            alt="Logo"
            className="h-16 w-16 rounded-full shadow"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">Welcome back</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full p-2 border rounded dark:text-black"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="w-full p-2 border rounded dark:text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white border p-2 rounded shadow hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FcGoogle className="mr-2 text-xl" />
          Continue with Google
        </button>

        {/* Redirect to EXISTING Signup page */}
        <p className="text-center text-sm">
          New user?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
