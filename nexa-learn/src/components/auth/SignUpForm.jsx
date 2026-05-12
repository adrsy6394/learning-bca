// src/components/auth/SignUpForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    studentId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    if (!form.full_name || !form.email || !form.studentId || !form.password) {
      setErr("All fields are required.");
      setLoading(false);
      return;
    }

    const result = await signUp({
      email: form.email,
      password: form.password,
      full_name: form.full_name,
      studentId: form.studentId,
    });

    setLoading(false);
    if (!result.success) {
      setErr(result.error || "Signup failed.");
    } else {
      // In many Supabase setups a confirmation email is sent.
      // You can redirect to an onboarding or home page.
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf7e9] p-4 font-sans text-[#0b2b24] relative overflow-hidden">
      {/* Background organic shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#d1e8c4]/20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0b2b24]/5 blur-[120px] pointer-events-none"></div>

      <form
        onSubmit={onSubmit}
        className="relative bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgba(11,43,36,0.1)] border border-[#0b2b24]/5 w-full max-w-md space-y-8 transition-all duration-500"
      >
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#d1e8c4] text-[#0b2b24] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Join NexaLearn
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0b2b24] tracking-tighter">
            Create <span className="italic text-[#0b2b24]/60">Account</span>
          </h2>
          <p className="text-[#0b2b24]/40 font-light text-sm tracking-wide">Start your journey with us today.</p>
        </div>

        {err && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs text-center border border-red-100 font-bold uppercase tracking-widest">
            {err}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full px-8 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-8 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Student ID</label>
            <input
              type="text"
              required
              placeholder="BCA-12345"
              value={form.studentId}
              onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
              className="w-full px-8 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b24]/40 ml-4">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full px-8 py-4 rounded-full bg-[#fdf7e9]/50 border border-[#0b2b24]/5 focus:border-[#d1e8c4] focus:bg-white text-[#0b2b24] outline-none transition-all duration-300 font-bold placeholder-[#0b2b24]/20 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0b2b24] text-[#d1e8c4] py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#0b2b24]/20 disabled:opacity-50"
        >
          {loading ? "⏳ Creating Account..." : "Join Platform"}
        </button>

        <p className="text-center font-bold text-[10px] uppercase tracking-widest text-[#0b2b24]/40 mt-8">
          Already a member?{" "}
          <Link
            to="/login"
            className="text-[#0b2b24] underline decoration-[#d1e8c4] decoration-2 underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
