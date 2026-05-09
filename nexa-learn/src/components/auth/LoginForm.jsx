// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const result = await signIn(form);

      if (!result.success) {
        setError(result.error || "Login failed");
        setLoading(false);
        return;
      }

      // 🔥 IMPORTANT: Redirect after success
      navigate("/", { replace: true });

    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // useGoogleLogin returns a trigger function — call it on button click
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user info from Google using the access token
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        // Send access token + user info to our backend
        const result = await signInWithGoogle(tokenResponse.access_token, userInfo);

        if (!result.success) {
          setError(result.error || "Google login failed");
          setLoading(false);
          return;
        }
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google login error:", err);
        setError("Google login failed. Please try again.");
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google login was cancelled or failed.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B1C2D] p-4 font-sans text-slate-800 dark:text-slate-200 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[100px] pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700/50 w-full max-w-md space-y-6 transition-all duration-500"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in.</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/30 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Logging in...
            </span>
          ) : "Sign In"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-4 rounded-2xl font-bold transition-all hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-500 hover:shadow-lg active:scale-[0.98]"
        >
          <FcGoogle className="mr-3 text-2xl" />
          Google Account
        </button>

        <p className="text-center font-medium text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
