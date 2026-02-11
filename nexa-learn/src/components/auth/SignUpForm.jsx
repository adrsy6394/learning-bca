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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-gray-800 dark:bg-gray-900 dark:text-white">
      <form
        onSubmit={onSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create account</h2>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <input
          type="text"
          required
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, full_name: e.target.value }))
          }
          className="w-full p-2 border rounded dark:text-black"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full p-2 border rounded dark:text-black"
        />
        <input
          type="text"
          required
          placeholder="Student ID"
          value={form.studentId}
          onChange={(e) =>
            setForm((f) => ({ ...f, studentId: e.target.value }))
          }
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
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-center text-sm">
          Old user?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline underline"
          >
            LogIn
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
