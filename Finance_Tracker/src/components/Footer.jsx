// src/components/Footer.jsx
import { Wallet, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-teal-100 dark:border-cyan-900/40 bg-white/80 dark:bg-[#0d1530]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Center — copyright */}
        <p className="text-xs text-teal-500/70 dark:text-cyan-500/50 flex items-center gap-1">
          © {year} FinanceTracker · Made by Vivek
        </p>

        {/* Right — links */}
        <div className="flex items-center gap-4 text-xs text-teal-600 dark:text-cyan-400/70">
          <a
            href="https://github.com/vivekfaujdar01"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center gap-1 hover:text-teal-500 dark:hover:text-cyan-300 transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
