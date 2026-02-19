// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wallet } from "lucide-react";

import { inputCls, labelCls } from "../utils/styles";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#edfaf6] dark:bg-[#0a0f1e] transition-colors duration-300" style={{ backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(13,148,136,0.12) 0%, transparent 60%)" }}>
      <div className="w-full max-w-sm rounded-xl p-8 bg-white dark:bg-[#0d1530] border border-teal-100 dark:border-cyan-900/40 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] animate-slide-up">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2 bg-linear-to-br from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500 shadow-lg">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold bg-linear-to-r from-teal-500 to-cyan-400 dark:from-cyan-400 dark:to-sky-300 bg-clip-text text-transparent">
            FinanceTracker
          </h1>
          <p className="text-xs text-teal-500/70 dark:text-cyan-600 mt-1">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/50 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Email Address</label>
            <input className={inputCls} name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Password</label>
            <input className={inputCls} name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-lg text-sm font-bold text-white bg-linear-to-r from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-teal-500/70 dark:text-cyan-700">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-teal-600 dark:text-cyan-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
