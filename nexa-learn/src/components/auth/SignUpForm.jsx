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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B1C2D] p-4 font-sans text-slate-800 dark:text-slate-200 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 dark:bg-pink-600/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[100px] pointer-events-none"></div>

      <form
        onSubmit={onSubmit}
        className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700/50 w-full max-w-md space-y-6 transition-all duration-500"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Join us and start your learning journey.</p>
        </div>

        {err && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center border border-red-200 dark:border-red-800/50 font-medium">
            {err}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            required
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />
          <input
            type="email"
            required
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />
          <input
            type="text"
            required
            placeholder="Student ID"
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all duration-300 shadow-inner dark:shadow-slate-950/50 placeholder-slate-400 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-pink-500/30 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Creating...
            </span>
          ) : "Sign Up"}
        </button>

        <p className="text-center font-medium text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
