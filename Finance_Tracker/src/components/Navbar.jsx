// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Wallet, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-[#0d1530]/80 border-b border-teal-100 dark:border-cyan-900/40 backdrop-blur-md transition-colors duration-300">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight bg-linear-to-r from-teal-500 to-cyan-400 dark:from-cyan-400 dark:to-sky-300 bg-clip-text text-transparent">
          FinanceTracker
        </span>
      </div>

      {/* Nav links */}
      <div className="flex gap-2">
        <Link
          to="/"
          className="text-base font-medium px-3 py-1.5 rounded-lg text-teal-700 dark:text-cyan-300 hover:bg-teal-50 dark:hover:bg-cyan-900/30 transition-colors duration-200"
        >
          Dashboard
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-teal-50 dark:bg-cyan-900/30 border border-teal-200 dark:border-cyan-700/50 hover:border-teal-400 dark:hover:border-cyan-400 hover:scale-110 hover:rotate-12 transition-all duration-200 cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-teal-600 dark:text-cyan-400" />}
        </button>

        {currentUser && (
          <>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold text-white bg-linear-to-br from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>

            {/* Email */}
            <span className="hidden sm:block text-sm max-w-[180px] truncate text-teal-600 dark:text-cyan-400/70">
              {currentUser.email}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg border border-teal-200 dark:border-cyan-800 text-teal-600 dark:text-cyan-400 hover:border-rose-400 hover:text-rose-500 dark:hover:border-rose-500 dark:hover:text-rose-400 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
