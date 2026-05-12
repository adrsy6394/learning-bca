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
    <div className="min-h-screen flex items-center justify-center bg-[#fdf7e9] p-4 font-sans text-[#0b2b24] relative overflow-hidden">
      {/* Background organic shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#d1e8c4]/20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0b2b24]/5 blur-[120px] pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgba(11,43,36,0.1)] border border-[#0b2b24]/5 w-full max-w-md space-y-8 transition-all duration-500"
      >
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#d1e8c4] text-[#0b2b24] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Welcome Back
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0b2b24] tracking-tighter">
            Sign <span className="italic text-[#0b2b24]/60">In</span>
          </h2>
          <p className="text-[#0b2b24]/40 font-light text-sm tracking-wide">Enter your details to access your learning hub.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs text-center border border-red-100 font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-8 py-5 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-8 py-5 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0b2b24] text-[#d1e8c4] py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#0b2b24]/20 disabled:opacity-50"
        >
          {loading ? "⏳ Authenticating..." : "Enter Hub"}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#0b2b24]/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="px-4 bg-white text-[#0b2b24]/20">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 text-[#0b2b24] py-5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white hover:border-[#d1e8c4] hover:shadow-xl active:scale-[0.98]"
        >
          <FcGoogle className="mr-3 text-xl" />
          Google Account
        </button>

        <p className="text-center font-bold text-[10px] uppercase tracking-widest text-[#0b2b24]/40 mt-8">
          New to NexaLearn?{" "}
          <Link
            to="/signup"
            className="text-[#0b2b24] underline decoration-[#d1e8c4] decoration-2 underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
